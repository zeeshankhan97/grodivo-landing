import { QountLanding } from "./qount/QountLanding";

/**
 * Currently showing the Qount landing replica (src/qount/). The original
 * Grodivo hero build is preserved in src/components/ — restore it by
 * re-mounting <Nav /> + <Hero /> from there.
 */
export default function App() {
  return <QountLanding />;
}
