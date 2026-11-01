import React, { useState } from 'react';
import {
  Flame,
  Layers,
  Thermometer,
  Gauge,
  Activity,
  ArrowDown,
  ArrowUp,
  Cpu,
  Info,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Database
} from 'lucide-react';

export const BlastFurnacePage: React.FC<{ onRequestConsulting: () => void }> = ({ onRequestConsulting }) => {
  const [selectedZone, setSelectedZone] = useState<'top' | 'stack' | 'belly' | 'bosh' | 'tuyere' | 'hearth'>('tuyere');

  // Interactive Calculator State
  const [calcVolume, setCalcVolume] = useState<number>(2500); // m³
  const [calcProduction, setCalcProduction] = useState<number>(6000); // t/d
  const [calcCokeRate, setCalcCokeRate] = useState<number>(365); // kg/tHM
  const [calcPciRate, setCalcPciRate] = useState<number>(160); // kg/tHM
  const [calcBlastTemp, setCalcBlastTemp] = useState<number>(1200); // °C
  const [calcO2Enrich, setCalcO2Enrich] = useState<number>(4.0); // %
  const [calcMoisture, setCalcMoisture] = useState<number>(15); // g/Nm³

  // Computed metrics
  const productivity = (calcProduction / (calcVolume || 1)).toFixed(2);
  const totalFuelRate = (calcCokeRate + calcPciRate).toFixed(0);
  const replacementRatio = (0.90 - (calcPciRate > 180 ? 0.05 : 0)).toFixed(2);
  const estimatedRaft = Math.round(
    1500 + 0.75 * calcBlastTemp - 2.5 * calcMoisture + 45 * calcO2Enrich - 2.2 * (calcPciRate / 10)
  );
  const estimatedSlagVolume = Math.round(290 + (calcPciRate * 0.15) + (calcCokeRate > 400 ? 25 : 0));
  const estimatedCo2Intensity = Math.round((Number(totalFuelRate) * 2.85) + 120);

  const zones = {
    top: {
      name: 'Furnace Top & Bell-Less Chute',
      temp: '150°C – 250°C',
      pressure: '1.8 – 2.5 bar',
      description: 'The burden charging and gas off-take nexus. Equipped with rotating, variable-tilt distribution chutes, 3D radar stockline scanners, and off-take pipes directing dusty top gas to the cleaning system.',
      reactions: [
        'Drying and preheating of descending ore, pellets, sinter, and coke',
        'Top gas composition: 20-24% CO, 19-23% CO2, 2-5% H2, balance N2',
        'Eta-CO Gas Utilization: η_CO = CO2 / (CO + CO2) ≈ 48% to 52%'
      ],
      equipment: 'Paul Wurth type bell-less top, planetary gearbox, water-cooled radar antennae, upper & lower seal valves, equalizing gas lines.'
    },
    stack: {
      name: 'Stack / Shaft & Thermal Reserve Zone',
      temp: '400°C – 1000°C',
      pressure: '2.0 – 2.8 bar',
      description: 'The primary indirect reduction zone. Solids descend while hot reducing gases ascend, transferring heat and stripping oxygen from iron oxides across the isothermal Thermal Reserve Zone (800-950°C).',
      reactions: [
        '3Fe2O3 + CO → 2Fe3O4 + CO2 (Exothermic, 400°C - 600°C)',
        'Fe3O4 + CO → 3FeO + CO2 (Mildly endothermic, 600°C - 800°C)',
        'FeO + CO → Fe + CO2 (Indirect reduction at 800°C - 1000°C)',
        'Limestone and dolomite decomposition: CaCO3 → CaO + CO2 (>850°C)'
      ],
      equipment: 'Copper and cast iron stave coolers, high-alumina & silicon carbide brick lining, shaft pressure taps, multi-point thermocouple probes.'
    },
    belly: {
      name: 'Furnace Belly',
      temp: '1000°C – 1200°C',
      pressure: '2.5 – 3.2 bar',
      description: 'The maximum diameter cylindrical zone of the furnace. Here, solid burden starts to soften, and the boundary of the cohesive zone begins to form under high gas velocities.',
      reactions: [
        'Commencement of wustite indirect reduction near chemical reserve limits',
        'Boudouard reaction starts: C + CO2 → 2CO (Consumes solid coke carbon)',
        'Softening of lower-melting gangue minerals and initial primary slag formation'
      ],
      equipment: 'Copper plate coolers / stave coolers with intense closed-circuit cooling water loops.'
    },
    bosh: {
      name: 'Bosh & Cohesive Zone',
      temp: '1200°C – 1500°C',
      pressure: '3.0 – 3.8 bar',
      description: 'Inverted truncated conical section. Metallic burden softens, fuses, and melts into liquid droplets. Coke remains the only solid structural component, forming permeable "coke slits" through which bosh gas passes.',
      reactions: [
        'Cohesive Zone: Sinter, pellets, and lump ore soften at 1150°C and liquefy at 1350°C',
        'Direct reduction: FeO + C → Fe + CO (Strongly endothermic, consumes 155 kJ/mol)',
        'Reduction of SiO2 into molten iron: SiO2 + 2C → [Si] + 2CO'
      ],
      equipment: 'High-density copper staves, hyper-pressure forced circulation demineralized cooling water, steerable refractory anchors.'
    },
    tuyere: {
      name: 'Tuyere Zone & Raceway (Heart of Combustion)',
      temp: '2000°C – 2250°C (RAFT)',
      pressure: '3.5 – 4.5 bar',
      description: 'Hot blast at 1150-1250°C is injected through 24-42 water-cooled copper tuyeres with oxygen enrichment and pulverized coal injection (PCI). High velocity gas (200 m/s) burns coke and coal, forming combustion raceways.',
      reactions: [
        'C + O2 → CO2 (Instantaneous combustion in raceway)',
        'CO2 + C → 2CO (Fast endothermic conversion at raceway border)',
        'H2O + C → CO + H2 (Blast moisture dissociation)',
        'Raceway Adiabatic Flame Temperature (RAFT): maintained between 2100°C - 2250°C'
      ],
      equipment: 'Double-chamber forged copper tuyeres, ceramic-insulated blowpipes, coaxial PCI lances, pyrometer sight glasses, tuyere flow monitors.'
    },
    hearth: {
      name: 'Hearth, Deadman & Taphole',
      temp: '1480°C – 1530°C (Liquid Pool)',
      pressure: '3.8 – 4.5 bar',
      description: 'The furnace crucible collecting separated molten hot metal (density ~6.8 g/cm³) and liquid slag (density ~2.6 g/cm³). Supported by a submerged permeable coke deadman bed and drained via clay-sealed tapholes.',
      reactions: [
        'Liquid hot metal carburization to saturation (~4.3-4.6% C)',
        'Desulfurization by slag: [FeS] + (CaO) + C → (CaS) + [Fe] + CO',
        'Manganese and Phosphorus partitioning: [Mn] reduction, [P] full recovery into metal',
        'Slag Basicity B2 = CaO/SiO2 (1.05 - 1.25) for optimum sulfur removal and fluidity'
      ],
      equipment: 'Micropore and super-micropore carbon blocks, graphite underhearth cooling pads, ceramic cup lining, hydraulic mud guns, automated drillers.'
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="border-b border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
            <Flame className="w-4 h-4" />
            Core Pyrometallurgy & Reactor Engineering
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Blast Furnace Ironmaking Technology
          </h1>
          <p className="mt-3 text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
            A comprehensive engineering breakdown of the blast furnace process: counter-current thermochemical reduction, burden dynamics, cohesive zone permeability, raceway combustion kinetics, and hearth metallurgy.
          </p>
        </div>

        {/* 1. Interactive Anatomical Cutaway */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-400" />
                Blast Furnace Interactive Reactor Cross-Section
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a furnace zone below or click the schematic to inspect operating temperatures, chemical kinetics, and mechanical equipment.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(zones) as Array<keyof typeof zones>).map((zoneKey) => (
                <button
                  key={zoneKey}
                  onClick={() => setSelectedZone(zoneKey)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                    selectedZone === zoneKey
                      ? 'bg-orange-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {zoneKey}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Visual Cross-Section Diagram */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-xl border border-slate-800/80">
              <div className="w-full max-w-xs space-y-2">
                {/* Furnace Top */}
                <button
                  onClick={() => setSelectedZone('top')}
                  className={`w-full py-3.5 px-4 rounded-lg border text-left transition-all relative overflow-hidden group ${
                    selectedZone === 'top'
                      ? 'bg-orange-950/40 border-orange-500 shadow-md shadow-orange-950/50'
                      : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      1. Furnace Top & Chute
                    </span>
                    <span className="font-mono text-slate-400">150 - 250°C</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Stockline radar & gas off-takes</div>
                </button>

                {/* Stack */}
                <button
                  onClick={() => setSelectedZone('stack')}
                  className={`w-full py-5 px-4 rounded-lg border text-left transition-all ${
                    selectedZone === 'stack'
                      ? 'bg-orange-950/40 border-orange-500 shadow-md shadow-orange-950/50'
                      : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      2. Stack / Shaft (Thermal Reserve)
                    </span>
                    <span className="font-mono text-slate-400">400 - 1000°C</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Indirect reduction Fe2O3 → FeO</div>
                </button>

                {/* Belly */}
                <button
                  onClick={() => setSelectedZone('belly')}
                  className={`w-full py-3.5 px-4 rounded-lg border text-left transition-all ${
                    selectedZone === 'belly'
                      ? 'bg-orange-950/40 border-orange-500 shadow-md shadow-orange-950/50'
                      : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      3. Belly Zone
                    </span>
                    <span className="font-mono text-slate-400">1000 - 1200°C</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Maximum cylindrical diameter</div>
                </button>

                {/* Bosh */}
                <button
                  onClick={() => setSelectedZone('bosh')}
                  className={`w-full py-5 px-4 rounded-lg border text-left transition-all ${
                    selectedZone === 'bosh'
                      ? 'bg-orange-950/40 border-orange-500 shadow-md shadow-orange-950/50'
                      : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      4. Bosh & Cohesive Zone
                    </span>
                    <span className="font-mono text-slate-400">1200 - 1500°C</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Softening, melting & coke slits</div>
                </button>

                {/* Tuyere */}
                <button
                  onClick={() => setSelectedZone('tuyere')}
                  className={`w-full py-4 px-4 rounded-lg border text-left transition-all ${
                    selectedZone === 'tuyere'
                      ? 'bg-orange-950/60 border-orange-500 shadow-lg shadow-orange-950/60'
                      : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-orange-400 flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                      5. Tuyere & Raceway Cavity
                    </span>
                    <span className="font-mono font-bold text-orange-400">2000 - 2250°C</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Hot blast + PCI coal combustion</div>
                </button>

                {/* Hearth */}
                <button
                  onClick={() => setSelectedZone('hearth')}
                  className={`w-full py-4 px-4 rounded-lg border text-left transition-all ${
                    selectedZone === 'hearth'
                      ? 'bg-orange-950/40 border-orange-500 shadow-md shadow-orange-950/50'
                      : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      6. Hearth & Taphole Crucible
                    </span>
                    <span className="font-mono text-slate-400">1480 - 1530°C</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Liquid hot metal, slag, & deadman</div>
                </button>
              </div>

              {/* Dynamic Gas / Solid Indicators */}
              <div className="w-full mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-orange-400">
                  <ArrowUp className="w-3.5 h-3.5" /> Ascending Reducing Gas
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <ArrowDown className="w-3.5 h-3.5" /> Descending Burden Solids
                </span>
              </div>
            </div>

            {/* Zone Details Card */}
            <div className="lg:col-span-7 bg-slate-950/60 rounded-xl p-6 border border-slate-800 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white text-orange-400">
                  {zones[selectedZone].name}
                </h3>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">Temp: <strong className="text-white">{zones[selectedZone].temp}</strong></span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Pressure: <strong className="text-white">{zones[selectedZone].pressure}</strong></span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {zones[selectedZone].description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-orange-400" />
                  Primary Thermochemical Reactions & Phenomena
                </h4>
                <ul className="space-y-1.5">
                  {zones[selectedZone].reactions.map((rxn, i) => (
                    <li key={i} className="text-xs font-mono bg-slate-900/90 p-2 rounded border border-slate-800/80 text-slate-200">
                      {rxn}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-orange-400" />
                  Refractory & Mechanical Infrastructure
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                  {zones[selectedZone].equipment}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={onRequestConsulting}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 group"
                >
                  Request Technical Consultation for this Zone
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Burden & Raw Material Quality Architecture */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Database className="w-6 h-6 text-orange-400" />
              Raw Materials & Burden Chemistry Specifications
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Metallurgical specifications governing modern high-productivity blast furnaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metallurgical Coke */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">Metallurgical Coke</h3>
                <span className="text-[11px] text-orange-400 font-mono">Fuel & Structural Grid</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The sole solid skeleton in the furnace hearth. Supports the mass of burden while ensuring gas permeability and liquid drainage.
              </p>
              <div className="space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">CSR (Strength after Reaction)</span>
                  <span className="text-white font-bold">&gt; 65.0%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">CRI (Coke Reactivity Index)</span>
                  <span className="text-white font-bold">&lt; 24.0%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Ash Content</span>
                  <span className="text-white font-bold">&lt; 10.5% – 12.5%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Moisture Content</span>
                  <span className="text-white font-bold">&lt; 4.0%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Sulfur [S]</span>
                  <span className="text-white font-bold">&lt; 0.65%</span>
                </div>
              </div>
            </div>

            {/* Fluxed Sinter */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">Fluxed Sinter</h3>
                <span className="text-[11px] text-orange-400 font-mono">65 - 80% Burden</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agglomerated iron ore fines self-fluxed with limestone and dolomite to provide basicity and superior high-temperature softening behavior.
              </p>
              <div className="space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Fe Content</span>
                  <span className="text-white font-bold">56.5% – 58.5%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Basicity B2 (CaO / SiO2)</span>
                  <span className="text-white font-bold">1.85 – 2.15</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">FeO Content</span>
                  <span className="text-white font-bold">8.0% – 9.5%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">RDI (Reduction Degradation)</span>
                  <span className="text-white font-bold">&lt; 28.0% (-3.15mm)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">TI (Tumbler Index)</span>
                  <span className="text-white font-bold">&gt; 71.0% (+6.3mm)</span>
                </div>
              </div>
            </div>

            {/* Pellets & Calibrated Lump Ore */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">Pellets & Lump Ore</h3>
                <span className="text-[11px] text-orange-400 font-mono">Supplementary Burden</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acid/fluxed pellets provide high Fe grade and uniform permeability. Calibrated lump ore provides low-cost direct Fe units with strict decrepitation limits.
              </p>
              <div className="space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Pellet Fe Content</span>
                  <span className="text-white font-bold">64.5% – 66.5%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Cold Crushing Strength (CCS)</span>
                  <span className="text-white font-bold">&gt; 250 daN/pellet</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Pellet Free Swelling Index</span>
                  <span className="text-white font-bold">&lt; 16.0%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Calibrated Lump Sizing</span>
                  <span className="text-white font-bold">10 – 30 mm</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Lump Decrepitation (DI)</span>
                  <span className="text-white font-bold">&lt; 1.5% (-0.5mm)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hot Metal & Slag Chemistry Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-400" />
              Hot Metal & Slag Metallurgical Equilibria
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Standard target ranges for Basic Oxygen Steelmaking (BOF) grade liquid iron and primary slag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hot Metal Specs */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400 mb-3">
                Liquid Hot Metal (Pig Iron) Chemistry
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-800">
                  <thead className="bg-slate-950 text-slate-300 font-semibold uppercase">
                    <tr>
                      <th className="py-2.5 px-3 border-b border-slate-800">Element</th>
                      <th className="py-2.5 px-3 border-b border-slate-800">Target Range</th>
                      <th className="py-2.5 px-3 border-b border-slate-800">Operational Significance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Carbon [C]</td>
                      <td className="py-2 px-3 font-mono text-orange-400">4.20% – 4.55%</td>
                      <td className="py-2 px-3 text-slate-400">Liquidus depression (1150°C eutectoid)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Silicon [Si]</td>
                      <td className="py-2 px-3 font-mono text-orange-400">0.35% – 0.65%</td>
                      <td className="py-2 px-3 text-slate-400">Key thermal indicator of hearth heat state</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Manganese [Mn]</td>
                      <td className="py-2 px-3 font-mono text-orange-400">0.20% – 0.50%</td>
                      <td className="py-2 px-3 text-slate-400">Enhances BOF dephosphorization slag foam</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Sulfur [S]</td>
                      <td className="py-2 px-3 font-mono text-orange-400">&lt; 0.035%</td>
                      <td className="py-2 px-3 text-slate-400">Harmful; removed into slag via high basicity</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Phosphorus [P]</td>
                      <td className="py-2 px-3 font-mono text-orange-400">&lt; 0.080%</td>
                      <td className="py-2 px-3 text-slate-400">100% partitions to metal in reducing conditions</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Tapping Temp</td>
                      <td className="py-2 px-3 font-mono text-orange-400">1495°C – 1525°C</td>
                      <td className="py-2 px-3 text-slate-400">Measured at iron runner before torpedo ladle</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Blast Furnace Slag Specs */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400 mb-3">
                Blast Furnace Slag & Fluidity Benchmarks
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-800">
                  <thead className="bg-slate-950 text-slate-300 font-semibold uppercase">
                    <tr>
                      <th className="py-2.5 px-3 border-b border-slate-800">Parameter</th>
                      <th className="py-2.5 px-3 border-b border-slate-800">Target Range</th>
                      <th className="py-2.5 px-3 border-b border-slate-800">Metallurgical Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Binary Basicity (B2)</td>
                      <td className="py-2 px-3 font-mono text-cyan-400">1.08 – 1.22</td>
                      <td className="py-2 px-3 text-slate-400">CaO / SiO2 for sulfur capacity and fluidity</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Magnesia (MgO)</td>
                      <td className="py-2 px-3 font-mono text-cyan-400">7.5% – 10.0%</td>
                      <td className="py-2 px-3 text-slate-400">Widens liquidus window against high Al2O3</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Alumina (Al2O3)</td>
                      <td className="py-2 px-3 font-mono text-cyan-400">12.5% – 16.5%</td>
                      <td className="py-2 px-3 text-slate-400">Increases viscosity; mitigated by MgO</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Slag Volume</td>
                      <td className="py-2 px-3 font-mono text-cyan-400">280 – 340 kg/tHM</td>
                      <td className="py-2 px-3 text-slate-400">Specific generation rate per ton hot metal</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Sulfur Partition Ls</td>
                      <td className="py-2 px-3 font-mono text-cyan-400">35 – 55</td>
                      <td className="py-2 px-3 text-slate-400">(%S in slag) / [%S in metal]</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-white">Viscosity at 1450°C</td>
                      <td className="py-2 px-3 font-mono text-cyan-400">&lt; 3.5 poise</td>
                      <td className="py-2 px-3 text-slate-400">Ensures clean separation in skimmer runner</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Live Interactive Blast Furnace KPI & Operating Calculator */}
        <div className="bg-slate-900 border-2 border-orange-500/40 rounded-2xl p-6 lg:p-8 shadow-2xl shadow-orange-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
                <Sliders className="w-4 h-4" />
                Live Engineering Simulator
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Interactive Blast Furnace Operating KPI Calculator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Calibrate working parameters to project daily specific productivity, total fuel rate, raceway adiabatic flame temperature (RAFT), and estimated carbon intensity.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-orange-600/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold">
              Thermodynamic Simulator v3.4
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Working Volume (Vw)</span>
                    <span className="font-mono text-orange-400">{calcVolume} m³</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="5500"
                    step="50"
                    value={calcVolume}
                    onChange={(e) => setCalcVolume(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1,000 m³</span>
                    <span>5,500 m³</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Target Daily Production</span>
                    <span className="font-mono text-orange-400">{calcProduction} t/d</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="14000"
                    step="100"
                    value={calcProduction}
                    onChange={(e) => setCalcProduction(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>2,000 t/d</span>
                    <span>14,000 t/d</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Dry Coke Rate</span>
                    <span className="font-mono text-orange-400">{calcCokeRate} kg/tHM</span>
                  </div>
                  <input
                    type="range"
                    min="280"
                    max="520"
                    step="5"
                    value={calcCokeRate}
                    onChange={(e) => setCalcCokeRate(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>280 kg</span>
                    <span>520 kg</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Pulverized Coal (PCI) Rate</span>
                    <span className="font-mono text-orange-400">{calcPciRate} kg/tHM</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="230"
                    step="5"
                    value={calcPciRate}
                    onChange={(e) => setCalcPciRate(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>60 kg</span>
                    <span>230 kg</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Hot Blast Temperature</span>
                    <span className="font-mono text-orange-400">{calcBlastTemp} °C</span>
                  </div>
                  <input
                    type="range"
                    min="1050"
                    max="1280"
                    step="10"
                    value={calcBlastTemp}
                    onChange={(e) => setCalcBlastTemp(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1,050°C</span>
                    <span>1,280°C</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Oxygen Enrichment</span>
                    <span className="font-mono text-orange-400">+{calcO2Enrich.toFixed(1)} %</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="9.0"
                    step="0.5"
                    value={calcO2Enrich}
                    onChange={(e) => setCalcO2Enrich(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>+1.0%</span>
                    <span>+9.0%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  High PCI rate requires adequate oxygen enrichment to preserve the raceway adiabatic flame temperature (RAFT &gt; 2100°C) and avoid unburnt coal char accumulation in the deadman.
                </span>
              </div>
            </div>

            {/* Calculated Output Display */}
            <div className="lg:col-span-5 bg-slate-950/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                Projected Blast Furnace Output Indices
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Specific Productivity</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {productivity} <span className="text-xs text-slate-400 font-normal">tHM/m³/d</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    {Number(productivity) >= 2.4 ? '✓ High Intensity' : 'Standard'}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Fuel Rate</div>
                  <div className="text-xl font-bold font-mono text-orange-400 mt-0.5">
                    {totalFuelRate} <span className="text-xs text-slate-400 font-normal">kg/tHM</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Coke + PCI Combined</div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Flame Temp (RAFT)</div>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${
                    estimatedRaft >= 2100 && estimatedRaft <= 2250 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {estimatedRaft} <span className="text-xs text-slate-400 font-normal">°C</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {estimatedRaft >= 2100 && estimatedRaft <= 2250 ? 'Optimal (2100-2250°C)' : 'Warning: Adjust O2/Blast'}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Replacement Ratio</div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {replacementRatio} <span className="text-xs text-slate-400 font-normal">kg/kg</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Coke saved / kg coal</div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Est. Slag Volume</div>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {estimatedSlagVolume} <span className="text-xs text-slate-400 font-normal">kg/tHM</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Scope 1 Carbon Est.</div>
                  <div className="text-lg font-bold font-mono text-orange-400 mt-0.5">
                    {estimatedCo2Intensity} <span className="text-xs text-slate-400 font-normal">kg CO2/tHM</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onRequestConsulting}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-orange-950/40"
              >
                <span>Request Plant-Specific Burden & Fuel Audit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
