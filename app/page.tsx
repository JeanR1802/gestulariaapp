'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import {
  Zap, Layers, ArrowRight, Menu, X,
  CheckCircle, Play, Rocket,
  Smartphone, Sparkles, Check,
  BarChart3, Briefcase, DollarSign, 
  TrendingUp, Users, PieChart, Activity,
  Calendar, ArrowUpRight, Layout
} from 'lucide-react';
import Image from 'next/image';

// --- MICRO-APP 1: MONITOR DE PULSO DE NEGOCIO (Hero) ---
// Simula un dashboard ejecutivo en tiempo real.
const BusinessPulseMonitor = () => {
  const [companyName, setCompanyName] = useState('Mi Empresa');
  const [activeMetric, setActiveMetric] = useState('revenue');

  // Datos simulados que cambian levemente para dar sensación de "vivo"
  const [metrics, setMetrics] = useState({
    revenue: 124500,
    leads: 45,
    efficiency: 92
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 100),
        leads: prev.leads + (Math.random() > 0.7 ? 1 : 0),
        efficiency: Math.min(100, Math.max(85, prev.efficiency + (Math.random() - 0.5)))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0f172a] rounded-[2rem] p-6 border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-teal-500/30 transition-all duration-500 w-full max-w-sm mx-auto">
       {/* Gradient Glow */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/10 rounded-full blur-[80px] pointer-events-none"></div>

       {/* Input Header */}
       <div className="relative z-10 mb-6 border-b border-white/5 pb-4">
          <div className="flex justify-between items-center mb-3">
             <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"/>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"/>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"/>
             </div>
             <span className="text-[10px] font-mono text-slate-500">gestularia.app/dash</span>
          </div>
          <div>
             <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 block">Organización</label>
             <input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors placeholder-slate-600 font-semibold"
                placeholder="Nombre de tu empresa"
             />
          </div>
       </div>

       {/* Dashboard Cards */}
       <div className="grid grid-cols-2 gap-3 relative z-10">
          {/* Revenue Card (Big) */}
          <div 
            onClick={() => setActiveMetric('revenue')}
            className={`col-span-2 p-4 rounded-xl border transition-all cursor-pointer ${activeMetric === 'revenue' ? 'bg-teal-500/10 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'}`}
          >
             <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400"><DollarSign size={16}/></div>
                <span className="text-xs font-bold text-green-400 flex items-center gap-1">+12% <ArrowUpRight size={12}/></span>
             </div>
             <p className="text-slate-400 text-xs font-medium">Ingresos Mensuales</p>
             <p className="text-2xl font-black text-white">${metrics.revenue.toLocaleString()}</p>
          </div>

          {/* Leads Card */}
          <div 
             className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between"
          >
             <div className="text-slate-400 mb-1"><Users size={16}/></div>
             <div>
                <p className="text-xl font-bold text-white">{metrics.leads}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Leads Activos</p>
             </div>
          </div>

          {/* Efficiency Card */}
          <div 
             className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between"
          >
             <div className="text-slate-400 mb-1"><Activity size={16}/></div>
             <div>
                <p className="text-xl font-bold text-white">{metrics.efficiency.toFixed(0)}%</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Eficiencia</p>
             </div>
          </div>
       </div>

       {/* Chart Simulation */}
       <div className="mt-4 h-24 flex items-end gap-1 px-2">
          {[40, 65, 45, 70, 55, 85, 60, 90, 75, 65, 80, 95].map((h, i) => (
             <div 
               key={i} 
               className={`flex-1 rounded-t-sm transition-all duration-500 ${i === 11 ? 'bg-teal-500' : 'bg-slate-700'}`}
               style={{ height: `${h}%`, opacity: i === 11 ? 1 : 0.3 + (i * 0.05) }}
             ></div>
          ))}
       </div>
    </div>
  );
};

