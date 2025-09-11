document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // Vertical Scroll Animation
    const howContainer = document.querySelector(".js-vertical-wrap-main");
    const serviceImg = document.querySelectorAll(".js-vertical-image > li");
    const animation = gsap.utils.toArray(".js-vertical-image > li");
    const textPart = gsap.utils.toArray(".js-vertical-text > li");

    let visibleElements = animation.length;
    let previousBottomPoint = 0;

    gsap.timeline({
        scrollTrigger: {
            trigger: howContainer,
            start: "top top",
            end: "bottom bottom",
            pin: true,
            pinSpacing: true,
           
        },
    });

    function serviceImgInitialState() {
        serviceImg.forEach((element, index) => {
            const image = element.querySelector("img");
            const translateX = 10 - 90 * index;
            const scale = 1 - 0.2 * index;
            element.style.transform = `translate(${translateX}px, ${0}px) scale(${scale})`;
            element.style.backgroundColor = "white";
            element.style.zIndex = `${serviceImg.length - index}`;
        });
    }

    function updatePositions(hiddenIndex) {
        visibleElements = animation.length - hiddenIndex - 1;
        animation.forEach((el, index) => {
            if (index > hiddenIndex) {
                const valueResetter = index - (hiddenIndex + 1);
                gsap.to(el, {
                    x: 10 - 90 * valueResetter,
                    scale: 1 - 0.2 * valueResetter,
                    duration: 0.1,
                    ease: "power2.out",
                });
            }
        });
    }

    function textBlur(activeIndex, activity) {
        textPart.forEach((el, index) => {
            const textBody = el.querySelector(".js-vertical-paragraph");
            if (activity === "enterBack" && index !== activeIndex) {
                gsap.to(el, {
                    opacity: 0.5,
                });
                gsap.to(textBody, { display: "none", duration: 0 });
            } else if (activity === "leave" && index !== activeIndex) {
                gsap.to(textBody, { display: "none", duration: 0 });
                gsap.to(el, {
                    opacity: 0.5,
                });
            }
        });
    }

    function exitPosition(hiddenIndex) {
        visibleElements = animation.length - hiddenIndex - 1;
        animation.forEach((el, index) => {
            if (index > hiddenIndex) {
                gsap.to(el, {
                    x: 10 - 90 * index,
                    scale: 1 - 0.2 * index,
                    duration: 0.1,
                    ease: "power2.out",
                });
            }
        });
    }

    serviceImgInitialState();

    // NOTE: textPart and animation arrays should always have the same length
    textPart.forEach((textElement, index) => {
        const triggerPointTop = previousBottomPoint === 0 ? 200 : previousBottomPoint + 20;
        const triggerPointBottom = triggerPointTop + 100;
        previousBottomPoint = triggerPointBottom;

        const imageElement = animation[index];
        const textBody = textElement.querySelector(".js-vertical-paragraph");

        // Create a timeline for synchronized animations
        const tl = gsap.timeline({
            scrollTrigger: {
                id: `pen-${index}`,
                trigger: imageElement,
                start: `${triggerPointTop}px 200px`,
                end: `${triggerPointBottom}px 100px`,
                scrub: true,
                onLeave: () => {
                    updatePositions(index);
                    textBlur(index + 1, "leave");
                },
                onEnterBack: () => {
                    exitPosition(index);
                    textBlur(index, "enterBack");
                },
                pinSpacing: true,
            },
        });

        // Add text animation to timeline
        const textHeader = gsap.fromTo(
            textElement,
            { opacity: textElement === textPart[0] ? 1 : 0.5 },
            { opacity: 1 }
        );

        const textBodyAnimation = gsap.fromTo(
            textBody,
            { display: textElement === textPart[0] ? "block" : "none" },
            { display: "block" }
        );

        // Add image animation to timeline
        const imageAnimation = gsap.fromTo(
            imageElement,
            { zIndex: serviceImg.length - index },
            {
                scale: 1.1,
                opacity: 1,
                x: 30,
                display: animation.length - 1 === index ? "block" : "none",
                ease: "power1.out",
                pin: animation.length - 1 === index ? true : false,
            }
        );

        tl.add(textHeader, 0);
        tl.add(textBodyAnimation, 0.2);
        tl.add(imageAnimation);
    });
});
