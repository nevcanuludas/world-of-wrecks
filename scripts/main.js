fetch("data/wrecks.json")
  .then(response => response.json())
  .then(wrecks => {
    // Initialize base layers
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });
    const esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    const openSeaMap = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; OpenSeaMap contributors'
    });

    // Initialize map with OSM as default layer
    const map = L.map('map', {
      layers: [osm],
      center: [30, 20],
      zoom: 2
    });

    // Add layer control
    const baseLayers = {
      "OpenStreetMap": osm,
      "Satellite": esriWorldImagery,
      "Nautical": openSeaMap
    };
    L.control.layers(baseLayers).addTo(map);

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

      if (markers.length > 0) {
        const bounds = L.featureGroup(markers).getBounds();
        map.fitBounds(bounds);
        map.zoomOut(1); // zoom out one level for extra space
      } else {
        map.setView([30, 20], 2);
      }
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
