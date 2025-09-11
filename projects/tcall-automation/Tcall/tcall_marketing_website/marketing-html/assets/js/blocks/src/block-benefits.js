class AnimationManager {
  constructor() {
    this.gsap = gsap; // Assuming GSAP is globally available
    this.scrollTrigger = ScrollTrigger; // Assuming ScrollTrigger is globally available

    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.gsap.registerPlugin(this.scrollTrigger);
      
      this.animatedZoomElement = document.querySelector(".js-zoomed-vector");
      this.blockToShow = document.querySelector(".js-block-to-show");
      this.benefitsWrapper = document.querySelector(".js-benefits-wrapper");
      this.howItWorkBlock = document.querySelector(".js-howitworks-block");

      if (this.animatedZoomElement) {
        this.setupZoomAnimation();
        this.setupHowItWorksAnimation();
        this.setupFadeOutAnimation();
        this.setupBenefitsWrapperAnimation();
        this.setupBlockToShowAnimation();
      }
    });
  }

  logoToScale() {
    return (window.innerWidth / this.animatedZoomElement.getBBox().width) * 2;
  }

  setupZoomAnimation() {
    const zoomTimeline = this.gsap.timeline({
      scrollTrigger: {
        id: "ZOOM",
        trigger: this.animatedZoomElement,
        start: "top 60%",
        end: "top top",
        scrub: 1,
        markers: false,
      },
    });

    zoomTimeline.to(this.animatedZoomElement, {
      scale: () => this.logoToScale(),
      duration: 10,
      rotation: -189,
    });
  }

  setupHowItWorksAnimation() {
    this.gsap.to(this.howItWorkBlock, {
      scrollTrigger: {
        id: "HOW_IT_WORKS",
        trigger: this.howItWorkBlock,
        start: "top top",
        end: "top 80%",
        scrub: 1,
        markers: false,
      },
      opacity: 1,
      duration: 2,
    });
  }

  setupFadeOutAnimation() {
    const fadeOutTimeline = this.gsap.timeline({
      scrollTrigger: {
        id: "FADE_OUT",
        trigger: this.animatedZoomElement,
        start: "top top",
        end: "top top",
        scrub: 1,
        markers: false,
      },
    });

    fadeOutTimeline.to(this.animatedZoomElement, {
      opacity: 0,
      duration: 1,
    });
  }

  setupBenefitsWrapperAnimation() {
    this.scrollTrigger.create({
      id: "Stacked_Block_Wrapper",
      trigger: this.benefitsWrapper,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      markers: false,
      pin: false,
      pinSpacing: false,
      onEnter: () => this.benefitsWrapper.classList.add("js-bg-active"),
      onEnterBack: () => this.benefitsWrapper.classList.add("js-bg-active"),
      onLeaveBack: () => this.benefitsWrapper.classList.remove("js-bg-active"),
    });
  }

  setupBlockToShowAnimation() {
    this.gsap.fromTo(
      this.blockToShow,
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          id: "BLOCK_TO_SHOW",
          trigger: this.blockToShow,
          start: "top 90%",
          end: "bottom 60%",
          scrub: 1,
          markers: false,
        },
        duration: 0.5,
      }
    );
  }
}

// Instantiate the AnimationManager when the DOM is fully loaded
new AnimationManager();