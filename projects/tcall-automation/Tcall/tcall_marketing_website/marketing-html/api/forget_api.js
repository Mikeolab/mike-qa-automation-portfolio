class ForgetPassword {
  constructor(container) {
    // console.log(container);
    this.isVerified = false;
    this.otp = false;
    this.email = "";
    this.reference_id = "";
    this.user_id = "";
    this.container = container;
    this.init();
  }

  async init() {
    this.render();
    this.submitHandler();
  }

  //Validator functions

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  }

  verifyEmail() {
    const form = this.container.querySelector("#forgetForm");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailInput = form.querySelector("#forget_email");
      const errorSpan = form.querySelector("#email_error");
      const submitButton = form.querySelector("#forgetBtn");

      this.email = emailInput.value;

      // Clear previous error
      errorSpan.textContent = "";

      if (!this.validateEmail(emailInput.value)) {
        errorSpan.textContent = "Please enter a valid email address";
        return;
      }

      // Handle API call
      submitButton.disabled = true;
      submitButton.textContent = "Verifying...";

      try {
        const response = await fetch(`${API_URL}send_otp/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput.value,
            is_register_user: true,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Email verification failed");
        }
        const data = await response.json();
        // console.log(data);
        // If successful, show success message or move to next step
        this.isVerified = true;
        this.user_id = data.data.user_id;
        this.render();
      } catch (error) {
        errorSpan.textContent = error.message;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Verify";
      }
    });
  }

  verifyOTP() {
    const form = this.container.querySelector("#otpForm");
    const submitButton = form.querySelector("#forgetBtn");

    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton);

    newButton.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const otpInput = form.querySelector("#forget_otp");
      const errorSpan = form.querySelector("#email_error");

      errorSpan.textContent = "";

      if (!otpInput.value || otpInput.value.length !== 6) {
        errorSpan.textContent = "Please enter a valid 6-digit OTP";
        return;
      }

      // Handle API call
      newButton.disabled = true;
      newButton.textContent = "Verifying...";

      try {
        const response = await fetch(`${API_URL}verify_otp/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: otpInput.value,
            email: this.email,
            user_id: this.user_id,
          }),
        });

        if (!response.ok) {
          throw new Error(data.message || "OTP verification failed");
        }
        const data = await response.json();
        // console.log(data.data);
        this.reference_id = data.data.access_token;

        this.otp = true;
        this.render();
      } catch (error) {
        errorSpan.textContent = error.message;
      } finally {
        newButton.disabled = false;
        newButton.textContent = "Verify";
      }
    });
  }

  resetPassword() {
    const form = this.container.querySelector("#resetPasswordForm");
    const submitButton = form.querySelector("#resetBtn");
    const passwordInput = form.querySelector("#new_password");
    const confirmPasswordInput = form.querySelector("#confirm_password");
    const passwordError = form.querySelector("#password_error");
    const confirmPasswordError = form.querySelector("#confirm_password_error");

    // Remove any existing eventlisteners
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton);

    newButton.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Clear previous errors
      passwordError.textContent = "";
      confirmPasswordError.textContent = "";

      // Validate password
      if (!this.validatePassword(passwordInput.value)) {
        passwordError.textContent =
          "Password must be at least 8 characters long and contain at least one number and one special character";
        return;
      }

      // Validate password match
      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordError.textContent = "Passwords do not match";
        return;
      }

      // Handle API call
      newButton.disabled = true;
      newButton.textContent = "Resetting...";

      try {
        const response = await fetch(`${API_URL}forgot_password/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.reference_id}`,
          },
          body: JSON.stringify({
            new_password: passwordInput.value,
            confirm_new_password: confirmPasswordInput.value,
            email: this.email,
            reference_id: this.reference_id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Password reset failed");
        }

        // Show success message
        alert("Password reset successfully");

        window.location.reload();
        localStorage.clear();
      } catch (error) {
        passwordError.textContent = error.message;
      } finally {
        newButton.disabled = false;
        newButton.textContent = "Reset Password";
      }
    });
  }

  submitHandler() {
    if (!this.isVerified && !this.otp) {
      this.verifyEmail();
    } else if (this.isVerified && !this.otp) {
      this.verifyOTP();
    } else if (this.isVerified && this.otp) {
      this.resetPassword();
    }
  }

  emailVerificationForm() {
    this.container.innerHTML = `
        <form id="forgetForm">
              <div class="o-modal__loginformgroup">
                <label class="o-modal__loginlabeltext">email</label>
                <input
                  id="forget_email"
                  name="email"
                  type="text"
                  class="o-modal__logininput"
                  placeholder="Enter your email"
                />
                <span id="email_error" class="error-message"></span>
              </div>
              <div class="o-modal__btnslide">
                <span class="o-modal__slidespan">
                  <button id="forgetBtn" type="submit" class="o-modal__herpbtn">
                    Verify
                  </button>
                </span>
        </div>
      </form>`;
  }
  otpVerificationForm() {
    this.container.innerHTML = `
        <form id="otpForm" onsubmit="return false;">
              <div class="o-modal__loginformgroup">
                <label class="o-modal__loginlabeltext">OTP</label>
                <input
                  id="forget_otp"
                  name="otp"
                  type="number"
                  class="o-modal__logininput"
                  placeholder="Please enter otp send in your mail"
                />
                <span id="email_error" class="error-message"></span>
              </div>
              <div class="o-modal__btnslide">
                <span class="o-modal__slidespan">
                  <button id="forgetBtn" type="button" class="o-modal__herpbtn">
                    Verify
                  </button>
                </span>
              </div>
      </form>`;

    this.verifyOTP();
  }
  passwordResetForm() {
    this.container.innerHTML = `
         <form id="resetPasswordForm" onsubmit="return false;">
            <div class="o-modal__loginformgroup">
                <label class="o-modal__loginlabeltext">New Password</label>
                <input
                    id="new_password"
                    name="password"
                    type="password"
                    class="o-modal__logininput"
                    placeholder="Enter new password"
                />
                <span id="password_error" class="error-message"></span>
            </div>
            <div class="o-modal__loginformgroup">
                <label class="o-modal__loginlabeltext">Confirm Password</label>
                <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    class="o-modal__logininput"
                    placeholder="Confirm new password"
                />
                <span id="confirm_password_error" class="error-message"></span>
            </div>
            <div class="o-modal__btnslide">
                <span class="o-modal__slidespan">
                    <button id="resetBtn" type="button" class="o-modal__herpbtn">
                        Reset Password
                    </button>
                </span>
            </div>
        </form>`;

    // Add event listener after creating the form
    this.resetPassword();
  }

  render() {
    if (!this.isVerified && !this.otp) {
      this.emailVerificationForm();
    } else if (this.isVerified && !this.otp) {
      this.otpVerificationForm();
    } else if (this.isVerified && this.otp) {
      this.passwordResetForm();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("forget-password-container");
  // console.log(container);
  new ForgetPassword(container);
});
