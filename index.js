const restaurants = [

    "Snocorner",
    "Tasty Food To Go",
    "Bubu's Restaurant",
    "Cafe Gazelle",
    "Saffron Mediterranean Grill"

];



function showRecommendations() {


    const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];



    const popup = document.getElementById("recommendationPopup");



    popup.innerHTML = `

        <i class = "fa-solid fa-bell-concierge"></i>

        Try ${randomRestaurant}!

    `;



    popup.classList.add("show");



    setTimeout(() => {

        popup.classList.remove("show");

    }, 3000);


}