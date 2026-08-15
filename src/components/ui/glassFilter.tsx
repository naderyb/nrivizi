/**
 * The actual "physics" behind liquid glass: an SVG feDisplacementMap warps
 * whatever is behind a glass panel using a noise field, so the backdrop
 * genuinely refracts/bends through the surface instead of just blurring
 * flat. Referenced via `backdrop-filter: url(#liquid-distortion) ...`.
 * Rendered once, invisible, reused by every glass surface in the app.
 */
export default function GlassFilters() {
  return (
    <svg
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id="liquid-distortion"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
