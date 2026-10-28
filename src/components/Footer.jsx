import { Github, MessageCircle } from "lucide-react";
import { WA_LINK } from "./Navbar";

export default function Footer() {
  return (
    <footer className="border-t border-edge bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-mute sm:flex-row sm:items-center md:px-8">
        <p>
          © 2026 Tanyara. Seluruh nama, percakapan &amp; data bersifat fiktif
          (concept demo).
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-bright"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <span>
            dibuat oleh{" "}
            <a
              href="https://github.com/Atazyyy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-ink hover:text-accent"
            >
              <Github className="h-3.5 w-3.5" /> Agni Miftah Fauzi
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
