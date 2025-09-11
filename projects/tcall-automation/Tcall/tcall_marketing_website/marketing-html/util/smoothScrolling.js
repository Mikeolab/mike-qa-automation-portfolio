// Initialize Lenis smooth scrolling
document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    duration: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    ignoreElements: (el) => {
      return (
        el.hasAttribute("data-lenis-prevent") ||
        el.closest("[data-lenis-prevent]") !== null
      );
    },
  });

  // Integrate Lenis with GSAP
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});
