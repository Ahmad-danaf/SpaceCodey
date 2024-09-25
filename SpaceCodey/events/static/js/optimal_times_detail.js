document.addEventListener("DOMContentLoaded", function() {
    const optimalTimesList = document.getElementById('optimalTimesList');
    if (optimalTimesList) {
        optimalTimesList.style.opacity = 0;
        fadeIn(optimalTimesList, 1000); // Fading in the list over 1 second
    }

    function fadeIn(element, duration) {
        let opacity = 0;
        const interval = 50; // Time interval for opacity change
        const gap = interval / duration;

        function fade() {
            opacity += gap;
            element.style.opacity = opacity;
            
            if (opacity >= 1) {
                clearInterval(fading);
            }
        }

        const fading = setInterval(fade, interval);
    }
});
