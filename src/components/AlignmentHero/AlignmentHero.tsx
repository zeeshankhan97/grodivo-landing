import { useLayoutEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  Linkedin,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import "./alignment-hero.css";
import avatar1 from "../../assets/photos/img-1.png";
import avatar2 from "../../assets/photos/img-2.png";
import avatar3 from "../../assets/photos/img-3.png";
import avatar4 from "../../assets/photos/img-4.png";
import avatar5 from "../../assets/photos/img-5.png";
import avatar6 from "../../assets/photos/img-6.png";

/**
 * AlignmentHero — the animated "TAP Alignment" hero artwork, built to the
 * reference spec: two source carousels feed an AI core over dashed flow lines,
 * resolving into an insight deck, cycling stat cards, typing TAP Insights and
 * cycling money cards. GSAP drives every loop (and the global hover-freeze);
 * Framer Motion drives the one-shot entrances. Colors are navy-adapted tokens.
 */

/* ---- content ------------------------------------------------------------- */

const INTERNAL = [
  { label: "TAP assessments", Icon: ClipboardCheck },
  { label: "Strategy docs", Icon: FileText },
  { label: "Slack channels", Icon: MessageCircle },
  { label: "Culture docs", Icon: Users },
];

const EXTERNAL = [
  { label: "Analyst reports", Icon: BarChart3 },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Competitors", Icon: Target },
  { label: "Market data", Icon: TrendingUp },
];

const TEAM_STATES: [string, string][] = [
  ["Design", "At Risk"],
  ["Development", "Aligned"],
  ["Marketing", "At Risk"],
  ["Finance", "Aligned"],
];

const LEVEL_STATES: [string, string][] = [
  ["Developer's", "Action Required"],
  ["C-Suite", "Action Required"],
  ["Manager's", "Aligned this week"],
  ["VP's", "Action Required"],
];

const INDIV_STATES: [number, string][] = [
  [4, "TAP profiles active"],
  [3, "Perception gap flagged"],
  [5, "TAP profiles active"],
  [2, "Perception gap flagged"],
];

const AVATARS: string[] = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
];

const INSIGHT_SETS: string[][] = [
  [
    "Dept A ↔ Dept B: strategy-execution gap widening",
    "Alignment tax: $310k / quarter if unmanaged",
    "Map Your Gap™: align roadmap owners now",
  ],
  [
    "Platform team: execution readiness strong",
    "Revenue-per-employee up 12% this quarter",
    "Standardize excellence across pods",
  ],
  [
    "C-Suite alignment trending up",
    "Trust index up 8% after culture reset",
    "Extend the TAP playbook to Dept C",
  ],
];

type MoneyState = [string, "loss" | "gain", string];
const MONEY_STATES: MoneyState[][] = [
  [
    ["-$1.2M", "loss", "Alignment tax on margins"],
    ["-$310k", "loss", "Quarterly friction cost"],
    ["$480k", "gain", "Value captured by aligning"],
  ],
  [
    ["$480k", "gain", "Value captured by aligning"],
    ["+12%", "gain", "Revenue-per-employee lift"],
    ["92", "gain", "Composite alignment score"],
  ],
  [
    ["-$310k", "loss", "Tax avoided if you act now"],
    ["91%", "gain", "Assessment participation"],
    ["+8%", "gain", "Trust index rising"],
  ],
];

/* ---- helpers ------------------------------------------------------------- */

/* Static when the user asked for reduced motion, or `?static` is in the URL
   (this repo's screenshot convention). SSR-safe. */
const isCalm = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(window.location.search).has("static"));

function CoreGlyph() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <g
        stroke="var(--hero-card)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M6 1L2 7L6 13" />
        <path d="M14 1L18 7L14 13" />
      </g>
      <rect
        x="7.2"
        y="4.2"
        width="5.6"
        height="5.6"
        rx="1.4"
        transform="rotate(45 10 7)"
        fill="var(--hero-card)"
      />
    </svg>
  );
}

/* ---- component ----------------------------------------------------------- */

