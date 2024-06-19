document.addEventListener('DOMContentLoaded', function () {
    console.log("NASA APOD script loaded successfully");

    // Lightbox functionality
    var modal = document.getElementById("myLightbox");
    var img = document.getElementById("image");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var span = document.getElementsByClassName("close")[0];

    img.onclick = function() {
        console.log("Image clicked");
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    }

    span.onclick = function() {
        console.log("Close clicked");
        modal.style.display = "none";
    }

    // Smooth scrolling functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Initialize AOS (Animate On Scroll)
    AOS.init();
});
