const displayErrors = (errors) => {
  const existingErrors = document.querySelectorAll(".error-message");
  existingErrors.forEach((error) => error.remove());

  const inputs = document.querySelectorAll(".error");
  inputs.forEach((input) => input.classList.remove("error"));

  if (errors.length > 0) {
    errors.forEach((error) => {
      console.log(error);
      const input = document.getElementById(error.id);
      input.classList.add("error");
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = error.message;
      input.parentNode.appendChild(errorDiv);

      // Remove error styling and message when user starts typing
      input.addEventListener("input", () => {
        input.classList.remove("error");
        const existingError = input.parentNode.querySelector(".error-message");
        if (existingError) {
          existingError.remove();
        }
      });
    });
  }
};
