import { version } from "../../../package.json";

export function AppFooter() {
  return (
    <footer className="px-5 py-8 text-center text-xs text-[var(--ink-faint)]">
      <p className="flex items-center justify-center gap-1">
        <span>&copy; {new Date().getFullYear()}</span>
        <a
          href="https://github.com/Fadhilamadan/nutrio"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-[var(--ink-muted)]"
        >
          Nutrio
        </a>
        <span aria-hidden="true">&middot;</span>v{version}
        <span aria-hidden="true">&middot;</span>
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-[var(--ink-muted)]"
        >
          CC BY-NC-SA 4.0
        </a>
      </p>
    </footer>
  );
}
