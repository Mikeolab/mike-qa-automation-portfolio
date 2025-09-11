document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const animatedZoomElement = document.querySelector(".js-zoomed-vector");
  const blockToShow = document.querySelector(".js-block-to-show");
  const benefitsWrapper = document.querySelector(".js-benefits-wrapper");
  const howItWorkBlock = document.querySelector(".js-howitworks-block");
  const items = gsap.utils.toArray(".js-stacked-card");

  let logoToScale = () =>
    (window.innerWidth / animatedZoomElement.getBBox().width) * 2;

  if (animatedZoomElement) {
    // Create the timeline for scaling and rotating the SVG icon
    const zoomTimeline = gsap.timeline({
      scrollTrigger: {
        id: "ZOOM",
        trigger: animatedZoomElement,
        start: "top 60%",
        end: "top top",
        scrub: 1,
        markers: false,
      },
    });

    zoomTimeline.to(animatedZoomElement, {
      // scale: 20,
      scale: () => logoToScale(),
      duration: 5,
      rotation: -189,
    });

    gsap.to(howItWorkBlock, {
      scrollTrigger: {
        id: "HOW_IT_WORKS",
        trigger: howItWorkBlock,
        start: "top top",
        end: "top 10%",
        scrub: 1,
        markers: false,
      },
      opacity: 0,
      duration: 2,
    });

    const fadeOutTimeline = gsap.timeline({
      scrollTrigger: {
        id: "FADE_OUT",
        trigger: animatedZoomElement,
        start: "top top",
        end: "top top",
        scrub: 1,
        markers: false,
      },
    });

    fadeOutTimeline.to([animatedZoomElement], {
      opacity: 1,
      duration: 1,
    });

    // Increase the opacity of `block-to-show` and pin it until the end
    ScrollTrigger.create({
      id: "Stacked_Block_Wrapper",
      trigger: benefitsWrapper,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      markers: false,
      pin: false,
      pinSpacing: false,
      onEnter: () => benefitsWrapper.classList.add("js-bg-active"), // Add class on enter
      onLeave: () => benefitsWrapper.classList.remove("js-bg-active"), // Remove class on leave
      onEnterBack: () => benefitsWrapper.classList.add("js-bg-active"), // Add class on enter back
      onLeaveBack: () => benefitsWrapper.classList.remove("js-bg-active"), // Remove class on leave back
    });

    // Reveal the hidden section when the SVG reaches the top of the viewport
    ScrollTrigger.create({
        id: "BLOCK_TO_SHOW",
        trigger: blockToShow,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        pin: false,
        pinSpacing: false,
        markers: false,
        onEnter: () => {
            blockToShow.classList.add("js-bg-active");
            gsap.fromTo(blockToShow, { opacity: 0 }, { opacity: 1, duration: 2 });
        },
        onLeaveBack: () => {
          blockToShow.classList.remove("js-bg-active");
          gsap.fromTo(blockToShow, { opacity: 1 }, { opacity: 0, duration: 2 });
        }
    });

    // gsap.fromTo(
    //   blockToShow,
    //   { opacity: 0 },
    //   {
    //     opacity: 1,
    //     scrollTrigger: {
    //       id: "BLOCK_TO_SHOW",
    //       trigger: blockToShow,
    //       start: "top 80%",
    //       end: "bottom 60%",
    //       scrub: 1,
    //       markers: true,
    //     },
    //     duration: .5,
    //   }
    // );
  }

  // ANCHOR Stacked benefits Script
  items.forEach((item, index) => {
    let tl = gsap.timeline({
      scrollTrigger: {
        id: "STACKED_" + index,
        trigger: item,
        start: "top top+=" + item.getAttribute("animation-item"),
        endTrigger: ".js-stacked-finish",
        end: "top 260",
        pin: true,
        pinSpacing: false,
        scrub: true,
        markers: false,
      },
    });
    tl.to(item, {
      opacity: 0.4,
      scale: 0.85 + 0.02 * index,
      transformOrigin: "center center",
    });
  });
});
