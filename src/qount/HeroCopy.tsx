import { Fragment } from "react";
import { motion } from "framer-motion";
import { EASE, useCalm } from "./motion";

/* Two-sentence antithesis. The first line is the reassuring surface; the
   second is the problem underneath — and is rendered a shade dimmer so the
   headline itself performs "the layer below", the part you can't see clearly. */
const LINES = [
  { text: "Your strategy is aligned.", color: "text-[#f6f8fd]" },
  { text: "The layer below it isn't.", color: "text-[#7f9bd6]" },
];

const HEADLINE = LINES.map((l) => l.text).join(" ");

const PARAGRAPH =
  "Grodivo measures how your teams actually work, then shows you exactly where execution breaks, what it costs, and how long it delays your deal.";

/**
 * Left half of the hero: word-by-word masked reveal on the headline, then the
 * paragraph and CTA cascade in behind it. The reveal delay runs continuously
 * across both lines, so the second sentence lands as the payoff.
 */
export function HeroCopy() {
  const reduce = useCalm();
  let word = 0;

  return (
    <div className="max-w-[700px]">
      <h1
        className="text-[clamp(2.2rem,3.1vw,3.25rem)] font-medium leading-[1.18] tracking-[-0.02em]"
        aria-label={HEADLINE}
      >
        {LINES.map((line, li) => (
          <span key={li} className={`block ${line.color}`}>
            {line.text.split(" ").map((w, wi) => {
              const delay = 0.12 + word * 0.04;
              word += 1;
              return (
                <Fragment key={`${li}-${wi}`}>
                  <span
                    aria-hidden="true"
                    className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top"
                  >
                    <motion.span
                      className="inline-block"
                      initial={reduce ? false : { y: "112%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.85, ease: EASE, delay }}
                    >
                      {w}
                    </motion.span>
                  </span>
                  {/* Space lives BETWEEN inline-blocks — a trailing space inside
                      one collapses at its line end and the words jam. */}
                  {" "}
                </Fragment>
              );
            })}
          </span>
        ))}
      </h1>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
        className="mt-8 max-w-[560px] text-[17px] leading-[1.7] text-[#a9bde8]"
      >
        {PARAGRAPH}
      </motion.p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
        className="mt-10 flex flex-wrap items-center gap-3.5"
      >
        <motion.a
          href="#"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-[10px] bg-[#d6f462] px-7 py-3.5 text-[15px] font-semibold text-[#111]"
        >
          Book a Demo
        </motion.a>
      </motion.div>
    </div>
  );
}
