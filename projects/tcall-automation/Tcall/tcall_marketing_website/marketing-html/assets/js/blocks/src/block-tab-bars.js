class TabManager {
  constructor(tabButtonsSelector, tabContentsSelector) {
    this.tabButtons = document.querySelectorAll(tabButtonsSelector);
    this.tabContents = document.querySelectorAll(tabContentsSelector);
    
    // Bind methods to this class
    this.tabOpen = this.tabOpen.bind(this);
    this.initTabs = this.initTabs.bind(this);
    
    // Initialize the tabs
    this.initTabs();
  }

  initTabs() {
    // Add click event listeners to each tab button
    this.tabButtons.forEach((button, index) => {
      button.addEventListener("click", (event) => {
        this.tabOpen(event, index);
      });
    });

    // Simulate a click on the default open tab
    const openTab = document.querySelector(".js-open");
    if (openTab) {
      openTab.click();
    }
  }

  tabOpen(event, index) {
    // Hide all tab content and remove the active class
    this.tabContents.forEach(content => {
      content.classList.remove("active");
      content.style.display = "none";
    });

    // Remove the active class from all tab buttons
    this.tabButtons.forEach(button => {
      button.classList.remove("active");
    });

    // Show the targeted tab content with animation
    const targetContent = this.tabContents[index];
    targetContent.style.display = "block";
    setTimeout(() => {
      targetContent.classList.add("active");
    }, 10); // Delay adding the class to ensure transition

    // Set the clicked tab button to active
    event.currentTarget.classList.add("active");
  }
}

// Initialize the TabManager when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new TabManager(".o-tab__button", ".o-tab__content");
});
