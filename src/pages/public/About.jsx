import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function About() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#3E2723]">
      <Navbar />
      
      {/* CHANGED: Removed 'items-center justify-center' and swapped py for pt (top) and pb (bottom) */}
      <section className="flex-grow pt-12 pb-24 md:pt-20 md:pb-32 px-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          
          {/* Header Block */}
          <div className="border-b-2 border-[#3E2723] pb-8 mb-4">
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-none mb-6">
              The Pitara Story
            </h1>
            <p className="text-2xl md:text-3xl font-serif italic text-[#3E2723]/80">
              Unbox Something Special.
            </p>
          </div>

          {/* Story Body */}
          <article className="flex flex-col gap-8 text-lg md:text-xl font-sans text-[#3E2723]/85 leading-relaxed font-light">
            <p>
              Pitara was born out of a simple observation: modern shopping had lost its soul. Mass-produced items in generic packaging had replaced the deeply personal, artisanal touch that makes discovering a new product truly memorable.
            </p>
            
            <p>
              We set out to build a sanctuary for the thoughtful. A place where every item—whether it is a hand-poured scented candle, an elegant piece of jewelry, intricately crafted crochet, or exclusive anime and superhero merchandise—is selected with uncompromising standards for quality and aesthetics.
            </p>
            
            <p>
              Our name, Pitara, translates to a <em className="font-serif italic font-medium">box of treasures</em>. And that is exactly what we strive to be. Whether you are treating yourself to something unique or choosing one of our bespoke gift hampers for a special occasion, we don't just sell products; we curate experiences.
            </p>
            
            <p className="font-medium text-[#3E2723]">
              From the moment you browse our catalog to the second the package is opened, we ensure the experience is nothing short of exceptional.
            </p>
          </article>
          
          {/* Action Button */}
          <div className="pt-8">
            <a 
              href="/#browse" 
              className="inline-block border border-[#3E2723] text-[#3E2723] px-10 py-4 uppercase tracking-[0.2em] text-sm font-medium hover:bg-[#3E2723] hover:text-[#FAF8F5] transition-colors"
            >
              Explore Our Treasures
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

export default About;