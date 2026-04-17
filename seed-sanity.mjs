/**
 * Sanity Seed Script — Serintsur
 * 
 * Populates the CMS with data from the company dossier.
 * Run: node seed-sanity.mjs
 * 
 * Requires: SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_TOKEN env vars
 * Get a token from: sanity.io/manage → your project → API → Tokens → Add API token (Editor)
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || 'zh7s2pbn',
  dataset: process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN, // Needs write access — create an Editor token
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ─── SITE SETTINGS ──────────────────────────────────────────────────────────
const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  companyName: 'Serintsur Multiservicios S.L.',
  tagline: {
    es: 'Construcción, rehabilitación y mantenimiento en Cádiz, Málaga y Sevilla',
    en: 'Construction, renovation and maintenance across Cádiz, Málaga and Sevilla',
    de: 'Bau, Sanierung und Instandhaltung in Cádiz, Málaga und Sevilla',
  },
  phone: '+34 655 634 800',
  email: 'jlcobano@serintsur.com',
  address: 'Avda. Alcalde Cantos Ropero, 104\nNave 6\n11407 Jerez de la Frontera, Cádiz',
  whatsappNumber: '+34655634800',
  cif: 'B11945391',
  stats: {
    projectsCompleted: 120,
    yearsExperience: 7,
    teamSize: 30,
    citiesCovered: 3,
  },
};

// ─── SERVICES ───────────────────────────────────────────────────────────────
const services = [
  {
    _id: 'service-reformas',
    _type: 'service',
    title: {
      es: 'Reformas integrales',
      en: 'Full renovations',
      de: 'Komplettsanierungen',
    },
    slug: { _type: 'slug', current: 'reformas-integrales' },
    description: {
      es: 'Transformamos viviendas y edificios completos — desde el diseño hasta la entrega de llaves. Cocinas, baños, instalaciones, acabados. Todo con equipo propio y plazos claros.',
      en: 'We transform homes and entire buildings — from design to key handover. Kitchens, bathrooms, installations, finishes. All with our own team and clear timelines.',
      de: 'Wir verwandeln Wohnungen und ganze Gebäude — vom Entwurf bis zur Schlüsselübergabe. Küchen, Bäder, Installationen, Ausstattung. Alles mit eigenem Team und klaren Terminen.',
    },
    icon: 'hammer',
    order: 1,
    isActive: true,
    seo: {
      metaTitle: {
        es: 'Reformas Integrales en Cádiz | Serintsur',
        en: 'Full Renovations in Cádiz | Serintsur',
        de: 'Komplettsanierungen in Cádiz | Serintsur',
      },
      metaDescription: {
        es: 'Reformas integrales de viviendas y edificios en Cádiz, Málaga y Sevilla. Equipo propio, plazos garantizados y acabados de calidad. Pide presupuesto sin compromiso.',
        en: 'Full home and building renovations in Cádiz, Málaga and Sevilla. Own team, guaranteed deadlines and quality finishes. Request a free quote.',
        de: 'Komplettsanierungen von Wohnungen und Gebäuden in Cádiz, Málaga und Sevilla. Eigenes Team, garantierte Termine und hochwertige Ausstattung.',
      },
    },
  },
  {
    _id: 'service-rehabilitacion',
    _type: 'service',
    title: {
      es: 'Rehabilitación de fachadas',
      en: 'Facade rehabilitation',
      de: 'Fassadensanierung',
    },
    slug: { _type: 'slug', current: 'rehabilitacion-fachadas' },
    description: {
      es: 'Rehabilitamos fachadas de edificios residenciales, comerciales e institucionales. Tratamiento de humedades, pintura, revestimientos, aislamiento térmico y reparación estructural.',
      en: 'We rehabilitate facades of residential, commercial and institutional buildings. Damp treatment, painting, cladding, thermal insulation and structural repair.',
      de: 'Wir sanieren Fassaden von Wohn-, Gewerbe- und öffentlichen Gebäuden. Feuchtigkeitsbehandlung, Anstrich, Verkleidung, Wärmedämmung und Strukturreparatur.',
    },
    icon: 'building-2',
    order: 2,
    isActive: true,
    seo: {
      metaTitle: {
        es: 'Rehabilitación de Fachadas en Cádiz | Serintsur',
        en: 'Facade Rehabilitation in Cádiz | Serintsur',
        de: 'Fassadensanierung in Cádiz | Serintsur',
      },
      metaDescription: {
        es: 'Rehabilitación profesional de fachadas en Cádiz y Andalucía. Tratamiento de humedades, pintura, revestimientos y aislamiento. Presupuesto gratuito.',
        en: 'Professional facade rehabilitation in Cádiz and Andalusia. Damp treatment, painting, cladding and insulation. Free quote.',
        de: 'Professionelle Fassadensanierung in Cádiz und Andalusien. Feuchtigkeitsbehandlung, Anstrich, Verkleidung und Dämmung. Kostenloses Angebot.',
      },
    },
  },
  {
    _id: 'service-construccion',
    _type: 'service',
    title: {
      es: 'Construcción de villas',
      en: 'Villa construction',
      de: 'Villenbau',
    },
    slug: { _type: 'slug', current: 'construccion-villas' },
    description: {
      es: 'Construimos villas y viviendas unifamiliares de obra nueva. Desde la cimentación hasta los acabados finales, combinando calidad, diseño y eficiencia en cada proyecto.',
      en: 'We build new-construction villas and detached houses. From foundations to final finishes, combining quality, design and efficiency in every project.',
      de: 'Wir bauen Villen und Einfamilienhäuser im Neubau. Vom Fundament bis zum letzten Finish — Qualität, Design und Effizienz in jedem Projekt.',
    },
    icon: 'home',
    order: 3,
    isActive: true,
    seo: {
      metaTitle: {
        es: 'Construcción de Villas en Cádiz y Costa del Sol | Serintsur',
        en: 'Villa Construction in Cádiz and Costa del Sol | Serintsur',
        de: 'Villenbau in Cádiz und Costa del Sol | Serintsur',
      },
      metaDescription: {
        es: 'Construcción de villas y chalets en Cádiz, Málaga y Sevilla. Obra nueva con equipo propio. Calidad, diseño y plazos garantizados.',
        en: 'Villa and house construction in Cádiz, Málaga and Sevilla. New builds with our own team. Quality, design and guaranteed timelines.',
        de: 'Villen- und Hausbau in Cádiz, Málaga und Sevilla. Neubau mit eigenem Team. Qualität, Design und garantierte Termine.',
      },
    },
  },
  {
    _id: 'service-mantenimiento',
    _type: 'service',
    title: {
      es: 'Mantenimiento de edificios',
      en: 'Building maintenance',
      de: 'Gebäudeinstandhaltung',
    },
    slug: { _type: 'slug', current: 'mantenimiento-edificios' },
    description: {
      es: 'Servicio integral de mantenimiento para comunidades de vecinos, hoteles y edificios comerciales. Cubiertas, instalaciones, zonas comunes y reparaciones urgentes.',
      en: 'Comprehensive maintenance service for residential communities, hotels and commercial buildings. Roofs, installations, common areas and emergency repairs.',
      de: 'Umfassender Wartungsservice für Wohngemeinschaften, Hotels und Gewerbegebäude. Dächer, Installationen, Gemeinschaftsbereiche und Notfallreparaturen.',
    },
    icon: 'wrench',
    order: 4,
    isActive: true,
    seo: {
      metaTitle: {
        es: 'Mantenimiento de Edificios en Cádiz | Serintsur',
        en: 'Building Maintenance in Cádiz | Serintsur',
        de: 'Gebäudeinstandhaltung in Cádiz | Serintsur',
      },
      metaDescription: {
        es: 'Mantenimiento integral de edificios en Cádiz. Comunidades de vecinos, hoteles y edificios comerciales. Respuesta rápida y equipo cualificado.',
        en: 'Comprehensive building maintenance in Cádiz. Residential communities, hotels and commercial buildings. Fast response and qualified team.',
        de: 'Umfassende Gebäudeinstandhaltung in Cádiz. Wohngemeinschaften, Hotels und Gewerbegebäude. Schnelle Reaktion und qualifiziertes Team.',
      },
    },
  },
];

// ─── PROJECTS ───────────────────────────────────────────────────────────────
const projects = [
  {
    _id: 'project-villas-oasis',
    _type: 'project',
    title: {
      es: 'Villas Oasis Estepona',
      en: 'Villas Oasis Estepona',
      de: 'Villas Oasis Estepona',
    },
    slug: { _type: 'slug', current: 'villas-oasis-estepona' },
    description: {
      es: 'Construcción de villas de lujo en la urbanización Oasis de Estepona para Pamasura Marein. Viviendas unifamiliares con piscina privada, acabados premium y vistas al mar.',
      en: 'Luxury villa construction in the Oasis development in Estepona for Pamasura Marein. Detached houses with private pools, premium finishes and sea views.',
      de: 'Bau von Luxusvillen in der Urbanisation Oasis in Estepona für Pamasura Marein. Einfamilienhäuser mit privatem Pool, Premium-Ausstattung und Meerblick.',
    },
    service: { _type: 'reference', _ref: 'service-construccion' },
    location: { city: 'Estepona', province: 'Málaga' },
    year: 2024,
    client: 'Pamasura - Grupo Marein',
    status: 'completed',
    featured: true,
    order: 1,
  },
  {
    _id: 'project-gonzalez-byass',
    _type: 'project',
    title: {
      es: 'Fachadas González Byass',
      en: 'González Byass Facades',
      de: 'Fassaden González Byass',
    },
    slug: { _type: 'slug', current: 'fachadas-gonzalez-byass' },
    description: {
      es: 'Tratamiento integral de fachadas en el Núcleo Las Copas de González Byass, Jerez. Restauración y protección de superficies en un entorno patrimonial vinícola de primer nivel.',
      en: 'Comprehensive facade treatment at the Las Copas complex of González Byass, Jerez. Surface restoration and protection in a premier winery heritage setting.',
      de: 'Umfassende Fassadenbehandlung im Komplex Las Copas von González Byass, Jerez. Oberflächenrestaurierung und -schutz in einer erstklassigen Weingut-Umgebung.',
    },
    service: { _type: 'reference', _ref: 'service-rehabilitacion' },
    location: { city: 'Jerez de la Frontera', province: 'Cádiz' },
    year: 2023,
    client: 'González Byass',
    status: 'completed',
    featured: true,
    order: 2,
  },
  {
    _id: 'project-hotel-jerez',
    _type: 'project',
    title: {
      es: 'Remodelación Hotel Jerez',
      en: 'Hotel Jerez Remodel',
      de: 'Umbau Hotel Jerez',
    },
    slug: { _type: 'slug', current: 'remodelacion-hotel-jerez' },
    description: {
      es: 'Remodelación completa de fachadas y terrazas del Hotel Jerez. Trabajo coordinado con la operativa hotelera para minimizar el impacto en huéspedes durante la ejecución.',
      en: 'Complete facade and terrace remodeling at Hotel Jerez. Work coordinated with hotel operations to minimize guest impact during execution.',
      de: 'Komplette Fassaden- und Terrassenmodernisierung im Hotel Jerez. Arbeiten in Abstimmung mit dem Hotelbetrieb, um die Auswirkungen auf die Gäste zu minimieren.',
    },
    service: { _type: 'reference', _ref: 'service-rehabilitacion' },
    location: { city: 'Jerez de la Frontera', province: 'Cádiz' },
    year: 2023,
    client: 'Hotel Jerez',
    status: 'completed',
    featured: true,
    order: 3,
  },
  {
    _id: 'project-san-jose-obrero',
    _type: 'project',
    title: {
      es: 'Cubiertas Barriada San José Obrero',
      en: 'San José Obrero Roofing',
      de: 'Dachsanierung San José Obrero',
    },
    slug: { _type: 'slug', current: 'cubiertas-san-jose-obrero' },
    description: {
      es: 'Renovación integral de techos, forjados y cubiertas en la Barriada San José Obrero. Proyecto de gran envergadura con intervención en múltiples bloques residenciales.',
      en: 'Comprehensive roof, slab and ceiling renovation in the San José Obrero neighborhood. Large-scale project involving multiple residential blocks.',
      de: 'Umfassende Dach-, Decken- und Dachsanierung im Stadtteil San José Obrero. Großprojekt mit Arbeiten an mehreren Wohnblöcken.',
    },
    service: { _type: 'reference', _ref: 'service-mantenimiento' },
    location: { city: 'Jerez de la Frontera', province: 'Cádiz' },
    year: 2024,
    status: 'in_progress',
    featured: false,
    order: 4,
  },
  {
    _id: 'project-upace',
    _type: 'project',
    title: {
      es: 'Remodelación UPACE San Fernando',
      en: 'UPACE San Fernando Remodel',
      de: 'Umbau UPACE San Fernando',
    },
    slug: { _type: 'slug', current: 'remodelacion-upace-san-fernando' },
    description: {
      es: 'Remodelación completa del edificio de Centros UPACE en San Fernando. Segunda fase próxima a inaugurarse. Proyecto con impacto social directo en personas con parálisis cerebral.',
      en: 'Complete remodeling of the UPACE Centers building in San Fernando. Second phase nearing inauguration. A project with direct social impact for people with cerebral palsy.',
      de: 'Kompletter Umbau des UPACE-Zentrums in San Fernando. Zweite Phase kurz vor der Einweihung. Ein Projekt mit direkter sozialer Wirkung für Menschen mit Zerebralparese.',
    },
    service: { _type: 'reference', _ref: 'service-reformas' },
    location: { city: 'San Fernando', province: 'Cádiz' },
    year: 2024,
    client: 'Centros UPACE',
    status: 'in_progress',
    featured: false,
    order: 5,
  },
  {
    _id: 'project-vivienda-barrosa',
    _type: 'project',
    title: {
      es: 'Vivienda en La Barrosa',
      en: 'House in La Barrosa',
      de: 'Haus in La Barrosa',
    },
    slug: { _type: 'slug', current: 'vivienda-la-barrosa' },
    description: {
      es: 'Construcción de nueva vivienda unifamiliar en La Barrosa, Chiclana de la Frontera. Diseño contemporáneo con materiales nobles y acabados de alta calidad.',
      en: 'New detached house construction in La Barrosa, Chiclana de la Frontera. Contemporary design with premium materials and high-quality finishes.',
      de: 'Neubau eines Einfamilienhauses in La Barrosa, Chiclana de la Frontera. Zeitgenössisches Design mit edlen Materialien und hochwertiger Ausstattung.',
    },
    service: { _type: 'reference', _ref: 'service-construccion' },
    location: { city: 'Chiclana de la Frontera', province: 'Cádiz' },
    year: 2024,
    status: 'completed',
    featured: true,
    order: 6,
  },
  {
    _id: 'project-chalets-puerto',
    _type: 'project',
    title: {
      es: 'Chalets C/ Mar de China',
      en: 'Detached Houses C/ Mar de China',
      de: 'Einfamilienhäuser C/ Mar de China',
    },
    slug: { _type: 'slug', current: 'chalets-mar-de-china' },
    description: {
      es: 'Construcción de 2 chalets independientes con sótano en C/ Mar de China, El Puerto de Santa María. Proyecto integral desde cimentación hasta entrega de llaves.',
      en: 'Construction of 2 detached houses with basements on C/ Mar de China, El Puerto de Santa María. Full project from foundations to key handover.',
      de: 'Bau von 2 freistehenden Häusern mit Keller in C/ Mar de China, El Puerto de Santa María. Gesamtprojekt vom Fundament bis zur Schlüsselübergabe.',
    },
    service: { _type: 'reference', _ref: 'service-construccion' },
    location: { city: 'El Puerto de Santa María', province: 'Cádiz' },
    year: 2024,
    status: 'completed',
    featured: false,
    order: 7,
  },
  {
    _id: 'project-ed-puerto-rico',
    _type: 'project',
    title: {
      es: 'Fachada Ed. Puerto Rico',
      en: 'Puerto Rico Building Facade',
      de: 'Fassade Ed. Puerto Rico',
    },
    slug: { _type: 'slug', current: 'fachada-edificio-puerto-rico' },
    description: {
      es: 'Rehabilitación completa de la fachada del Edificio Puerto Rico. Intervención en altura con tratamiento integral de superficies y mejora del aislamiento.',
      en: 'Complete facade rehabilitation of the Puerto Rico Building. High-rise intervention with comprehensive surface treatment and insulation improvement.',
      de: 'Vollständige Fassadensanierung des Gebäudes Puerto Rico. Höhenarbeiten mit umfassender Oberflächenbehandlung und Verbesserung der Dämmung.',
    },
    service: { _type: 'reference', _ref: 'service-rehabilitacion' },
    location: { city: 'Jerez de la Frontera', province: 'Cádiz' },
    year: 2023,
    status: 'completed',
    featured: false,
    order: 8,
  },
  {
    _id: 'project-costa-luz-rota',
    _type: 'project',
    title: {
      es: 'Terrazas Hotel Costa de la Luz',
      en: 'Hotel Costa de la Luz Terraces',
      de: 'Terrassen Hotel Costa de la Luz',
    },
    slug: { _type: 'slug', current: 'terrazas-hotel-costa-luz-rota' },
    description: {
      es: 'Remodelación de terrazas en el Hotel Costa de la Luz, Rota. Renovación completa de pavimentos, barandillas e impermeabilización con vistas al océano Atlántico.',
      en: 'Terrace remodeling at Hotel Costa de la Luz, Rota. Complete renovation of floors, railings and waterproofing with Atlantic Ocean views.',
      de: 'Terrassenmodernisierung im Hotel Costa de la Luz, Rota. Kompletterneuerung von Böden, Geländern und Abdichtung mit Blick auf den Atlantik.',
    },
    service: { _type: 'reference', _ref: 'service-mantenimiento' },
    location: { city: 'Rota', province: 'Cádiz' },
    year: 2023,
    client: 'Hotel Costa de la Luz',
    status: 'completed',
    featured: false,
    order: 9,
  },
  {
    _id: 'project-apartamentos-doctor-mercado',
    _type: 'project',
    title: {
      es: '6 Apartamentos y Coworking C/ Doctor Mercado',
      en: '6 Apartments and Coworking C/ Doctor Mercado',
      de: '6 Apartments und Coworking C/ Doctor Mercado',
    },
    slug: { _type: 'slug', current: 'apartamentos-coworking-doctor-mercado' },
    description: {
      es: 'Construcción de 6 apartamentos y zona de coworking en C/ Doctor Mercado. Proyecto mixto residencial-comercial con diseño funcional y acabados modernos.',
      en: 'Construction of 6 apartments and coworking zone on C/ Doctor Mercado. Mixed residential-commercial project with functional design and modern finishes.',
      de: 'Bau von 6 Apartments und Coworking-Zone in C/ Doctor Mercado. Gemischtes Wohn-Gewerbe-Projekt mit funktionalem Design und modernen Ausführungen.',
    },
    service: { _type: 'reference', _ref: 'service-construccion' },
    location: { city: 'Jerez de la Frontera', province: 'Cádiz' },
    year: 2024,
    status: 'completed',
    featured: false,
    order: 10,
  },
];

// ─── CLIENT LOGOS ───────────────────────────────────────────────────────────
const clientLogos = [
  { name: 'Ayuntamiento de Jerez', order: 1 },
  { name: 'Base Naval de Rota', order: 2 },
  { name: 'Base Española de Morón de la Frontera', order: 3 },
  { name: 'González Byass', order: 4 },
  { name: 'Hotel Jerez', order: 5 },
  { name: 'Metrovacesa', order: 6 },
  { name: 'Bodega Díez Mérito', order: 7 },
  { name: 'Centros UPACE San Fernando', order: 8 },
  { name: 'Cáritas Diocesana Asidonia Jerez', order: 9 },
  { name: 'Cooperativa Covijerez', order: 10 },
  { name: 'Beam Suntory', order: 11 },
  { name: 'Norauto', order: 12 },
  { name: 'Coprasa', order: 13 },
  { name: 'Red de Albergues Inturjoven', order: 14 },
  { name: 'Urgencias 061', order: 15 },
].map((c) => ({
  _id: `client-${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`,
  _type: 'clientLogo',
  ...c,
  isActive: true,
}));

// ─── SEED FUNCTION ──────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Seeding Sanity with dossier data...\n');

  if (!client.config().token) {
    console.error('❌ SANITY_TOKEN is required. Create an Editor token at:');
    console.error('   https://www.sanity.io/manage/project/zh7s2pbn/api#tokens');
    process.exit(1);
  }

  const transaction = client.transaction();

  // Site Settings
  console.log('📋 Site Settings...');
  transaction.createOrReplace(siteSettings);

  // Services
  console.log(`🏗️  ${services.length} Services...`);
  services.forEach((s) => transaction.createOrReplace(s));

  // Projects
  console.log(`📁 ${projects.length} Projects...`);
  projects.forEach((p) => transaction.createOrReplace(p));

  // Client Logos
  console.log(`🏢 ${clientLogos.length} Client Logos...`);
  clientLogos.forEach((c) => transaction.createOrReplace(c));

  try {
    const result = await transaction.commit();
    console.log(`\n✅ Done! ${result.results.length} documents created/updated.`);
    console.log('\n📌 Next steps:');
    console.log('   1. Go to https://serintsur.sanity.studio/');
    console.log('   2. Upload images for services and projects');
    console.log('   3. Restart npm run dev to see data on the site');
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    if (err.message.includes('Insufficient permissions')) {
      console.error('   → Your token needs Editor permissions, not Viewer.');
    }
    process.exit(1);
  }
}

seed();
