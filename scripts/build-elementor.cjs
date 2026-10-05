// Builds a single HTML snippet for the Elementor "HTML" widget from outputs/dist.
//   node scripts/build-elementor.cjs [assetsBaseUrl]
// Needs: npm i postcss postcss-prefix-selector
// The CSS is scoped under #estrutec-lp so the WordPress theme cannot restyle it.
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const prefixer = require('postcss-prefix-selector');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'outputs', 'dist');
const outDir = path.join(root, 'outputs', 'elementor');
const BASE = (process.argv[2] || '/wp-content/uploads/estrutec').replace(/\/$/, '');
const WRAP = '#estrutec-lp';

let css = fs.readFileSync(path.join(dist, 'fonts.css'), 'utf8') + '\n' + fs.readFileSync(path.join(dist, 'styles.css'), 'utf8');
css = css.replace(/url\((['"]?)assets\//g, `url($1${BASE}/assets/`);

const scoped = postcss([prefixer({
  prefix: WRAP,
  transform(prefix, selector, prefixed) {
    const s = selector.trim();
    if (s === 'html') return s;                                  // scroll behaviour stays on <html>
    if (s === ':root' || s === 'body') return prefix;            // tokens and base text live on the wrapper
    if (s === '*') return `${prefix}, ${prefix} *`;
    if (s.startsWith('body:has(')) return 'body:has(#estrutec-lp #lead-modal[open])';
    return prefixed;
  }
})]).process(css, { from: undefined }).css;

// Neutralise common WordPress theme rules that would otherwise leak into the page.
const guard = `
${WRAP} h1,${WRAP} h2,${WRAP} h3,${WRAP} h4{color:inherit;text-shadow:none}
${WRAP} li{margin:0}
${WRAP} img{border:0;box-shadow:none}
${WRAP} a{box-shadow:none}
${WRAP} p{margin-bottom:0;font-size:inherit}
${WRAP} li,${WRAP} address{font-size:inherit}
`;
const minify = c => c.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const btn = `${WRAP} .button{text-decoration:none!important;box-shadow:none!important}`;
// Only on pages that contain the landing page: hide the theme's own header/footer (the page brings its own).
const OUT = ':not(#estrutec-lp):not(#estrutec-lp *)';
const hideTheme = ['header', 'footer', '#masthead', '#colophon', '.elementor-location-header', '.elementor-location-footer', '[data-elementor-type="header"]', '[data-elementor-type="footer"]', '.site-header', '.site-footer', '.page-header', '.entry-header']
  .map(x => `body:has(#estrutec-lp) ${x}${OUT}`).join(',') + '{display:none!important}body:has(#estrutec-lp) .site-content,body:has(#estrutec-lp) .entry-content,body:has(#estrutec-lp) main{margin-top:0!important;padding-top:0!important}';
let body = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
body = body.slice(body.indexOf('<body>') + 6, body.indexOf('</body>'));
body = body.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/, '');
body = body.replace(/\n\s*\n+/g, '\n').replace(/^[ \t]+$/gm, '');
body = body.replace(/(src|href|poster)="assets\//g, `$1="${BASE}/assets/`);

const endpoint = fs.readFileSync(path.join(dist, 'form-config.js'), 'utf8');
let js = fs.readFileSync(path.join(dist, 'script.js'), 'utf8');
js = js.replace('document.body.append(modal);', "(document.getElementById('estrutec-lp') || document.body).append(modal);");

const html = `<!--
  Estrutec Monitoramento - landing page para o widget HTML do Elementor.
  Cole este arquivo inteiro em um widget HTML do Elementor. As imagens, fontes e o video sao carregados de ${BASE}/assets/.
  O Google Tag Manager (GTM-5DLHWFCJ) ja esta incluido no fim deste codigo.
-->
<style>${minify(scoped + guard + btn + hideTheme)}</style>
<div id="estrutec-lp">
${body.trim()}
</div>
<script>(function(w,d,s,l,i){if(w.google_tag_manager&&w.google_tag_manager[i])return;w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5DLHWFCJ');</script>
<script>
(function () {
${endpoint}
${js}
// Break out of boxed Elementor containers: stretch the page to the full width of the screen.
function estrutecFit() {
  var w = document.getElementById('estrutec-lp');
  if (!w) return;
  w.style.maxWidth = 'none';
  w.style.marginLeft = '0px';
  w.style.width = 'auto';
  var left = w.getBoundingClientRect().left;
  w.style.width = document.documentElement.clientWidth + 'px';
  w.style.marginLeft = (-left) + 'px';
}
// Only on this page: hide everything of the old site around the landing page (slider, footer, floating WhatsApp, etc.).
function estrutecPurge() {
  var w = document.getElementById('estrutec-lp');
  if (!w) return;
  var skip = /^(SCRIPT|STYLE|LINK|META|NOSCRIPT|TEMPLATE)$/;
  function hide(e) { if (e.nodeType === 1 && !skip.test(e.tagName) && e.style.display !== 'none') e.style.setProperty('display', 'none', 'important'); }
  for (var n = w; n && n !== document.documentElement; n = n.parentNode) {
    var sib = n.parentNode ? n.parentNode.children : [];
    for (var i = 0; i < sib.length; i++) if (sib[i] !== n) hide(sib[i]);
  }
  var all = document.body.getElementsByTagName('*');
  for (var j = 0; j < all.length; j++) {
    var e = all[j];
    if (w.contains(e) || e.contains(w) || skip.test(e.tagName)) continue;
    var pos = getComputedStyle(e).position;
    if (pos === 'fixed' || pos === 'sticky') hide(e);
  }
}
estrutecPurge();
if (window.MutationObserver) {
  var purgeTimer;
  new MutationObserver(function () { clearTimeout(purgeTimer); purgeTimer = setTimeout(estrutecPurge, 150); }).observe(document.body, { childList: true, subtree: true });
}
window.addEventListener('load', function () { estrutecPurge(); setTimeout(estrutecPurge, 1000); setTimeout(estrutecPurge, 3000); });
estrutecFit();
window.addEventListener('resize', estrutecFit);
window.addEventListener('load', function () { estrutecFit(); setTimeout(estrutecFit, 400); setTimeout(estrutecFit, 1500); });
})();
</script>
`;
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'estrutec-elementor.html'), html);
console.log('wrote', path.join(outDir, 'estrutec-elementor.html'), html.length, 'bytes; assets base', BASE);
