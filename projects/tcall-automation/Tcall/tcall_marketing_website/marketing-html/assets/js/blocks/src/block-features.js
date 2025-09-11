document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Helper function to check if the user is on a mobile device
  function isMobile() {
    return window.innerWidth <= 992; // Adjust the breakpoint as needed
  }

  // Horizontal Scroll Animation
  const featureHorizonalScroll = gsap.utils.toArray(
    ".o-home-feature__contentblock"
  );
  if (featureHorizonalScroll.length) {
    gsap.to(featureHorizonalScroll, {
      xPercent: -100 * (featureHorizonalScroll.length - 1),
      ease: "none",
      scrollTrigger: {
        // trigger: ".js-feature-transition",
        // pin: true,
        // scrub: 1,
        // snap: 1 / (featureHorizonalScroll.length - 1),
        // end: () =>
        //   "+=" + document.querySelector(".js-feature-transition").offsetWidth,
        // pinSpacing: true,
        trigger: ".js-feature-transition",
        start: "top 15%",          // Start the animation 40% before reaching the top
        pin: true,
        scrub: 1,
        snap: 1 / (featureHorizonalScroll.length - 1),
        end: () => "+=" + document.querySelector(".js-feature-transition").offsetWidth,
        pinSpacing: true,
      },
    });
  }

  // Vertical Scroll Animation
  let textElementCount = 0;
  const simplerGirl = document.querySelector(".o-howitwork__simpler-girl1");
  const howContainer = document.querySelector(".js-vertical-wrap-main");
  const textPart = gsap.utils.toArray(".js-vertical-text > li");

  if (howContainer && !isMobile()) {
    // Disable vertical scroll animation on mobile
    let previousBottomPoint = 0;

    // Calculate the dynamic end value for the pinning
    const containerHeight = howContainer.scrollHeight + 100;
    // const pinDuration = containerHeight + window.innerHeight;

    gsap.timeline({
      scrollTrigger: {
        id: "MAIN",
        trigger: howContainer,
        start: "top top",
        end: `+=${containerHeight}px`,
        pin: true,
        // markers: true,
      },
    });
    // SimplerGirl element with respect to howContainer
    if (simplerGirl) {
      gsap.timeline({
        scrollTrigger: {
          id: "SIMPLER-GIRL",
          trigger: howContainer,
          start: "top top",
          end: `+=${containerHeight}px`,
          pin: simplerGirl,
          pinSpacing: false,
        },
      });
      //  zoom animation for simplerGirl
      gsap.timeline({
        scrollTrigger: {
          trigger: howContainer,
          start: "top top",
          end: `+=${containerHeight}px`,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const scale = 1 + progress * 0.5; // Adjust the 0.5 to control zoom intensity
            const opacity = 1 - progress * 0.3; // Adjust the 0.3 to control fade intensity
            gsap.to(simplerGirl, {
              scale: scale,
              opacity: opacity,
              duration: 0.1, // Reduced duration for smoother, more frequent updates
              ease: "power2.out", // Linear interpolation for smoother zooming
              smoothOrigin: true, // Ensures smooth scaling from the center
              overwrite: "auto", // Prevents conflicting animations
              force3D: true, // Enables hardware acceleration for smoother performance
            });
          },
        },
      });

      textPart.forEach((item, index) => {
        if (index > 0) {
          gsap.set(item, {
            opacity: 0.4,
          });
        }
      });

      function moveTextUpward(itemIndex) {
        textPart.forEach((item, index) => {
          const itemHeight = item.offsetHeight;

          if (index === itemIndex) {
            gsap.to(item, {
              y: -itemHeight * itemIndex,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          } else {
            gsap.to(item, {
              y: -itemHeight * itemIndex,
              opacity: 0.4,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        });
      }

      // Animate text items
      textPart.forEach((item, index) => {
        gsap.to(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 20%",
            end: "bottom top",
            scrub: true,

            onEnter: () => {
              moveTextUpward(index);
            },
            onEnterBack: () => {
              moveTextUpward(index);
            },
          },
        });
      });
    }
  }
});
