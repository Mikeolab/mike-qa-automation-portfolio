document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // Get all accordion elements except the last one
    const accordions = gsap.utils.toArray(".js-accordion");
    const numberOfAccordions = accordions.length;

    // Define the start and end scale values
    const startScale = 0.9;
    const endScale = 1;

    // Calculate incremental scale values
    const scales = [];
    for (let i = 0; i < numberOfAccordions; i++) {
        // Calculate scale values incrementally
        scales.push(startScale + ((endScale - startScale) / (numberOfAccordions - 1)) * i);
    }

    // Create a timeline
    const tlap = gsap.timeline({
        scrollTrigger: {
            trigger: ".js-how-accordions",
            pin: true,
            start: "top 15%",
            end: "bottom top",
            scrub: 1,
            ease: "linear",
        },
    });

    // Hide all accordion contents except the last one and apply initial scaling
    tlap.to(".js-accordion:not(:last-of-type) .js-accordion-content", {
        height: 0,
        paddingBottom: 0,
        opacity: 0,
        stagger: 0.5,
    });

    // Apply initial scaling to all accordions
    tlap.to(
        ".js-accordion",
        {
            marginBottom: -20,
            stagger: 0.5,
        },
        "<"
    );

    // Apply custom scaling incrementally to all accordions except the last one
    accordions.slice(0, -1).forEach((accordion, index) => {
        tlap.to(
            accordion,
            {
                scale: scales[index], // Apply calculated scale value
                duration: 0.5,
                ease: "linear",
            },
            "<"
        );
    });

    // Ensure the last accordion content remains visible and at the correct scale
    tlap.to(
        ".js-accordion:last-of-type",
        {
            scale: 1,
            duration: 0.5,
            ease: "linear",
        },
        "<"
    );
});