// --- MICRO-APP 2: AUTOMATIZADOR DE FLUJO (Features) ---
// Simula la creación de un pipeline de ventas o tareas.
const WorkflowAutomator = () => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
        setStep(s => s >= 3 ? 1 : s + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#131B2E] rounded-3xl p-8 border border-teal-500/20 shadow-2xl relative h-full flex flex-col justify-center overflow-hidden min-h-[320px]">
       <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
       <div className="absolute top-4 left-4 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
          Pipeline Inteligente
       </div>

       <div className="flex flex-col gap-6 relative z-10 max-w-[240px] mx-auto mt-8">
          
          {/* Node 1: Trigger */}
          <div className={`relative p-4 rounded-xl border transition-all duration-500 ${step >= 1 ? 'bg-slate-800 border-teal-500/50 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${step >= 1 ? 'bg-teal-500 text-black' : 'bg-slate-800'}`}>
                   <Users size={18}/>
                </div>
                <div className="text-sm font-bold">Nuevo Cliente</div>
             </div>
             {/* Connecting Line */}
             <div className="absolute left-8 top-full h-6 w-0.5 bg-slate-800 z-0">
                <div className={`w-full bg-teal-500 transition-all duration-1000 ease-out ${step >= 2 ? 'h-full' : 'h-0'}`}></div>
             </div>
          </div>

          {/* Node 2: Action */}
          <div className={`relative p-4 rounded-xl border transition-all duration-500 ${step >= 2 ? 'bg-slate-800 border-blue-500/50 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-800'}`}>
                   <Briefcase size={18}/>
                </div>
                <div className="text-sm font-bold">Crear Proyecto</div>
             </div>
             <div className="absolute left-8 top-full h-6 w-0.5 bg-slate-800 z-0">
                <div className={`w-full bg-blue-500 transition-all duration-1000 ease-out ${step >= 3 ? 'h-full' : 'h-0'}`}></div>
             </div>
          </div>

          {/* Node 3: Result */}
          <div className={`relative p-4 rounded-xl border transition-all duration-500 ${step >= 3 ? 'bg-slate-800 border-green-500/50 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${step >= 3 ? 'bg-green-500 text-white' : 'bg-slate-800'}`}>
                   <DollarSign size={18}/>
                </div>
                <div className="text-sm font-bold">Generar Factura</div>
             </div>
          </div>

       </div>
    </div>
  );
};

