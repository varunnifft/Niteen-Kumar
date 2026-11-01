import React, { useState } from 'react';
import {
  Layers,
  Flame,
  Factory,
  Cog,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ArrowRight,
  Zap,
  CheckCircle2,
  Wind
} from 'lucide-react';

export const SupportingPlantsPage: React.FC<{ onRequestConsulting: () => void }> = ({ onRequestConsulting }) => {
  const [activeTab, setActiveTab] = useState<'sinter' | 'pellet' | 'coke' | 'handling' | 'pci' | 'gas'>('sinter');

  const plants = [
    { id: 'sinter', label: 'A. Sinter Plant', icon: Layers },
    { id: 'pellet', label: 'B. Pellet Plant', icon: Factory },
    { id: 'coke', label: 'C. Coke Oven & Battery', icon: Flame },
    { id: 'handling', label: 'D. Raw Material Handling (RMHS)', icon: Cog },
    { id: 'pci', label: 'E. Pulverized Coal Injection (PCI)', icon: Zap },
    { id: 'gas', label: 'F. Gas Cleaning & TRT Recovery', icon: Wind }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
            <Factory className="w-4 h-4" />
            Upstream Agglomeration & Auxiliary Systems
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Supporting Raw Material Plants & Agglomeration
          </h1>
          <p className="mt-3 text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
            The operational stability and fuel rate of a blast furnace are fundamentally dictated by the physical and metallurgical quality of its prepared burden. Explore our technical coverage across sintering, pelletizing, coking, raw material handling, PCI, and energy recovery.
          </p>
        </div>

        {/* Plant Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          {plants.map((p) => {
            const Icon = p.icon;
            const isActive = activeTab === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id as any)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/40'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-orange-400'}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB A: SINTER PLANT */}
        {activeTab === 'sinter' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Agglomeration Engineering</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Sintering Process & Quality Optimization</h2>
                </div>
                <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                  Target Basicity: <strong className="text-orange-400">B2 = 1.85 – 2.15</strong> · FeO: <strong className="text-orange-400">8.0 – 9.5%</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Raw Material Blending & Sintering Strand Mechanics
                  </h3>
                  <p>
                    Iron ore fines (-10mm) are blended with fluxing agents (calcitic limestone and dunite/dolomite for MgO), solid fuel (coke breeze or low-volatile anthracite sized -3mm), and circulating return fines (sized -5mm). The mixture is conditioned in primary and secondary mixing drums where controlled water addition generates micro-nodules with superior permeability.
                  </p>
                  <p>
                    The prepared bed (450 to 700 mm depth) is deposited on the continuous travelling grate strand. Ignition hoods fired with blast furnace/coke oven gas at 1150°C–1250°C ignite the top layer while powerful exhaust exhaust fans draw air downwards through windboxes under negative suction (12 to 16 kPa).
                  </p>
                  <p>
                    The narrow combustion flame front (1300°C–1400°C) propagates downwards through the bed until it strikes the grate bars at the designated <strong>Burn-Through Point (BTP)</strong>, typically located 1 to 2 windboxes before the strand discharge.
                  </p>
                </div>

                {/* Sinter Quality Metrics Card */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-2">
                    Critical Sinter Quality Parameters
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex justify-between font-bold text-white">
                        <span>Tumbler Index (TI)</span>
                        <span className="font-mono text-emerald-400">&gt; 71.0% – 74.0%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Resistance to cold degradation during transfer via +6.3mm fraction after drum rotation.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex justify-between font-bold text-white">
                        <span>Reduction Degradation Index (RDI)</span>
                        <span className="font-mono text-emerald-400">&lt; 26.0% – 28.0%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Measures skeletal fines generation (-3.15mm) at 550°C in the upper furnace stack.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex justify-between font-bold text-white">
                        <span>Reducibility Index (RI)</span>
                        <span className="font-mono text-emerald-400">&gt; 65.0% – 70.0%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Oxygen removal rate at 900°C; governed by acicular SFCA (Silico-Ferrites of Calcium & Aluminum).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex justify-between font-bold text-white">
                        <span>Specific Productivity</span>
                        <span className="font-mono text-white">1.25 – 1.65 t/m²/24h</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Daily net sinter production normalized to effective suction area of the strand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimization Strategies */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white mb-3">Sinter Plant Technical Optimization Levers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <strong className="text-orange-400 block mb-1">Moisture & Granulation Tuning</strong>
                    <span className="text-slate-400">
                      Targeting +1.0mm to -5mm granulation fraction to minimize bed suction resistance and stabilize flame front speed.
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <strong className="text-orange-400 block mb-1">Return Fines Balance Control</strong>
                    <span className="text-slate-400">
                      Maintaining closed-circuit equilibrium (Generation = Consumption) to prevent strand starvation or coke waste.
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <strong className="text-orange-400 block mb-1">FeO Minimization & SFCA Phase</strong>
                    <span className="text-slate-400">
                      Operating at 8.0-9.0% FeO to lower solid coke breeze consumption while keeping RDI under 28% using low-silica fluxes.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB B: PELLET PLANT */}
        {activeTab === 'pellet' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Fine Concentrate Agglomeration</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Pelletizing Process & Induration Grate</h2>
                </div>
                <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                  Target Fe: <strong className="text-orange-400">65.0 – 66.5%</strong> · CCS: <strong className="text-orange-400">&gt; 250 daN/pellet</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Green Pellet Preparation & Disc Balling Dynamics
                  </h3>
                  <p>
                    Ultra-fine iron ore concentrate (ground to Blaine fineness &gt; 1600–2200 cm²/g, &gt;80% -45 microns) is mixed with binder (such as 0.5–0.7% sodium bentonite or synthetic polymers) and minor basic fluxes (hydrated lime, limestone, or dolomite).
                  </p>
                  <p>
                    Balling discs (5 to 7.5 meters diameter, inclined at 45° to 50°) roll the moist mix into spherical green balls (9 to 16 mm diameter). Surface tension and capillary forces govern green pellet growth. Quality is verified via Green Drop Number (&gt; 5 drops from 450 mm without rupture) and Green Compressive Strength (&gt; 1.2 daN/pellet).
                  </p>
                  <p>
                    The green pellets are gently screened through roller screens to discard undersize and oversize before entering the induration machine.
                  </p>
                </div>

                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-2">
                    Induration Thermal Cycle Stages
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="font-bold text-white">1. Updraft & Downdraft Drying (200°C – 350°C)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Evaporates free capillary water without steam spalling or bursting.</p>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="font-bold text-white">2. Preheating Zone (800°C – 1050°C)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Oxidizes magnetite (Fe3O4 → Fe2O3), releasing 460 kJ/kg exothermic heat.</p>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="font-bold text-white">3. Induration / Firing (1250°C – 1320°C)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Recrystallization of hematite grains and formation of silicate/ferrite bridging bonds.</p>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="font-bold text-white">4. Multi-Stage Cooling (1300°C down to &lt;100°C)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Recovers sensible heat to supply preheating and drying air via recuperation ducts.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
                  <strong className="text-orange-400 block mb-1">Cold Crushing Strength (CCS)</strong>
                  <span className="text-slate-400">Guaranteed &gt; 250 daN/pellet to survive blast furnace burden column hydrostatic loads without disintegrating into fines.</span>
                </div>
                <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
                  <strong className="text-orange-400 block mb-1">Free Swelling Index</strong>
                  <span className="text-slate-400">Controlled below 16% volume expansion to prevent severe catastrophic swelling and hanging in blast furnace shaft.</span>
                </div>
                <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
                  <strong className="text-orange-400 block mb-1">Fluxed & Olivine Pellets</strong>
                  <span className="text-slate-400">Doping with MgO (1.5-2.0% via olivine or dolomite) raises softening-melting temperature and sharpens cohesive zone profile.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB C: COKE OVEN */}
        {activeTab === 'coke' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Coal Carbonization & Byproduct Recovery</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Coke Oven Battery Operations & Coke Quality</h2>
                </div>
                <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                  CSR: <strong className="text-orange-400">&gt; 65.0%</strong> · CRI: <strong className="text-orange-400">&lt; 24.0%</strong> · CDQ Steam: <strong className="text-orange-400">0.55 t/t Coke</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Coking Battery Thermal Carbonization
                  </h3>
                  <p>
                    Metallurgical coking coals (hard coking coals blended with semi-soft and PCI coals) are crushed to &gt;80% passing 3.15 mm. In stamp-charged batteries, the coal charge is mechanically compacted into a high-density cake (~1.15 t/m³ vs 0.75 t/m³ in top charging) before horizontal insertion into silica refractory coking chambers.
                  </p>
                  <p>
                    The battery ovens (heated externally by combustion flues at 1250°C–1350°C using rich coke oven gas or preheated blast furnace gas) heat the coal charge in an oxygen-free atmosphere for 18 to 22 hours.
                  </p>
                  <p>
                    During carbonization, volatile matter is expelled and captured in byproduct recovery plants (producing tar, ammonium sulfate, crude benzol, and clean coke oven gas), leaving a fused, porous, high-carbon metallurgical coke cake.
                  </p>
                </div>

                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-2">
                    Coke Quality Standards & Indices
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">Coke Strength after Reaction (CSR)</span>
                        <span className="text-[11px] text-slate-400">Resistance to degradation after exposure to CO2 at 1100°C</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold text-sm">&gt; 65.0%</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">Coke Reactivity Index (CRI)</span>
                        <span className="text-[11px] text-slate-400">Weight loss percentage during 2-hour CO2 exposure at 1100°C</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold text-sm">&lt; 24.0%</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">Micum Strength Indices (M40 / M10)</span>
                        <span className="text-[11px] text-slate-400">Cold impact strength (M40) and abrasion resistance (M10)</span>
                      </div>
                      <span className="font-mono text-white text-xs">M40 &gt; 82% · M10 &lt; 7.0%</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">Coke Dry Quenching (CDQ)</span>
                        <span className="text-[11px] text-slate-400">Inert gas cooling improves CSR by +2-3% while generating high-pressure steam</span>
                      </div>
                      <span className="font-mono text-orange-400 font-bold text-xs">CDQ Equipped</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB D: RAW MATERIAL HANDLING SYSTEM */}
        {activeTab === 'handling' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Logistics, Sizing & Homogenization</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Raw Material Handling System (RMHS)</h2>
                </div>
                <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                  Stockyard Capacity: <strong className="text-orange-400">30–45 Days Buffer</strong> · Automated Stacker-Reclaimers
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white text-orange-400">Unloading & Blending Beds</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Receival via tandem rotary wagon tipplers and track hoppers. Automated stackers deposit layers using Chevron or Windrow pile methods (hundreds of thin longitudinal layers) to homogenize chemistry variance (Fe, SiO2, Al2O3) across thousands of tons.
                  </p>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white text-orange-400">Screening Station Standards</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Removal of fines before blast furnace charging is paramount to prevent permeability loss.
                  </p>
                  <ul className="text-xs font-mono space-y-1.5 text-slate-300">
                    <li className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span>Sinter Screening:</span>
                      <strong className="text-white">&gt; 5.0 mm</strong>
                    </li>
                    <li className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span>Pellet Screening:</span>
                      <strong className="text-white">&gt; 6.3 mm</strong>
                    </li>
                    <li className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span>Lump Coke Screening:</span>
                      <strong className="text-white">&gt; 25.0 / 30.0 mm</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Nut Coke Recovery:</span>
                      <strong className="text-orange-400">10 – 25 mm</strong>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white text-orange-400">Conveying & High-Bay Bunkers</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Vibrating grizzly feeders, automated tripper cars, load-cell weighing bins, and emergency magnetic separators extract tramp metals. Sealed conveyor galleries feature bag filter dust extraction and spray mist suppression.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB E: PULVERIZED COAL INJECTION */}
        {activeTab === 'pci' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Coke Replacement & Fuel Injection</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Pulverized Coal Injection (PCI) Technology</h2>
                </div>
                <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                  Injection Rates: <strong className="text-orange-400">150 – 220 kg/tHM</strong> · Replacement Ratio: <strong className="text-orange-400">0.85 – 0.95</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Milling, Inert Drying & Dense-Phase Pneumatic Transport
                  </h3>
                  <p>
                    Raw coal is ground in vertical roller mills / bowl mills while simultaneously being dried by inert hot flue gas (strictly regulated with oxygen sensors &lt;8% O2 to prevent coal dust deflagration). The pulverized coal is ground to &gt;80% passing 74 microns (200 mesh) and collected in nitrogen-blanketed baghouses.
                  </p>
                  <p>
                    Dry pulverized coal is transferred into high-pressure lock hoppers and injection tanks. High-pressure pneumatic carrier gas transports the coal in dense-phase mode to dynamic distribution bottles located near the furnace tuyere deck.
                  </p>
                  <p>
                    Coaxial water-cooled or heat-resistant stainless steel lances inject coal streams directly into the core of the 1200°C hot blast stream at each tuyere blowpipe, achieving ignition in under 15 milliseconds.
                  </p>
                </div>

                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-2">
                    PCI Coal Quality Specifications
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">Volatile Matter (VM)</span>
                        <span className="text-[11px] text-slate-400 block">Low-vol (12-18%) for high carbon vs High-vol (28-35%) for fast ignition</span>
                      </div>
                      <span className="font-mono text-white text-xs font-bold">12% – 32%</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">Ash Content</span>
                        <span className="text-[11px] text-slate-400 block">Low ash reduces slag volume and preserves hearth permeability</span>
                      </div>
                      <span className="font-mono text-emerald-400 text-xs font-bold">&lt; 9.5% – 11.0%</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">Hardgrove Grindability Index (HGI)</span>
                        <span className="text-[11px] text-slate-400 block">High HGI reduces pulverizer grinding power consumption</span>
                      </div>
                      <span className="font-mono text-white text-xs font-bold">&gt; 55 – 75</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">Total Moisture</span>
                        <span className="text-[11px] text-slate-400 block">Drying target in mill to prevent pipe blockage</span>
                      </div>
                      <span className="font-mono text-emerald-400 text-xs font-bold">&lt; 1.0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB F: GAS CLEANING & TRT */}
        {activeTab === 'gas' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Environmental Controls & Clean Energy Generation</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Blast Furnace Gas Cleaning & TRT Recovery</h2>
                </div>
                <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                  Clean Gas Dust: <strong className="text-orange-400">&lt; 5 mg/Nm³</strong> · TRT Power: <strong className="text-orange-400">35 – 55 kWh/tHM</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white text-orange-400">1. Primary Cleaning (Dust Catcher)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ascending dirty top gas enters the gravity dust catcher / cyclone. Abrupt 180° flow reversal and centrifugal forces drop coarse particles (&gt;50 microns), capturing 60% to 75% of total dust dry for sinter plant recycling.
                  </p>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white text-orange-400">2. Secondary Cleaning (Dry Bag Filter / ESP)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Modern installations utilize high-temperature dry baghouse filters with pulse-jet cleaning instead of wet venturi scrubbers. Retains sensible heat, generates zero wet effluent slurry, and purifies gas to less than 5 mg/Nm³ dust content.
                  </p>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white text-orange-400">3. Top Pressure Recovery Turbine (TRT)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Clean gas at 2.0 to 2.8 bar gauge expands through an axial expansion turbine coupled to an electrical generator. Generates 35 to 55 kWh of carbon-free electricity per ton of hot metal, offsetting 30-40% of total plant power consumption!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plant Consulting CTA Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-orange-500/30 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              Need Plant Diagnostics or Process Troubleshooting?
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl">
              Our engineering specialists conduct on-site audits for sinter plants, pellet induration optimization, coke quality CSR/CRI improvement, and raw material cost reduction.
            </p>
          </div>
          <button
            onClick={onRequestConsulting}
            className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs whitespace-nowrap shadow-lg shadow-orange-950/40 transition-colors flex items-center gap-2"
          >
            <span>Request Plant Engineering Support</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
