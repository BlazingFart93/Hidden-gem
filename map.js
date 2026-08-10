let userLocation = null;

const markersGroup = L.layerGroup();

const map = L.map("map").setView([33.7749, -118.1937], 13);
markersGroup.addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const chains = [
  "mcdonald", "starbucks", "burger king", "wendy", "taco bell",
  "subway", "chick-fil-a", "jack in the box", "panda express",
  "kfc", "chipotle", "domino", "pizza hut", "five guys"
];



const locations = [
  { name: "Tony's Corner Pizza", lat: 33.7701, lng: -118.1937, foodType: "pizza", isChain: false },
  { name: "Domino's Pizza", lat: 33.7838, lng: -118.1141, foodType: "pizza", isChain: true },
  { name: "Pizza Hut", lat: 33.7550, lng: -118.1880, foodType: "pizza", isChain: true },
  { name: "Mama Rosa Slice Shop", lat: 33.7900, lng: -118.1500, foodType: "pizza", isChain: false },
  { name: "El Sabroso Tacos", lat: 33.7720, lng: -118.1600, foodType: "tacos", isChain: false },
  { name: "Taco Bell", lat: 33.7650, lng: -118.2000, foodType: "tacos", isChain: true },
  { name: "Sakura Sushi Bar", lat: 33.7800, lng: -118.1300, foodType: "sushi", isChain: false },
  { name: "Golden Wok", lat: 33.7600, lng: -118.1400, foodType: "chinese", isChain: false },
  { name: "In-N-Out Burger", lat: 33.7750, lng: -118.1750, foodType: "burgers", isChain: true },
  { name: "Joe's Backyard Burgers", lat: 33.7680, lng: -118.1550, foodType: "burgers", isChain: false }
];

function fetchHiddenGems(lat, lng, query = "") {
  markersGroup.clearLayers();



  locations.forEach((place) => {
    const searchText = (place.name + " " + place.foodType).toLowerCase();
    if (query && !searchText.includes(query.toLowerCase())) {
      return;
    }

    L.marker([place.lat, place.lng])
      .bindPopup(`<b>${place.name}</b><br>${place.foodType}`)
      .addTo(markersGroup);
  });



  const overpassQuery = `
[out:json][timeout:25];
(
  node["amenity"="restaurant"](around:10000,${lat},${lng});
  way["amenity"="restaurant"](around:10000,${lat},${lng});
  node["amenity"="cafe"](around:10000,${lat},${lng});
  way["amenity"="cafe"](around:10000,${lat},${lng});
  node["amenity"="fast_food"](around:10000,${lat},${lng});
  way["amenity"="fast_food"](around:10000,${lat},${lng});
);
out center;
`;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: overpassQuery
  })
    .then((response) => response.json())
    .then((data) => {
      const matches = data.elements.filter((place) => {
        if (!place.tags?.name) return false;
        const name = place.tags.name.toLowerCase();
        const isChain = chains.some((chain) => name.includes(chain));
        if (isChain) return false;

        if (query) {
          const searchText = (
            place.tags.name + " " + (place.tags.cuisine || "")
          ).toLowerCase();
          return searchText.includes(query.toLowerCase());
        }

        return true;
      });

      matches.forEach((place) => {
        const placeLat = place.lat ?? place.center?.lat;
        const placeLng = place.lon ?? place.center?.lon;

        if (!placeLat || !placeLng) return;

        const name = place.tags.name;
        const cuisine = place.tags.cuisine || "Local Restaurant";

        L.marker([placeLat, placeLng])
          .bindPopup(`<b>${name}</b><br>${cuisine}`)
          .addTo(markersGroup);
      });
    })
    .catch((error) => {
      console.error(error);
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
      color: "#2563EB",
      fillColor: "#3B82F6",
      fillOpacity: 0.15
    }).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup("You are here!")
      .openPopup();

    const selectedFood = localStorage.getItem("selectedFood");

    if (selectedFood) {
      fetchHiddenGems(lat, lng, selectedFood);
      localStorage.removeItem("selectedFood");
    } else {
      fetchHiddenGems(lat, lng);
    }
  },
  (error) => {
    console.error(error);
    alert("Please allow location access.");
  }
);