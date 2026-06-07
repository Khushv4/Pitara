function Hero() {
  return (
    
    <section className="relative pt-16 pb-24 md:pt-20 md:pb-32 px-6 flex flex-col items-center justify-center text-center border-b border-[#EAE3D5]">
      
      {/* The Tagline / Pre-heading */}
      <span className="font-serif italic text-xl md:text-2xl text-[#3E2723]/80 mb-6 block">
        Unbox Something Special.
      </span>
      
      {/* Main Impact Heading */}
      <h1 className="text-6xl md:text-8xl lg:text-[100px] font-sans font-black tracking-tighter text-[#3E2723] uppercase leading-[0.9] max-w-5xl mx-auto flex flex-col gap-2">
        <span>Curated Treasures.</span>
        <span className="opacity-80">Crafted Memories.</span>
      </h1>
      
      {/* Subtext */}
      <p className="mt-8 text-[#3E2723]/70 font-sans max-w-lg mx-auto text-sm md:text-base leading-relaxed font-light">
        Skip the mass-produced. Dive into a handpicked world of artisanal candles, elegant jewelry, exclusive pop-culture collectibles, and bespoke hampers designed for the thoughtful.
      </p>
      
      {/* Call to Action */}
      <div className="mt-14">
        <a 
          href="#browse" 
          className="inline-flex items-center justify-center bg-[#3E2723] text-[#FAF8F5] px-12 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#2C2C2C] transition-colors shadow-sm hover:shadow-md"
        >
          Explore The Collection
        </a>
      </div>
      
    </section>
  );
}

export default Hero;