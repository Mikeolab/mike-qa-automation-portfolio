document.addEventListener("DOMContentLoaded", function () {
  // FOR ACCORDIAN

  const itemsAccordian = gsap.utils.toArray(
    ".js-accordia-item .js-accordia-content"
  );
  
  const tline = gsap.timeline({
    scrollTrigger: {
      trigger: ".js-accordion-section",
      start: "top",
      end: "+=" + 10 * itemsAccordian.length + "%",
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      markers: false,
      pinSpacing: false
    },
  });

  gsap.set(".js-accordia-item:not(:first-child) .js-accordia-content", {
    height: 0,
  });

  itemsAccordian.forEach((item, i) => {
    if (itemsAccordian[i + 1]) {
      tline.to(item, {
        height: 0,
        onComplete: () => item.classList.remove("active"),
        onReverseComplete: () => item.classList.add("active"),
      }).to(
        itemsAccordian[i + 1],
        {
          height: "auto",
          onComplete: () => itemsAccordian[i + 1].classList.add("active"),
          onReverseComplete: () =>
            itemsAccordian[i + 1].classList.remove("active"),
        },
        "<"
      );
    }
  });

  gsap.set(".js-accordian-wrapper", { autoAlpha: 1 });

  // FOR PIN TO IMAGE SCALE
  gsap.set(".js-scroll-photo:not(:first-child)", { opacity: 0, scale: 0.5, x: -100, y: -100 });

  const galleryAnimation = gsap.to(".js-scroll-photo:not(:first-child)", {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    duration: 1,
    stagger: 1,
  });

  ScrollTrigger.create({
    trigger: ".js-scroll-gallery",
    start: "top",
    end: "+=" + 10 * itemsAccordian.length + "%",
    pin: ".js-scroll-right",
    animation: galleryAnimation,
    scrub: true,
    onLeave: () => gsap.set(".js-scroll-right", { clearProps: "transform" }),
    markers: false,
    pinSpacing: false,
  });
});
