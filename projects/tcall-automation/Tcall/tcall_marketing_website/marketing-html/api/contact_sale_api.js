function validateForm(formData) {
  const errors = [];

  const errorList = {
    first_name: { id: "firstName", message: "First name is required" },
    last_name: { id: "lastName", message: "Last name is required" },
    mobile_no: { id: "phoneNumber", message: "Phone number is required" },
    message: { id: "message", message: "Message is required" },
    email: { id: "email", message: "Email is required" },
    country_code: { id: "countryCode", message: "Country code is required" },
  };

  const regexList = {
    mobile_no: /^\+?[\d\s-]{10,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  const regexErrors = {
    mobile_no: { id: "phoneNumber", message: "Enter valid phone number" },
    email: { id: "email", message: "Enter valid email" },
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

const clearDivMessage = (component) => {
  if (component) {
    setTimeout(() => {
      component.remove();
    }, 3000);
  }
};

const errorMessageHandler = (errorMessage, form) => {
  const errorDiv = document.createElement("div");
  errorDiv.className = "form-error-message";
  // errorDiv.style.cssText =
  //   "color: red; padding: 10px; margin-bottom: 15px; background-color: #ffebee; border-radius: 4px;";
  errorDiv.textContent = errorMessage;
  form.insertBefore(errorDiv, form.firstChild);
  clearDivMessage(errorDiv);
};

const successMessageHandler = (successMessage, form) => {
  const successDiv = document.createElement("div");
  successDiv.className = "form-success-message";
  // successDiv.style.cssText =
  //   "color: green; padding: 10px; margin-bottom: 15px; background-color: #e0f2e9; border-radius: 4px;";
  successDiv.textContent = successMessage;
  form.insertBefore(successDiv, form.firstChild);
  clearDivMessage(successDiv);
};

async function contactSaleHandleSubmit(event) {
  event.preventDefault();
  // Get form data
  const form = document.getElementById("contactForm");
  const formData = {
    first_name: document.querySelector("#firstName").value,
    last_name: document.querySelector("#lastName").value,
    mobile_no: document.querySelector("#phoneNumber").value,
    country_code: document.querySelector("#countryCode").value,
    email: document.querySelector("#email").value,
    message: document.querySelector("#message").value,
  };

  const errors = validateForm(formData);
  if (errors.length > 0) {
    displayErrors(errors);
    return;
  }

  const submitButton = document.querySelector("#contactSalesSubmitBtn");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    const response = await fetch(`${API_URL}send_contact_request/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        is_request_for_demo: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success:", data);

    // Clear form after successful submission
    document.getElementById("contactForm").reset();

    // Show success message to user
    submitButton.textContent = "Submitted!";
    successMessageHandler("Form submitted successfully!", form);
  } catch (error) {
    console.error("Error:", error.message);
    submitButton.textContent = "Error!";
    // Better error message handling
    let errorMessage = "There was an error submitting the form. ";
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      errorMessage +=
        "CORS error: Unable to connect to the server. Please check if the server is running and CORS is properly configured.";
    } else {
      errorMessage += error.message;
    }
    errorMessageHandler(errorMessage, form);
    // Create and append error message div at the top of the form
  } finally {
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = "CONTACT SALES";
    }, 1000);
  }
}
