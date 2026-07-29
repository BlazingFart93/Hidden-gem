let userLocation = null;

const foodLoc = [
  {
    name: "Michael's Pizzeria",
    type: "Pizza",
    address: "5616 E 2nd St, Long Beach, CA 90803",
    lat: 33.7554,
    lng: -118.1228
  },
  {
    name: "Milana's New York Pizzeria",
    type: "Pizza",
    address: "165 E 4th St, Long Beach, CA 90802",
    lat: 33.7719,
    lng: -118.1912
  },
  {
    name: "The 4th Horseman",
    type: "Pizza",
    address: "121 W 4th St, Long Beach, CA 90802",
    lat: 33.7716,
    lng: -118.1944
  },
  {
    name: "Sushi Mafia",
    type: "Sushi",
    address: "649 E Broadway, Long Beach, CA 90802",
    lat: 33.7650,
    lng: -118.1824
  }
];

const map = L.map("map").setView([33.7749, -118.1937], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

foodLoc.forEach(location => {
  L.marker([location.lat, location.lng])
    .addTo(map)
    .bindPopup(
      `<b>${location.name}</b><br>${location.type}<br>${location.address}`
    );
});

const selectedFood = localStorage.getItem("selectedFood");

if (selectedFood) {
  const points = foodLoc
    .filter(place =>
      place.name.toLowerCase().includes(selectedFood.toLowerCase()) ||
      place.type.toLowerCase().includes(selectedFood.toLowerCase())
    )
    .map(place => [place.lat, place.lng]);

  if (points.length > 0) {
    map.fitBounds(points, {
      padding: 50,
      maxZoom: 16
    });
  }

  localStorage.removeItem("selectedFood");
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
  },
  () => {
    console.warn("Location not available");
  }
);