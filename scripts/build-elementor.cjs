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
let body = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
body = body.slice(body.indexOf('<body>') + 6, body.indexOf('</body>'));
body = body.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/, '');
body = body.replace(/(src|href|poster)="assets\//g, `$1="${BASE}/assets/`);

const endpoint = fs.readFileSync(path.join(dist, 'form-config.js'), 'utf8');
let js = fs.readFileSync(path.join(dist, 'script.js'), 'utf8');
js = js.replace('document.body.append(modal);', "(document.getElementById('estrutec-lp') || document.body).append(modal);");

const html = `<!--
  Estrutec Monitoramento - landing page para o widget HTML do Elementor.
  Cole este arquivo inteiro em um widget HTML do Elementor. As imagens, fontes e o video sao carregados de ${BASE}/assets/.
  O codigo do Google Tag Manager (GTM-5DLHWFCJ) NAO esta aqui: instale-o pelo tema, plugin ou Elementor > Custom Code.
-->
<style>
${scoped}${guard}
</style>
<div id="estrutec-lp">
${body.trim()}
</div>
<script>
(function () {
${endpoint}
${js}
})();
</script>
`;
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'estrutec-elementor.html'), html);
console.log('wrote', path.join(outDir, 'estrutec-elementor.html'), html.length, 'bytes; assets base', BASE);
