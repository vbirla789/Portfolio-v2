import SideNav from "./components/SideNav";
import TimelineWidget from "./components/TimelineWidget";
import WorkSection from "./components/WorkSection";
import Footer from "./components/Footer";
import { t, type } from "./theme";

export default function Home() {
  return (
    <>
      <SideNav />
      <main className="mx-auto w-full max-w-[800px] px-6 pb-32 pt-32">
        {/* dynamic timeline widget */}
        <div id="intro" className="scroll-mt-28">
          <TimelineWidget />
        </div>

        {/* hero */}
        <h1 className="mt-16 max-w-[820px]" style={t(type.headline)}>
          Vishal Birla is a Product Designer &amp; Framer Expert.
        </h1>

        {/* about */}
        <section id="about" className="mt-14 max-w-[640px] scroll-mt-28">
          <p className="mb-3 font-mono uppercase" style={t(type.aboutLabel)}>
            About
          </p>
          <p style={t(type.aboutBody)}>
            Vishal is a Product Designer at Ambitio, where he builds edtech and AI
            products used by thousands of learners. An engineer-turned-designer, he
            designs in Figma and prototypes in Framer.
          </p>
          <p className="mt-5" style={t(type.aboutBody)}>
            He loves building with AI and playing with code to bring ideas to life,
            and believes the best design is the kind you don&apos;t notice — you just
            get your thing done and move on.
          </p>
        </section>

        {/* work / experience / fun / resume */}
        <div className="mt-20">
          <WorkSection />
        </div>

        {/* footer */}
        <Footer />
      </main>
    </>
  );
}
