// Initialize the map
const mymap = L.map('map').setView([0, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap); //{x} {y}-->0 {z}-->3

// Function to fetch ISS current location
async function getISSLocation() {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const data = await response.json();
    const { latitude, longitude } = data;
    return { latitude, longitude };
  } catch (error) {
    console.error('Error fetching ISS location:', error);
    return null;
  }
}

// Update ISS marker on the map
async function updateISSMarker() {
  const location = await getISSLocation();
  if (location) {
    const { latitude, longitude } = location;
    const issIcon = L.icon({
      iconUrl: '/static/images/ISSIcon.png',
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
    const marker = L.marker([latitude, longitude], { icon: issIcon }).addTo(mymap);
    marker.bindPopup('<b>International Space Station</b>').openPopup();
    mymap.setView([latitude, longitude]);
  }
}

// Update ISS marker every 5 seconds
updateISSMarker()
setInterval(updateISSMarker, 5000);
