const countries = [
    "Pizza",
    "Paella",
    "Pak Choi",
    "Pakora",
    "Pancakes",
    "Pancetta",
    "Pandanus Leaves",
    "Pad Thai",
    "Pardon Peppers",
    "Pasta",
    "Patatas bravas",
    "Peanut Butter Cookies",
    "Polish doughnuts",
    "plantain rolls",
];

//get the input and the autocomplete container elements
const input = document.getElementById("search-input");
const autocompleteList = document.getElementById("autocomplete-list");

let currentFocus = -1; //To track the currently active suggestiom

//Part 1: Handling user input and filtering suggestions
input.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    //Get user input and convert to lowercase for case-insensitive matching
    autocompleteList.innerHTML = ""; //Clear previous autocomplete suggestions
    currentFocus = -1; //Reset the focus index when typing new input

    //If the input is empty dont show any suggestions
    if (!query) return;

    //Filter the countries based on user input
    const filteredSuggestions = countries.filter((country) =>
        country.toLowerCase().includes(query)
    );
    //Part 2:Create suggestions list dynamically
    filteredSuggestions.forEach((country) => {
        const item = document.createElement("div");
        item.innerHTML = country; //Set the suggestion text
        item.addEventListener("click", function () {
            input.value = country; //set the suggestion text
            autocompleteList.innerHTML = ""; //Clear the suggestion list after selection
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