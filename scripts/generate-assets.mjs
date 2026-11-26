import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "public", "images");
fs.mkdirSync(dir, { recursive: true });

const assets = [
  // Origins
  { file: "origin-kona.svg", bg1: "#1E1410", bg2: "#5C2B1A", accent: "#E3B878", tag: "19.6224° N • HAWAII", title: "North Kona", sub: "Volcanic Slope Reserve" },
  { file: "origin-png.svg", bg1: "#0F241B", bg2: "#254E3B", accent: "#D5BC96", tag: "5.8421° S • PAPUA NEW GUINEA", title: "Wahgi Valley", sub: "Cloud-Forest Micro-Lot" },
  { file: "origin-nicaragua.svg", bg1: "#1B1512", bg2: "#4B2C20", accent: "#D97A5D", tag: "13.0910° N • NICARAGUA", title: "Jinotega", sub: "Finca La Neblina Honey" },

  // Café Bar & Kitchen
  { file: "cafe-cortado.svg", bg1: "#241711", bg2: "#5E3928", accent: "#E8DAC4", tag: "CAFÉ BAR • ESPRESSO", title: "Cortado", sub: "Double Ristretto + Velvety Milk" },
  { file: "cafe-pourover.svg", bg1: "#191512", bg2: "#473123", accent: "#C29B63", tag: "CAFÉ BAR • V60", title: "Kona Pour-Over", sub: "Hand-Brewed Micro-Lot" },
  { file: "cafe-coldbrew.svg", bg1: "#101B17", bg2: "#253D32", accent: "#D5BC96", tag: "CAFÉ BAR • 18-HR STEEP", title: "Cold Brew", sub: "PNG Highland Concentrate" },
  { file: "cafe-latte.svg", bg1: "#2A1812", bg2: "#733D26", accent: "#F4EDE1", tag: "CAFÉ BAR • SEASONAL", title: "Cardamom Latte", sub: "Panela Cane + Double Shot" },
  { file: "cafe-americano.svg", bg1: "#1D1410", bg2: "#4C2E20", accent: "#E3B878", tag: "CAFÉ BAR • CLASSIC", title: "Hot Americano", sub: "El-Jefe Espresso + Spring Water" },
  { file: "cafe-cuban.svg", bg1: "#26160F", bg2: "#6F361C", accent: "#F4EDE1", tag: "TAMPA FAVORITE • CUBAN", title: "Cuban Coffee", sub: "Whipped Espuma + Café con Leche" },
  { file: "cafe-deluxe.svg", bg1: "#2A1B12", bg2: "#7A4B24", accent: "#FBF8F3", tag: "MORNING BITES • HOT", title: "The Deluxe", sub: "Bacon, Egg & Cheese on NY Bagel" },
  { file: "cafe-giacomo.svg", bg1: "#18241A", bg2: "#4E3422", accent: "#E8DAC4", tag: "AFTERNOON BITES • SUB", title: "The Giacomo", sub: "Artisan Italian Sub Pressed Warm" },
  { file: "cafe-turkey.svg", bg1: "#241913", bg2: "#693822", accent: "#F4EDE1", tag: "SIGNATURE LUNCH", title: "Turkey Do.", sub: "Turkey, Bacon, Avocado & Spartacus" },
  { file: "cafe-crumbcake.svg", bg1: "#2E1E14", bg2: "#7C5233", accent: "#FBF8F3", tag: "BAKERY • HOUSE-MADE", title: "NY Crumb Cake", sub: "Thick Cinnamon Streusel Square" },

  // Bagged Coffee & Subscriptions
  { file: "bag-kona.svg", bg1: "#20130F", bg2: "#6B301E", accent: "#E3B878", tag: "19.6° N • LIGHT-MEDIUM", title: "Kona Reserve", sub: "100% Estate Typica" },
  { file: "bag-png.svg", bg1: "#0D2118", bg2: "#1E4A36", accent: "#E8DAC4", tag: "5.8° S • MEDIUM ROAST", title: "PNG Highlands", sub: "Triple-Washed Micro-Lot" },
  { file: "bag-nicaragua.svg", bg1: "#1D130F", bg2: "#54291E", accent: "#E28B6B", tag: "13.1° N • MEDIUM ROAST", title: "Jinotega Honey", sub: "Black-Honey Cloud Forest" },
  { file: "bag-eljefe.svg", bg1: "#120D0A", bg2: "#3B1E14", accent: "#D5BC96", tag: "DARK ROAST • ESPRESSO", title: "El-Jefe Espresso", sub: "Bold, Syrupy Dark Chocolate" },
  { file: "bag-flowerpower.svg", bg1: "#2B1C14", bg2: "#824A2E", accent: "#FBF8F3", tag: "LIGHT ROAST • BLEND", title: "Flower Power", sub: "Bright Jasmine & Citrus Bloom" },
  { file: "bag-ethiopia.svg", bg1: "#1C1A12", bg2: "#544723", accent: "#E8DAC4", tag: "6.0° N • LIGHT ROAST", title: "Ethiopia Sidamo", sub: "Guji Berry & Bergamot" },
  { file: "bag-costarica.svg", bg1: "#171210", bg2: "#47251A", accent: "#D97A5D", tag: "9.6° N • DARK ROAST", title: "Tarrazú Dark", sub: "Costa Rica Molasses & Cacao" },
  { file: "bag-honduras.svg", bg1: "#111613", bg2: "#2C3830", accent: "#D5BC96", tag: "14.8° N • FTO DARK", title: "After Dark FTO", sub: "Fair-Trade Organic Honduras" },
  { file: "bag-decaf.svg", bg1: "#151D22", bg2: "#304854", accent: "#E8DAC4", tag: "DECAF • SWISS WATER", title: "Peruvian Decaf", sub: "Smooth Caramel, Zero Caffeine" },
  { file: "bag-subscription.svg", bg1: "#16261E", bg2: "#395947", accent: "#F4EDE1", tag: "SUBSCRIPTION BOX", title: "Monthly Box", sub: "Freshly Roasted & Delivered" },

  // Merch & Brewing Gear
  { file: "merch-mug.svg", bg1: "#261B16", bg2: "#5A3828", accent: "#E8DAC4", tag: "MERCH • 15OZ LOGO MUG", title: "CL Logo Mug", sub: "Classic Roastery Stoneware" },
  { file: "merch-tee.svg", bg1: "#141211", bg2: "#332924", accent: "#F4EDE1", tag: "MERCH • APPAREL", title: "Latitudes Tee", sub: "Soft Ring-Spun Cotton" },
  { file: "merch-cap.svg", bg1: "#181C1A", bg2: "#38423D", accent: "#E8DAC4", tag: "MERCH • HEADWEAR", title: "Flex-Fit Cap", sub: "Embroidered Coffee Latitudes" },
  { file: "merch-kettle.svg", bg1: "#1E1D1C", bg2: "#4A4540", accent: "#F4EDE1", tag: "BREWING GEAR • HARIO", title: "Buono Kettle", sub: "1200ml Gooseneck Pour-Over" },
  { file: "merch-chemex.svg", bg1: "#221A14", bg2: "#63462D", accent: "#FBF8F3", tag: "BREWING GEAR • POUR-OVER", title: "Chemex Brewer", sub: "Classic Hourglass Glass Carafe" },
  { file: "merch-frenchpress.svg", bg1: "#171717", bg2: "#3D352E", accent: "#D5BC96", tag: "BREWING GEAR • 800ML", title: "French Press", sub: "Borosilicate Full-Immersion" },
  { file: "merch-tote.svg", bg1: "#2C221A", bg2: "#614A37", accent: "#FBF8F3", tag: "MERCH • 16OZ CANVAS", title: "Roastery Tote", sub: "Waxed Ecru & Brick Stitch" },
];

