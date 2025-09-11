const registerValidation = (formData) => {
  const errors = [];

  const errorList = {
    type: { id: "type", message: "User type is required" },
    first_name: {
      id: "register_first_name",
      message: "First name is required",
    },
    last_name: { id: "register_last_name", message: "Last name is required" },
    country_code: {
      id: "register_country_code",
      message: "Country code is required",
    },
    mobile_no: {
      id: "register_phone_number",
      message: "Phone number is required",
    },
    email: { id: "register_email", message: "Email is required" },
    password: { id: "register_password", message: "Password is required" },
    confirm_password: {
      id: "register_confirm_password",
      message: "Confirm password is required",
    },
  };

  const regexList = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone_number: /^\+?1?\s*\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    password: /^.{8,}$/, // At least 8 characters
  };

  const regexErrors = {
    email: {
      id: "register_email",
      message: "Please enter a valid email address",
    },
    phone_number: {
      id: "register_phone_number",
      message: "Please enter a valid phone number",
    },
    password: {
      id: "register_password",
      message: "Password must be at least 8 characters long",
    },
  };

  // Check for empty fields
  Object.keys(formData).forEach((key) => {
    if (!formData[key]?.trim()) {
      console.log(key);
      errors.push({
        id: errorList[key].id,
        message: errorList[key].message,
      });
    }
  });

  // Check regex validations
  Object.keys(regexList).forEach((key) => {
    if (formData[key]?.trim() && !regexList[key].test(formData[key])) {
      errors.push({
        id: regexErrors[key].id,
        message: regexErrors[key].message,
      });
    }
  });

  // Check if passwords match
  if (formData.password !== formData.confirm_password) {
    errors.push({
      id: "register_confirm_password",
      message: "Passwords do not match",
    });
  }

  if (!formData.is_terms_accepted) {
    errors.push({
      id: "register_is_terms_accepted",
      message: "Please accept terms and conditions",
    });
  }

  return errors;
};

async function handleRegister(body) {
  document.getElementById("registerBtn").disabled = true;
  document.getElementById("registerBtn").textContent = "Registering...";
  try {
    const response = await fetch(`${API_URL}register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();

    alert("Registration successful! Please login to continue.");
  } catch (error) {
    errorMessageHandler(error.message, document.getElementById("registerForm"));
  } finally {
    document.getElementById("registerBtn").disabled = false;
    document.getElementById("registerBtn").textContent = "SUBMIT";
  }
}

async function registerHandleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formDataObj = Object.fromEntries(formData.entries());
  const errors = registerValidation(formDataObj);
  if (errors.length > 0) {
    displayErrors(errors);
    return;
  }

  await handleRegister(formDataObj);
}
