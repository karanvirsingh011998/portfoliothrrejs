import { BUILT_WITH, PROFILE } from "@/data/portfolio";

/**
 * Closing credit strip — stack used to build the world + authorship.
 */
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-accent/15 px-6 pb-14 pt-16 text-center">
      <p className="hud-label">BUILT WITH</p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-8">
        {BUILT_WITH.map((tech) => (
          <li
            key={tech}
            className="font-mono text-[11px] tracking-[0.28em] text-foreground/75 sm:text-xs"
          >
            {tech.toUpperCase()}
          </li>
        ))}
      </ul>

      <div className="hud-line mx-auto mt-10 w-24" />

      <p className="mt-8 text-[10px] tracking-[0.22em] text-muted sm:text-[11px]">
        Designed &amp; Developed by{" "}
        <span className="text-accent">{PROFILE.name}</span>
      </p>
      <p className="mt-3 text-[9px] tracking-[0.2em] text-muted/60">
        © {new Date().getFullYear()} {PROFILE.name.toUpperCase()}
      </p>
    </footer>
  );
}
