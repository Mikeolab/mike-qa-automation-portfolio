let Agents = [];
let loading = false;
const AgentsList = document.getElementById("agentsList");
let checkedItem = { id: null };

let content = "";

const setCheckedItem = (agentId) => {
  const agent = Agents.find((a) => a.id === parseInt(agentId));
  if (agent) {
    // console.log("AGENT FOUND", agent);
    checkedItem = { id: agent.id };
  } else {
    console.warn(`Agent with id ${agentId} not found.`);
  }
};

const updateAgentsList = () => {
  if (loading) {
    AgentsList.innerHTML = `<li class="o-modal__slides splide__slide">
      <label class="o-modal__radioitem">
        <div class="o-modal__itemsinside">Loading...</div>
      </label>
    </li>`;
    return;
  }

  if (Agents.length > 0) {
    const slidelist = Agents.map(
      (agent) => `
      <li class="o-modal__slides splide__slide">
        <label class="o-modal__radioitem">
          <input
            type="radio"
            ${checkedItem.id === agent.id ? "checked" : ""}
            name="radio"
            class="o-modal__radio"
            value=${agent.id}
            onchange="(function(){ setCheckedItem('${
              agent.id
            }'); console.log('Radio changed to:', '${agent.agent_id}'); })()"
          />
          <span class="o-modal__checkmark check"></span>
          <div class="o-modal__itemsinside chkbody">
            <i><img src=${agent.icone} alt="Real Estate"/></i>
            <p class="o-modal__textpart">${agent.prompts_title}</p>
          </div>
        </label>
      </li>
    `
    ).join("");
    AgentsList.innerHTML = `<div class="splide js-popup-slider"><div class="splide__track"><ul class="splide__list">${slidelist}</ul></div></div>`;

    const event = new CustomEvent("agentsSlideLoaded");
    document.dispatchEvent(event);
  }
};

const getAgents = async () => {
  try {
    loading = true;
    updateAgentsList();
    const response = await fetch(
      API_URL + `hompage_agent_list/?is_inbound=false`
    );
    const data = await response.json();
    // console.log(data);
    checkedItem = { id: data.data[0].id };
    // console.log("checkedItem", checkedItem);
    Agents = data.data;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error;
  } finally {
    loading = false;
    // console.log("Agents List", Agents);
    updateAgentsList();
  }
};

// <!--ANCHOR call getAgents on page load  -->
document.addEventListener("DOMContentLoaded", () => {
  getAgents();
});

//ANCHOR Function to update the dropdown
const updateAgentDropdown = () => {
  const selectElement = document.querySelector(".o-banner__agent");
  if (!selectElement || !Agents.length) return;

  selectElement.innerHTML = "<option>Select Agent</option>"; // Reset options

  Agents.forEach((agent) => {
    const option = document.createElement("option");
    option.value = agent.agent_id;
    option.textContent = agent.prompts_title;
    selectElement.appendChild(option);
  });
};

// ANCHOR Make Trial Call API
const makeTrialCall = async () => {
  try {
    const phoneInput = document.querySelector(".o-banner__phone");
    const agentSelect = document.querySelector(".o-banner__agent");
    const selectedAgentId = agentSelect.value;
    const iti = window.intlTelInputGlobals.getInstance(phoneInput);
    const rawInput = phoneInput.value.trim();

    document.querySelectorAll(".o-banner__error-message").forEach((el) => el.remove());

    let errorMessage = "";

    if (!rawInput) {
      errorMessage = "Please enter a phone number.";
      phoneInput
        .closest(".iti")
        .insertAdjacentHTML(
          "afterend",
          `<p class='o-banner__error-message'>${errorMessage}</p>`
        );
      return;
    }

    // if (!phoneNumber) {
    //   errorMessage = "Please enter a phone number.";
    //   phoneInput.closest('.iti').insertAdjacentHTML("afterend", `<p class='o-banner__error-message'>${errorMessage}</p>`);
    //   return;
    // }

    const phoneNumber = iti.isValidNumber()
      ? iti.getNumber()
      : "+" + iti.getSelectedCountryData().dialCode + rawInput;

    if (!selectedAgentId || selectedAgentId === "Select Agent") {
      errorMessage = "Please select an agent.";
      agentSelect.insertAdjacentHTML(
        "afterend",
        `<p class='o-banner__error-message'>${errorMessage}</p>`
      );
      return;
    }

    const selectedAgent = Agents.find(
      (agent) => agent.agent_id === selectedAgentId
    );

    if (!selectedAgent) {
      errorMessage = "Invalid agent selection.";
      agentSelect.insertAdjacentHTML(
        "afterend",
        `<p class='o-banner__error-message'>${errorMessage}</p>`
      );
      return;
    }

    const requestBody = {
      agent: selectedAgent.agent,
      purchase_number: selectedAgent.purchase_number,
      to_number: phoneNumber,
    };

    console.log("Sending request with phone number:", phoneNumber);

    const response = await fetch(API_URL + "hompage_make_trial_call/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.statusCode === 200) {
      document.querySelector(".o-banner__makecallcontainer").style.display = "none";
      document.querySelector(".o-banner__successmessagecontainer").style.display = "flex";
      // agentSelect.insertAdjacentHTML(
      //   "afterend",
      //   `<p class='o-banner__success-message'>Trial call request successful!</p>`
      // );
    } else {
      agentSelect.insertAdjacentHTML(
        "afterend",
        `<p class='o-banner__error-message'>Failed to make trial call. Please try again.</p>`
      );
    }
  } catch (error) {
    console.error("Error making trial call:", error);
    const errorAgentSelect = document.querySelector(".o-banner__agent");
    errorAgentSelect.insertAdjacentHTML(
      "afterend",
      `<p class='o-banner__error-message'>An error occurred. Please try again later.</p>`
    );
  }
};

//ANCHOR Clear error messages when user starts typing or selecting
document.querySelector(".o-banner__phone").addEventListener("input", () => {
  document.querySelectorAll(".o-banner__error-message").forEach((el) => el.remove());
});

document.querySelector(".o-banner__agent").addEventListener("change", () => {
  document.querySelectorAll(".o-banner__error-message").forEach((el) => el.remove());
});

  //ANCHOR Hide the success content and show the form content
  const retryCall = () => {
    document.querySelector(".o-banner__successmessagecontainer").style.display = "none";
    document.querySelector(".o-banner__makecallcontainer").style.display = "block";
  
    //ANCHOR Clear the form values
    const phoneInput = document.querySelector(".o-banner__phone");
    const agentSelect = document.querySelector(".o-banner__agent");
  
    phoneInput.value = "";
    agentSelect.value = "Select Agent";
  
  };

// <!--ANCHOR To prevent page scroll when iti__country-list open  -->
document.addEventListener("DOMContentLoaded", function () {
  const countryList = document.querySelector(".iti__country-list");

  if (countryList) {
    countryList.addEventListener("wheel", function (event) {
      event.stopPropagation();
    });
  }
});
