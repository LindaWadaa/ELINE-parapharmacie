import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = resolve(__dirname, '..', '.env');
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = process.env[key] || value;
    }
  } catch { }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Supabase credentials not found.');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
  process.exit(1);
}

if (supabaseKey === 'COLLEZ_ICI_LA_CLE_PUBLISHABLE_COMPLETE') {
  console.error('ERROR: You need to replace the placeholder Supabase anon key in your .env file.');
  console.error('Get your keys from: https://supabase.com/dashboard/project/jgkubxmhncmieaoqbvqf/settings/api');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function mapCategoryToPublic(category) {
  const map = {
    'BABY & MOM': 'Bébés (0-3 ans)',
    'FOOD SUPPLEMENTS': 'Femmes',
    'HYGIENE': 'Femmes',
    'FACE': 'Femmes',
    'BODY': 'Femmes',
    'HAIR': 'Femmes',
    'MEN': 'Hommes',
    'DIETARY SUPPLEMENTS': 'Femmes',
    'SUN CARE': 'Femmes',
    'MAKEUP': 'Femmes',
    'PROMO': 'Femmes',
  };
  return map[category] || null;
}

const products = [
  // ── From products.json ──────────────────────────────────────
  {
    name: 'SEBIACLEAR Hydra',
    description: 'Hydrating soothing repair care, anti-marks long-lasting comfort.',
    price: 115.000,
    category: 'FACE',
    subcategory: 'Soins hydratants et nourrissants',
    image_url: '/assets/hydratingSVR.webp',
    discount_percent: null,
    category_public: 'Femmes',
  },
  {
    name: 'SVR Ampoule C Anti-Ox Concentrated Glow 30ml',
    description: 'SVR Ampoule C Anti-Ox Concentrated Glow 30 ml is an ultra-concentrated serum with optimized vitamin C (20%).',
    price: 32.500,
    category: 'FACE',
    subcategory: 'Anti-âge & anti-rides',
    image_url: '/assets/VitaminC.avif',
    discount_percent: 15,
    category_public: 'Femmes',
  },
  {
    name: 'AKTIV Omega 3 Marine 60 Capsules',
    description: 'AKTIV OMEGA 3 MARINE 60 CAPSULES helps maintain healthy cholesterol levels and contributes to cardiovascular health.',
    price: 50.800,
    category: 'FOOD SUPPLEMENTS',
    subcategory: 'Oméga & acides gras',
    image_url: '/assets/AKTIV.webp',
    discount_percent: null,
    category_public: null,
  },
  {
    name: 'Neutraderm Baby Detangling Shampoo Softness 200ml',
    description: 'Neutraderm Baby detangling shampoo softness is specially adapted for baby\'s hair and skin, from birth.',
    price: 28.500,
    category: 'BABY & MOM',
    subcategory: 'Bain & soins bébé',
    image_url: '/assets/prod4.webp',
    discount_percent: null,
    category_public: 'Bébés (0-3 ans)',
  },
  {
    name: 'CLINO+ Hydroalcoholic Hand Gel 70% 500ml',
    description: 'Clino hydroalcoholic gel is a hypoallergenic antiseptic preparation that effectively disinfects dry hands.',
    price: 12.200,
    category: 'HYGIENE',
    subcategory: 'Désinfectants mains',
    image_url: '/assets/prod5.webp',
    discount_percent: null,
    category_public: null,
  },
  {
    name: 'Nutrend EAA Mega Strong Powder 300g',
    description: 'Nutrend EAA Mega Strong Powder instant blend of 9 essential amino acids enriched with vitamins, zinc and green tea.',
    price: 139.000,
    category: 'FOOD SUPPLEMENTS',
    subcategory: 'Protéines',
    image_url: '/assets/prod6.avif',
    discount_percent: null,
    category_public: null,
  },
  {
    name: 'Roncey Clairskin Hand Cream SPF 30+ 100ml',
    description: 'Clairskin SPF30 hand cream with stabilized Vitamin C and Niacinamide is a brightening and depigmenting treatment for an anti-dark spot action.',
    price: 33.000,
    category: 'BODY',
    subcategory: 'Soins des mains',
    image_url: '/assets/prod7.avif',
    discount_percent: null,
    category_public: 'Femmes',
  },
  {
    name: 'SVR Topialyse Cleansing Gel 200ml',
    description: 'Topialyse cleansing gel from SVR laboratories is a cleanser designed for sensitive and dry skin.',
    price: 22.750,
    category: 'BODY',
    subcategory: 'Hydratation & nutrition du corps',
    image_url: '/assets/prod8.avif',
    discount_percent: null,
    category_public: 'Femmes',
  },
  {
    name: 'SVR Topialyse Cream 400ml',
    description: 'SVR Topialyse 48H Nourishing Soothing Cream 400ml for sensitive, dry, and uncomfortable skin.',
    price: 57.240,
    category: 'BODY',
    subcategory: 'Hydratation & nutrition du corps',
    image_url: '/assets/prod9.avif',
    discount_percent: null,
    category_public: 'Femmes',
  },
  {
    name: 'ROGE CAVAILLES Special Dryness 250ml',
    description: 'Intimate Gel for Women, enriched with prebiotics. Recommended by gynecologists.',
    price: 26.200,
    category: 'BODY',
    subcategory: 'Hydratation & nutrition du corps',
    image_url: '/assets/prod10.avif',
    discount_percent: null,
    category_public: 'Femmes',
  },
  {
    name: 'Chicco decorated flat and deep plate set for babies 12+ months, blue',
    description: 'Set of 1 dinner plate and 1 soup plate with playful designs. Rims for resting a spoon or fork.',
    price: 54.240,
    category: 'BABY & MOM',
    subcategory: 'Équipement bébé',
    image_url: '/assets/prod11.avif',
    discount_percent: null,
    category_public: 'Bébés (0-3 ans)',
  },
  {
    name: 'Biolane Fresh Eau de Toilette 200ml',
    description: 'Biolane Freshness Eau de Toilette pleasantly completes your baby\'s bath time routine.',
    price: 15.410,
    category: 'BABY & MOM',
    subcategory: 'Bain & soins bébé',
    image_url: '/assets/prod12.avif',
    discount_percent: null,
    category_public: 'Bébés (0-3 ans)',
  },
  {
    name: 'Gum Ortho Soft Toothbrush 124',
    description: 'The GUM ORTHODONTIC toothbrush with v-shaped bristles for cleaning around orthodontic appliances.',
    price: 11.650,
    category: 'HYGIENE',
    subcategory: 'Hygiène intime',
    image_url: '/assets/prod13.webp',
    discount_percent: null,
    category_public: null,
  },

  // ── From Sections MOCK_PRODUCTS (Bébés) ────────────────────
  {
    name: 'Crème Hydratante Protectrice Biolane',
    description: 'Soin doux hypoallergénique pour le corps et le visage de bébé, protège des rougeurs et de la sécheresse.',
    price: 18.500,
    category: 'BABY & MOM',
    subcategory: 'Crèmes / soins',
    image_url: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=400&q=80',
    discount_percent: null,
    category_public: 'Bébés (0-3 ans)',
  },
  {
    name: 'Biberon Anti-Colique Easy Active 270ml',
    description: 'Tétine débit 2 ultra douce. Favorise une transition douce entre l\'allaitement et le biberon.',
    price: 24.900,
    category: 'BABY & MOM',
    subcategory: 'Cuillères / accessoires',
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
    discount_percent: null,
    category_public: 'Bébés (0-3 ans)',
  },
  {
    name: 'Thermomètre Médical Pédiatrique Soft-Tip',
    description: 'Thermomètre rectal et sous-axillaire à embout souple pour une mesure sûre et rapide.',
    price: 29.900,
    category: 'BABY & MOM',
    subcategory: 'Matériel',
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80',
    discount_percent: null,
    category_public: 'Bébés (0-3 ans)',
  },
  {
    name: 'Body en Coton Biologique Lot de 3',
    description: 'Manches longues, boutons pressions à l\'entrejambe pour un change facile et un confort optimal.',
    price: 35.000,
    category: 'BABY & MOM',
    subcategory: 'Vêtements',
    image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
    discount_percent: null,
    category_public: 'Bébés (0-3 ans)',
  },

  // ── Enfants ──────────────────────────────────────────────────
  {
    name: 'Shampoing Démêlant Cerise & Amande Douce',
    description: 'Ne pique pas les yeux. Formule biodégradable qui laisse les cheveux soyeux et parfumés.',
    price: 14.800,
    category: 'HAIR',
    subcategory: 'Shampooings',
    image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80',
    discount_percent: null,
    category_public: 'Enfants (3-12 ans)',
  },
  {
    name: 'Gummies Multivitaminés Vitalité Kids',
    description: 'Contient 12 vitamines et minéraux essentiels pour soutenir la croissance et l\'énergie quotidienne.',
    price: 32.000,
    category: 'FOOD SUPPLEMENTS',
    subcategory: 'Vitamines',
    image_url: 'https://images.unsplash.com/photo-1628243382943-f11406126bb8?w=400&q=80',
    discount_percent: null,
    category_public: 'Enfants (3-12 ans)',
  },
  {
    name: 'Baskets Légères Respirantes ActivePlay',
    description: 'Fermeture scratch pratique pour l\'école et le sport. Semelle antidérapante.',
    price: 49.000,
    category: 'BABY & MOM',
    subcategory: 'Équipement bébé',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    discount_percent: null,
    category_public: 'Enfants (3-12 ans)',
  },

  // ── Femmes ───────────────────────────────────────────────────
  {
    name: 'Sérum Anti-Rides Concentré Acide Hyaluronique',
    description: 'Repulpe la peau, lisse les ridules et procure une hydratation intense longue durée.',
    price: 78.500,
    category: 'FACE',
    subcategory: 'Anti-âge & anti-rides',
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    discount_percent: null,
    category_public: 'Femmes',
  },
  {
    name: 'Mascara Volumateur Bio Noir Intense',
    description: 'Formule naturelle enrichie en huile de ricin pour renforcer et allonger les cils.',
    price: 36.900,
    category: 'MAKEUP',
    subcategory: 'Yeux',
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    discount_percent: null,
    category_public: 'Femmes',
  },
  {
    name: 'Infusion Detox & Éclat aux Herbes Bio',
    description: 'Mélange apaisant de menthe, romarin et pissenlit pour purifier l\'organisme de l\'intérieur.',
    price: 19.500,
    category: 'DIETARY SUPPLEMENTS',
    subcategory: 'Antioxydants',
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80',
    discount_percent: null,
    category_public: 'Femmes',
  },
  {
    name: 'Huile de Massage Relaxante Lavande & Amande',
    description: 'Détend les muscles et l\'esprit après une longue journée. Parfum apaisant.',
    price: 42.000,
    category: 'BODY',
    subcategory: 'Hydratation & nutrition du corps',
    image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80',
    discount_percent: null,
    category_public: 'Femmes',
  },

  // ── Hommes ───────────────────────────────────────────────────
  {
    name: 'Gel Hydratant Anti-Fatigue 24H',
    description: 'Soin énergisant enrichi en magnésium et vitamine C pour combattre le teint terne et les cernes.',
    price: 45.000,
    category: 'MEN',
    subcategory: 'Soins visage homme',
    image_url: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80',
    discount_percent: null,
    category_public: 'Hommes',
  },
  {
    name: 'Huile Barbe Adoucissante Bois de Cèdre',
    description: 'Nourrit les poils en profondeur et hydrate la peau sous la barbe sans effet gras.',
    price: 32.500,
    category: 'MEN',
    subcategory: 'Rasage & barbe',
    image_url: 'https://images.unsplash.com/photo-1626015713026-d837d172406f?w=400&q=80',
    discount_percent: null,
    category_public: 'Hommes',
  },
  {
    name: 'Gel Douche Purifiant 3-en-1 Charbon Actif',
    description: 'Nettoie le visage, le corps et les cheveux. Élimine les impuretés et laisse un parfum boisé ultra frais.',
    price: 16.900,
    category: 'BODY',
    subcategory: 'Hydratation & nutrition du corps',
    image_url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80',
    discount_percent: null,
    category_public: 'Hommes',
  },

  // ── Personnes âgées ──────────────────────────────────────────
  {
    name: 'Baume Articulaire Fort Harpagophytum',
    description: 'Soulage les raideurs articulaires et améliore la souplesse. Effet chauffant réconfortant.',
    price: 39.900,
    category: 'BODY',
    subcategory: 'Soins des articulations',
    image_url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80',
    discount_percent: null,
    category_public: 'Personnes âgées',
  },
  {
    name: 'Tensiomètre de Bras Électronique Automatique',
    description: 'Écran rétroéclairé, détection d\'arythmie. Enregistrement des mesures pour 2 utilisateurs.',
    price: 129.000,
    category: 'BODY',
    subcategory: 'Soins du corps',
    image_url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80',
    discount_percent: null,
    category_public: 'Personnes âgées',
  },
  {
    name: 'Chaussons Confort Ergonomiques Ajustables',
    description: 'Chaussures d\'intérieur extensibles adaptées aux pieds gonflés ou sensibles. Semelles antidérapantes.',
    price: 59.000,
    category: 'BODY',
    subcategory: 'Soins du corps',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
    discount_percent: null,
    category_public: 'Personnes âgées',
  },
  {
    name: 'Complexe Magnésium Marin & Vitamine B6',
    description: 'Soutient la fonction musculaire et nerveuse. Réduit la fatigue et régule le sommeil.',
    price: 28.000,
    category: 'FOOD SUPPLEMENTS',
    subcategory: 'Minéraux',
    image_url: 'https://images.unsplash.com/photo-1616679911721-feb6e5e468b2?w=400&q=80',
    discount_percent: null,
    category_public: 'Personnes âgées',
  },
];

async function seed() {
  console.log('Connecting to Supabase...');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Products to insert: ${products.length}`);

  const { error: deleteError } = await supabase.from('products').delete().neq('id', 0);
  if (deleteError) {
    console.error('Error clearing products:', deleteError.message);
    process.exit(1);
  }
  console.log('Cleared existing products.');

  const BATCH_SIZE = 10;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error.message);
      process.exit(1);
    }
    console.log(`Inserted batch ${i / BATCH_SIZE + 1}/${Math.ceil(products.length / BATCH_SIZE)}`);
  }

  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error counting products:', countError.message);
    process.exit(1);
  }

  console.log(`\n✅ Successfully seeded ${count} products into Supabase!`);
}

seed().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
