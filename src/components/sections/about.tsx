import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";

/* Every figure here is a fact from the timeline below, not a claim. */
const facts = [
  { value: "29", unit: "months", label: "Running hotel and restaurant operations as Assistant Manager" },
  { value: "143", unit: "sensors", label: "Covered by the telemetry pipeline I built, now in production" },
  { value: "4", unit: "", label: "Internship, research and training placements across C-DAC, IITs and Annam.AI" },
  { value: "2", unit: "", label: "Institutions in one degree — IIT Ropar for data science, IIM Amritsar for management" },
];

export function About() {
  return (
    <Section id="about" tone="deep">
      <SectionHeading
        id="about"
        index="01"
        title="An engineer who has run the floor"
        lede="Computer science gave me the tools. Two and a half years in operations taught me what decisions actually depend on."
      />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
        <Reveal className="space-y-6 text-[1.0625rem] leading-[1.75] text-soft">
          <p>
            I studied Computer Science at Lovely Professional University, then spent 29 months as an
            Assistant Manager at A.R. Hotel &amp; Restaurant. Managing staff, guests and daily numbers
            showed me how much of a business runs on decisions made with incomplete information.
          </p>
          <p>
            That pulled me toward data. I&apos;m now doing an MS in Data Science &amp; Management, a joint
            programme of IIT Ropar and IIM Amritsar — machine learning and statistics on one side,
            strategy and management on the other.
          </p>
          <p>
            Along the way I&apos;ve trained at C-DAC Patna, interned at the Bharat Space Education Research
            Centre, done research at IIT Guwahati, and built a production telemetry reconstruction
            pipeline on AWS at Annam.AI, IIT Ropar.
          </p>
          <p className="text-fg">
            What I want to do is the part in between: take a real business problem, find the data that
            answers it, and make the answer clear enough to act on.
          </p>
        </Reveal>

        <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-3xl border border-line bg-line">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.06} className="bg-deep p-6 md:p-7">
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <span className="tabular block text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-fg md:text-5xl">
                  {f.value}
                  {f.unit && <span className="ml-1.5 text-base font-normal tracking-normal text-mute">{f.unit}</span>}
                </span>
                <span className="mt-4 block text-[13.5px] leading-snug text-soft">{f.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
