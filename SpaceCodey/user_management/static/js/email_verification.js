document.addEventListener("DOMContentLoaded", function() {
    const resendButton = document.querySelector(".btn-warning");

    // Disable resend button for 30 seconds to prevent spam
    let disableTime = 30; // seconds
    resendButton.disabled = true;
    const countdown = setInterval(() => {
        resendButton.innerText = `Resend Verification Email (${disableTime--}s)`;
        if (disableTime < 0) {
            clearInterval(countdown);
            resendButton.disabled = false;
            resendButton.innerText = "Resend Verification Email";
        }
    }, 1000);
});
