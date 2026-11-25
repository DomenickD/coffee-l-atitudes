import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Coffee Latitudes database...");

  // 1. Categories
  const cafeMenu = await prisma.category.upsert({
    where: { slug: "cafe-menu" },
    update: {
      name: "Café Menu",
      description:
        "Handcrafted espresso drinks, single-origin pour-overs, and slow-steeped cold brew prepared fresh for café pick-up.",
      sortOrder: 1,
    },
    create: {
      slug: "cafe-menu",
      name: "Café Menu",
      description:
        "Handcrafted espresso drinks, single-origin pour-overs, and slow-steeped cold brew prepared fresh for café pick-up.",
      sortOrder: 1,
    },
  });

  const baggedCoffee = await prisma.category.upsert({
    where: { slug: "bagged-coffee" },
    update: {
      name: "Bagged Coffee",
      description:
        "Direct-trade micro-lots roasted to order across the Coffee Belt—traceable from farm gate to your morning cup.",
      sortOrder: 2,
    },
    create: {
      slug: "bagged-coffee",
      name: "Bagged Coffee",
      description:
        "Direct-trade micro-lots roasted to order across the Coffee Belt—traceable from farm gate to your morning cup.",
      sortOrder: 2,
    },
  });

  const merch = await prisma.category.upsert({
    where: { slug: "merch" },
    update: {
      name: "Merch",
      description:
        "Small-batch stoneware mugs, heavy-weight apparel, and precision brewing vessels designed for daily ritual.",
      sortOrder: 3,
    },
    create: {
      slug: "merch",
      name: "Merch",
      description:
        "Small-batch stoneware mugs, heavy-weight apparel, and precision brewing vessels designed for daily ritual.",
      sortOrder: 3,
    },
  });

  // 2. Farm Traceability Lots
  const konaLot = await prisma.farmLot.upsert({
    where: { lotCode: "CL-HI-1950" },
    update: {},
    create: {
      lotCode: "CL-HI-1950",
      name: "Holualoa Volcanic Slope Reserve",
      originRegion: "North Kona, Big Island",
      country: "Hawaii, USA",
      latitude: "19.6224° N",
      longitude: "155.9486° W",
      elevation: "620m – 780m",
      producer: "Ka'u & Holualoa Family Estates",
      varietal: "Kona Typica",
      processMethod: "Washed & Sun-Dried on Hoshidana Decks",
      harvestSeason: "October – January",
      cupScore: 89.25,
      tastingNotes: ["Macadamia Praline", "Brown Butter", "Meyer Lemon", "Cacao Nib"],
      story:
        "Grown in mineral-rich volcanic loam along the mist-cooled western flanks of Hualalai. Hand-picked in seven selective passes and dried under retractable timber roofs.",
      farmGatePremiumPct: 48,
      imageUrl: "/images/origin-kona.svg",
    },
  });

  const pngLot = await prisma.farmLot.upsert({
    where: { lotCode: "CL-PG-0584" },
    update: {},
    create: {
      lotCode: "CL-PG-0584",
      name: "Wahgi Valley Cloud-Forest Micro-Lot",
      originRegion: "Western Highlands",
      country: "Papua New Guinea",
      latitude: "5.8421° S",
      longitude: "144.2314° E",
      elevation: "1,650m – 1,850m",
      producer: "Sigri & Kunjin Smallholder Collective",
      varietal: "Arusha, Bourbon & Typica",
      processMethod: "Triple-Washed Mountain Spring Fermentation",
      harvestSeason: "May – August",
      cupScore: 88.5,
      tastingNotes: ["Blood Orange", "Wildflower Honey", "Cardamom Spice", "Silky Cocoa"],
      story:
        "Cultivated by smallholder families tucked beneath highland rainforest canopy. Fermented in crisp mountain spring water and dried slowly on raised bamboo tables.",
      farmGatePremiumPct: 42,
      imageUrl: "/images/origin-png.svg",
    },
  });

  const nicaraguaLot = await prisma.farmLot.upsert({
    where: { lotCode: "CL-NI-1309" },
    update: {},
    create: {
      lotCode: "CL-NI-1309",
      name: "Finca La Neblina Shade-Grown Lot",
      originRegion: "Jinotega Cloud Forest",
      country: "Nicaragua",
      latitude: "13.0910° N",
      longitude: "86.0023° W",
      elevation: "1,420m – 1,680m",
      producer: "Jinotega Women-Led Cooperative",
      varietal: "Red Catuai & Maragogype",
      processMethod: "Black Honey & Raised-Bed Natural",
      harvestSeason: "December – March",
      cupScore: 89.75,
      tastingNotes: ["Roasted Hazelnut", "Black Cherry", "Panela", "Velvet Espresso Finish"],
      story:
        "Shade-grown alongside native cedar and banana trees in Jinotega's cloud forest. Direct farm-gate premiums fund clean-water filtration and year-round agronomy training.",
      farmGatePremiumPct: 52,
      imageUrl: "/images/origin-nicaragua.svg",
    },
  });

  // 3. Products
  const products = [
    // Café Menu (Pick-Up)
    {
      slug: "latitude-signature-cortado",
      name: "Latitude Signature Cortado",
      subtitle: "Double ristretto with velvety steamed milk",
      description:
        "Pulled with our Jinotega cloud-forest espresso blend and balanced 1:1 with lightly textured organic milk or oat milk.",
      priceCents: 475,
      imageUrl: "/images/cafe-cortado.svg",
      categoryId: cafeMenu.id,
      farmLotId: nicaraguaLot.id,
      isFeatured: true,
      badge: "Barista Favorite",
      origin: "Jinotega, Nicaragua",
      roastLevel: "Medium",
      tastingNotes: ["Caramelized Sugar", "Dark Chocolate", "Toasted Almond"],
      weightOptions: [],
      grindOptions: [],
      sizeOptions: ["4.5oz Classic", "6oz Oat Milk"],
    },
    {
      slug: "kona-single-origin-pourover",
      name: "Kona Single-Origin Pour-Over",
      subtitle: "Hand-poured V60 brewed fresh to order",
      description:
        "Showcasing our Holualoa volcanic reserve brewed through Japanese paper for crystalline clarity and sweet macadamia warmth.",
      priceCents: 650,
      imageUrl: "/images/cafe-pourover.svg",
      categoryId: cafeMenu.id,
      farmLotId: konaLot.id,
      isFeatured: true,
      badge: "Micro-Lot Pour",
      origin: "North Kona, Hawaii",
      roastLevel: "Light-Medium",
      tastingNotes: ["Macadamia", "Meyer Lemon", "Brown Butter"],
      weightOptions: [],
      grindOptions: [],
      sizeOptions: ["12oz Hot", "16oz Iced Flash-Brew"],
    },
    {
      slug: "cloud-forest-cold-brew",
      name: "Cloud-Forest Cold Brew",
      subtitle: "18-hour cold extraction over highland PNG beans",
      description:
        "Steeped cold for 18 hours in triple-filtered water for syrupy body, bright citrus aroma, and zero bitterness.",
      priceCents: 550,
      imageUrl: "/images/cafe-coldbrew.svg",
      categoryId: cafeMenu.id,
      farmLotId: pngLot.id,
      isFeatured: false,
      badge: "Slow Steeped",
      origin: "Western Highlands, PNG",
      roastLevel: "Medium",
      tastingNotes: ["Blood Orange", "Cacao", "Raw Honey"],
      weightOptions: [],
      grindOptions: [],
      sizeOptions: ["12oz", "16oz", "20oz"],
    },
    {
      slug: "cardamom-panela-latte",
      name: "Cardamom Panela Latte",
      subtitle: "House-spiced unrefined cane syrup & double espresso",
      description:
        "Freshly cracked green cardamom pods steeped with organic Colombian panela and folded into a rich double espresso.",
      priceCents: 600,
      imageUrl: "/images/cafe-latte.svg",
      categoryId: cafeMenu.id,
      farmLotId: nicaraguaLot.id,
      isFeatured: false,
      badge: "Seasonal House",
      origin: "Jinotega, Nicaragua",
      roastLevel: "Medium",
      tastingNotes: ["Green Cardamom", "Molasses", "Sweet Cream"],
      weightOptions: [],
      grindOptions: [],
      sizeOptions: ["12oz Hot", "16oz Hot", "16oz Iced"],
    },

    // Bagged Coffee
    {
      slug: "hawaii-kona-reserve-bag",
      name: "19.6° N — Kona Volcanic Reserve",
      subtitle: "100% Estate North Kona Typica",
      description:
        "Lush, aromatic, and impossibly smooth. Roasted gently in small batches to honor the volcanic terroir of Holualoa's sunny morning slopes and afternoon cloud cover.",
      priceCents: 3400,
      imageUrl: "/images/bag-kona.svg",
      categoryId: baggedCoffee.id,
      farmLotId: konaLot.id,
      isFeatured: true,
      badge: "100% Estate Kona",
      origin: "North Kona, Hawaii (19.6° N)",
      roastLevel: "Light-Medium",
      tastingNotes: ["Macadamia Praline", "Brown Butter", "Meyer Lemon"],
      weightOptions: ["12oz", "16oz", "2lb"],
      grindOptions: ["Whole Bean", "Pour-Over (Medium-Fine)", "Drip (Medium)", "French Press (Coarse)", "Espresso (Fine)"],
      sizeOptions: [],
    },
    {
      slug: "papua-new-guinea-highlands-bag",
      name: "5.8° S — Papua New Guinea Highlands",
      subtitle: "Wahgi Valley Cloud-Forest Micro-Lot",
      description:
        "Vibrant blood orange sweetness balanced by warm cardamom spice and a lush cocoa finish. Triple-washed in crystal highland spring water.",
      priceCents: 2200,
      imageUrl: "/images/bag-png.svg",
      categoryId: baggedCoffee.id,
      farmLotId: pngLot.id,
      isFeatured: true,
      badge: "Direct Trade",
      origin: "Western Highlands, PNG (5.8° S)",
      roastLevel: "Medium",
      tastingNotes: ["Blood Orange", "Wildflower Honey", "Cardamom"],
      weightOptions: ["12oz", "16oz", "2lb"],
      grindOptions: ["Whole Bean", "Pour-Over (Medium-Fine)", "Drip (Medium)", "French Press (Coarse)", "Espresso (Fine)"],
      sizeOptions: [],
    },
    {
      slug: "nicaragua-jinotega-honey-bag",
      name: "13.1° N — Nicaragua Jinotega Honey",
      subtitle: "Finca La Neblina Shade-Grown Reserve",
      description:
        "Our signature crowd-pleaser and café espresso foundation. Black-honey processed in Jinotega's cloud forest for velvety body, black cherry sweetness, and toasted hazelnut depth.",
      priceCents: 2100,
      imageUrl: "/images/bag-nicaragua.svg",
      categoryId: baggedCoffee.id,
      farmLotId: nicaraguaLot.id,
      isFeatured: true,
      badge: "Roaster's Pick",
      origin: "Jinotega, Nicaragua (13.1° N)",
      roastLevel: "Medium",
      tastingNotes: ["Black Cherry", "Roasted Hazelnut", "Panela"],
      weightOptions: ["12oz", "16oz", "2lb"],
      grindOptions: ["Whole Bean", "Pour-Over (Medium-Fine)", "Drip (Medium)", "French Press (Coarse)", "Espresso (Fine)"],
      sizeOptions: [],
    },

    // Merch
    {
      slug: "coffee-latitudes-stoneware-mug",
      name: "Brickworks Ceramic Field Mug",
      subtitle: "12oz wheel-thrown speckled stoneware",
      description:
        "Hand-glazed in warm terracotta and espresso speckle with the Coffee Latitudes compass mark debossed into the clay base.",
      priceCents: 2800,
      imageUrl: "/images/merch-mug.svg",
      categoryId: merch.id,
      farmLotId: null,
      isFeatured: true,
      badge: "Small Batch",
      origin: "Handcrafted Stoneware",
      roastLevel: null,
      tastingNotes: ["Dishwasher Safe", "12oz Capacity", "Heat-Retaining Base"],
      weightOptions: [],
      grindOptions: [],
      sizeOptions: ["One Size (12oz)"],
    },
    {
      slug: "coffee-belt-heavyweight-tee",
      name: "Coffee Belt Coordinates Tee",
      subtitle: "Heavyweight 240gsm organic ring-spun cotton",
      description:
        "Minimalist white outline wordmark across the chest with Tropic of Cancer to Tropic of Capricorn coordinates printed down the spine.",
      priceCents: 3600,
      imageUrl: "/images/merch-tee.svg",
      categoryId: merch.id,
      farmLotId: null,
      isFeatured: false,
      badge: "Organic Cotton",
      origin: "Espresso Charcoal",
      roastLevel: null,
      tastingNotes: ["100% Organic Cotton", "Pre-Shrunk", "Relaxed Fit"],
      weightOptions: [],
      grindOptions: [],
      sizeOptions: ["S", "M", "L", "XL"],
    },
    {
      slug: "canvas-origin-tote",
      name: "Roastery Waxed Canvas Tote",
      subtitle: "16oz heavy duck canvas built for bags & vinyl",
      description:
        "Reinforced brick-red stitched handles with an interior pocket sized for a 12oz bag of beans and your favorite field notebook.",
      priceCents: 2600,
      imageUrl: "/images/merch-tote.svg",
      categoryId: merch.id,
      farmLotId: null,
      isFeatured: false,
      badge: "Roastery Gear",
      origin: "Natural Ecru / Brick",
      roastLevel: null,
      tastingNotes: ["16oz Canvas", "Interior Pocket", "Reinforced Straps"],
      weightOptions: [],
      grindOptions: [],
      sizeOptions: ["Standard"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        subtitle: product.subtitle,
        description: product.description,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        farmLotId: product.farmLotId,
        isFeatured: product.isFeatured,
        badge: product.badge,
        origin: product.origin,
        roastLevel: product.roastLevel,
        tastingNotes: product.tastingNotes,
        weightOptions: product.weightOptions,
        grindOptions: product.grindOptions,
        sizeOptions: product.sizeOptions,
      },
      create: product,
    });
  }

  console.log(
    `Seeded 3 categories, 3 traceability farm lots, and ${products.length} products.`
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
