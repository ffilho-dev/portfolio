import Link from "next/link";
import { profile } from "@/data/profile";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/#cases", label: "Cases" },
  { href: "/#ia", label: "IA no fluxo" },
  { href: "/#projetos", label: "Projetos" },
  { href: "/#trajetoria", label: "Trajetória" },
  { href: "/curriculo", label: "Currículo" },
] as const;

/**
 * Architectural hairline header shared across all routes and hidden on print.
 */
export function SiteHeader() {
  return (
    <header className="no-print border-b border-[var(--rule)] bg-[var(--bg)]">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5">
        <Link
          href="/"
          translate="no"
          className="inline-flex min-h-9 items-center font-mono text-sm font-medium tracking-tight text-[var(--ink)] transition-[color] duration-150 hover:text-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
        >
          {profile.handle}
        </Link>

        <div className="flex w-full items-start justify-between gap-4 md:w-auto md:items-center md:gap-6">
          <nav aria-label="Principal" className="min-w-0">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-sm font-medium text-[var(--muted)] transition-[color] duration-150 hover:text-[var(--ink)] [@media(pointer:coarse)]:min-h-11"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
