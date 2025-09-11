class TabManager {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.opentab = document.querySelector(".js-open");
      if (this.opentab) {
        setTimeout(() => {
          this.opentab.click();
        }, 100); // Slight delay to ensure DOM is fully ready
      }
    });
  }

  openTab(evt, tabtarget) {
    this.hideAllTabs();
    this.showTargetTab(tabtarget);
    this.setActiveTab(evt.currentTarget);
    this.resetScrollAndRefreshTriggers();
  }

  hideAllTabs() {
    const tabcontent = document.querySelectorAll(".o-tab__content");
    tabcontent.forEach((content) => {
      content.classList.remove("active");
      content.style.display = "none";
    });
  }

  showTargetTab(tabtarget) {
    const target = document.getElementById(tabtarget);
    target.style.display = "block";
    setTimeout(() => {
      target.classList.add("active");
    }, 10); // Delay adding the class to ensure transition
  }

  setActiveTab(tab) {
    const tablinks = document.querySelectorAll(".o-tab__button");
    tablinks.forEach((link) => {
      link.classList.remove("active");
    });
    tab.classList.add("active");
  }

  resetScrollAndRefreshTriggers() {
    gsap.to(window, { scrollTo: { y: 0 }, duration: 0.5 });
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    setTimeout(() => {
      this.initializeScrollTrigger();
      ScrollTrigger.refresh(true); // Force a full refresh
    }, 500); // Delay to allow DOM changes to settle
  }

  initializeScrollTrigger() {
    ScrollTriggerManager.init();
  }
}

class ScrollTriggerManager {
  static init() {
    gsap.registerPlugin(ScrollTrigger);

    const howAccordionSections = gsap.utils.toArray(".js-how-accordions");

    howAccordionSections.forEach((section) => {
      const accordions = gsap.utils.toArray(
        section.querySelectorAll(".js-accordion")
      );
      const numberOfAccordions = accordions.length;

      const startScale = 0.9;
      const endScale = 1;

      const scales = [];
      for (let i = 0; i < numberOfAccordions; i++) {
        scales.push(
          startScale + ((endScale - startScale) / (numberOfAccordions - 1)) * i
        );
      }

      const tlap = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top 15%",
          end: "bottom top",
          scrub: 1,
          ease: "linear",
          invalidateOnRefresh: true, // Recalculate on refresh
          anticipatePin: 1, // Anticipate changes
        },
      });

      tlap.to(
        section.querySelectorAll(
          ".js-accordion:not(:last-of-type) .js-accordion-content"
        ),
        {
          height: 0,
          paddingBottom: 0,
          opacity: 0,
          stagger: 0.5,
        }
      );

      tlap.to(
        section.querySelectorAll(".js-accordion"),
        {
          marginBottom: -45,
          stagger: 0.5,
        },
        "<"
      );

      accordions.slice(0, -1).forEach((accordion, index) => {
        tlap.to(
          accordion,
          {
            scale: scales[index],
            duration: 0.5,
            ease: "linear",
          },
          "<"
        );
      });

      tlap.to(
        section.querySelector(".js-accordion:last-of-type"),
        {
          scale: 1,
          duration: 0.5,
          ease: "linear",
        },
        "<"
      );
    });
  }
}

// Initialize the TabManager when the DOM is fully loaded
const tabManager = new TabManager();

// Attach the openTab method to global scope for inline onclick handlers
window.tabOpen = (evt, tabtarget) => tabManager.openTab(evt, tabtarget);
