// Generates sleek, EnerGenius-branded SVG product illustrations for every SKU
// in public/powerx_products.json, and writes them to public/products/<sku>.svg.
// These replace the hotlinked powerxgenerators.com photos (which show PowerX's
// own branding) with original, in-house artwork sized/labeled from the real specs.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'public', 'powerx_products.json');
const outDir = path.join(root, 'public', 'products');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
fs.mkdirSync(outDir, { recursive: true });

// ---- brand palette (matches Tailwind emerald/slate/amber used across the site) ----
const C = {
  emerald900: '#064e3b',
  emerald700: '#047857',
  emerald600: '#059669',
  emerald500: '#10b981',
  emerald400: '#34d399',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  white: '#ffffff',
};

// ---- naming, mirrors scripts/seed.ts whiteLabel() so units show EnerGenius names ----
function whiteLabel(model) {
  let m = model.replace(/Power\s*X\s*/gi, '').replace(/Lithium\s*/gi, '').trim();
  if (m.includes('30000') || m.includes('30K')) return 'Guardian 30K';
  if (m.includes('25000') || m.includes('25K')) return 'Guardian 25K';
  if (m.includes('20000') || m.includes('20K')) return 'Nomad 20K';
  if (m.includes('15000') || m.includes('15K')) return 'Nomad 15K';
  if (m.includes('10000') || m.includes('10K')) return 'Titan 10K';
  if (m.includes('8000')) return 'Guardian 8000';
  if (m.includes('5000')) return 'Guardian 5000';
  if (m.includes('3000')) return 'Guardian 3000';
  if (m.includes('2000')) return 'Nomad 2000';
  if (m.includes('1500')) return 'Nomad 1500';
  if (m.includes('1000') && m.includes('Mini')) return 'Scout 1000';
  if (m.includes('750') && m.includes('Mini')) return 'Scout 750';
  if (m.includes('400')) return 'Scout 400';
  if (m.includes('750') && !m.includes('Mini')) return 'Scout 750 Pro';
  if (m.includes('1000') && !m.includes('Mini')) return 'Scout 1000 Pro';
  if (m.includes('X120')) return 'PowerBank 120';
  if (m.includes('X90')) return 'PowerBank 90';
  if (m.includes('X80')) return 'PowerBank 80';
  if (m.includes('45')) return 'PowerBank 45';
  if (m.includes('40')) return 'PowerBank 40';
  if (m.includes('AGM')) return 'Scout 750 AGM';
  return m;
}

