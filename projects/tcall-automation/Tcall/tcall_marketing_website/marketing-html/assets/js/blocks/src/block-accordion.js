document.addEventListener("DOMContentLoaded", function () {
  class Accordion {
      constructor(selector, deactivateSelector) {
          this.accordionButtons = document.querySelectorAll(selector);
          this.isAccordionActive = true; // Initially allow toggling
          this.initialize();

          if (deactivateSelector) {
              this.deactivateButton = document.getElementById(deactivateSelector);
              if (this.deactivateButton) {
                  this.deactivateButton.addEventListener("click", () => this.deactivateAccordionToggle());
              }
          }

          // Open the first accordion by default if it exists
          const firstAccordionButton = document.querySelector(`${selector}.active`);
          if (firstAccordionButton) {
              firstAccordionButton.click();
          }
      }

      initialize() {
          this.accordionButtons.forEach((button) => {
              button.addEventListener("click", () => this.toggleAccordion(button));
          });
      }

      toggleAccordion(button) {
          if (this.isAccordionActive && !button.classList.contains("exclude-button")) {
              const panel = button.nextElementSibling;
              const icon = button.querySelector('.o-accordion__icon');

              // Close other panels
              this.accordionButtons.forEach((btn) => {
                  const otherPanel = btn.nextElementSibling;
                  const otherIcon = btn.querySelector('.o-accordion__icon');
                  if (btn !== button && otherPanel.style.maxHeight) {
                      otherPanel.style.maxHeight = null;
                      btn.classList.remove('active');
                      otherIcon.innerHTML = '<path d="M15 1V29" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 15H29" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>';
                  }
              });

              // Toggle the clicked panel
              button.classList.toggle('active');
              if (panel.style.maxHeight) {
                  panel.style.maxHeight = null;
                  icon.innerHTML = '<path d="M15 1V29" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 15H29" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>';
              } else {
                  panel.style.maxHeight = panel.scrollHeight + "px";
                  icon.innerHTML = '<path d="M1 1H29" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>';
              }
          }
      }

      deactivateAccordionToggle() {
          this.isAccordionActive = false;
      }
  }

  // Instantiate the Accordion class
  new Accordion(".o-accordion__button", "deactivateAccordion");
});