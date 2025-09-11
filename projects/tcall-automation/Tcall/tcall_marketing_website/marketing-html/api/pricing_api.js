class PricingPlan {
  constructor(container) {
    this.container = container;
    this.pricingData = [];
    this.loading = false;

    // Initial render
    this.init();
  }

  async init() {
    await this.getPricingData();
    this.render();
  }

  async getPricingData() {
    try {
      this.loading = true;
      this.render(); // Show loading state

      const response = await fetch(`${API_URL}pricing_plan_list`);
      const data = await response.json();
      this.pricingData = data.data;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
      this.render();
    }
  }

  render() {
    if (this.loading) {
      this.container.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <style>
            .loading-spinner {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 200px;
            }
            .spinner {
              width: 50px;
              height: 50px;
              border: 5px solid #f3f3f3;
              border-top: 5px solid #3498db;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      ${this.pricingData
        .map(
          (item) => `
            <div class="o-pricing__planbox ${
              item.is_popular ? "o-pricing__planbox--popular" : ""
            } splide__slide">
              <div class="o-pricing__planboxtop">
                <h4 class="o-pricing__planame">${item.title}</h4>
                <p class="o-pricing__plancost">$${item.price}/M</p>
              </div>
              <div class="o-pricing__planboxbottom">
                <ul class="o-pricing__planlist">
                  ${
                    item.description &&
                    item.description
                      .split(";")
                      .map(
                        (feature) => `
                    <li class="o-pricing__planitem">
                      ${feature}
                    </li>
                  `
                      )
                      .join("")
                  }
                </ul>
                <a href="contact-us.html" class="btn-default o-pricing__planbtn">GET STARTED</a>
              </div>
            </div>
          `
        )
        .join("")}
    `;

    // Add event listeners after rendering
    this.addEventListeners();
  }

  addEventListeners() {
    const startButton = this.container.querySelector(".o-pricing__planbtn");
    startButton.addEventListener("click", (e) => {
      e.preventDefault();
      // Add your click handler here
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pricing-container");
  new PricingPlan(container);
});
