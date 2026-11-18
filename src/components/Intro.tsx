import { Mark } from "./Logo";

/**
 * First-visit curtain: the sun of the mark rises behind the panels, its rays draw in,
 * the wordmark appears, then the curtain lifts. Pure CSS, so content never waits for JavaScript.
 * The inline script in the layout adds html.no-intro on repeat views and away from the home page.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-mark">
        <Mark size={132} className="intro-logo" id="in" />
        <span className="logo-word intro-word">
          MEGA<b>SOLAR</b>
        </span>
        <span className="intro-bar">
          <i />
        </span>
      </div>
    </div>
  );
}
