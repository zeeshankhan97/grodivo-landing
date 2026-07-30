import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { ArtCollage } from "./ArtCollage";
import { useEntranceGate } from "../hooks/useEntranceGate";

const AUDIENCES = ["Private equity", "M&A advisory", "Corporate development"];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const gate = useEntranceGate();
  return (
    <section className="relative overflow-hidden pb-beat pt-10 sm:pt-14">
      <div className="relative mx-auto max-w-page px-gutter">
        <div className="grid-hero-art">
          {/* ---- Copy column ---- */}
          <motion.div
            className="min-w-0"
            variants={stagger}
            initial={gate}
            animate="show"
          >
            <motion.a
              variants={rise}
              href="#top"
              className="trans-cta group inline-flex max-w-full items-center gap-2.5 rounded-pill border border-paper/25 py-1.5 pl-2 pr-3.5 hover:border-cyan-soft"
            >
              <span className="u-micro rounded-pill bg-paper px-2 py-1 text-navy">
                Forbes
              </span>
              <span className="u-micro text-frost">
                June 2026 — M&amp;A&rsquo;s biggest blind spots
              </span>
            </motion.a>

            <motion.h1
              variants={rise}
              className="u-display text-display mt-6 text-paper"
            >
              The deal closes.
              <br />
              <span className="text-frost-dim">The companies don&rsquo;t.</span>
            </motion.h1>

            {/* 20 words. The hard cap is 25. */}
            <motion.p
              variants={rise}
              className="text-lead measure-sub mt-6 text-frost"
            >
              Cultural misalignment extends post-merger integration{" "}
              <strong className="font-medium text-paper">
                6&ndash;12 months
              </strong>{" "}
              and costs tens of millions. The TAP Platform™ measures it before
              you sign.
            </motion.p>

            <motion.div
              variants={rise}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#top"
                className="trans-cta group inline-flex items-center gap-2.5 rounded-control bg-cyan px-6 py-3.5 text-ink-950 hover:bg-cyan-soft hover:shadow-lift"
              >
                <span className="u-display-sm text-h3">Map Your Gap™</span>
                <ArrowRight
                  className="size-4 transition-transform dur-hover group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </a>
              {/* Solid white secondary, per the reference layout. */}
              <a
                href="#top"
                className="trans-cta inline-flex items-center rounded-control bg-paper px-6 py-3.5 text-navy hover:bg-frost"
              >
                <span className="u-display-sm text-h3">Explore Platform</span>
              </a>
            </motion.div>

            <motion.ul
              variants={rise}
              className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-paper/15 pt-5"
            >
              {AUDIENCES.map((a, i) => (
                <li key={a} className="flex items-center gap-3">
                  <span className="u-micro text-frost-dim">{a}</span>
                  {i < AUDIENCES.length - 1 && (
                    <span aria-hidden className="size-1 bg-cyan-soft/60" />
                  )}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---- Artwork column: unframed collage on the page ground ---- */}
          <div className="min-w-0">
            <ArtCollage />
          </div>
        </div>
      </div>
    </section>
  );
}
