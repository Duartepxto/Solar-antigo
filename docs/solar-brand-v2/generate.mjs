// Review sources only. No dependencies, fonts, raster logos or production writes.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
const assets = join(root, 'assets');
mkdirSync(assets, { recursive: true });
const colors = { ink: '#111111', white: '#ffffff', gold: '#ddbd89' };
const path = (d, x = 0, y = 0, extra = '') => `<path d="${d}" transform="translate(${x} ${y})" ${extra}/>`;
const svg = (name, width, height, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none"><title>Solar — ${name}, conceito para comparação</title>${content}</svg>\n`;

// Palavra: broad capital lettering; open terminals, broad counters, short L foot.
// All five letters are authored outlines, not text from an installed font.
const aS = 'M45 5C38 1 31 0 23 0C8 0 0 8 0 19C0 30 8 35 22 39C32 42 37 45 37 51C37 57 32 60 23 60C15 60 8 57 2 53L0 62C7 67 15 69 24 69C38 69 47 61 47 50C47 38 38 33 24 29C14 26 10 23 10 18C10 12 15 9 24 9C31 9 37 11 43 14Z';
const aWord = path(aS, 0, 7) +
  path('M26 0C9 0 0 13 0 35C0 57 9 70 26 70C43 70 52 57 52 35C52 13 43 0 26 0ZM26 10C36 10 41 19 41 35C41 51 36 60 26 60C16 60 11 51 11 35C11 19 16 10 26 10Z', 60, 6, 'fill-rule="evenodd"') +
  path('M0 0H11V59H39V69H0Z', 129, 7) +
  path('M0 69L23 0H36L59 69H47L42 52H16L11 69ZM19 42H39L29 10Z', 181, 7, 'fill-rule="evenodd"') +
  path('M0 0H25C43 0 52 7 52 21C52 32 46 38 36 41L56 69H43L25 43H11V69H0ZM11 10V33H24C35 33 41 29 41 21C41 13 35 10 24 10Z', 257, 7, 'fill-rule="evenodd"');
const aSymbol = `<g transform="translate(15 6) scale(.76)">${path(aS)}</g>`;

// Passagem: two opposing masses with one stepped channel, never a node graph.
const bSymbol = path('M10 28V18Q10 8 20 8H54V20H32V28ZM10 44H32V36H54V46Q54 56 44 56H10Z');
// Rounded square counters and deliberately clipped r terminal share the channel grammar.
const bWord = `<g transform="translate(4 4)" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="square" stroke-linejoin="round">` +
  path('M32 19H12Q3 19 3 27V28Q3 36 12 36H23Q32 36 32 44V46Q32 54 23 54H3', 0, 3) +
  path('M13 19H23Q33 19 33 29V44Q33 54 23 54H13Q3 54 3 44V29Q3 19 13 19Z', 48, 3) +
  path('M5 0V48Q5 54 12 54H17', 94, 3) +
  path('M32 19V54M32 27Q29 19 20 19H13Q3 19 3 29V44Q3 54 13 54H20Q29 54 32 46', 127, 3) +
  path('M3 54V19M3 31Q3 19 16 19H28', 176, 3) + '</g>';

// Limiar: one solid field of light with a broad off-centre aperture.
// The cut is a calm vertical transition, not a ray, stripe system or orbit.
const cSymbol = path('M32 5C47 5 59 17 59 32C59 47 47 59 32 59C17 59 5 47 5 32C5 17 17 5 32 5ZM29 5C20 15 16 24 16 32C16 44 23 53 34 59C20 48 23 40 28 32C35 22 35 13 29 5Z', 0, 0, 'fill-rule="evenodd"');
// Limiar lettering: mixed case, flared S, high contrast o/a, a quiet foot on l.
const cWord = path('M44 8C36 2 29 0 21 0C9 0 2 7 2 17C2 27 8 31 22 36C33 40 38 45 38 51C38 59 30 64 21 64C12 64 6 60 3 54L0 68C6 70 14 72 21 72C36 72 48 63 48 50C48 38 40 33 26 28C15 24 11 20 11 14C11 7 17 4 24 4C31 4 37 10 39 18Z', 0, 3) +
  path('M24 0C9 0 0 10 0 26C0 42 9 52 24 52C39 52 48 42 48 26C48 10 39 0 24 0ZM24 5C33 5 37 13 37 26C37 39 33 47 24 47C15 47 11 39 11 26C11 13 15 5 24 5Z', 61, 24, 'fill-rule="evenodd"') +
  path('M0 0L17 0V63Q17 69 24 69V73H0V69Q7 69 7 63V9Q7 5 0 4Z', 123, 2) +
  path('M24 0C11 0 0 10 0 28C0 43 7 52 18 52C26 52 32 48 36 41V51H46V0L35 4C31 1 28 0 24 0ZM24 6C32 6 35 13 35 25C35 38 30 46 22 46C14 46 11 39 11 27C11 14 16 6 24 6Z', 161, 24, 'fill-rule="evenodd"') +
  path('M0 0H16V10C20 3 26 0 33 0H37V11C26 9 17 13 17 26V42Q17 47 23 47V51H0V47Q7 47 7 42V10Q7 4 0 4Z', 220, 24);

const concepts = [
  { id: 'palavra', name: 'Palavra', word: aWord, wordWidth: 314, wordHeight: 84, symbol: aSymbol, fullWidth: 314, fullHeight: 84, full: aWord },
  { id: 'passagem', name: 'Passagem', word: bWord, wordWidth: 216, wordHeight: 70, symbol: bSymbol, fullWidth: 308, fullHeight: 78, full: `<g transform="translate(0 7)">${bSymbol}</g><g transform="translate(88 6)">${bWord}</g>` },
  { id: 'limiar', name: 'Limiar', word: cWord, wordWidth: 266, wordHeight: 84, symbol: cSymbol, fullWidth: 354, fullHeight: 84, full: `<g transform="translate(0 10)">${cSymbol}</g><g transform="translate(84 0)">${cWord}</g>` },
];

for (const concept of concepts) {
  const folder = join(assets, concept.id); mkdirSync(folder, { recursive: true });
  for (const [tone, color] of Object.entries(colors)) {
    const painted = content => `<g fill="${color}" color="${color}">${content}</g>`;
    writeFileSync(join(folder, `signature-${tone}.svg`), svg(`${concept.name} — assinatura ${tone}`, concept.fullWidth, concept.fullHeight, painted(concept.full)));
    writeFileSync(join(folder, `wordmark-${tone}.svg`), svg(`${concept.name} — lettering ${tone}`, concept.wordWidth, concept.wordHeight, painted(concept.word)));
    for (const size of [16, 24, 32]) {
      writeFileSync(join(folder, `symbol-${size}-${tone}.svg`), svg(`${concept.name} — símbolo ${size}px ${tone}`, size, size, `<g transform="scale(${size / 64})">${painted(concept.symbol)}</g>`));
    }
    // Transparent layer for the review mask compositor, not native Android XML.
    // Actual ink bounds (not the 64px viewBox) stay inside [21,87] on both axes.
    writeFileSync(join(folder, `foreground-${tone}.svg`), svg(`${concept.name} — foreground 108dp ${tone}`, 108, 108, `<g transform="translate(15.6 15.6) scale(1.2)">${painted(concept.symbol)}</g>`));
  }
}
writeFileSync(join(assets, 'background-graphite.svg'), svg('fundo de app icon, simulação', 108, 108, '<path fill="#15191f" d="M0 0H108V108H0Z"/>'));
console.log('Three SVG review systems generated. No production assets modified.');
