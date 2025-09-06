// app/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";

// Helper component for the checkmark icon in lists
const CheckIcon = () => (
  <span className="mt-1 w-[18px] h-[18px] bg-[radial-gradient(circle_at_40%_40%,#fff,#c8f7d0_40%,var(--tw-gradient-stops))] from-amor-success to-amor-success rounded-[4px] shrink-0"></span>
);

export default function AmorIAPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chatMessages, setChatMessages] = useState([
    { from: "ai", text: "Hola, soy <b>Luna</b> ✨ Tu acompañante virtual. ¿Cómo te gustaría que fuera nuestra noche ideal? 💬" },
    { from: "me", text: "Dulce pero traviesa. Me gustan los videojuegos y las charlas largas." },
    { from: "ai", text: "Uff… gamer y de pláticas profundas, justo mi tipo. ¿Te preparo un plan para hoy? 🎮🍿" },
    { from: "me", text: "Sí, sorpréndeme." },
    { from: "ai", text: `<span class="inline-flex gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amor-muted opacity-70 animate-dot-bounce"></span><span class="w-1.5 h-1.5 rounded-full bg-amor-muted opacity-70 animate-dot-bounce [animation-delay:.15s]"></span><span class="w-1.5 h-1.5 rounded-full bg-amor-muted opacity-70 animate-dot-bounce [animation-delay:.3s]"></span></span>` },
  ]);
  const modalRef = useRef<HTMLDialogElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply a specific class to the body for this page's theme
    document.body.classList.add('amor-ia-theme');
    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('amor-ia-theme');
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  const handleOpenModal = () => modalRef.current?.showModal();
  const handleCloseModal = () => modalRef.current?.close();

  const handleStartChat = () => {
    const nameInput = modalRef.current?.querySelector('#botName') as HTMLInputElement;
    const styleInput = modalRef.current?.querySelector('#style') as HTMLSelectElement;
    const emailInput = modalRef.current?.querySelector('#email') as HTMLInputElement;

    const name = nameInput?.value.trim() || 'Luna';
    const style = styleInput?.value;
    const email = emailInput?.value.trim();
    
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      alert('Por favor, ingresa un email válido para guardar tu progreso.');
      return;
    }

    modalRef.current?.close();

    const newWelcomeMessage = {
      from: "ai",
      text: `Listo ✨ He creado tu bot <b>${name}</b> con estilo <b>${style}</b>. ¡Hablemos!`
    };

    // Replace typing indicator with the new message
    setChatMessages(prev => [...prev.slice(0, -1), newWelcomeMessage]);
  };


  return (
    <div className="font-['Inter',_sans-serif] text-amor-text bg-amor-bg">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-[rgba(9,14,27,.9)] to-[rgba(9,14,27,.5)] backdrop-blur-sm backdrop-saturate-125">
        <div className="w-full max-w-[1150px] mx-auto px-[4%] flex items-center justify-between py-4">
          <a href="#" className="flex items-center gap-2.5 font-extrabold text-lg">
            <i className="w-7 h-7 inline-block rounded-lg bg-[conic-gradient(from_210deg,#7c5cff,#10e7ff)] shadow-[0_6px_18px_rgba(124,92,255,.35)]"></i>
            AmorIA
          </a>
          <div className="flex gap-2.5 items-center">
            <a className="hidden sm:inline-flex items-center gap-2.5 border border-white/10 rounded-full py-2.5 px-5 font-bold cursor-pointer bg-transparent text-amor-text text-sm" href="#precios">Precios</a>
            <button onClick={handleOpenModal} className="inline-flex items-center gap-2.5 border-0 rounded-full py-3.5 px-5 font-bold cursor-pointer bg-gradient-to-r from-amor-brand to-amor-brand-2 text-[#0b0f1d] shadow-[0_10px_30px_rgba(124,92,255,.35)] hover:-translate-y-0.5 transition-transform duration-150 ease-in-out text-sm">
              Probar gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="py-16 md:py-24">
        <div className="w-full max-w-[1150px] mx-auto px-[4%] grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 py-1.5 px-3 mb-4 rounded-full text-sm border border-white/15 bg-[rgba(124,92,255,.14)]">Privado · Personalizado · 24/7</div>
            <h1 className="text-[clamp(2rem,4.5vw,3.4rem)] leading-tight font-extrabold my-2">Crea tu <span className="bg-gradient-to-r from-white via-[#c6d4ff] to-[#8acfff] bg-clip-text text-transparent">pareja virtual con IA</span> en 60 segundos</h1>
            <p className="text-[#cbd5e1] text-[clamp(1rem,1.5vw,1.15rem)] my-4">Diseña su apariencia y personalidad. Chatea sin límites, con voz realista y total privacidad. Empieza gratis y mejora a Premium cuando quieras.</p>
            <div className="flex gap-3 flex-wrap mt-5">
              <button onClick={handleOpenModal} className="inline-flex items-center gap-2.5 border-0 rounded-full py-3.5 px-5 font-bold cursor-pointer bg-gradient-to-r from-amor-brand to-amor-brand-2 text-[#0b0f1d] shadow-[0_10px_30px_rgba(124,92,255,.35)] hover:-translate-y-0.5 transition-transform duration-150 ease-in-out">Crear mi bot</button>
              <a className="inline-flex items-center gap-2.5 border border-white/15 rounded-full py-3.5 px-5 font-bold cursor-pointer bg-transparent text-amor-text" href="#como-funciona">¿Cómo funciona?</a>
            </div>
            <div className="flex items-center gap-3 mt-5 text-amor-muted text-sm">
              <span>⚡ Respuestas instantáneas</span>
              <span>🔒 Cifrado en tránsito</span>
              <span>🙈 Anónimo por defecto</span>
            </div>
          </div>
          <div>
            <div className="w-full max-w-[380px] mx-auto bg-white/10 border border-white/10 p-3.5 rounded-[36px] shadow-custom relative">
              <div className="h-8 w-[46%] bg-black/50 rounded-full mx-auto mb-3"></div>
              <div ref={chatContainerRef} className="bg-[rgba(8,13,27,.8)] border border-white/10 rounded-2xl p-3 h-[480px] overflow-auto">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`max-w-[80%] py-3 px-4 rounded-2xl my-2.5 text-sm ${msg.from === 'ai' ? 'bg-[rgba(124,92,255,.18)] border border-[rgba(124,92,255,.35)]' : 'bg-white/5 border border-white/10 ml-auto'}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* FEATURES */}
        <section className="py-14" id="como-funciona">
          <div className="w-full max-w-[1150px] mx-auto px-[4%]">
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] m-0 mb-3.5">Hecho para sentirte <span className="bg-gradient-to-r from-white via-[#c6d4ff] to-[#8acfff] bg-clip-text text-transparent">acompañado</span></h2>
            <p className="text-[#cbd5e1] m-0 mb-6">Personaliza tu bot, conversa por texto y voz, y mantén tu privacidad bajo control.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-gradient-to-b from-white/5 to-white/5 border border-white/10 rounded-xl p-6 shadow-custom">
                <h3 className="m-0 mb-1.5 text-lg font-semibold">🎭 Personalidad a tu medida</h3>
                <p className="text-amor-muted text-sm">Define tono, límites, gustos y estilo de conversación. Guarda múltiples perfiles.</p>
              </div>
              <div className="bg-gradient-to-b from-white/5 to-white/5 border border-white/10 rounded-xl p-6 shadow-custom">
                <h3 className="m-0 mb-1.5 text-lg font-semibold">🗣️ Voz realista</h3>
                <p className="text-amor-muted text-sm">Activa el modo voz para escuchar respuestas naturales (función Premium).</p>
              </div>
              <div className="bg-gradient-to-b from-white/5 to-white/5 border border-white/10 rounded-xl p-6 shadow-custom">
                <h3 className="m-0 mb-1.5 text-lg font-semibold">🛡️ Privacidad primero</h3>
                <p className="text-amor-muted text-sm">Sesiones anónimas, sin datos reales. Control para borrar historial en 1 clic.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-14" id="precios">
          <div className="w-full max-w-[1150px] mx-auto px-[4%]">
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] m-0 mb-4">Precios simples</h2>
            <p className="text-[#cbd5e1] m-0 mb-6">Empieza gratis. Mejora cuando quieras para más mensajes y voz.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-b from-white/5 to-white/5 border border-white/10 rounded-xl p-6 shadow-custom relative">
                <div className="absolute top-3.5 right-3.5 bg-gradient-to-r from-amor-brand to-amor-brand-2 text-[#071226] font-extrabold py-1 px-2.5 rounded-full text-[0.7rem]">Gratis</div>
                <h3 className="text-xl font-bold">Básico</h3>
                <div className="text-4xl font-extrabold my-2">$0</div>
                <ul className="m-0 p-0 list-none grid gap-2.5 my-4 text-sm">
                  <li className="flex gap-2.5 items-start"><CheckIcon /> 30 mensajes/día</li>
                  <li className="flex gap-2.5 items-start"><CheckIcon /> 1 bot personal</li>
                  <li className="flex gap-2.5 items-start"><CheckIcon /> Borrado de historial</li>
                </ul>
                <div className="mt-4">
                  <button onClick={handleOpenModal} className="w-full justify-center inline-flex items-center gap-2.5 border border-white/15 rounded-full py-3.5 px-5 font-bold cursor-pointer bg-transparent text-amor-text">Probar ahora</button>
                </div>
              </div>
              <div className="bg-gradient-to-b from-white/5 to-white/5 border-2 border-amor-brand rounded-xl p-6 shadow-custom relative">
                <div className="absolute top-3.5 right-3.5 bg-gradient-to-r from-amor-brand to-amor-brand-2 text-[#071226] font-extrabold py-1 px-2.5 rounded-full text-[0.7rem]">Más popular</div>
                <h3 className="text-xl font-bold">Premium</h3>
                <div className="text-4xl font-extrabold my-2">$9.99 <span className="text-base text-amor-muted font-semibold">/mes</span></div>
                <ul className="m-0 p-0 list-none grid gap-2.5 my-4 text-sm">
                  <li className="flex gap-2.5 items-start"><CheckIcon /> Mensajes ilimitados</li>
                  <li className="flex gap-2.5 items-start"><CheckIcon /> 5 bots personales</li>
                  <li className="flex gap-2.5 items-start"><CheckIcon /> Respuestas más largas</li>
                  <li className="flex gap-2.5 items-start"><CheckIcon /> Voz realista</li>
                  <li className="flex gap-2.5 items-start"><CheckIcon /> Prioridad de soporte</li>
                </ul>
                <div className="mt-4">
                  <button onClick={() => alert('Redirigiendo a pasarela de pago...')} className="w-full justify-center inline-flex items-center gap-2.5 border-0 rounded-full py-3.5 px-5 font-bold cursor-pointer bg-gradient-to-r from-amor-brand to-amor-brand-2 text-[#0b0f1d] shadow-[0_10px_30px_rgba(124,92,255,.35)] hover:-translate-y-0.5 transition-transform duration-150 ease-in-out">Elegir Premium</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14">
          <div className="w-full max-w-[900px] mx-auto px-[4%]">
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] m-0 mb-4 text-center">Preguntas frecuentes</h2>
            <div className="grid gap-2.5">
              <details className="border border-white/10 bg-white/5 rounded-xl overflow-hidden" open>
                <summary className="cursor-pointer p-4 font-semibold list-none">¿Es privado y anónimo?</summary>
                <p className="p-4 pt-0 text-[#cdd6e4] text-sm">Sí. No necesitas nombre real. Todo viaja cifrado y puedes borrar el historial cuando quieras.</p>
              </details>
              <details className="border border-white/10 bg-white/5 rounded-xl overflow-hidden">
                <summary className="cursor-pointer p-4 font-semibold list-none">¿Hay límites en el plan gratis?</summary>
                <p className="p-4 pt-0 text-[#cdd6e4] text-sm">El plan gratis permite 30 mensajes por día con 1 bot. Premium desbloquea mensajes ilimitados y voz.</p>
              </details>
               <details className="border border-white/10 bg-white/5 rounded-xl overflow-hidden">
                <summary className="cursor-pointer p-4 font-semibold list-none">¿Puedo personalizar la personalidad del bot?</summary>
                <p className="p-4 pt-0 text-[#cdd6e4] text-sm">Claro. Elige tono, gustos, límites y estilo de conversación. Puedes guardar varios perfiles en Premium.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 text-amor-muted py-9 text-sm">
        <div className="w-full max-w-[1150px] mx-auto px-[4%] flex justify-between gap-4 flex-wrap">
          <div>© {year} AmorIA — Todos los derechos reservados</div>
          <div className="flex gap-4">
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            <a href="#">Contacto</a>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <dialog ref={modalRef} className="p-0 bg-transparent backdrop:bg-black/50">
        <div className="w-full max-w-[560px] bg-amor-card border border-white/10 rounded-2xl shadow-custom overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-white/10">
            <strong>Crea tu bot en 60 segundos</strong>
            <button onClick={handleCloseModal} className="inline-flex items-center gap-2.5 border border-white/15 rounded-full py-2 px-4 text-sm font-bold cursor-pointer bg-transparent text-amor-text">Cerrar</button>
          </div>
          <div className="p-5 grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span>Nombre del bot</span>
              <input id="botName" placeholder="Ej: Luna" className="bg-white/5 border border-white/20 text-amor-text p-3 rounded-xl" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span>Estilo</span>
              <select id="style" className="bg-white/5 border border-white/20 text-amor-text p-3 rounded-xl appearance-none">
                <option>Romántico</option><option>Atrevido</option><option>Gamer</option><option>Tierna</option><option>Dominante</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm">
              <span>Email (para guardar tu progreso)</span>
              <input id="email" type="email" placeholder="tu@email.com" className="bg-white/5 border border-white/20 text-amor-text p-3 rounded-xl" />
            </label>
            <button onClick={handleStartChat} className="justify-center mt-2 inline-flex items-center gap-2.5 border-0 rounded-full py-3.5 px-5 font-bold cursor-pointer bg-gradient-to-r from-amor-brand to-amor-brand-2 text-[#0b0f1d] shadow-[0_10px_30px_rgba(124,92,255,.35)] hover:-translate-y-0.5 transition-transform duration-150 ease-in-out">Crear y empezar gratis</button>
            <p className="text-amor-muted text-xs mt-1.5">Al continuar aceptas nuestros Términos y Política de Privacidad. Contenido sólo para mayores de 18 años.</p>
          </div>
        </div>
      </dialog>
    </div>
  );
}