for (const a of assets) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a.bg1}"/>
      <stop offset="100%" stop-color="${a.bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="32%" r="55%">
      <stop offset="0%" stop-color="${a.accent}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${a.bg1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="520" fill="url(#g)"/>
  <rect width="800" height="520" fill="url(#glow)"/>
  <g stroke="${a.accent}" stroke-opacity="0.22" fill="none">
    <circle cx="620" cy="180" r="150" stroke-width="1.2"/>
    <circle cx="620" cy="180" r="95" stroke-width="1" stroke-dasharray="5 6"/>
    <ellipse cx="620" cy="180" rx="68" ry="150" stroke-width="1"/>
    <path d="M470 180 H770 M495 110 H745 M495 250 H745" stroke-width="1"/>
  </g>
  <rect x="44" y="44" width="712" height="432" rx="18" fill="none" stroke="${a.accent}" stroke-opacity="0.25" stroke-width="1"/>
  <text x="72" y="112" fill="${a.accent}" font-family="ui-monospace, monospace" font-size="18" letter-spacing="4">${a.tag}</text>
  <text x="72" y="340" fill="#FFFFFF" font-family="Georgia, serif" font-size="56" font-weight="600">${a.title}</text>
  <text x="72" y="388" fill="${a.accent}" font-family="system-ui, sans-serif" font-size="24" opacity="0.9">${a.sub}</text>
  <text x="72" y="442" fill="#FFFFFF" opacity="0.55" font-family="ui-monospace, monospace" font-size="14" letter-spacing="3">COFFEE LATITUDES • TAMPA, FL</text>
</svg>`;
  fs.writeFileSync(path.join(dir, a.file), svg, "utf8");
}

console.log(`Generated ${assets.length} editorial SVG assets.`);
