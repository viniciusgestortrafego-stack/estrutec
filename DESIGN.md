# Estrutec Monitoramento — Design system

## Direction and goal
Premium, restrained landing page in Brazilian Portuguese. The user-pinned palette uses black, graphite, white and orange. Primary conversion is a WhatsApp conversation for a security quotation; the page has no lead form and no simulated submission.

## Actual implementation
- Section order (September 29 revision, merging user feedback with the "Landing Page Vendas V2" brief): hero "Sua segurança precisa de mais do que câmeras" with lead form; "O que a Estrutec entrega para você" (six benefits); technologies (photo cards, CTA card, four icon items, AI band); problem with cost-of-failure block and "Ter câmeras não é o mesmo que ter um sistema de segurança confiável" conclusion; orange maintenance band; "Por que contratar a Estrutec?" (six numbered reasons); Poste Inteligente Estrutec; "Você não precisa de mais equipamentos. Precisa de uma estratégia de segurança." with audiences; "Do diagnóstico ao monitoramento" five-step process; "Atendimento em São Paulo" with client logos and Google reviews; FAQ; closing "Sua segurança não pode depender da sorte."
- Sticky dark header with logo, anchor navigation (hidden below 1050px) and quotation button. A floating WhatsApp button stays visible on every viewport.
- Hero uses a full-height monitoring photograph on the right behind a dark gradient, an uppercase display headline with orange emphasis, a "+"-joined solution stack and the lead form panel.
- Sections alternate white, pale graphite, dark graphite and orange surfaces. The process uses numbered circles joined by a line (vertical timeline on mobile). FAQ uses native details/summary disclosures.

## Tokens
- Ink: #111315. Dark section: #1c2023.
- Accent/action orange: #ff8a3d. Dark orange on pale surfaces: #a9460b.
- Paper: #ffffff. Alternate surface: #f1f2f2.
- Secondary text: #555b60. Rules: #dfe1e2; dark rules: #343739.
- Self-hosted Manrope weights 400–800 with Arial/sans-serif fallback. Display sizes are fluid, headings use balanced wrapping and -0.035em letter spacing.
- Content container: 1280px maximum, 48px desktop side padding; 22px mobile side padding.
- Section vertical spacing: 105px desktop, 80px intermediate, 65px mobile.
- Buttons: bold dark text on orange, 3px corner radius, 54px minimum height; compact header action has a 44px mobile minimum.

## Responsive behavior
Breakpoints at 1050px, 760px and 360px reduce gutters, stack editorial columns and process steps, and adapt service/client grids. The hero stacks copy before photography on mobile. The trust strip becomes two columns. The final conversion panel becomes one column with a full-width action.

## Interaction and accessibility
Anchor navigation, skip link, focus-visible outlines, themed text selection, semantic headings, descriptive image alternatives and native FAQ controls are implemented. JavaScript limits the FAQ to one open answer. The disclosures remain functional without JavaScript. Smooth scrolling and short button color transitions respect reduced-motion preferences.

All conversion links use this exact destination, both in HTML and the script:
https://wa.me/551196278767?text=Ol%C3%A1%20vi%20dos%20an%C3%BAncios%20e%20quero%20fazer%20um%20or%C3%A7amento

## Review evidence and limits
Reviewed the built HTML, CSS, font declarations and JavaScript plus desktop hero, mobile hero and mobile FAQ screenshots. Those screenshots show readable composition with no apparent overlap or horizontal clipping. Seven sections, six FAQ items and six conversion links are present in code. No fresh browser execution or end-to-end WhatsApp navigation was performed during this bounded review. The middle and bottom sections were inspected in source, not in screenshots; full breakpoint, keyboard and contrast audits are outside this evidence.

## Follow-up polish
The final dark button's orange focus outline sits on an orange panel; use a dark or white contrasting outline in that context. Unicode directional arrows and disclosure symbols can be replaced with consistent SVG/CSS marks to fully satisfy the craft floor. A small caption above the hero photo's bold caption resembles a kicker; combine the captions if applying the floor's strict no-kicker rule. Motion is limited to hover and scrolling, with no separate authored entrance moment. These do not prevent the primary lead path from working.
