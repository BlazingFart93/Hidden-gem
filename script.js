const input = document.getElementById("search-input");
const autocompleteList = document.getElementById("autocomplete-list");

let currentFocus = -1;

function selectSuggestion(food) {
  input.value = food;
  autocompleteList.innerHTML = "";

  localStorage.setItem("selectedFood", food);
  window.location.href = "map.html";
}

input.addEventListener("input", function () {
  const query = this.value.toLowerCase();

  autocompleteList.innerHTML = "";
  currentFocus = -1;

  if (!query) return;

  const filteredSuggestions = foods.filter((food) =>
    food.toLowerCase().includes(query)
  );

  filteredSuggestions.forEach((food) => {
    const item = document.createElement("div");

    item.innerHTML = food;

    item.addEventListener("click", function () {
      selectSuggestion(food);
    });

    autocompleteList.appendChild(item);
  });
});

input.addEventListener("keydown", function (e) {
  const items = autocompleteList.getElementsByTagName("div");

  if (e.key === "ArrowDown") {
    currentFocus++;
    highlightItem(items);
  }

  if (e.key === "ArrowUp") {
    currentFocus--;
    highlightItem(items);
  }

  if (e.key === "Enter") {
    e.preventDefault();

    if (currentFocus > -1 && items[currentFocus]) {
      items[currentFocus].click();
    }
  }
});

function highlightItem(items) {
  removeActive(items);

  if (currentFocus >= items.length) {
    currentFocus = 0;
  }

  if (currentFocus < 0) {
    currentFocus = items.length - 1;
  }

  items[currentFocus].classList.add("autocomplete-active");
}

function removeActive(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("autocomplete-active");
  }
}

document.addEventListener("click", function (e) {
  if (!autocompleteList.contains(e.target) && e.target !== input) {
    autocompleteList.innerHTML = "";
  }
});