function archetypeFor(product, isBattery) {
  if (isBattery) {
    return product.category.includes('Flat Pack') ? 'battery-flat' : 'battery-block';
  }
  const w = parseInt(String(product.specifications.continuous_power).replace(/[^0-9]/g, ''), 10) || 0;
  // AGM-750 shares the mini units' 24"x15"x14" portable-brick footprint, unlike
  // the briefcase-style 750/1000 "Pro" (non-mini) lithium units.
  const mini = /mini/i.test(product.category) || /AGM/i.test(product.category);
  if (w >= 20000) return 'tower';
  if (w >= 10000) return 'cabinet';
  if (w >= 3000) return 'compact';
  if (mini) return 'brick';
  return 'case';
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- shared chrome: backdrop, floor shadow, brand badge, caption plate ----
function shell({ archetype, accent, body, capacityLabel, chipLabel, modelName, sku }) {
  const W = 800, H = 600;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="${C.slate100}"/>
      <stop offset="100%" stop-color="${C.slate200}"/>
    </radialGradient>
    <linearGradient id="metal" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${C.slate700}"/>
      <stop offset="45%" stop-color="${C.slate800}"/>
      <stop offset="100%" stop-color="${C.slate900}"/>
    </linearGradient>
    <linearGradient id="metalLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${C.slate600}"/>
      <stop offset="100%" stop-color="${C.slate800}"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent[0]}"/>
      <stop offset="100%" stop-color="${accent[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${C.amber400}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${C.amber400}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.28"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="${W / 2}" cy="470" rx="${170 + (ARCHETYPES[archetype]?.width ?? 200) * 0.35}" ry="22" fill="#0f172a" opacity="0.14"/>

  <g filter="url(#soft)">${body}</g>

  <!-- EnerGenius corner badge -->
  <g transform="translate(36,34)">
    <circle cx="22" cy="22" r="26" fill="url(#glow)"/>
    <path d="M22 2 C30 16 30 16 22 30 C14 16 14 16 22 2 Z" fill="${C.emerald500}"/>
    <path d="M22 2 L22 30 C14 16 14 16 22 2 Z" fill="${C.emerald700}"/>
    <path d="M6 30 C 6 40, 14 46, 22 46 C 30 46, 38 40, 38 30 C 30 34, 14 34, 6 30 Z" fill="${C.emerald600}"/>
    <text x="52" y="19" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${C.slate900}">Ener<tspan fill="${C.emerald600}">Genius</tspan></text>
    <text x="52" y="34" font-family="Arial, sans-serif" font-size="10" letter-spacing="2" fill="${C.slate600}">RENEWABLE RESOURCE GROUP</text>
  </g>

  <!-- caption plate -->
  <g transform="translate(0,${H - 76})">
    <rect x="40" y="0" width="${W - 80}" height="56" rx="12" fill="${C.white}" opacity="0.92"/>
    <text x="64" y="24" font-family="Arial, sans-serif" font-size="19" font-weight="700" fill="${C.slate900}">${esc(modelName)}</text>
    <text x="64" y="43" font-family="Arial, sans-serif" font-size="12" fill="${C.slate600}">${esc(capacityLabel)}</text>
    <rect x="${W - 220}" y="14" width="156" height="28" rx="14" fill="${C.emerald600}"/>
    <text x="${W - 142}" y="33" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="${C.white}" text-anchor="middle">${esc(chipLabel)}</text>
    <text x="64" y="66" font-family="Arial, sans-serif" font-size="10" letter-spacing="1" fill="${C.slate400}">SKU ${esc(sku)}</text>
  </g>
</svg>`;
}

function ventLines(x, y, w, rows, color = 'rgba(255,255,255,0.08)') {
  let out = '';
  for (let i = 0; i < rows; i++) {
    out += `<rect x="${x}" y="${y + i * 6}" width="${w}" height="2.4" rx="1.2" fill="${color}"/>`;
  }
  return out;
}

function outlets(cx, cy, count, size = 15) {
  let out = '';
  const n = Math.min(count, 6);
  for (let i = 0; i < n; i++) {
    const x = cx + i * (size + 8);
    out += `<circle cx="${x}" cy="${cy}" r="${size / 2}" fill="${C.slate900}" stroke="${C.slate400}" stroke-width="1.5"/>
      <circle cx="${x - 3}" cy="${cy - 2}" r="1.4" fill="${C.slate400}"/>
      <circle cx="${x + 3}" cy="${cy - 2}" r="1.4" fill="${C.slate400}"/>
      <rect x="${x - 1.2}" y="${cy + 1}" width="2.4" height="3.5" fill="${C.slate400}"/>`;
  }
  return out;
}

function display(x, y, w, h, text) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#052e21"/>
    <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="4" fill="#06331f" stroke="${C.emerald500}" stroke-width="1" opacity="0.8"/>
    <text x="${x + w / 2}" y="${y + h / 2 + 5}" font-family="'Courier New', monospace" font-size="13" font-weight="700" fill="${C.emerald400}" text-anchor="middle">${esc(text)}</text>`;
}

function wheels(cx1, cx2, cy, r = 20) {
  return `<circle cx="${cx1}" cy="${cy}" r="${r}" fill="${C.slate900}"/><circle cx="${cx1}" cy="${cy}" r="${r * 0.4}" fill="${C.slate600}"/>
    <circle cx="${cx2}" cy="${cy}" r="${r}" fill="${C.slate900}"/><circle cx="${cx2}" cy="${cy}" r="${r * 0.4}" fill="${C.slate600}"/>`;
}

// A folded carry handle molded flush into the top surface (not floating above it).
function handle(cx, topY, width) {
  return `<rect x="${cx - width / 2}" y="${topY - 13}" width="${width}" height="17" rx="8.5" fill="${C.slate600}" stroke="${C.slate900}" stroke-width="2"/>
    <rect x="${cx - width / 2 + 7}" y="${topY - 8}" width="${width - 14}" height="7" rx="3.5" fill="${C.slate800}"/>`;
}

function solarBadge(x, y) {
  return `<circle cx="${x}" cy="${y}" r="11" fill="${C.amber500}"/>
    <g stroke="${C.amber500}" stroke-width="2">
      <line x1="${x}" y1="${y - 17}" x2="${x}" y2="${y - 21}"/>
      <line x1="${x}" y1="${y + 17}" x2="${x}" y2="${y + 21}"/>
      <line x1="${x - 17}" y1="${y}" x2="${x - 21}" y2="${y}"/>
      <line x1="${x + 17}" y1="${y}" x2="${x + 21}" y2="${y}"/>
    </g>`;
}

// Ground line the illustration sits on: non-wheeled units rest with their base
// here; wheeled units get casters straddling it so everything shares one floor.
const GROUND_Y = 462;