// --- MICRO-APP 3: CALCULADORA DE ROI (Pricing) ---
// Calcula el retorno de inversión de usar la plataforma.
const ROICalculator = () => {
  const [hoursSaved, setHoursSaved] = useState(10);
  const hourlyRate = 50; // Valor hora promedio
  
  const monthlySavings = hoursSaved * hourlyRate * 4; // 4 semanas
  const cost = 29; // Costo del software
  const roi = Math.round(((monthlySavings - cost) / cost) * 100);

  return (
    <div className="bg-[#131B2E] rounded-3xl p-8 border border-teal-500/20 shadow-2xl w-full max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
         <div className="bg-teal-500 text-black p-2 rounded-lg shadow-lg shadow-teal-500/20"><TrendingUp size={20}/></div>
         <div>
            <h3 className="text-white font-bold text-base">Calculadora de ROI</h3>
            <p className="text-slate-400 text-xs">Retorno de Inversión</p>
         </div>
      </div>

      <div className="space-y-8">
         <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">
               <span>Horas Ahorradas / Semana</span>
               <span className="text-white bg-slate-800 px-2 py-0.5 rounded">{hoursSaved}h</span>
            </div>
            <input 
              type="range" min="1" max="40" value={hoursSaved} 
              onChange={(e) => setHoursSaved(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <p className="text-[10px] text-slate-500 mt-2 text-right">Basado en valor hora de $50 USD</p>
         </div>

         <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4 mb-4 border-b border-white/5 pb-4">
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Costo Gestularia</p>
                        <p className="text-lg font-bold text-white">${cost}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Valor Recuperado</p>
                        <p className="text-lg font-bold text-green-400">${monthlySavings.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <p className="text-xs text-teal-200 font-bold uppercase tracking-wider">Tu ROI Mensual</p>
                    <p className="text-4xl font-black text-teal-400 tracking-tight">+{roi}%</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};


// --- COMPONENTES UI ---

const Button = ({ children, variant = 'primary', className = '', icon: Icon, onClick }: { children: React.ReactNode, variant?: 'primary' | 'secondary' | 'outline', className?: string, icon?: React.ElementType, onClick?: () => void }) => {
  const styles = {
    primary: "bg-teal-500 text-[#001e1d] hover:bg-teal-400 shadow-[0_0_20px_-5px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.6)] border-0",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur-md",
    outline: "border border-slate-700 text-slate-300 hover:border-teal-500 hover:text-teal-400 bg-transparent"
  };
  return (
    <button onClick={onClick} className={`inline-flex items-center justify-center px-6 py-3 font-bold rounded-xl transition-all duration-300 active:scale-95 border ${styles[variant]} ${className}`}>
      {children}
      {Icon && <Icon className="ml-2 w-5 h-5" />}
    </button>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) => (
  <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/5 hover:border-teal-500/30 transition-all duration-300 group hover:-translate-y-2 h-full flex flex-col shadow-lg hover:shadow-teal-500/10">
    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-teal-500 group-hover:scale-110 transition-transform duration-300 group-hover:bg-teal-500 group-hover:text-[#001e1d]">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm flex-grow">{desc}</p>
  </div>
);

// --- SECCIONES ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-[#000814]/80 backdrop-blur-xl z-50 border-b border-white/10 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
           <Image src="/lgo.png" alt="Gestularia logo" className="w-8 h-8 object-contain rounded-md transition-transform group-hover:scale-105" width={32} height={32} priority />
          <span className="font-black text-2xl tracking-tight text-white group-hover:text-teal-400 transition-colors">
            Gestularia
          </span>
        </div>
        
        <div className="hidden md:flex gap-10 items-center font-medium text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Soluciones</a>
          <a href="#automation" className="hover:text-white transition-colors">Automatización</a>
          <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
          
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            {loading ? (
               <span className="text-slate-600 text-xs animate-pulse">Cargando...</span>
            ) : user ? (
               <Button variant="primary" className="!py-2.5 !px-6 !text-xs !rounded-lg shadow-none" onClick={() => router.push('/dashboard')}>
                  Dashboard
               </Button>
            ) : (
               <>
                  <button className="text-white hover:text-teal-400 transition-colors font-bold text-sm" onClick={() => router.push('/login')}>
                     Entrar
                  </button>
                  <Button variant="primary" className="!py-2.5 !px-6 !text-xs !rounded-lg shadow-none" onClick={() => router.push('/register')}>
                     Empezar Gratis
                  </Button>
               </>
            )}
          </div>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#000814] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden z-50 animate-in slide-in-from-top-5 duration-200 shadow-2xl">
            <a href="#features" className="text-slate-300 font-bold text-lg p-2 border-b border-white/5 hover:text-teal-400" onClick={() => setIsOpen(false)}>Soluciones</a>
            <a href="#automation" className="text-slate-300 font-bold text-lg p-2 border-b border-white/5 hover:text-teal-400" onClick={() => setIsOpen(false)}>Automatización</a>
            <a href="#pricing" className="text-slate-300 font-bold text-lg p-2 border-b border-white/5 hover:text-teal-400" onClick={() => setIsOpen(false)}>Precios</a>
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                 <Button variant="primary" className="w-full" onClick={() => router.push('/dashboard')}>Dashboard</Button>
              ) : (
                 <>
                   <Button variant="secondary" className="w-full" onClick={() => router.push('/login')}>Iniciar Sesión</Button>
                   <Button variant="primary" className="w-full" onClick={() => router.push('/register')}>Crear Cuenta</Button>
                 </>
              )}
            </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const router = useRouter();
  
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-[#000814] overflow-hidden relative">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        <div className="text-center lg:text-left relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700 hover:border-teal-500/40 transition-colors cursor-default select-none">
            <Sparkles size={12} fill="currentColor" /> Business OS v2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-8">
            Escala tu <br/>
            Empresa <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 animate-pulse">
              Sin Límites.
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
            Gestión integral de negocios, CRM, proyectos y finanzas en un solo sistema operativo. Deja las hojas de cálculo y empieza a crecer de verdad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button variant="primary" icon={ArrowRight} className="text-lg shadow-teal-500/20" onClick={() => router.push('/register')}>
              Comenzar Gratis
            </Button>
            <Button variant="secondary" icon={Play}>
              Ver Demo
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500"/> Todo en Uno</span>
            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500"/> Analíticas IA</span>
            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500"/> Soporte VIP</span>
          </div>
        </div>

        {/* Hero Visual: Business Pulse Monitor */}
        <div className="relative mx-auto lg:mr-0 perspective-1000 group z-10 w-full max-w-[400px]">
           <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/20 to-blue-600/20 rounded-[3rem] blur-3xl group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>
           
           <div className="relative transform transition-transform duration-500 hover:-rotate-1">
              <BusinessPulseMonitor />
              
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-[#0f172a] text-white px-5 py-3 rounded-xl border border-teal-500/30 shadow-2xl flex items-center gap-3 animate-bounce z-20">
                 <div className="bg-teal-600 rounded-lg p-1 text-white">
                    <Activity size={16} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">Estado</span>
                    <span className="text-sm font-bold leading-none text-teal-300">En Crecimiento</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

const Features = () => (
  <section id="features" className="py-24 bg-[#080C17]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Tu Centro de Comando</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Herramientas potentes pero simples para gestionar cada aspecto de tu operación.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        <FeatureCard 
           icon={Layout}
           title="Gestión de Proyectos"
           desc="Organiza tareas, asigna recursos y visualiza el progreso con tableros Kanban y diagramas de Gantt intuitivos."
        />
        <FeatureCard 
           icon={Users}
           title="CRM Inteligente"
           desc="Centraliza tus clientes, sigue tus leads y automatiza el seguimiento para no perder ninguna oportunidad de venta."
        />
        <FeatureCard 
           icon={BarChart3}
           title="Finanzas y Métricas"
           desc="Facturación automática, control de gastos y reportes financieros en tiempo real para decisiones inteligentes."
        />
      </div>
    </div>
  </section>
);

const AutomationSection = () => {
  const router = useRouter();
  return (
    <section id="automation" className="py-24 bg-[#0B1121] border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05),transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10">
          
          <div className="order-2 lg:order-1 relative h-auto min-h-[400px]">
             {/* INTERACTIVE 2: Workflow Automator */}
             <WorkflowAutomator />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Automatiza lo <br/>
              <span className="text-teal-400">Aburrido.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Deja que Gestularia se encargue de las tareas repetitivas. Conecta ventas, correos y tareas en flujos de trabajo automatizados que funcionan mientras duermes.
            </p>
            
            <div className="grid grid-cols-1 gap-6">
               <div className="flex gap-4">
                  <div className="bg-teal-500/10 p-3 h-fit rounded-xl text-teal-400 border border-teal-500/20">
                     <Zap size={24}/>
                  </div>
                  <div>
                     <h4 className="text-white font-bold text-lg mb-1">Triggers Instantáneos</h4>
                     <p className="text-slate-500 text-sm">Dispara acciones cuando ocurre una venta, un registro o una fecha límite.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="bg-teal-500/10 p-3 h-fit rounded-xl text-teal-400 border border-teal-500/20">
                     <CheckCircle size={24}/>
                  </div>
                  <div>
                     <h4 className="text-white font-bold text-lg mb-1">Sin Código</h4>
                     <p className="text-slate-500 text-sm">Constructor visual de flujos. Si puedes dibujarlo, puedes automatizarlo.</p>
                  </div>
               </div>
            </div>

            <Button variant="outline" className="mt-10" onClick={() => router.push('/register')}>
               Explorar Automatizaciones
            </Button>
          </div>

      </div>
    </section>
  );
};

const Pricing = () => {
  const router = useRouter();
  return (
    <section id="pricing" className="py-24 bg-[#080C17]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Rentabilidad Probada</h2>
          <p className="text-slate-400 mb-8 text-lg">¿Cuánto tiempo y dinero estás perdiendo con procesos manuales?</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          
          {/* INTERACTIVE 3: ROI Calculator */}
          <div className="order-2 lg:order-1 w-full">
            <ROICalculator />
          </div>

          {/* Pricing Card */}
          <div className="order-1 lg:order-2 bg-gradient-to-b from-teal-500/20 to-[#1A1F2E] p-[1px] rounded-[2rem] relative w-full transform hover:scale-[1.01] transition-transform duration-300">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg shadow-teal-500/20">
                Plan Growth
             </div>
             
             <div className="bg-[#0f172a] rounded-[2rem] p-8 md:p-10 h-full relative overflow-hidden">
                {/* Background shine */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <h3 className="text-white font-bold mb-2 text-2xl">Empresarial</h3>
                <p className="text-slate-400 text-sm mb-8">Para equipos que buscan escalar operaciones rápidamente.</p>
                
                <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-white/5">
                  <span className="text-6xl font-black text-white tracking-tight">$49</span>
                  <span className="text-slate-500 font-medium text-lg">/ mes</span>
                </div>
                
                <ul className="space-y-5 text-left text-sm text-slate-300 mb-10">
                  {[
                    "Usuarios Ilimitados",
                    "CRM Avanzado + Pipelines",
                    "Gestión de Proyectos Gantt",
                    "Automatizaciones Ilimitadas",
                    "Facturación y Finanzas",
                    "Soporte Prioritario"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-center">
                       <div className="bg-teal-500 rounded-full p-0.5 text-black"><Check size={12} strokeWidth={3}/></div> 
                       {item}
                    </li>
                  ))}
                </ul>
                
                <Button variant="primary" className="w-full py-4 text-base" onClick={() => router.push('/register')}>
                   Comenzar Prueba de 14 Días
                </Button>
                <p className="text-xs text-center text-slate-600 mt-4">Cancela cuando quieras. Sin contratos.</p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#000814] py-12 border-t border-white/5 text-center relative z-10">
    <div className="flex items-center justify-center gap-3 font-black text-2xl text-white mb-8">
      <Image src="/lgo.png" alt="Gestularia logo" className="w-8 h-8 object-contain rounded-md" width={32} height={32} />
      Gestularia
    </div>
    
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-500 mb-8 font-medium">
       <a href="#" className="hover:text-teal-400 transition-colors">Producto</a>
       <a href="#" className="hover:text-teal-400 transition-colors">Comunidad</a>
       <a href="#" className="hover:text-teal-400 transition-colors">Soporte</a>
       <a href="#" className="hover:text-teal-400 transition-colors">Términos</a>
    </div>
    
    <p className="text-slate-700 text-xs">
      © 2025 Gestularia Inc. Todos los derechos reservados.
    </p>
  </footer>
);

export default function App() {
  return (
    // Cursor oculto globalmente para usar el custom cursor definido en el CSS global si existe, o cursor default si no.
    <div className="font-sans bg-[#000814] text-white scroll-smooth selection:bg-teal-500/30 selection:text-teal-200">
      <Navbar />
      <Hero />
      <Features />
      <AutomationSection />
      <Pricing />
      <Footer />
    </div>
  );
}