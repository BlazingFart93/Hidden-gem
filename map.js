let userLocation = null;

const markersGroup = L.layerGroup();

const map = L.map("map").setView([33.7749, -118.1937], 13);
markersGroup.addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

function fetchRealLocations(query, lat, lng) {
  markersGroup.clearLayers();

  const overpassQuery = `
[out:json][timeout:25];
(
  node["amenity"="restaurant"](around:4828,${lat},${lng});
  way["amenity"="restaurant"](around:4828,${lat},${lng});
  relation["amenity"="restaurant"](around:4828,${lat},${lng});

  node["amenity"="fast_food"](around:4828,${lat},${lng});
  way["amenity"="fast_food"](around:4828,${lat},${lng});
  relation["amenity"="fast_food"](around:4828,${lat},${lng});

  node["amenity"="cafe"](around:4828,${lat},${lng});
  way["amenity"="cafe"](around:4828,${lat},${lng});
  relation["amenity"="cafe"](around:4828,${lat},${lng});
);
out center;
`;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: overpassQuery
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch locations.");
      }
      return response.json();
    })
    .then((data) => {

      const matches = data.elements.filter((place) => {
        if (!place.tags) return false;

        const searchText = (
          (place.tags.name || "") +
          " " +
          (place.tags.cuisine || "")
        ).toLowerCase();

        return searchText.includes(query.toLowerCase());
      });

      if (matches.length === 0) {
        alert("No nearby " + query + " places found.");
        return;
      }

      const bounds = [];

      matches.forEach((place) => {

        const placeLat = place.lat ?? place.center?.lat;
        const placeLng = place.lon ?? place.center?.lon;

        if (!placeLat || !placeLng) return;

        bounds.push([placeLat, placeLng]);

        const name = place.tags.name || "Unnamed Restaurant";
        const cuisine = place.tags.cuisine || "Restaurant";

        L.marker([placeLat, placeLng])
          .bindPopup(`
            <b>${name}</b><br>
            ${cuisine}
          `)
          .addTo(markersGroup);
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15
        });
      }

    })
    .catch((error) => {
      console.error(error);
      alert("Unable to load nearby restaurants.");
    });
}

navigator.geolocation.getCurrentPosition(

  (position) => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    userLocation = L.latLng(lat, lng);

    map.setView([lat, lng], 14);

    L.circle([lat, lng], {
      radius: 3 * 1609.34,
      color: "#2563eb",
      fillColor: "#3b82f6",
      fillOpacity: 0.15
    }).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup("You are here!")
      .openPopup();

    const selectedFood = localStorage.getItem("selectedFood");

    if (selectedFood) {
      fetchRealLocations(selectedFood, lat, lng);
      localStorage.removeItem("selectedFood");
    }

  },

  (error) => {
    console.error(error);
    alert("Please allow location access.");
  }

);