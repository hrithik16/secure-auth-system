function validatePasswords() {
  // Get the values from the password input fields
  const password1 = document.getElementById("new-password").value;
  const password2 = document.getElementById("new-password1").value;
  const msg = document.getElementById("validationMessage");

  // Check if passwords are not empty
  if (password1.trim() === "" || password2.trim() === "") {
    alert("Passwords cannot be empty");
    return false;
  }

  // Check if passwords meet your criteria (e.g., minimum length, complexity)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Example: Requires at least 8 characters, one letter, and one digit

  if (!passwordRegex.test(password1)) {
    console.log(password1);
    msg.textContent = "Password 1 does not meet the criteria";
    return false;
  }

  if (!passwordRegex.test(password2)) {
    msg.textContent = "Password 1 does not meet the criteria";
    return false;
  }

  // Check if passwords match
  if (password1 !== password2) {
    msg.textContent = "Passwords do not match";
    return false;
  }
  return true;
}
