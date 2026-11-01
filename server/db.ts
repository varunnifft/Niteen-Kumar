import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  mobile: string;
  designation: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface ApplicationItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  targetUsers: string;
  iconName: string;
  appType: 'apk' | 'web' | 'both' | 'coming_soon';
  androidDownloadUrl?: string;
  webAppUrl?: string;
  version: string;
  latestUpdateDate: string;
  isPublished: boolean;
  technicalHighlights: string[];
  systemRequirements: string;
}

export interface ConsultationAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // stored as base64 data url or file reference
}

export interface ConsultationRequest {
  id: string; // e.g. ITDS-2026-4891
  userId?: string;
  fullName: string;
  companyName: string;
  designation: string;
  email: string;
  mobile: string;
  plantLocation: string;
  plantType: string;
  consultingTopic: string;
  problemDescription: string;
  currentOperatingParameters: string;
  expectedImprovement: string;
  preferredMethod: string;
  attachments: ConsultationAttachment[];
  status: 'New' | 'Under Review' | 'Information Required' | 'In Progress' | 'Completed' | 'Closed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: 'Blast Furnace Guides' | 'Sinter Plant' | 'Raw Material Quality' | 'Process Optimization' | 'Troubleshooting' | 'Safety & SOP';
  author: string;
  readTime: string;
  publishedDate: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    bullets?: string[];
  }[];
  keyFormulas?: string[];
  tags: string[];
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Application Release' | 'Feature Update' | 'Consulting Notice' | 'Technical Article' | 'Engineering Module';
  publicationDate: string;
  shortDescription: string;
  fullDetails: string;
  relatedAppOrService: string;
  badge?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  inquiryType: 'Consulting' | 'Technical Support' | 'Application Info' | 'General';
  message: string;
  createdAt: string;
  status: 'Unread' | 'Replied' | 'Archived';
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  email: string;
  supportEmail: string;
  phone: string;
  emergencyPhone: string;
  headquarters: string;
  officeHours: string;
}

