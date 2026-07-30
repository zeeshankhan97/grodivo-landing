import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";
import { EASE, useCalm } from "./motion";

/**
 * "Trusted by" band under the hero: a single bordered table. The first cell
 * spans both rows and carries a "TRUSTED BY" chip over a headline stat; the
 * rest of the grid is pure-type wordmarks (no logo images) — each cell
 * approximates its brand's voice with weight, case and tracking only.
 */

const LOGOS: { name: string; node: React.ReactNode }[] = [
  {
    name: "Udacity",
    node: (
      <span className="text-center">
        <span className="block text-[18px] font-medium tracking-[0.3em] text-[#141414]">
          UDACITY
        </span>
        <span className="mt-1 block text-[10px] text-[#6a6a6a]">
          Part of <span className="font-bold">Accenture</span>
        </span>
      </span>
    ),
  },
  {
    name: "Nasdaq",
    node: (
      <span className="text-[22px] font-semibold tracking-[-0.02em] text-[#141414]">
        Nasdaq
      </span>
    ),
  },
  {
    name: "Dropbox",
    node: (
      <span className="text-[22px] font-bold tracking-[-0.01em] text-[#141414]">
        Dropbox
      </span>
    ),
  },
  {
    name: "Cision",
    node: (
      <span className="text-[20px] font-light tracking-[0.24em] text-[#141414]">
        CISION
      </span>
    ),
  },
  {
    name: "S&P Global",
    node: (
      <span className="border-t-[3px] border-[#141414] pt-1.5 text-[20px] font-bold tracking-[-0.02em] text-[#141414]">
        S&amp;P Global
      </span>
    ),
  },
  {
    name: "Nutanix",
    node: (
      <span className="text-[17px] font-bold tracking-[0.26em] text-[#141414]">
        NUTANIX
      </span>
    ),
  },
  {
    name: "Tines",
    node: (
      <span className="text-[22px] font-semibold text-[#141414]">tines</span>
    ),
  },
  {
    name: "Anthology",
    node: (
      <span className="text-[21px] font-extrabold text-[#141414]">
        Anthology<sup className="text-[11px]">✳</sup>
      </span>
    ),
  },
  {
    name: "Telia Cygate",
    node: (
      <span className="text-[19px] text-[#141414]">
        <span className="font-bold">Telia</span> Cygate
      </span>
    ),
  },
  {
    name: "Instacart",
    node: (
      <span className="text-[21px] font-bold tracking-[-0.02em] text-[#141414]">
        instacart
      </span>
    ),
  },
  {
    name: "TeamViewer",
    node: (
      <span className="text-[20px] font-bold tracking-[-0.01em] text-[#141414]">
        TeamViewer
      </span>
    ),
  },
  {
    name: "Discover",
    node: (
      <span className="text-[19px] font-semibold tracking-[-0.01em] text-[#141414]">
        DISCOVER
      </span>
    ),
  },
];

/* Count-up for the "$380M" headline stat — waits for the viewport. */
function StatTicker() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const calm = useCalm();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calm) {
      el.textContent = "$380M";
      return;
    }
    if (!inView) return;
    const c = animate(0, 380, {
      duration: 1.5,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = `$${Math.round(v)}M`;
      },
    });
    return () => c.stop();
  }, [inView, calm]);
  return <span ref={ref}>{calm ? "$380M" : "$0M"}</span>;
}

function StatCell() {
  const calm = useCalm();
  return (
    <div className="col-span-2 row-span-1 flex flex-col justify-between gap-8 bg-[#f5f5f3] p-6 sm:col-span-4 lg:col-span-1 lg:row-span-2 lg:p-7">
      <motion.span
        whileHover={calm ? undefined : { scale: 1.06 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1.5 text-[11px] font-medium tracking-[0.14em] text-[#444]"
      >
        TRUSTED BY
      </motion.span>
      <p className="text-[17px] font-medium leading-[1.4] text-[#1c1c1a]">
        <span className="text-[26px] font-bold tracking-[-0.01em] text-[#111]">
          <StatTicker />
        </span>{" "}
        in quantified client value generated across{" "}
        <span className="font-bold text-[#111]">140+</span> production AI
        deployments
      </p>
    </div>
  );
}

export function LogoCloud() {
  const calm = useCalm();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1640px] px-6 py-16 lg:px-10 lg:py-20">
        {/* single bordered table: gap-px over a hairline ground draws every
            rule — including around the row-spanning stat cell — in one pass */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#e7e7e5] bg-[#e7e7e5] sm:grid-cols-4 lg:grid-cols-7">
          <StatCell />
          {LOGOS.map(({ name, node }, i) => (
            <motion.div
              key={name}
              initial={calm ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: EASE, delay: (i % 6) * 0.06 }}
              className="flex h-[140px] items-center justify-center bg-white px-4 transition-colors duration-200 hover:bg-black/[0.05]"
              aria-label={name}
            >
              {node}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
