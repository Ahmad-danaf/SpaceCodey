document.addEventListener('DOMContentLoaded', function() {
    function toggleInputFields() {
        const cityRadio = document.getElementById('city-radio').checked;
        const cityFields = document.getElementById('city-fields');
        const latLongFields = document.getElementById('lat-long-fields');
        
        if (cityRadio) {
            cityFields.style.display = 'block';
            latLongFields.style.display = 'none';
        } else {
            cityFields.style.display = 'none';
            latLongFields.style.display = 'block';
        }
    }

    document.getElementById('city-radio').addEventListener('change', toggleInputFields);
    document.getElementById('latlong-radio').addEventListener('change', toggleInputFields);

    toggleInputFields(); // Set init state
});
