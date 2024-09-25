document.addEventListener("DOMContentLoaded", function() {
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");
    const password1Field = document.getElementById("password1");
    const password2Field = document.getElementById("password2");
    const submitButton = document.getElementById("submit-btn");

    // Real-time validation
    function validateForm() {
        let isValid = true;

        // Validate username
        if (usernameField.value.trim().length < 3) {
            usernameField.style.borderColor = "red";
            isValid = false;
        } else {
            usernameField.style.borderColor = "";
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
            emailField.style.borderColor = "red";
            isValid = false;
        } else {
            emailField.style.borderColor = "";
        }

        // Validate passwords
        if (password1Field.value !== password2Field.value || password1Field.value.length < 8) {
            password1Field.style.borderColor = "red";
            password2Field.style.borderColor = "red";
            isValid = false;
        } else {
            password1Field.style.borderColor = "";
            password2Field.style.borderColor = "";
        }

        // Enable/Disable submit button
        submitButton.disabled = !isValid;
    }

    // Add input event listeners for real-time validation
    [usernameField, emailField, password1Field, password2Field].forEach(input => {
        input.addEventListener("input", validateForm);
    });
});

// Move the togglePassword function outside to make it global
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}
