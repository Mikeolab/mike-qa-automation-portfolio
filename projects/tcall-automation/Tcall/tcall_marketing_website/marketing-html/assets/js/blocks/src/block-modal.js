// CarouselManager Class Definition
class CarouselManager1 {
    constructor(selectorOrElement, options, customHandlers = null) {
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
  
  // ModalManager Class Definition
  class ModalManager {
    constructor() {
      this.openButtons = document.querySelectorAll(".modalBtn");
      this.closeButtons = document.querySelectorAll(".o-modal__close");
      this.activeModal = null;
      this.carousel = null;
  
      this.init();
  
      // Add event listener for agents loaded
      document.addEventListener("agentsSlideLoaded", () => {
        if (this.activeModal) {
          this.initializeCarousel();
        }
      });
    }
  
    init() {
      this.openButtons.forEach((btn) => {
        btn.addEventListener("click", () =>
          this.openModal(btn.getAttribute("data-target"))
        );
      });
  
      this.closeButtons.forEach((btn) => {
        btn.addEventListener("click", () =>
          this.closeModal(btn.getAttribute("data-target"))
        );
      });
  
      document.addEventListener("keydown", (event) => this.handleKeydown(event));
    }
  
    initializeCarousel() {
      const sliderElement = this.activeModal.querySelector(".js-popup-slider");
      const slideCount = sliderElement ? sliderElement.querySelectorAll(".splide__slide").length : 0;

      if (sliderElement && !this.carousel) {
        this.carousel = new CarouselManager1(".js-popup-slider", {
          autoplay: true,
          perPage: 3,
          perMove: 1,
          pagination: false,
          autoWidth: true,
          gap: 20,
          arrows: slideCount >= 4,  // Set arrows to false if slide count is less than 4
          interval: 6000,
          pauseOnHover: false,
        });
      }
    }
  
    openModal(targetId) {
      // Close any currently open modal
      if (this.activeModal) {
        this.closeModal(this.activeModal.id);
      }
  
      const targetModal = document.getElementById(targetId);
      if (!targetModal) return;
  
      document.body.style.overflow = "hidden";
      targetModal.classList.add("show");
  
      setTimeout(() => {
        targetModal.style.display = "block";
        this.activeModal = targetModal;
        this.initializeCarousel();
      }, 100);
    }
  
    closeModal(targetId) {
      const targetModal = document.getElementById(targetId);
      if (!targetModal) return;
  
      document.body.style.overflow = "visible";
  
      targetModal.classList.remove("show");
      setTimeout(() => {
        targetModal.style.display = "none";
        this.activeModal = null;
  
        // Destroy carousel if it exists
        if (this.carousel && this.carousel.splide) {
          this.carousel.splide.destroy();
          this.carousel = null;
        }
        // Stop and reset the video player
        const videoPlayer = targetModal.querySelector(".o-modal__video");
        if (videoPlayer && typeof videoPlayer.pause === "function") {
          videoPlayer.pause();
          videoPlayer.currentTime = 0; // Reset to the beginning
        }
      }, 100);
    }
  
    handleKeydown(event) {
      if (event.code === "Escape" && this.activeModal) {
        event.preventDefault();
        this.closeModal(this.activeModal.id);
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    new ModalManager();
  });  