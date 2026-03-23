/**
 * indieHub — Veritabani seed scripti
 * Kullanim: node scripts/seed-database.mjs
 *
 * Bu script:
 * 1. "games" tablosunu olusturur (yoksa)
 * 2. Demo oyunlari ekler
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vljvqftirubxeggagiub.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsanZxZnRpcnVieGVnZ2FnaXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDE0MzksImV4cCI6MjA4OTU3NzQzOX0.ZFHJD7yJKbpPt1232x09E9F8Ey5QZhNSzw0gNPIl3n8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEMO_GAMES = [
  {
    title: "Hollow Depths",
    description: "Karanlik bir yeralti diyarinda gecen metroidvania tarzinda aksiyon-macera oyunu. Gizemli yaratiklara karsi savas ve antik sirlarini coz.",
    Studio: "Neon Forge Studios",
    price: 89.99,
    rating: 4.7,
    tags: ["Metroidvania", "Indie", "Aksiyon", "Karanlik"],
    image_url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=340&fit=crop",
  },
  {
    title: "Starfield Wanderer",
    description: "Sonsuz uzayda kesfet, ticaret yap ve hayatta kal. Prosedural olarak olusturulan galaksilerde kendi hikayeni yaz.",
    Studio: "Pixel Dreams",
    price: 119.99,
    rating: 4.5,
    tags: ["Uzay", "Sandbox", "RPG", "Strateji"],
    image_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=340&fit=crop",
  },
  {
    title: "Neon Drift",
    description: "Cyberpunk dunyasinda neon isikli sokaklarda yaris. Arabanizi ozellestirin ve yeraltina inin.",
    Studio: "RetroWave Games",
    price: 59.99,
    rating: 4.3,
    tags: ["Yaris", "Cyberpunk", "Arcade", "Co-op"],
    image_url: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=340&fit=crop",
  },
  {
    title: "Whispers of the Wild",
    description: "Buyuleyici bir orman dunyasinda hayvanlarla iletisim kur, dogayi iyilestir ve antik ruhlarin gizemini coz.",
    Studio: "Mossy Stone Interactive",
    price: 49.99,
    rating: 4.8,
    tags: ["Macera", "Indie", "Rahatlatici", "Dogal"],
    image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=340&fit=crop",
  },
  {
    title: "Dungeon Crawl Chronicles",
    description: "Klasik roguelite mekaniklariyla modern piksel sanat. Her olum yeni bir baslangic. 200+ esya, 50+ dusman.",
    Studio: "Dice & Pixel Co.",
    price: 39.99,
    rating: 4.6,
    tags: ["Roguelite", "Piksel", "RPG", "Indie"],
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=340&fit=crop",
  },
  {
    title: "Ocean Builder",
    description: "Okyanusun derinliklerinde kendi sualti sehrini in. Kaynaklari yonet, ekosistemi koru.",
    Studio: "Tidal Works",
    price: 69.99,
    rating: 4.2,
    tags: ["Simulasyon", "Insaat", "Strateji", "Rahatlatici"],
    image_url: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&h=340&fit=crop",
  },
  {
    title: "Shadow Tactics",
    description: "Gizlilik tabanli taktik oyunu. Dusmanlari alt et, tuzaklar kur ve gorevlerini sessizce tamamla.",
    Studio: "Stealth Pixel Games",
    price: 79.99,
    rating: 4.4,
    tags: ["Strateji", "Gizlilik", "Taktik", "Indie"],
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=340&fit=crop",
  },
  {
    title: "Frost Kingdom",
    description: "Buzul caginda hayatta kalma ve sehir insaat oyunu. Halkini soguktan koru, kaynaklar topla.",
    Studio: "Northern Lights Dev",
    price: 99.99,
    rating: 4.1,
    tags: ["Hayatta Kalma", "Insaat", "Strateji", "Yeni"],
    image_url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&h=340&fit=crop",
  },
  {
    title: "Pixel Warriors Online",
    description: "Retro tarzinda cok oyunculu arena savas oyunu. Arkadaslarinla takim kur ve rakiplerini yen!",
    Studio: "8-Bit Arena",
    price: 0,
    rating: 4.0,
    tags: ["Co-op", "PvP", "Piksel", "Aksiyon"],
    image_url: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=340&fit=crop",
  },
  {
    title: "Mind Puzzle Realm",
    description: "Zihin buken bulmacalar ve optik illuzyonlarla dolu gizemli bir dunya. 100+ benzersiz seviye.",
    Studio: "Cerebral Games",
    price: 29.99,
    rating: 4.9,
    tags: ["Bulmaca", "Indie", "Rahatlatici", "Yeni"],
    image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&h=340&fit=crop",
  },
  {
    title: "Galactic Trader",
    description: "Galaksiler arasi ticaret imparatorlugu kur. Al, sat, kacakcilik yap ve zengin ol!",
    Studio: "Cosmos Interactive",
    price: 84.99,
    rating: 3.9,
    tags: ["Uzay", "Strateji", "Ekonomi", "RPG"],
    image_url: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=600&h=340&fit=crop",
  },
  {
    title: "Verdant Valley",
    description: "Huzurlu bir ciftlik simulasyonu. Ekin ek, hayvan besle, kasabayla arkadaslik kur.",
    Studio: "Cozy Pixel Studio",
    price: 44.99,
    rating: 4.7,
    tags: ["Simulasyon", "Rahatlatici", "Indie", "Indirim"],
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=340&fit=crop",
  },
];

async function seed() {
  console.log("🌱 indieHub veritabani seed basliyor...\n");

  // Oncelikle mevcut veriyi kontrol et
  const { data: existing, error: checkError } = await supabase
    .from("games")
    .select("id")
    .limit(1);

  if (checkError) {
    console.error("❌ 'games' tablosuna erisilemedi:", checkError.message);
    console.log("\n📋 Once Supabase Dashboard > SQL Editor'da su komutu calistir:\n");
    console.log(`
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "Studio" TEXT,
  price NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  tags JSONB DEFAULT '[]',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON games FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON games FOR INSERT WITH CHECK (true);
    `);
    console.log("Sonra bu scripti tekrar calistir: node scripts/seed-database.mjs");
    process.exit(1);
  }

  if (existing && existing.length > 0) {
    console.log(`⚠️  Tabloda zaten ${existing.length}+ oyun var. Tekrar eklemek istiyor musun?`);
    console.log("   Devam etmek icin scripti --force ile calistir.");

    if (!process.argv.includes("--force")) {
      process.exit(0);
    }
  }

  // Oyunlari ekle
  console.log(`📦 ${DEMO_GAMES.length} demo oyun ekleniyor...`);

  const { data, error } = await supabase.from("games").insert(DEMO_GAMES).select("id, title");

  if (error) {
    console.error("❌ Oyun ekleme hatasi:", error.message);
    process.exit(1);
  }

  console.log(`\n✅ ${data.length} oyun basariyla eklendi!\n`);
  data.forEach((g) => console.log(`   🎮 ${g.title}`));
  console.log("\n🚀 Simdi 'npm run dev' ile uygulamayi baslat!");
}

seed().catch(console.error);
