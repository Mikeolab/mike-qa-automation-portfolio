function loginValidation(formData) {
  const errors = [];

  const errorList = {
    email: { id: "login_email", message: "Email is required" },
    password: { id: "password", message: "Password is required" },
  };

  Object.keys(formData).forEach((key) => {
    if (!formData[key].trim()) {
      errors.push({ id: errorList[key].id, message: errorList[key].message });
    }
  });

  return errors;
}

async function handleLogin(body) {
  document.getElementById("loginBtn").disabled = true;
  document.getElementById("loginBtn").textContent = "Logging in...";
  try {
    const response = await fetch(`${API_URL}login/`, {
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
      if (error.statusCode === 401) {
        throw new Error(`Invalid credentials`);
      } else {
        throw new Error(`${response.message}`);
      }
    }

    const data = await response.json();
    localStorage.setItem("token", JSON.stringify(data.data));
    console.log("Login successful:", data);
    window.location.href = " https://dashboard.tcall.ai/#/customer/login";

    // Clear form after successful login
    document.getElementById("loginForm").reset();
  } catch (error) {
    errorMessageHandler(error.message, document.getElementById("loginForm"));
  } finally {
    document.getElementById("loginBtn").disabled = false;
    document.getElementById("loginBtn").textContent = "LOGIN";
  }
}

async function loginHandleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formDataObj = Object.fromEntries(formData.entries());
  const errors = loginValidation(formDataObj);
  if (errors.length > 0) {
    displayErrors(errors);
    return;
  }

  await handleLogin({ ...formDataObj, username_or_email: formDataObj.email });
}
