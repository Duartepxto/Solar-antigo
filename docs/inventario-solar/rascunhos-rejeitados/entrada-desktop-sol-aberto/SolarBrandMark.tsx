/** Solar's sun and open orbit. Product identity; agent avatars stay separate. */
export function SolarBrandMark({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="32" cy="32" r="8" />
      <path d="M32 17v3M32 44v3M17 32h3M44 32h3M21.4 21.4l2.1 2.1M40.5 40.5l2.1 2.1M21.4 42.6l2.1-2.1M40.5 23.5l2.1-2.1" />
      <path d="M15.03 48.97a24 24 0 0 1 33.94-33.94M55.18 38.21A24 24 0 0 1 32 56" />
    </g>
    <circle cx="48.97" cy="15.03" r="3.5" fill="currentColor" />
    <circle cx="15.03" cy="48.97" r="2.5" fill="currentColor" />
  </svg>;
}
