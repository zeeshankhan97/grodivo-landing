import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE, useCalm } from "./motion";
import logo from "../assets/photos/logo.webp";

const LINKS: { label: string; menu?: string[] }[] = [
  { label: "Our Platform" },
  {
    label: "Mapping Alignment",
    menu: ["Map Your Gap™", "TAP Assessments", "Alignment Reports"],
  },
  {
    label: "Solutions",
    menu: ["M&A Diligence", "Post-Merger Integration", "Team Alignment"],
  },
  { label: "About", menu: ["Company", "Grodivo Labs", "Contact"] },
];

function Logo() {
  return (
    <a href="#" className="flex items-center" aria-label="Grodivo">
      <img src={logo} alt="Grodivo" className="h-8 w-auto" />
    </a>
  );
}

export function Nav() {
  const calm = useCalm();
  return (
    <motion.header
      initial={calm ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative z-20"
    >
      <div className="mx-auto flex h-[84px] max-w-[1640px] items-center justify-between px-6 lg:px-10">
        <Logo />

        <div className="flex items-center gap-10">
          <nav className="hidden items-center gap-9 lg:flex">
            {LINKS.map(({ label, menu }) => (
              <div key={label} className="group relative">
                <a
                  href="#"
                  className="flex items-center gap-1.5 py-3 text-[15px] font-normal text-[#d9e2f7] transition-colors duration-200 hover:text-white"
                >
                  {label}
                  {menu && (
                    <ChevronDown
                      size={15}
                      strokeWidth={2}
                      className="mt-0.5 transition-transform duration-200 group-hover:rotate-180"
                    />
                  )}
                </a>
                {menu && (
                  <div className="invisible absolute left-1/2 top-full z-30 -translate-x-1/2 translate-y-1 pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="min-w-[230px] rounded-xl bg-white p-2 shadow-[0_18px_48px_rgba(0,13,51,0.35)]">
                      {menu.map((item) => (
                        <a
                          key={item}
                          href="#"
                          className="block rounded-lg px-3.5 py-2.5 text-[14px] font-medium text-[#0b2b66] transition-colors duration-150 hover:bg-[#eef4ff]"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <motion.a
            href="#"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-[10px] bg-[#d6f462] px-6 py-2.5 text-[15px] font-semibold text-[#111]"
          >
            Request a Demo
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