export function AlignmentHero({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const calm = useMemo(isCalm, []);

  useLayoutEffect(() => {
    const host = root.current;
    if (!host || calm) return;

    let paused = false;
    const intervals: number[] = [];
    const timeouts: number[] = [];
    let insightTl: gsap.core.Timeline | null = null;

    const onEnter = () => {
      paused = true;
      gsap.globalTimeline.pause();
    };
    const onLeave = () => {
      paused = false;
      gsap.globalTimeline.resume();
    };
    host.addEventListener("mouseenter", onEnter);
    host.addEventListener("mouseleave", onLeave);

    const ctx = gsap.context(() => {
      /* 1 — source carousels. The track is animated up one card-step, then the
         first card is appended to the end and the offset reset — an infinite
         belt. React never re-renders these lists, so owning their DOM order
         here is safe. */
      const setupCarousel = (selector: string, startDelay: number) => {
        const track = host.querySelector<HTMLElement>(selector);
        if (!track) return;
        const mark = () =>
          Array.from(track.children).forEach((c, i) =>
            c.classList.toggle("ah-active", i === 1),
          );
        mark();
        const tick = () => {
          if (paused) return;
          gsap.to(track, {
            y: -58,
            duration: 0.55,
            ease: "power2.inOut",
            onComplete: () => {
              track.appendChild(track.firstElementChild as Element);
              gsap.set(track, { y: 0 });
              mark();
              gsap.fromTo(
                track.children[1],
                { scale: 0.95, opacity: 0.28 },
                { scale: 1, opacity: 1, duration: 0.4 },
              );
            },
          });
        };
        timeouts.push(
          window.setTimeout(() => {
            intervals.push(window.setInterval(tick, 2600));
            tick();
          }, startDelay),
        );
      };
      setupCarousel(".ah-track--internal", 0);
      setupCarousel(".ah-track--external", 1300);

      /* 2 — AI core: outer pulse, slow dial spin, radar ping, breathing
         glyph — plus the dotted connectors marching toward the core. */
      gsap.to(".ah-core-wrap", {
        scale: 1.08,
        duration: 1.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        transformOrigin: "center",
      });
      gsap.to(".ah-core-dial", {
        rotation: 360,
        duration: 24,
        repeat: -1,
        ease: "none",
        transformOrigin: "center",
      });
      gsap.fromTo(
        ".ah-core-ping",
        { scale: 0.55, opacity: 0.7 },
        {
          scale: 1.25,
          opacity: 0,
          duration: 2,
          repeat: -1,
          ease: "power1.out",
        },
      );
      gsap.to(".ah-core-orb svg", {
        scale: 1.14,
        duration: 1.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        transformOrigin: "center",
      });
      /* dot pattern period is 9px (0.1 dot + 8.9 gap) — offset by a whole
         number of periods per loop so the march never skips. */
      gsap.to(".ah-line", {
        strokeDashoffset: -36,
        duration: 2.6,
        repeat: -1,
        ease: "none",
      });

      /* 3 — insight card deck */
      const w1 = host.querySelector<HTMLElement>(".ah-w1");
      const w2 = host.querySelector<HTMLElement>(".ah-w2");
      if (w1 && w2) {
        const cards = [w1, w2];
        gsap.set(w1, { y: 0, scale: 1, opacity: 1, zIndex: 2 });
        gsap.set(w2, { y: -12, scale: 0.94, opacity: 0.3, zIndex: 1 });
        let front = 0;
        intervals.push(
          window.setInterval(() => {
            if (paused) return;
            const f = cards[front];
            const b = cards[1 - front];
            gsap.to(f, {
              x: 70,
              opacity: 0,
              rotate: 3,
              duration: 0.55,
              ease: "power2.in",
              onComplete: () => {
                gsap.set(f, { zIndex: 1, rotate: 0, x: 0 });
                gsap.fromTo(
                  f,
                  { y: -24, scale: 0.9, opacity: 0 },
                  {
                    y: -12,
                    scale: 0.94,
                    opacity: 0.3,
                    duration: 0.45,
                    ease: "power2.out",
                  },
                );
              },
            });
            gsap.to(b, {
              y: 0,
              scale: 1,
              opacity: 1,
              zIndex: 2,
              duration: 0.6,
              delay: 0.3,
              ease: "power2.out",
            });
            front = 1 - front;
          }, 4600),
        );
      }

      /* shared fade-swap for stat + money text */
      const swapText = (el: Element | null, next: () => void) => {
        if (!el) return;
        gsap.to(el, {
          opacity: 0,
          y: -6,
          duration: 0.25,
          onComplete: () => {
            next();
            gsap.fromTo(
              el,
              { opacity: 0, y: 6 },
              { opacity: 1, y: 0, duration: 0.3 },
            );
          },
        });
      };

      /* 4 — stat cards + avatar rotation */
      const statEls = {
        teamV: host.querySelector(".ah-stat--team .ah-stat-v"),
        teamC: host.querySelector(".ah-stat--team .ah-stat-c"),
        levelV: host.querySelector(".ah-stat--level .ah-stat-v"),
        levelC: host.querySelector(".ah-stat--level .ah-stat-c"),
        indivV: host.querySelector(".ah-stat--indiv .ah-stat-v"),
        indivC: host.querySelector(".ah-stat--indiv .ah-stat-c"),
        avatars: host.querySelector<HTMLElement>(".ah-avatars"),
      };
      let si = 0;
      let avStart = 0;
      intervals.push(
        window.setInterval(() => {
          if (paused) return;
          si = (si + 1) % 4;
          swapText(statEls.teamV, () => {
            statEls.teamV!.textContent = TEAM_STATES[si][0];
          });
          swapText(statEls.teamC, () => {
            statEls.teamC!.textContent = TEAM_STATES[si][1];
          });
          swapText(statEls.levelV, () => {
            statEls.levelV!.textContent = LEVEL_STATES[si][0];
          });
          swapText(statEls.levelC, () => {
            statEls.levelC!.textContent = LEVEL_STATES[si][1];
          });
          swapText(statEls.indivV, () => {
            statEls.indivV!.textContent = String(INDIV_STATES[si][0]);
          });
          swapText(statEls.indivC, () => {
            statEls.indivC!.textContent = INDIV_STATES[si][1];
          });
          const row = statEls.avatars;
          if (row) {
            gsap.to(row, {
              opacity: 0,
              x: -8,
              duration: 0.25,
              onComplete: () => {
                avStart = (avStart + 1) % AVATARS.length;
                Array.from(row.children).forEach((c, i) => {
                  (c as HTMLImageElement).src =
                    AVATARS[(avStart + i) % AVATARS.length];
                });
                gsap.fromTo(
                  row,
                  { opacity: 0, x: 8 },
                  { opacity: 1, x: 0, duration: 0.3 },
                );
              },
            });
          }
        }, 3600),
      );

      /* 5 — TAP Insights typewriter. One flowing paragraph per set (not
         separate lines); recursive timelines registered with the context so
         cleanup kills whichever is live. */
      const insight = host.querySelector<HTMLElement>(".ah-type");
      let setIdx = 0;
      const typeSet = () => {
        if (!insight) return;
        const tl = gsap.timeline({
          onComplete: () => {
            setIdx = (setIdx + 1) % INSIGHT_SETS.length;
            ctx.add(typeSet);
          },
        });
        insightTl = tl;
        const full = INSIGHT_SETS[setIdx].join(". ") + ".";
        const state = { n: 0 };
        tl.add(() => {
          insight.textContent = "";
          insight.classList.add("ah-typing");
        });
        tl.to(state, {
          n: full.length,
          duration: full.length * 0.024,
          ease: "none",
          onUpdate: () => {
            insight.textContent = full.slice(0, Math.round(state.n));
          },
        });
        tl.to({}, { duration: 3.2 });
      };
      typeSet();

      /* 6 — money cards cycle */
      const moneyEls = Array.from(host.querySelectorAll(".ah-money"));
      let mi = 0;
      intervals.push(
        window.setInterval(() => {
          if (paused) return;
          mi = (mi + 1) % MONEY_STATES.length;
          moneyEls.forEach((card, c) => {
            const [value, kind, caption] = MONEY_STATES[mi][c];
            const v = card.querySelector(".ah-money-v");
            const cap = card.querySelector(".ah-money-c");
            swapText(v, () => {
              v!.textContent = value;
              v!.classList.toggle("ah-loss", kind === "loss");
              v!.classList.toggle("ah-gain", kind === "gain");
            });
            swapText(cap, () => {
              cap!.textContent = caption;
            });
          });
        }, 4800),
      );
    }, host);

    return () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
      insightTl?.kill();
      ctx.revert();
      gsap.globalTimeline.resume();
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
    };
  }, [calm]);

  const rise = (delay: number) => ({
    initial: calm ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <motion.div
      ref={root}
      {...rise(0.35)}
      className={`ah-canvas ${className}`}
    >
      {/* ---- Column 1: data sources ---- */}
      <motion.div {...rise(0.5)}>
        <p className="ah-label">Internal signals</p>
        <div className="ah-viewport">
          <div className="ah-track ah-track--internal">
            {INTERNAL.map(({ label, Icon }, i) => (
              <div
                key={label}
                className={`ah-source${i === 1 ? " ah-active" : ""}`}
              >
                <Icon size={18} strokeWidth={1.9} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="ah-label">External signals</p>
        <div className="ah-viewport">
          <div className="ah-track ah-track--external">
            {EXTERNAL.map(({ label, Icon }, i) => (
              <div
                key={label}
                className={`ah-source${i === 1 ? " ah-active" : ""}`}
              >
                <Icon size={18} strokeWidth={1.9} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ---- Column 2: connector + AI core ---- */}
      <motion.div {...rise(0.7)} className="ah-conn" aria-hidden="true">
        <svg width="70" height="480" fill="none">
          {/* Feeds route through the empty channel only — out of the gutter,
              one smooth bend, then straight down/up into the icon's top and
              bottom faces, so they never cross card text. */}
          <path
            className="ah-line"
            d="M-16 130C18 130 35 152 35 186L35 211"
          />
          <path
            className="ah-line"
            d="M-16 350C18 350 35 328 35 294L35 269"
          />
          {/* Long tail out of the app icon toward the read on the right. */}
          <path className="ah-line" d="M64 240H210" />
        </svg>
        <div className="ah-core-wrap" id="aicore-wrap">
          <div className="ah-core-face">
            {/* Dial per the reference icon: two soft concentric rings and a
                dense radial tick ring around the orb. */}
            <svg className="ah-core-dial" viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="22"
                stroke="var(--hero-core-ring)"
                strokeWidth="1"
              />
              <circle
                cx="24"
                cy="24"
                r="15"
                stroke="var(--hero-core-ring)"
                strokeWidth="1"
                opacity="0.6"
              />
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="var(--hero-core-tickstrong)"
                strokeWidth="4"
                strokeDasharray="1 1.8"
              />
            </svg>
            <span className="ah-core-glass" />
            {/* radar ping expanding from the orb */}
            <span className="ah-core-ping" />
            <div className="ah-core-orb">
              <CoreGlyph />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- Column 3 ---- */}
      <div>
        {/* insight deck */}
        <motion.div {...rise(0.6)} className="ah-wstack">
          <div className="ah-wcard ah-w1">
            <div className="ah-wtop">
              <span className="ah-chip">82 Alignment Risk</span>
              <span className="ah-date">Wed, Jul 29</span>
            </div>
            <h3 className="ah-wtitle">Dept A ↔ Dept B</h3>
            <p className="ah-wsub">Strategy-execution gap</p>
            <div className="ah-winset">
              Invisible friction — $310k / quarter alignment tax
            </div>
          </div>
          <div className="ah-wcard ah-w2">
            <div className="ah-wtop">
              <span className="ah-chip ah-chip--green">92 Alignment Score</span>
              <span className="ah-date">Wed, Jul 29</span>
            </div>
            <h3 className="ah-wtitle">Platform Team</h3>
            <p className="ah-wsub">Execution readiness</p>
            <div className="ah-winset">
              Aligned to strategy — synergy captured sooner
            </div>
          </div>
        </motion.div>

        {/* stat row */}
        <motion.div {...rise(0.75)} className="ah-statrow">
          <div className="ah-stat ah-stat--team">
            <p className="ah-stat-h">Team</p>
            <p className="ah-stat-v">{TEAM_STATES[0][0]}</p>
            <p className="ah-stat-c">{TEAM_STATES[0][1]}</p>
          </div>
          <div className="ah-stat ah-stat--level">
            <p className="ah-stat-h">Level</p>
            <p className="ah-stat-v">{LEVEL_STATES[0][0]}</p>
            <p className="ah-stat-c">{LEVEL_STATES[0][1]}</p>
          </div>
          <div className="ah-stat ah-stat--indiv">
            <p className="ah-stat-h">Individual</p>
            <p className="ah-stat-v">{INDIV_STATES[0][0]}</p>
            <div className="ah-avatars">
              {AVATARS.slice(0, 4).map((src, i) => (
                <img key={i} className="ah-avatar" src={src} alt="" />
              ))}
            </div>
            <p className="ah-stat-c">{INDIV_STATES[0][1]}</p>
          </div>
        </motion.div>

        {/* TAP insights */}
        <motion.div {...rise(0.9)} className="ah-insights">
          <div className="ah-ins-h">
            <Sparkles size={18} />
            <span>TAP Insights</span>
          </div>
          {/* One flowing paragraph — each set types as continuous prose. */}
          <p className="ah-ins-line">
            <span className="ah-type">
              {INSIGHT_SETS[0].join(". ") + "."}
            </span>
          </p>
        </motion.div>

        {/* money cards */}
        <motion.div {...rise(1.05)} className="ah-moneyrow">
          {MONEY_STATES[0].map(([value, kind, caption]) => (
            <div key={caption} className="ah-money">
              <p className={`ah-money-v ah-${kind}`}>{value}</p>
              <p className="ah-money-c">{caption}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
