import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
