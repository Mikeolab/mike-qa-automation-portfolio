class TransitionAnimator {
  constructor(selector, interval = 3000) {
    this.transitionDivs = document.querySelectorAll(selector);
    this.interval = interval;
    this.init();
  }

  init() {
    this.applyInitialTransforms();
    this.addTransitionEndListeners();
    this.startInfiniteTransitions();
  }

  getRandomTransform() {
    const directionX = Math.random() < 0.5 ? 1 : -1;
    const translateX = directionX * (Math.random() * 50 + 150);

    const directionY = Math.random() < 0.5 ? 1 : -1;
    const translateY = directionY * (Math.random() * 50 + 150);

    return `translate(${translateX}px, ${translateY}px)`;
  }

  applyInitialTransforms() {
    this.transitionDivs.forEach(div => div.style.transform = this.getRandomTransform());
  }

  handleTransitionEnd(event) {
    const target = event.target;
    target.style.transform = this.getRandomTransform();
  }

  addTransitionEndListeners() {
    this.transitionDivs.forEach(div => {
      div.addEventListener("transitionend", this.handleTransitionEnd.bind(this));
    });
  }

  startInfiniteTransitions() {
    setInterval(() => {
      this.transitionDivs.forEach(div => div.style.transform = this.getRandomTransform());
    }, this.interval);
  }
}

class GSAPAnimator {
  constructor() {
    gsap.registerPlugin(MotionPathPlugin);
    this.init();
  }

  init() {
    this.animateClockRotation();
    this.animateAnticlockRotation();
  }

  animateClockRotation() {
    gsap.to(".animation-clock-rotation", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "linear",
    });
  }

  animateAnticlockRotation() {
    gsap.to(".animation-anticlock-rotation", {
      rotation: -360,
      duration: 15,
      repeat: -1,
      ease: "linear",
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TransitionAnimator(".js-transition-element");
  new GSAPAnimator();
});