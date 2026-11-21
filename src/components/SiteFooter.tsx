import Link from "next/link";
import { profile } from "@/data/profile";

/**
 * Sober architectural footer with direct career and contact links (hidden on print).
 */
export function SiteFooter() {
  return (
    <footer className="no-print border-t border-border bg-background">
      <div className="site-container flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="prose-measure space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {profile.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {profile.title}, {profile.location}
          </p>
          <p className="text-sm text-muted-foreground">{profile.availability}</p>
        </div>

        <nav aria-label="Links diretos" className="min-w-0">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <li>
              <Link
                href="/curriculo"
                className="inline-flex min-h-9 items-center text-muted-foreground underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
              >
                Currículo
              </Link>
            </li>
            <li>
              <a
                href="/curriculo.pdf"
                className="inline-flex min-h-9 items-center text-muted-foreground underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
              >
                Baixar PDF
              </a>
            </li>
            <li>
              <a
                href={profile.contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center text-muted-foreground underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={profile.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center text-muted-foreground underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={profile.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center text-muted-foreground underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.contact.email}`}
                className="inline-flex min-h-9 items-center text-muted-foreground underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
              >
                E-mail
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
