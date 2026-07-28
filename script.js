const input = document.getElementById("search-input");
const autocompleteList = document.getElementById("autocomplete-list");

let currentFocus = -1; //To track the currently active suggestiom

function selectSuggestion(food) {
input.value = food;
autocompleteList.innerHTML = "";
window.location.href = "index.html";
}

//Part 1: Handling user input and filtering suggestions
input.addEventListener("input", function () {
const query = this.value.toLowerCase();
//Get user input and convert to lowercase for case-insensitive matching
autocompleteList.innerHTML = ""; //Clear previous autocomplete suggestions
currentFocus = -1; //Reset the focus index when typing new input

//If the input is empty dont show any suggestions
if (!query) return;

//Filter the foods based on user input
const filteredSuggestions = foods.filter((food) =>
food.toLowerCase().includes(query)
);

//Part 2:Create suggestions list dynamically
filteredSuggestions.forEach((food) => {
const item = document.createElement("div");
item.innerHTML = food; //Set the suggestion text
item.addEventListener("click", function () {
selectSuggestion(food);
});
autocompleteList.appendChild(item); //Add the suggestion to list
});
});

//Part 3: handling keyboard navigation(arrow keys and enter)
input.addEventListener("keydown", function (e) {
let items = autocompleteList.getElementsByTagName("div");
//get all suggestions div elements
if (e.key === "ArrowDown") {
currentFocus++;
highlightItem(items);
} else if (e.key === "ArrowUp") {
currentFocus--;
highlightItem(items);
} else if (e.key === "Enter") {
e.preventDefault();
if (currentFocus > -1 && items[currentFocus]) {
items[currentFocus].click();
}
}
});

//Part 4: Function to highlight the current item
function highlightItem(items) {
if (!items) return;
removeActive(items);
//Wrap focus withon the bounds of suggestion list
if (currentFocus >= items.length) currentFocus = 0;
if (currentFocus < 0) currentFocus = items.length - 1;
items[currentFocus].classList.add("autocomplete-active");
}

//Part 5: Function to remove the active class from all items
function removeActive(items) {
for (let i = 0; i < items.length; i++) {
items[i].classList.remove("autocomplete-active");
}
}

//Part 6: close the autocomple list is the user click outite tje input field or list
document.addEventListener("click", function (e) {
if (!autocompleteList.contains(e.target) && e.target !== input) {
autocompleteList.innerHTML = "";
}
});