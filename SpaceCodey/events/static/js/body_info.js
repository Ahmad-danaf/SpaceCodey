document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('info-form');
    const infoSections = document.getElementById('info-sections');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const params = new URLSearchParams(formData).toString();

        fetch(`/events/body_info/?${params}`)
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Extract the positions and events sections from the returned HTML
                const positionsSection = tempDiv.querySelector('.positions-section');
                const eventsSection = tempDiv.querySelector('.events-section');

                // Clear the current info sections
                infoSections.innerHTML = '';

                // Append the new positions and events sections
                if (positionsSection) {
                    infoSections.appendChild(positionsSection);
                }
                if (eventsSection) {
                    infoSections.appendChild(eventsSection);
                }
            })
            .catch(error => console.error('Error fetching body information:', error));
    });
});
