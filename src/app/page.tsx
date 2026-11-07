import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Doors } from "@/components/sections/doors";
import { TimeMachine } from "@/components/sections/time-machine";
import { Credentials } from "@/components/sections/credentials";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { ScrollMarquee } from "@/components/ui/marquee";

const numbers = ["143 IoT sensors", "100,000 rows", "10K+ transactions", "R² 0.991", "136 outages caught", "5-min resolution"];
const tools = ["Python", "SQL", "LightGBM", "XGBoost", "Power BI", "Tableau", "AWS", "Pandas", "ARIMA"];

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <ScrollMarquee items={numbers} />
        <Doors />
        <TimeMachine />
        <Credentials />
        <Skills />
        <ScrollMarquee items={tools} reverse speed={1.8} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
