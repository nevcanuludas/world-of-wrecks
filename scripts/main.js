fetch("data/wrecks.json")
  .then(response => response.json())
  .then(wrecks => {
    // Initialize map
    const map = L.map('map').setView([30, 20], 2); // World view

    // Add OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let markers = [];

    function renderMarkers() {
      // Remove old markers
      markers.forEach(m => map.removeLayer(m));
      markers = [];

      const countryFilter = document.getElementById('country').value;
      const typeFilter = document.getElementById('type').value;

      wrecks
        .filter(w => (!countryFilter || w.country === countryFilter) &&
                     (!typeFilter || w.type === typeFilter))
        .forEach(w => {
          const marker = L.marker([w.latitude, w.longitude]).addTo(map);
          marker.bindPopup(`<b>${w.name}</b><br><a href="wreck.html?id=${w.id}">View Details</a>`);
          markers.push(marker);
        });
    }

    // Initial render
    renderMarkers();

    // Add filter listeners
    document.getElementById('country').addEventListener('change', renderMarkers);
    document.getElementById('type').addEventListener('change', renderMarkers);
  })

  .catch(error => {
    console.error('Error loading wrecks data:', error);
  });
