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

// console.log(checkedItem);

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

/**
 *
 * This part for form submission
 *
 */

function recivedvalidateForm(formData) {
  const errors = [];

  const errorList = {
    name: { id: "name", message: "Name is required" },
    email: { id: "agent_email", message: "Email is required" },
    mobile_no: { id: "mobile_no", message: "Mobile number is required" },
  };

  const regexList = {
    mobile_no: /^\+?[\d\s-]{10,}$/,
    agent_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  const regexErrors = {
    mobile_no: { id: "mobile_no", message: "Enter valid phone number" },
    agent_email: { id: "agent_email", message: "Enter valid email" },
  };

  Object.keys(formData).forEach((key) => {
    if (!formData[key].trim()) {
      errors.push({ id: errorList[key].id, message: errorList[key].message });
    }
    if (
      regexList[key] &&
      !regexList[key].test(formData[key]) &&
      formData[key].length > 0
    ) {
      errors.push({
        id: regexErrors[key].id,
        message: regexErrors[key].message,
      });
    }
  });

  return errors;
}

const displayErrorsForm = (errors) => {
  // First, clear all existing errors
  const existingErrors = document.querySelectorAll(".error-form-message");
  existingErrors.forEach((error) => error.remove());

  const inputs = document.querySelectorAll(".error");
  inputs.forEach((input) => input.classList.remove("error"));

  // Then display new errors if any
  if (errors.length > 0) {
    errors.forEach((error) => {
      console.log(error);
      const input = document.getElementById(error.id);
      input.classList.add("error");
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-form-message";
      errorDiv.textContent = error.message;
      input.parentNode.appendChild(errorDiv);

      // Remove error styling and message when user starts typing
      input.addEventListener("input", () => {
        input.classList.remove("error");
        const existingError = input.parentNode.querySelector(
          ".error-form-message"
        );
        if (existingError) {
          existingError.remove();
        }
      });
    });
  }
};

async function reciveCallHandleSubmit(event) {
  event.preventDefault();

  // Get form values
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("agent_email").value,
    mobile_no: document.getElementById("mobile_no").value,
  };

  const errors = recivedvalidateForm(formData);
  if (errors.length > 0) {
    displayErrorsForm(errors);
    return;
  }

  // Disable submit button while processing
  const submitButton = document.getElementById("reciveCallBtn");
  submitButton.disabled = true;
  submitButton.innerHTML = "Submitting...";

  // console.log("checkedItem.id", checkedItem.agent_id);

  try {
    const response = await fetch(
      `${API_URL}send_request_for_free_trial_call/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          agent: checkedItem.id,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      successMessageHandler(
        "Thank you for your message. We will contact you soon!",
        document.getElementById("requestForm")
      );
      document.getElementById("requestForm").reset();

      testCallNumber = data.data;

      // console.log("TEST CALL NUMBER", testCallNumber);

      document.getElementById("selectDomain").classList.remove("show");
      document.getElementById("selectDomain").style = "";
      document.querySelector(".js-show-agent-name").textContent =
        testCallNumber.domain;
      document.querySelector(".js-show-number").textContent =
        testCallNumber.static_number;
      const callAnchor = document.querySelector(".js-number-call-btn");
      callAnchor.href = `tel:${testCallNumber.static_number}`;
      callAnchor.textContent = "Make Test Call";
      document.getElementById("testNumber").classList.add("show");
      document.getElementById("testNumber").style.display = "block";
      checkedItem = { agent_id: null };
    } else {
      throw new Error(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to send message. Please try again later.");
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.innerHTML = "RECEIVE CALL";
  }
}
