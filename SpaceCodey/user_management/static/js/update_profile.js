document.addEventListener("DOMContentLoaded", function() {
    const profilePictureInput = document.getElementById("profile_picture");
    const submitButton = document.querySelector(".btn-primary");

    // Preview profile picture before upload
    profilePictureInput.addEventListener("change", function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            const imagePreview = document.createElement("img");
            imagePreview.src = reader.result;
            imagePreview.style.maxWidth = "100px";
            imagePreview.style.marginTop = "10px";
            document.querySelector(".profile-container").appendChild(imagePreview);
        };
        reader.readAsDataURL(event.target.files[0]);
    });

    // Form validation checks
    submitButton.addEventListener("click", function(event) {
        const emailField = document.getElementById("email");
        const usernameField = document.getElementById("username");

        if (!emailField.value.includes("@")) {
            alert("Please enter a valid email address.");
            event.preventDefault();
        }

        if (usernameField.value.length < 3) {
            alert("Username must be at least 3 characters long.");
            event.preventDefault();
        }
    });
});
