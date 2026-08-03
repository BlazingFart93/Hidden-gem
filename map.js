let userLocation = null;

const markersGroup = L.layerGroup();

const map = L.map("map").setView([33.7749, -118.1937], 13);
markersGroup.addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);



const hiddenGems = [

  {
    name: "Snocorner",
    lat: 33.7742,
    lng: -118.1548,
    food: "Shaved Ice Desserts"
  },

  {
    name: "Tasty Food To Go",
    lat: 33.7798,
    lng: -118.1715,
    food: "Thai Lao Food"
  },

  {
    name: "Bubu's Restaurant",
    lat: 33.7910,
    lng: -118.1895,
    food: "Mexican Food"
  },

  {
    name: "Cafe Gazelle",
    lat: 33.7610,
    lng: -118.1500,
    food: "Italian Food"
  },

  {
    name: "Black Pork",
    lat: 33.7920,
    lng: -118.2200,
    food: "Smoked Meats"
  },

  {
    name: "Saffron Mediterranean Grill",
    lat: 33.7707,
    lng: -118.1925,
    food: "Mediterranean Food"
  },

  {
    name: "Sesame Dinette",
    lat: 33.7915,
    lng: -118.1940,
    food: "Vietnamese Food"
  },

  {
    name: "Lacquered",
    lat: 33.7710,
    lng: -118.1400,
    food: "Fried Chicken Asian Fusion"
  },

  {
    name: "EA Seafood Restaurant",
    lat: 33.8145,
    lng: -118.1770,
    food: "Chinese Seafood"
  },

  {
    name: "La Casa De Iris",
    lat: 33.7800,
    lng: -118.1890,
    food: "Puerto Rican Food"
  }

];



const chains = [

  "mcdonald",
  "starbucks",
  "burger king",
  "wendy",
  "taco bell",
  "subway",
  "chick-fil-a",
  "jack in the box",
  "panda express",
  "kfc",
  "chipotle",
  "domino",
  "pizza hut",
  "five guys"

];



function fetchHiddenGems(lat, lng, query = "") {


  markersGroup.clearLayers();



  hiddenGems.forEach((place) => {


    const searchText = (

      place.name +
      " " +
      place.food

    ).toLowerCase();



    if (query && !searchText.includes(query.toLowerCase())) {

      return;

    }



    L.marker([place.lat, place.lng])

      .bindPopup(`

        <b>${place.name}</b><br>
        ${place.food}

      `)

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



        const isChain = chains.some((chain) =>

          name.includes(chain)

        );



        if (isChain) return false;



        if (query) {



          const searchText = (

            place.tags.name +
            " " +
            (place.tags.cuisine || "")

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

          .bindPopup(`

            <b>${name}</b><br>
            ${cuisine}

          `)

          .addTo(markersGroup);



      });



    })



    .catch((error) => {


      console.error(error);

      alert("Unable to load hidden gems.");


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



      fetchHiddenGems(lat, lng, selectedFood);



      localStorage.removeItem("selectedFood");



    }


    else {



      fetchHiddenGems(lat, lng);



    }




  },



  (error) => {



    console.error(error);



    alert("Please allow location access.");



  }


);