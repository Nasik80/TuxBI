export function Logo() {
  return (
    <div className="brand" aria-label="TuxBI home">
      <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M5 21.5 16 4l11 17.5-11 6-11-6Z"
          fill="currentColor"
          opacity="0.18"
        />
        <path
          d="m7.7 21 8.3-13.2L24.3 21 16 25.5 7.7 21Z"
          fill="currentColor"
        />
        <path
          d="m16 7.8 4.3 13.4-4.3 2.3-4.3-2.3L16 7.8Z"
          fill="var(--brand-highlight)"
        />
      </svg>
      <span className="brand__wordmark">TuxBI</span>
    </div>
  );
}
