class MobileMenu {
    constructor() {
      this.menu = document.querySelector(".o-header__menu-area");
      this.burger = document.querySelector(".o-header__hamburg");
      this.overlay = document.querySelector(".o-header__overlay");
  
      // Initialize the mobile menu
      this.init();
    }
  
    init() {
      this.addEventListeners();
    }
  
    toggleMenu() {
      this.menu.classList.toggle("menu-active");
      this.overlay.classList.toggle("menu-active");
  
      document.body.classList.toggle(
        "menu-open",
        this.menu.classList.contains("menu-active")
      );
    }
  
  
    addEventListeners() {
      this.burger.addEventListener("click", this.toggleMenu.bind(this));
      this.overlay.addEventListener("click", this.toggleMenu.bind(this));
  
      // Add event listener for the close icon within the submenu
      document.addEventListener("click", (e) => {
        if (e.target.closest(".o-header__mobile-close-icon")) {
          this.toggleMenu(); // Close the main menu as well when the close icon is clicked
        }
      });
    }
  }
  
  // Instantiate the MobileMenu class
  const mobileMenu = new MobileMenu();