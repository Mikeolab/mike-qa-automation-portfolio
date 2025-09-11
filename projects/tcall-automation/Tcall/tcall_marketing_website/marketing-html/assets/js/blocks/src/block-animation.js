document.addEventListener("DOMContentLoaded", function () {
  class AnimationHandler {
      constructor() {
          gsap.registerPlugin(ScrollTrigger);
      }

      animateFadeInUp(selector) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
              elements.forEach((element) => {
                  gsap.from(element, {
                      scrollTrigger: {
                          trigger: element,
                          start: "top 95%",
                          end: "top 30%",
                          scrub: 1,
                          markers: false,
                      },
                      opacity: 0,
                      y: 100,
                      duration: 1,
                  });
              });
          }
      }

      animatePopUp(selector) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
              elements.forEach((element) => {
                  gsap.from(element, {
                      scrollTrigger: {
                          trigger: element,
                          start: "top center",
                          end: "top 10px",
                          scrub: true,
                          markers: false,
                      },
                      scale: 0.5,
                      duration: 1,
                  });
              });
          }
      }

      // Add more animation methods as needed
  }

  // Instantiate the AnimationHandler class
  const animationHandler = new AnimationHandler();

  // Trigger animations
  animationHandler.animateFadeInUp(".js-animation-fadeInUp");
  animationHandler.animatePopUp(".js-animation-popup");
});
