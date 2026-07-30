import { Nav } from "./Nav";
import { HeroCopy } from "./HeroCopy";
import { LogoCloud } from "./LogoCloud";
import { ValueSection } from "./ValueSection";
import { HeroDots } from "./HeroDots";
import { AlignmentHero } from "../components/AlignmentHero/AlignmentHero";
import "./qount.css";

export function QountLanding() {
  return (
    <div className="qount min-h-dvh overflow-x-clip">
      <Nav />
      <main>
        <section className="relative mx-auto max-w-[1640px] px-6 lg:px-10">
          {/* Halftone shimmer spans the whole hero. It renders here — before the
              grid, which is `relative` and later in the DOM — so it always paints
              BEHIND the copy and the right-side graphic, never over them. */}
          <HeroDots className="pointer-events-none absolute -inset-y-[4%] -left-[4%] -right-[4%] opacity-70" />
          <div className="relative grid min-h-[calc(100dvh-84px)] items-center gap-16 py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:py-8">
            <HeroCopy />
            <AlignmentHero />
          </div>
        </section>
        <LogoCloud />
        <ValueSection />
      </main>
    </div>
  );
}
