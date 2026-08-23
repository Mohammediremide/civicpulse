import { useEffect, useState } from "react";

// Small shared hook: true once the page has scrolled past `threshold`.
// Used to switch the public navbar into its compact/blurred state.
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}