export interface DatabaseSchema {
  users: User[];
  applications: ApplicationItem[];
  consultations: ConsultationRequest[];
  articles: Article[];
  announcements: Announcement[];
  contacts: ContactInquiry[];
  settings: SiteSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper using crypto pbkdf2
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Simple signed token helper (HMAC SHA-256)
const JWT_SECRET = process.env.SESSION_SECRET || 'ironmaking-tech-platform-secret-2026';

export function createToken(payload: { id: string; email: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (decoded.exp && decoded.exp < Date.now()) return null;
    return { id: decoded.id, email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

// Initial Seed Data
const initialAdmin = hashPassword('Admin@Ironmaking2026!');
const initialUser = hashPassword('Engineer@2026');

const defaultApplications: ApplicationItem[] = [
  {
    id: 'app-1',
    name: 'Blast Furnace Burden Distribution',
    slug: 'burden-distribution',
    category: 'Blast Furnace Burden Distribution',
    shortDescription: 'Matrix and trajectory modeling for bell-less top chutes, radar stockline profile simulation, and ore-to-coke radial distribution optimizer.',
    fullDescription: 'An advanced metallurgical application for blast furnace operation teams and process engineers. Simulates the multi-ring chute tilting angles, rotational speeds, and burden trajectory under varying stockline depths. Accurately predicts the ore/coke (O/C) radial profile, layer thickness, and central gas permeability to eliminate center over-blowing or peripheral gas channeling.',
    features: [
      'Multi-ring chute angle trajectory calculation with Coriolis acceleration correction',
      'Radial ore/coke ratio profile mapping with simulated stockline radar integration',
      'Central coke charging (coke slit/plug) permeability predictor',
      'Interactive cross-sectional burden visualization with layer collapse tracking',
      'Gas flow redistribution index based on Ergun equation resistance'
    ],
    targetUsers: 'Blast Furnace Operating Superintendents, Burden Control Technicians, Senior Process Metallurgists',
    iconName: 'Layers',
    appType: 'both',
    androidDownloadUrl: 'https://downloads.ironmaking-tech.com/apps/itds-burden-dist-v3.2.1.apk',
    webAppUrl: '/apps/burden-distribution/launch',
    version: '3.2.1',
    latestUpdateDate: '2026-10-15',
    isPublished: true,
    technicalHighlights: [
      'Validated across 1200 m³ to 5500 m³ blast furnace bell-less tops',
      'Reduces fuel rate by 4-8 kg/tHM through optimized radial gas utilization (Eta-CO)',
      'Compatible with radar and mechanical stockline detectors'
    ],
    systemRequirements: 'Web browser (Chrome/Edge/Firefox) or Android 10+ with minimum 4GB RAM'
  },
  {
    id: 'app-2',
    name: 'Blast Furnace Geometry & Design',
    slug: 'furnace-geometry',
    category: 'Blast Furnace Geometry and Design',
    shortDescription: 'Comprehensive dimensioning tool for total volume, working volume, hearth diameter, bosh angle, belly height, and tuyere pitch spacing.',
    fullDescription: 'Designed for plant expansion planners, design institutes, and engineering consultants. Computes inner profiles, refractory lining isotherms, carbon block hearth heat flux, and critical dimensional ratios (Working Volume / Hearth Area, Bosh angle, Stack batter) according to international metallurgical design norms.',
    features: [
      'Inner volume (Vu) and working volume (Vw) parametric calculation',
      'Hearth carbon block 800°C and 1150°C solidification isotherm thermal modeling',
      'Tuyere count, diameter, and penetration depth optimizer based on raceway depth',
      'Bosh angle & stack angle slip-retardation safety index',
      'Refractory wear and deadman geometry estimation module'
    ],
    targetUsers: 'Plant Design Institutes, Chief Technology Officers, Furnace Project Managers, Refractory Engineers',
    iconName: 'DraftingCompass',
    appType: 'web',
    webAppUrl: '/apps/furnace-geometry/launch',
    version: '2.4.0',
    latestUpdateDate: '2026-09-28',
    isPublished: true,
    technicalHighlights: [
      'Calculates optimum deadman height and coke-free zone clearance',
      'Incorporates blast penetration index (Kinetic energy per tuyere > 12000 J/s)'
    ],
    systemRequirements: 'Web browser with WebGL canvas support'
  },
  {
    id: 'app-3',
    name: 'Blast Furnace Raw Material Planning',
    slug: 'raw-material-planning',
    category: 'Blast Furnace Raw Material Planning',
    shortDescription: 'Multi-criteria linear programming solver for optimizing metallic burden mix (sinter, pellet, lump ore) and flux additions at minimum cost.',
    fullDescription: 'Solves complex ironmaking raw material procurement and daily burden mix planning. Balances chemical constraints (Fe, SiO2, Al2O3, MgO, CaO, P, Zn, alkalis K2O + Na2O) while honoring plant stockpile limits, sinter strand capacity, and target slag basicity (B2, B4).',
    features: [
      'Linear programming cost minimization engine with real-time price matrices',
      'Strict control of harmful trace elements (Zn < 0.15 kg/tHM, Alkalis < 2.5 kg/tHM)',
      'Slag volume and liquidus temperature prediction with MgO/Al2O3 ratio balance',
      'Automatic fluxing requirements calculation (limestone, dolomite, quartzite)',
      'Scenario comparison: High-Sinter vs High-Pellet vs Calibrated Lump Ore burden'
    ],
    targetUsers: 'Raw Material Procurement Managers, Metallurgical Planners, Shift In-Charge Engineers',
    iconName: 'PieChart',
    appType: 'both',
    androidDownloadUrl: 'https://downloads.ironmaking-tech.com/apps/itds-burden-plan-v4.1.0.apk',
    webAppUrl: '/apps/raw-material-planning/launch',
    version: '4.1.0',
    latestUpdateDate: '2026-10-22',
    isPublished: true,
    technicalHighlights: [
      'Directly connects to SAP/ERP raw material inventories via API',
      'Delivers an average cost saving of $2.20 to $4.80 per metric ton of hot metal'
    ],
    systemRequirements: 'Web browser or Android 10+ (64-bit)'
  },
  {
    id: 'app-4',
    name: 'Blast Furnace Heat Balance & Rist Diagram',
    slug: 'heat-balance',
    category: 'Blast Furnace Heat Balance',
    shortDescription: 'Enthalpy and mass balance calculator based on the Rist operating diagram and Reichardt heat exchange stages.',
    fullDescription: 'Comprehensive thermodynamic analysis software for blast furnace operations. Constructs the Rist operating diagram (O/Fe vs C/Fe), determines the thermal and chemical reserve zone equilibria, computes the theoretical flame temperature (RAFT), and identifies reserve energy margins.',
    features: [
      'Automated Rist Operating Diagram generation with operating point (P) tracking',
      'Reichardt thermodynamic diagram for upper, middle, and lower heat exchange zones',
      'Adiabatic flame temperature (RAFT) calculator with blast moisture, O2, and PCI impact',
      'Shaft efficiency and carbon gasification (Boudouard reaction) loss quantification',
      'Top gas calorific value (MJ/Nm³) and sensible heat recovery assessment'
    ],
    targetUsers: 'Chief Metallurgists, Energy Managers, Ironmaking Research Fellows',
    iconName: 'Flame',
    appType: 'web',
    webAppUrl: '/apps/heat-balance/launch',
    version: '3.0.2',
    latestUpdateDate: '2026-08-19',
    isPublished: true,
    technicalHighlights: [
      'Pinpoints exact carbon requirement for direct vs indirect reduction',
      'Accurate RAFT calibration for blast temperatures up to 1300°C'
    ],
    systemRequirements: 'Modern browser with HTML5 canvas'
  },
  {
    id: 'app-5',
    name: 'Blast Furnace Cost & Production Planning',
    slug: 'cost-production-planning',
    category: 'Blast Furnace Cost and Production Planning',
    shortDescription: 'Dynamic costing model for hot metal production, tapping schedule simulation, slag value realization, and daily throughput forecasting.',
    fullDescription: 'A tactical financial and operational platform designed for ironmaking plant general managers and production controllers. Simulates taphole opening sequences, hot metal ladle turnaround times, fuel replacement economics, and live cost per ton of liquid iron ($/tHM).',
    features: [
      'Live Unit Production Cost ($/tHM) real-time decomposition into fuel, ores, fluxes, utilities',
      'Multi-taphole scheduling model to prevent hearth liquid level buildup',
      'Hot metal yield optimization based on C, Si, Mn, P chemistry targets',
      'Sensitivity analysis on coke price, pulverised coal costs, and pellet premiums',
      'Daily, monthly, and fiscal production scheduling with planned maintenance downtime'
    ],
    targetUsers: 'Plant General Managers, Financial Controllers, Production Planning Directors',
    iconName: 'TrendingUp',
    appType: 'both',
    androidDownloadUrl: 'https://downloads.ironmaking-tech.com/apps/itds-cost-plan-v2.8.0.apk',
    webAppUrl: '/apps/cost-production-planning/launch',
    version: '2.8.0',
    latestUpdateDate: '2026-10-05',
    isPublished: true,
    technicalHighlights: [
      'Simulates profitability impact of PCI injection rate increments (+10 kg/tHM)',
      'Customized multi-currency support with regional raw material tax offsets'
    ],
    systemRequirements: 'Web browser or Android tablet'
  },
  {
    id: 'app-6',
    name: 'CBAM Carbon Emissions Calculator',
    slug: 'cbam-calculator',
    category: 'CBAM Carbon Emissions Calculator',
    shortDescription: 'EU CBAM and ISO 14064 compliant carbon accounting module for Scope 1 direct and Scope 2 electricity emissions in blast furnace ironmaking.',
    fullDescription: 'Essential digital compliance software for steelmakers exporting hot metal, pig iron, and crude steel products into the European Union and regulated green steel markets. Computes specific embedded emissions (tCO2e/tHM) from coke consumption, PCI, fluxes calcination, and auxiliary power generation.',
    features: [
      'Direct Scope 1 combustion and process emissions calculator (coke, coal, limestone, dolomite)',
      'Scope 2 indirect emissions assessment for plant electrical grids and oxygen plants',
      'Export certificate generator with official EU CBAM communication templates',
      'Decarbonization pathway simulator: biomass injection, hydrogen enrichment, and higher scrap rates',
      'Financial penalty and carbon credit price exposure forecasting (€/tCO2)'
    ],
    targetUsers: 'Sustainability Directors, Export Compliance Managers, Plant Carbon Auditors',
    iconName: 'Leaf',
    appType: 'both',
    androidDownloadUrl: 'https://downloads.ironmaking-tech.com/apps/itds-cbam-calc-v1.9.4.apk',
    webAppUrl: '/apps/cbam-calculator/launch',
    version: '1.9.4',
    latestUpdateDate: '2026-10-30',
    isPublished: true,
    technicalHighlights: [
      'Updated to the latest European Commission CBAM definitive period methodology',
      'Tracks cradle-to-gate emissions from iron ore mine to blast furnace taphole'
    ],
    systemRequirements: 'Web browser or Android 10+'
  },
  {
    id: 'app-7',
    name: 'Sinter Plant Analysis & Optimization',
    slug: 'sinter-optimization',
    category: 'Sinter Plant Analysis and Optimization',
    shortDescription: 'Strand productivity model, suction windbox permeability monitor, burn-through point (BTP) predictor, and return fines equilibrium calculator.',
    fullDescription: 'Comprehensive analytical suite for sinter machine operators. Monitors moisture addition, raw mix permeability, bed height, strand speed, ignition hood temperature, and fuel consumption to achieve consistent basicity (B2 = 1.8-2.2), optimum FeO (8.0-9.5%), and superior mechanical strength (TI > 72%).',
    features: [
      'Burn-Through Point (BTP) predictive algorithm utilizing windbox thermocouple gradient',
      'Return fines balance simulator to prevent closed-circuit accumulation or depletion',
      'Raw mix bed permeability index (J-factor) optimizer',
      'FeO vs Reduction Degradation Index (RDI) and Reducibility Index (RI) correlation',
      'Coke breeze / anthracite consumption minimization per ton of net sinter'
    ],
    targetUsers: 'Sinter Plant In-Charge, Quality Control Superintendents, Strand Technicians',
    iconName: 'Cpu',
    appType: 'web',
    webAppUrl: '/apps/sinter-optimization/launch',
    version: '3.5.0',
    latestUpdateDate: '2026-09-12',
    isPublished: true,
    technicalHighlights: [
      'Increases strand productivity by 0.15 - 0.35 t/m²/24h',
      'Stabilizes sinter tumbler index (TI) above 72% with reduced FeO variance'
    ],
    systemRequirements: 'Web browser on desktop or industrial tablet'
  },
  {
    id: 'app-8',
    name: 'Raw Material Quality Analysis',
    slug: 'raw-material-quality',
    category: 'Raw Material Quality Analysis',
    shortDescription: 'Statistical quality control (SQC) and automated penalty calculator for iron ore fines, lump ore, coking coal, PCI coal, and flux shipments.',
    fullDescription: 'A quality assurance powerhouse for steel plant laboratories and receiving stockyards. Automatically computes chemical tolerances, sizing fractions (+40mm, -5mm, -100 mesh), moisture deductions, and supplier commercial penalties against contractual specifications.',
    features: [
      'Automated commercial penalty and bonus calculator against contractual guarantees',
      'Control charts (X-bar and R-charts) for Fe%, SiO2%, Al2O3%, and sizing distributions',
      'Coke reactivity index (CRI) and coke strength after reaction (CSR) trend analysis',
      'Harmful trace element threshold alarms (Zinc, Lead, Arsenic, Chlorine, Alkali)',
      'Automated laboratory certificate of analysis (COA) parsing and archive'
    ],
    targetUsers: 'Quality Assurance Managers, Laboratory Heads, Raw Material Inspectors',
    iconName: 'Activity',
    appType: 'apk',
    androidDownloadUrl: 'https://downloads.ironmaking-tech.com/apps/itds-rm-quality-v2.1.2.apk',
    version: '2.1.2',
    latestUpdateDate: '2026-08-30',
    isPublished: true,
    technicalHighlights: [
      'Eliminates manual spreadsheet verification errors across multiple vessel cargoes',
      'Integrates ISO 3082 and ISO 13909 sampling standards'
    ],
    systemRequirements: 'Android 10+ mobile or tablet'
  },
  {
    id: 'app-9',
    name: 'Industrial Safety & Emergency SOP Management',
    slug: 'safety-sop-management',
    category: 'Industrial Safety and Emergency SOP Management',
    shortDescription: 'Digital interactive standard operating procedures (SOP), carbon monoxide (CO) gas hazard protocols, and furnace emergency action guides.',
    fullDescription: 'Engineered specifically for hazardous ironmaking environments. Equips plant safety officers, shift managers, and field operators with step-by-step verified action checklists for blast furnace gas leaks, cooling water failure, hearth breakout alerts, tuyere burn-outs, and blackouts.',
    features: [
      'Interactive emergency workflows for Blast Furnace Gas (CO) alarms and rescue protocols',
      'Tuyere burn-out detection and safe isolation sequence with video illustrations',
      'Cooling member water failure and emergency diesel backup initiation checklists',
      'Hearth shell temperature thermocouple escalation procedures',
      'Shift handover digital logbook with mandatory safety sign-off compliance'
    ],
    targetUsers: 'Plant Safety Directors, Emergency Response Teams, Shift Operations In-Charge',
    iconName: 'ShieldAlert',
    appType: 'coming_soon',
    version: '1.0.0-Beta',
    latestUpdateDate: '2026-11-01',
    isPublished: true,
    technicalHighlights: [
      'Developed with senior blast furnace operating veterans with 30+ years field experience',
      'Zero-delay offline access on mobile devices during plant communication failures'
    ],
    systemRequirements: 'Coming Soon - Android & iOS Release Q1 2027'
  }
];

const defaultArticles: Article[] = [
  {
    id: 'art-1',
    slug: 'blast-furnace-working-principles-countercurrent',
    title: 'Counter-Current Reactor Dynamics in Modern Blast Furnaces',
    category: 'Blast Furnace Guides',
    author: 'Dr. V. Sharma, Senior Ironmaking Consultant',
    readTime: '8 min read',
    publishedDate: '2026-10-18',
    summary: 'A deep dive into the gas-solids counter-current flow, heat exchange efficiency across thermal reserve zones, and iron oxide reduction kinetics.',
    sections: [
      {
        heading: 'The Counter-Current Principle',
        content: 'The blast furnace is thermodynamically one of the most efficient counter-current chemical reactors ever developed. Hot reducing gases generated at the tuyere raceway ascend at velocities between 1.5 to 3.0 m/s, carrying thermal energy and reducing agents (CO and H2) upwards. Simultaneously, the solid burden (coke, sinter, pellets, and lump ore) descends under gravitational pull over a transit time of 6 to 8 hours.',
        bullets: [
          'Gas residence time: 8 to 12 seconds from tuyere to furnace top',
          'Solid residence time: 5 to 8 hours depending on productivity rate',
          'Overall thermal efficiency: exceeds 85% in modern high-pressure furnaces'
        ]
      },
      {
        heading: 'Reduction Zones and Thermal Reserve Zone',
        content: 'As burden descends, it undergoes progressive chemical reduction in three distinct zones: the upper low-temperature zone (200-800°C) where Hematite (Fe2O3) is reduced to Magnetite (Fe3O4) and Wustite (FeO); the Thermal Reserve Zone (800-1000°C) where gas and solid temperatures equalize; and the lower high-temperature zone (>1000°C) where direct carbon reduction and melting occur.',
        bullets: [
          'Fe2O3 + CO -> 2Fe3O4 + CO2 (Exothermic, 400-600°C)',
          'Fe3O4 + CO -> 3FeO + CO2 (Mildly endothermic, 600-800°C)',
          'FeO + CO -> Fe + CO2 (Indirect reduction in chemical reserve zone)',
          'FeO + C -> Fe + CO (Direct reduction, highly endothermic, consumes 155 kJ/mol)'
        ]
      },
      {
        heading: 'Cohesive Zone Formation and Gas Distribution',
        content: 'Between 1050°C and 1400°C, the metallic burden softens and fuses, forming impermeable cohesive layers. Gas cannot penetrate these softening ore layers directly and must navigate through the permeable "coke slits" or windows between them. The geometric shape of this cohesive zone (inverted-V, W, or mixed profile) dictates the entire furnace gas permeability and hearth liquid distribution.'
      }
    ],
    keyFormulas: [
      'Indirect Reduction Ratio: r_i = (Moles of Fe reduced by CO + H2) / (Total Moles of Fe)',
      'Specific Productivity: P = Daily Hot Metal Output (t/d) / Working Volume (m³)',
      'Ergun Permeability Equation: dP/dL = 150 * (1-eps)²/eps³ * (mu*U/dp²) + 1.75 * (1-eps)/eps³ * (rho*U²/dp)'
    ],
    tags: ['Blast Furnace', 'Thermodynamics', 'Rist Diagram', 'Gas Flow']
  },
  {
    id: 'art-2',
    slug: 'sinter-quality-parameters-rdi-ri-ti',
    title: 'Sinter Quality Metrics: Optimizing RDI, RI, and Tumbler Index for High Productivity',
    category: 'Sinter Plant',
    author: 'P. Sengupta, Chief Process Metallurgist',
    readTime: '6 min read',
    publishedDate: '2026-10-02',
    summary: 'Understanding the delicate balance between FeO content, basicity (B2), and mineralogical phases (SFCA) to minimize low-temperature reduction degradation.',
    sections: [
      {
        heading: 'The Triad of Sinter Quality',
        content: 'Sinter constitutes 65% to 85% of modern blast furnace metallic burdens. Its quality is characterized by three interdependent parameters: Mechanical Strength (Tumbler Index, TI), Low-Temperature Reduction Degradation Index (RDI), and Reducibility Index (RI). Operating a furnace with high sinter fractions requires achieving high TI (>70%), low RDI (<28%), and high RI (>65%).',
        bullets: [
          'Tumbler Index (ISO 3271): Measures cold degradation resistance during transport and handling (+6.3 mm % after 200 revolutions)',
          'RDI (ISO 4696): Measures skeletal disintegration at 550°C in the upper shaft (-3.15 mm % generated)',
          'Reducibility Index (ISO 4695): Measures rate of oxygen removal at 900°C under 30% CO / 70% N2 gas'
        ]
      },
      {
        heading: 'The Role of FeO and Silico-Ferrites of Calcium and Aluminum (SFCA)',
        content: 'FeO levels directly control both RDI and RI in opposite directions. Higher FeO (above 10.5%) binds the sinter into a tough magnetite-silicate matrix with excellent Tumbler strength and low RDI, but drastically reduces reducibility (RI) and increases furnace coke rate. Conversely, targeting low FeO (7.5-8.5%) demands maximizing complex acicular SFCA phases rather than skeletal hematite.'
      }
    ],
    keyFormulas: [
      'Basicity Index B2: B2 = CaO / SiO2 (Target: 1.85 to 2.15)',
      'Quaternary Basicity B4: B4 = (CaO + MgO) / (SiO2 + Al2O3)',
      'Heat Consumption Index: Q_sinter = 1.6 to 2.0 GJ/t Sinter'
    ],
    tags: ['Sinter Plant', 'RDI', 'Tumbler Index', 'SFCA', 'Quality Control']
  },
  {
    id: 'art-3',
    slug: 'coke-quality-csr-cri-fuel-rate',
    title: 'CSR and CRI: The True Guardians of Blast Furnace Lower Zone Permeability',
    category: 'Raw Material Quality',
    author: 'Ironmaking Technical Committee',
    readTime: '7 min read',
    publishedDate: '2026-09-15',
    summary: 'Why metallurgical coke remains the only solid material in the blast furnace lower zone and how high CSR (>65%) prevents deadman suffocation.',
    sections: [
      {
        heading: 'Coke: The Unique Multifunctional Burden Component',
        content: 'In the blast furnace, metallurgical coke serves three irreplaceable functions: thermal (supplying heat via combustion), chemical (producing CO reducing gas and carbonizing hot metal), and mechanical (providing a gas-permeable and liquid-drainable structural grid). Below the cohesive zone (1200-1400°C), all iron-bearing materials have melted into liquid; coke is the ONLY solid material supporting the massive burden weight.',
        bullets: [
          'Coke Reactivity Index (CRI): Weight loss (%) of 200g coke sample exposed to CO2 at 1100°C for 2 hours',
          'Coke Strength After Reaction (CSR): Percentage of reacted coke surviving on a 10mm sieve after 600 tumbling revolutions',
          'Target benchmark for furnaces > 3000 m³: CRI < 24.0%, CSR > 65.0%'
        ]
      },
      {
        heading: 'Impact of Low CSR on Blast Furnace Operational Disruption',
        content: 'When CSR drops below 60%, coke breaks down prematurely in the lower bosh and raceway. Fines (<10mm) accumulate in the furnace deadman and bosh slag, choking the permeable liquid drainage channels. This causes high blast pressure fluctuations, hanging, slipping, tuyere flooding, and severe hearth thermal instability.'
      }
    ],
    keyFormulas: [
      'CRI (%) = ((Initial Weight - Final Weight) / Initial Weight) * 100',
      'CSR (%) = (Weight remaining on 10mm sieve / Final Reacted Weight) * 100',
      'Fuel Rate Impact: Every 1% increase in CSR typically saves 1.5 to 2.5 kg coke/tHM'
    ],
    tags: ['Coke Quality', 'CSR', 'CRI', 'Fuel Rate', 'Hearth Permeability']
  },
  {
    id: 'art-4',
    slug: 'tuyere-raceway-combustion-pci-optimization',
    title: 'Tuyere Raceway Dynamics & High-Rate Pulverized Coal Injection (PCI)',
    category: 'Process Optimization',
    author: 'Engineering Division',
    readTime: '9 min read',
    publishedDate: '2026-08-22',
    summary: 'Maximizing coal replacement ratios up to 180-220 kg/tHM while managing raceway adiabatic flame temperature (RAFT) and unburnt char distribution.',
    sections: [
      {
        heading: 'The Raceway Combustion Cavity',
        content: 'Hot blast at 1150-1250°C exits the water-cooled copper tuyere blowpipe at high kinetic velocity (180-240 m/s), creating an active void or raceway 1.2 to 2.0 meters deep into the coke bed. Pulverized coal injected through coaxial lances ignites and combusts within milliseconds, replacing costly lump metallurgical coke.',
        bullets: [
          'C + O2 -> CO2 (Instantaneous combustion in raceway)',
          'CO2 + C -> 2CO (Endothermic gasification at raceway boundary)',
          'Coal Replacement Ratio: 1 kg coal typically replaces 0.85 to 0.95 kg metallurgical coke'
        ]
      },
      {
        heading: 'Balancing RAFT with Oxygen Enrichment and Blast Moisture',
        content: 'Pulverized coal injection consumes thermal energy for devolatilization and heats carrier gas, which tends to depress the Raceway Adiabatic Flame Temperature (RAFT). To maintain RAFT within the stable operating window of 2100°C to 2250°C, oxygen enrichment must be increased by 2.5% to 4.5% per 50 kg/tHM of coal injected.'
      }
    ],
    keyFormulas: [
      'RAFT (°C) ≈ 1500 + 0.75 * T_blast - 2.5 * Blast_Moisture + 45 * O2_enrichment% - 2.2 * PCI_Rate',
      'Kinetic Energy of Blast: E_k = 0.5 * Mass_flow * Velocity² (J/s)',
      'Unburnt Char Index: Char < 5% at raceway boundary to prevent shaft permeability choking'
    ],
    tags: ['PCI', 'Tuyere', 'RAFT', 'Combustion', 'Energy Efficiency']
  }
];

const defaultAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Release of CBAM Carbon Emissions Calculator v1.9.4',
    category: 'Application Release',
    publicationDate: '2026-10-30',
    shortDescription: 'Updated with European Commission 2026 definitive reporting rules, default emission factor libraries, and multi-facility steel plant aggregation.',
    fullDetails: 'We are pleased to announce the official release of our CBAM Carbon Emissions Calculator v1.9.4. This update incorporates the finalized reporting methodologies for hot metal and crude steel production entering the European Union. Features automated Scope 1 & Scope 2 calculation, hydrogen and biomass injection simulations, and exportable verification documentation.',
    relatedAppOrService: 'CBAM Carbon Emissions Calculator',
    badge: 'New Release'
  },
  {
    id: 'ann-2',
    title: 'On-Site Furnace Stability & Burden Audit Services Expanded',
    category: 'Consulting Notice',
    publicationDate: '2026-10-15',
    shortDescription: 'Our senior metallurgical consulting team now offers comprehensive on-site gas flow diagnostics, radar profile tuning, and refractory health assessments.',
    fullDetails: 'Responding to rising demand across Southeast Asia and the Middle East, our technical consulting group has expanded its specialized on-site diagnostic service. We provide 3D thermographic hearth audits, chute trajectory laser verification, and tailored burden distribution matrices designed to decrease fuel consumption by up to 10 kg/tHM.',
    relatedAppOrService: 'Technical Consulting Services',
    badge: 'Service Update'
  },
  {
    id: 'ann-3',
    title: 'Burden Distribution Application v3.2.1 Update Available',
    category: 'Feature Update',
    publicationDate: '2026-10-01',
    shortDescription: 'Added support for 36-point radar stockline scanning profiles and high-speed multi-ring central coke charging models.',
    fullDetails: 'Version 3.2.1 of our flagship Burden Distribution software provides direct integration with high-temperature radar stockline detectors. Engineers can now model dynamic layer collapse under varying gas velocity profiles and simulate dual-angle chute discharges in real time.',
    relatedAppOrService: 'Blast Furnace Burden Distribution',
    badge: 'App Update'
  },
  {
    id: 'ann-4',
    title: 'Technical Guide: Sinter Strand Burn-Through Point (BTP) Automation Published',
    category: 'Technical Article',
    publicationDate: '2026-09-18',
    shortDescription: 'New engineering reference guide published in our Knowledge Center detailing thermocouple gradient algorithms for strand speed control.',
    fullDetails: 'Our technical team has published a comprehensive engineering methodology for stabilizing sinter plant burn-through points. Covers windbox temperature sensors, suction pressure drop analysis, and return fines equilibrium strategies.',
    relatedAppOrService: 'Technical Knowledge Center',
    badge: 'Technical Insight'
  }
];

const defaultSettings: SiteSettings = {
  companyName: 'Ironmaking Technology & Digital Solutions',
  tagline: 'Smarter Ironmaking Through Engineering, Technology and Digital Innovation',
  email: 'contact@ironmaking-tech.com',
  supportEmail: 'support@ironmaking-tech.com',
  phone: '+91 (0651) 240-8800',
  emergencyPhone: '+91 (0651) 240-8899',
  headquarters: 'Metallurgical Towers, Industrial Technology Corridor, Ranchi / Jamshedpur Engineering Hub, India',
  officeHours: 'Monday - Saturday: 08:30 - 18:30 IST (24/7 Plant Emergency Helpline)'
};

// Database Read/Write Functions
export function getDb(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const seed: DatabaseSchema = {
      users: [
        {
          id: 'user-admin-1',
          fullName: 'Chief Metallurgical Administrator',
          companyName: 'Ironmaking Technology & Digital Solutions',
          email: 'admin@ironmaking-tech.com',
          mobile: '+91 98350 12345',
          designation: 'Principal Ironmaking Consultant & Admin',
          passwordHash: initialAdmin.hash,
          salt: initialAdmin.salt,
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 'user-demo-1',
          fullName: 'Vikramaditya Roy',
          companyName: 'Apex Steel & Power Ltd',
          email: 'vikram.roy@apexsteel.com',
          mobile: '+91 94311 88200',
          designation: 'Assistant General Manager - Blast Furnace',
          passwordHash: initialUser.hash,
          salt: initialUser.salt,
          role: 'user',
          createdAt: new Date().toISOString()
        }
      ],
      applications: defaultApplications,
      consultations: [
        {
          id: 'ITDS-2026-0412',
          userId: 'user-demo-1',
          fullName: 'Vikramaditya Roy',
          companyName: 'Apex Steel & Power Ltd',
          designation: 'Assistant General Manager - Blast Furnace',
          email: 'vikram.roy@apexsteel.com',
          mobile: '+91 94311 88200',
          plantLocation: 'Odisha / Steel Hub, India',
          plantType: 'Integrated Steel Plant (2500 m³ BF)',
          consultingTopic: 'Burden distribution and furnace stability',
          problemDescription: 'Frequent peripheral gas channeling observed after switching to 75% sinter burden with higher alumina (2.2% Al2O3 in sinter). Wall temperatures fluctuating between 450°C and 780°C at lower stack level.',
          currentOperatingParameters: 'Productivity: 2.15 tHM/m³/d, Fuel rate: 532 kg/tHM (Coke: 375 kg, PCI: 157 kg), Blast temp: 1180°C, O2 enrichment: 3.5%, Top pressure: 1.85 bar.',
          expectedImprovement: 'Stabilize thermal wall load, eliminate channeling, and reduce overall fuel rate by at least 12 kg/tHM.',
          preferredMethod: 'Remote engineering audit & Video conference review',
          attachments: [
            {
              name: 'BF2_Stockline_Radar_Trace_Oct2026.pdf',
              size: 245000,
              type: 'application/pdf'
            }
          ],
          status: 'In Progress',
          adminNotes: 'Initial trajectory analysis completed. Chute angle pattern adjusted to increase central coke charging by 4% to open up furnace core. Second review scheduled with plant GM.',
          createdAt: '2026-10-24T09:30:00Z',
          updatedAt: '2026-10-28T14:15:00Z'
        }
      ],
      articles: defaultArticles,
      announcements: defaultAnnouncements,
      contacts: [],
      settings: defaultSettings
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading db.json, returning empty template', err);
    return {
      users: [],
      applications: defaultApplications,
      consultations: [],
      articles: defaultArticles,
      announcements: defaultAnnouncements,
      contacts: [],
      settings: defaultSettings
    };
  }
}

export function saveDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json', err);
  }
}
