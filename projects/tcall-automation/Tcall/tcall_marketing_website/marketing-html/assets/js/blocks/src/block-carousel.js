class CarouselManager {
    constructor(selectorOrElement, options, customHandlers = null) {
      // Check if the argument is a string or a DOM element
      this.element =
        typeof selectorOrElement === "string"
          ? document.querySelector(selectorOrElement)
          : selectorOrElement;
  
      if (this.element) {
        this.splide = new Splide(this.element, options);
        if (customHandlers) {
          customHandlers(this.splide);
        }
        this.splide.mount();
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", function () {

  
  
    // Happy Customer Carousel
    const happyCustomerSlider = new CarouselManager(".js-happy-customer-slider", {
      type: "loop",
      autoplay: false,
      interval: 3000,
      perPage: 3,
      focus: "center",
      pagination: false,
      pauseOnHover: true,
      arrows: false,
      breakpoints: {
        1024: {
          perPage: 1,
        },
      },
      gap: "20px",
      padding: {
        left: "50px",
        right: "50px",
      },
    });
  
    // Home How Carousel
    new CarouselManager(".js-home-how-slider", {
      type: "loop",
      autoplay: true,
      pagination: false,
      arrows: false,
      interval: 6000,
      pauseOnHover: false,
      gap: 15,
      focus: "center",
      destroy: true,
      padding: "10%",
      breakpoints: {
        767: {},
        992: {
          destroy: false,
        },
      },
    });
  
    // Price Carousel
    document.querySelectorAll(".js-price-slider").forEach((slider) => {
      // Wait until the slides are rendered properly
      const initializeCarousel = () => {
        if (slider.querySelectorAll('.splide__slide').length > 0) {
          // Initialize the CarouselManager
          new CarouselManager(slider, {
            type: "loop",
            autoplay: true,
            perPage: 1,
            perMove: 1,
            pagination: false,
            arrows: true,
            gap: 15,
            destroy: true,
            breakpoints: {
              767: {
                destroy: false,
              },
            },
          });

          // Add the is-initialized class
          slider.classList.add("is-initialized");
        } else {
          // Retry initialization after a short delay
          setTimeout(initializeCarousel, 100); // Adjust delay as needed
        }
      };

      initializeCarousel();
    });

  
    // feature slide
    new CarouselManager(".js-feature-slider", {
      type: "slide",
      perPage: 1,
      pagination: false,
      arrows: true,
      gap: 15,
      destroy: true,
      breakpoints: {
          767: {
            perPage: 1,
            autoplay: true,
          },
          992: {
            destroy: false,
          },
        },
    });

    // feature slide
    new CarouselManager(".js-understand-slider", {
      type: "slide",
      perPage: 1,
      pagination: false,
      arrows: true,
      gap: 15,
      destroy: true,
      breakpoints: {
          767: {
            perPage: 1,
            autoplay: true,
          },
          992: {
            destroy: false,
          },
        },
    });

      // Home Trust Carousel
    new CarouselManager('.js-trusted-brand-slider', {
      type: 'loop',
      autoplay: true,
      autoWidth: true,
      pagination: false,
      arrows: false,
      gap: 50,
      interval: 6000,
      pauseOnHover: false,
    });
    
  });
  