// One parametric body builder covers every archetype - they differ only in
// footprint, whether they roll on casters, outlet/vent count, and solar input.
const ARCHETYPES = {
  tower: { width: 280, height: 330, rx: 18, metal: 'metal', wheels: true, wheelR: 22, outlets: 4, outletSize: 15, vents: 10, solar: true, handleWidth: 90 },
  cabinet: { width: 220, height: 280, rx: 16, metal: 'metal', wheels: true, wheelR: 18, outlets: 3, outletSize: 15, vents: 8, solar: true, handleWidth: 70 },
  compact: { width: 200, height: 230, rx: 16, metal: 'metalLight', wheels: true, wheelR: 15, outlets: 3, outletSize: 13, vents: 6, solar: true, handleWidth: 60 },
  case: { width: 180, height: 180, rx: 14, metal: 'metalLight', wheels: false, outlets: 2, outletSize: 12, vents: 5, solar: true, handleWidth: 46 },
  brick: { width: 140, height: 130, rx: 12, metal: 'metalLight', wheels: false, outlets: 2, outletSize: 10, vents: 4, solar: false, handleWidth: 36 },
  'battery-block': { width: 260, height: 130, rx: 14, metal: 'metal', wheels: false, outlets: 0, vents: 6, solar: false, terminals: true },
  'battery-flat': { width: 200, height: 150, rx: 14, metal: 'metal', wheels: false, outlets: 0, vents: 6, solar: false, terminals: true },
};

const accentByArchetype = {
  tower: [C.emerald600, C.emerald400],
  cabinet: [C.emerald600, C.emerald400],
  compact: [C.emerald500, C.emerald400],
  case: [C.emerald500, C.emerald400],
  brick: [C.emerald400, C.amber400],
  'battery-block': [C.amber500, C.amber400],
  'battery-flat': [C.amber500, C.amber400],
};

function buildBody(archetype, displayText) {
  const cfg = ARCHETYPES[archetype];
  const cx = 400;
  const top = GROUND_Y - cfg.height;
  const x = cx - cfg.width / 2;
  let out = '';

  if (cfg.wheels) {
    out += wheels(x + cfg.wheelR + 6, x + cfg.width - cfg.wheelR - 6, GROUND_Y + cfg.wheelR * 0.55, cfg.wheelR);
  }

  out += `<rect x="${x}" y="${top}" width="${cfg.width}" height="${cfg.height}" rx="${cfg.rx}" fill="url(#${cfg.metal})" stroke="${C.slate900}"/>`;
  out += `<rect x="${x}" y="${top}" width="${cfg.width}" height="${Math.max(10, cfg.rx - 2)}" rx="${cfg.rx / 2}" fill="url(#accentGrad)"/>`;

  if (cfg.terminals) {
    out += `<rect x="${cx - cfg.width * 0.23}" y="${top - 16}" width="18" height="18" rx="4" fill="${C.slate600}"/>`;
    out += `<rect x="${cx + cfg.width * 0.23 - 18}" y="${top - 16}" width="18" height="18" rx="4" fill="${C.slate600}"/>`;
  } else {
    out += handle(cx, top, cfg.handleWidth);
  }

  out += ventLines(x + cfg.width * 0.12, top + cfg.height * 0.16, cfg.width * 0.6, cfg.vents);

  const dispW = cfg.width * 0.72, dispH = Math.max(24, cfg.height * 0.15);
  out += display(cx - dispW / 2, top + cfg.height * 0.45, dispW, dispH, displayText);

  if (cfg.outlets > 0) {
    out += outlets(x + cfg.width * 0.14, top + cfg.height * 0.78, cfg.outlets, cfg.outletSize);
  }
  if (cfg.solar) {
    out += solarBadge(x + cfg.width - 24, top + cfg.height * 0.2);
  }

  return out;
}

function renderProduct(product, isBattery) {
  const archetype = archetypeFor(product, isBattery);
  const modelName = `EnerGenius ${whiteLabel(product.model)}`;
  const accent = accentByArchetype[archetype];

  let capacityLabel, chipLabel, displayText;
  if (isBattery) {
    capacityLabel = `${product.specifications.capacity} · ${product.specifications.battery_type} · ${product.specifications.dimensions}`;
    chipLabel = product.specifications.capacity.replace(' Hours', 'H');
    displayText = product.specifications.capacity;
  } else {
    capacityLabel = `${product.specifications.continuous_power} Continuous / ${product.specifications.peak_power} Peak · ${product.specifications.battery_type}`;
    chipLabel = product.wattage.split('/')[0].trim();
    displayText = product.specifications.continuous_power;
  }

  const body = buildBody(archetype, displayText);
  return shell({ archetype, accent, body, capacityLabel, chipLabel, modelName, sku: product.sku });
}

let count = 0;
for (const gen of data.generators) {
  const svg = renderProduct(gen, false);
  fs.writeFileSync(path.join(outDir, `${gen.sku}.svg`), svg);
  count++;
}
for (const battery of data.batteries) {
  const svg = renderProduct(battery, true);
  fs.writeFileSync(path.join(outDir, `${battery.sku}.svg`), svg);
  count++;
}

console.log(`Generated ${count} EnerGenius-branded product SVGs in public/products/`);
