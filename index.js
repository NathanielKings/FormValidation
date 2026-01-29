// ===================== RULE FUNCTIONS =====================

// ----- NAME RULES -----
function atleast3char(text) {
  return text.value.trim().length >= 3;
}

function noNumber(text) {
  return !/[0-9]/.test(text.value);
}

function twoWords(text) {
  let value = text.value.trim();
  let wordCount = 0;
  let inWord = false;

  for (let i = 0; i < value.length; i++) {
    if (value[i] !== " " && !inWord) {
      wordCount++;
      inWord = true;
    }

    if (value[i] === " ") {
      inWord = false;
    }
  }

  return wordCount >= 2;
}

// ----- EMAIL RULES -----
function validEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email.value);
}

function blockedEmail(email) {
  const blocked = ["tempmail.com", "mailinator.com", "10minutemail.com"];

  const domain = email.value.split("@")[1];
  return blocked.includes(domain);
}

// ----- PASSWORD RULES -----
function min8(password) {
  return password.value.length >= 8;
}

function hasUpper(password) {
  return /[A-Z]/.test(password.value);
}

function hasLower(password) {
  return /[a-z]/.test(password.value);
}

function hasNumber(password) {
  return /[0-9]/.test(password.value);
}

function hasSpecial(password) {
  return /[!@#$%^&*]/.test(password.value);
}

// ----- CONFIRM PASSWORD -----
function passwordMatch(password, confirmPassword) {
  return password.value === confirmPassword.value;
}

// ===================== UI HELPERS =====================
function showError(input, message) {
  const field = input.parentElement;
  field.classList.add("error");
  field.classList.remove("success");
  field.querySelector(".error").innerText = message;
}

function showSuccess(input) {
  const field = input.parentElement;
  field.classList.remove("error");
  field.classList.add("success");
  field.querySelector(".error").innerText = "";
}

// ===================== FIELD VALIDATORS =====================
function checkName(name) {
  if (!atleast3char(name)) {
    showError(name, "At least 3 characters");
    return false;
  }

  if (!noNumber(name)) {
    showError(name, "No numbers allowed");
    return false;
  }

  if (!twoWords(name)) {
    showError(name, "Enter first and last name");
    return false;
  }

  showSuccess(name);
  return true;
}

function checkEmail(email) {
  if (!validEmail(email)) {
    showError(email, "Invalid email format");
    return false;
  }

  if (blockedEmail(email)) {
    showError(email, "Email domain not allowed");
    return false;
  }

  showSuccess(email);
  return true;
}

function checkPassword(password) {
  if (!min8(password)) {
    showError(password, "Minimum 8 characters");
    return false;
  }

  if (!hasUpper(password)) {
    showError(password, "Add an uppercase letter");
    return false;
  }

  if (!hasLower(password)) {
    showError(password, "Add a lowercase letter");
    return false;
  }

  if (!hasNumber(password)) {
    showError(password, "Add a number");
    return false;
  }

  if (!hasSpecial(password)) {
    showError(password, "Add a special character");
    return false;
  }

  showSuccess(password);
  return true;
}

function checkConfirm(password, confirmPassword) {
  if (!passwordMatch(password, confirmPassword)) {
    showError(confirmPassword, "Passwords do not match");
    return false;
  }

  showSuccess(confirmPassword);
  return true;
}

// ===================== FIELD-SPECIFIC VALIDATORS =====================
function validateNameField() {
  checkName(nameInput);
  updateButtonState();
}

function validateEmailField() {
  checkEmail(emailInput);
  updateButtonState();
}

function validatePasswordField() {
  checkPassword(passwordInput);
  checkConfirm(passwordInput, confirmInput);
  updateButtonState();
}

function validateConfirmField() {
  checkConfirm(passwordInput, confirmInput);
  updateButtonState();
}

// ===================== SILENT FORM VALIDATION =====================
function isFormValidSilently() {
  return (
    atleast3char(nameInput) &&
    noNumber(nameInput) &&
    twoWords(nameInput) &&
    validEmail(emailInput) &&
    !blockedEmail(emailInput) &&
    min8(passwordInput) &&
    hasUpper(passwordInput) &&
    hasLower(passwordInput) &&
    hasNumber(passwordInput) &&
    hasSpecial(passwordInput) &&
    passwordMatch(passwordInput, confirmInput)
  );
}

function updateButtonState() {
  const valid = isFormValidSilently();
  button.disabled = !valid;
  button.classList.toggle("enabled", valid);
}

// ===================== FORM LOGIC =====================
const form = document.getElementById("form");
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const button = document.getElementById("btn");
const statusMessage = document.getElementById("status-message");

function validateForm() {
  const nameOk = checkName(nameInput);
  const emailOk = checkEmail(emailInput);
  const passwordOk = checkPassword(passwordInput);
  const confirmOk = checkConfirm(passwordInput, confirmInput);

  const allValid = nameOk && emailOk && passwordOk && confirmOk;

  button.disabled = !allValid;
  button.classList.toggle("enabled", allValid);

  return allValid;
}

// Real-time validation
// ===================== EVENT LISTENERS =====================
nameInput.addEventListener("input", validateNameField);
nameInput.addEventListener("blur", validateNameField);

emailInput.addEventListener("input", validateEmailField);
emailInput.addEventListener("blur", validateEmailField);

passwordInput.addEventListener("input", validatePasswordField);
passwordInput.addEventListener("blur", validatePasswordField);

confirmInput.addEventListener("input", validateConfirmField);
confirmInput.addEventListener("blur", validateConfirmField);

// ===================== SUBMIT SIMULATION =====================
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validateForm()) return;

  button.innerText = "Submitting...";
  button.disabled = true;

  statusMessage.innerText = "";
  statusMessage.className = "";

  setTimeout(function () {
    const success = Math.random() > 0.3;

    if (success) {
      statusMessage.innerText = "Account created successfully 🎉";
      statusMessage.className = "success";
      form.reset();
    } else {
      statusMessage.innerText = "Something went wrong. Try again.";
      statusMessage.className = "error";
    }

    button.innerText = "Sign Up";
    button.disabled = false;
  }, 1500);
});
