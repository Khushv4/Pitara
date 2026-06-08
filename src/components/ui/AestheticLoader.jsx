export default function AestheticLoader({ message = "Fetching a moment..." }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 font-sans overflow-hidden">
      
      {/* Aesthetic SVG Composition Wrapper */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        {/* Trendy Shape 1: Abstract curved line (The base) */}
        <svg className="absolute w-full h-full text-[#EAE3D5] animate-[drift_8s_linear_infinite]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 100C20 55.8172 55.8172 20 100 20C144.183 20 180 55.8172 180 100" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round"/>
        </svg>

        {/* Trendy Shape 2: Minimalist solid geometric blob (The core) */}
        <svg className="absolute w-20 h-20 text-[#3E2723]/10 animate-[morph_5s_ease-in-out_infinite_alternate]" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 50C90 72.0914 72.0914 90 50 90C27.9086 90 10 72.0914 10 50C10 27.9086 27.9086 10 50 10C72.0914 10 90 27.9086 90 50Z"/>
        </svg>

        {/* Trendy Shape 3: Sharp aesthetic sparkle (The accent) */}
        <svg className="absolute w-5 h-5 text-[#3E2723] opacity-70 animate-[sparkle_3s_ease-in-out_infinite] delay-150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Text designed to look like a fashion caption */}
      <div className="mt-8 text-center flex flex-col items-center gap-2">
        <p className="text-[9px] uppercase tracking-[0.5em] text-[#3E2723] font-bold">
          Pitara
        </p>
        <p className="font-serif italic text-lg text-[#3E2723]/90">
          {message}
        </p>
      </div>

      {/* Injecting the trendy animations via style tag */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes morph {
          0% { d: path('M90 50C90 72.0914 72.0914 90 50 90C27.9086 90 10 72.0914 10 50C10 27.9086 27.9086 10 50 10C72.0914 10 90 27.9086 90 50Z'); }
          100% { d: path('M85 30C95 50 85 80 50 85C15 90 5 60 15 30C25 0 75 10 85 30Z'); }
        }
        @keyframes drift {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) opacity(0.7); filter: blur(0px); }
          50% { transform: scale(1.3) opacity(1); filter: blur(1px); }
        }
      `}} />
    </div>
  );
}