const grid = document.getElementById("grid");
const cards = grid.querySelectorAll(".col");
const search = document.getElementById("search");
const message = document.getElementById("no-results");

// Extract numeric price from text (e.g. "Rs 2,400" -> 2400)
function getPrice(card) {
  const text = card.querySelector(".price").textContent;
  return parseFloat(text.replace(/[^0-9.]/g, ""));
}

// Show "No products found" if all cards are hidden by search or category filter
function checkEmpty() {
  let visible = 0;
  cards.forEach(function (card) {
    if (getComputedStyle(card).display !== "none") {
      visible++;
    }
  });
  message.style.display = visible === 0 ? "block" : "none";
}

// Live search filter by product name (case-insensitive)
search.addEventListener("input", function () {
  const text = search.value.toLowerCase();
  cards.forEach(function (card) {
    const name = card.querySelector(".card-title").textContent.toLowerCase();
    if (name.includes(text)) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
  checkEmpty();
});

// Re-check empty state when category radio button selection changes
document.querySelectorAll('input[name="cat"]').forEach(function (radio) {
  radio.addEventListener("change", checkEmpty);
});

// Sort button toggle (Low-to-High / High-to-Low) using appendChild
let ascending = true;
document.getElementById("sortBtn").addEventListener("click", function () {
  const list = Array.from(grid.querySelectorAll(".col"));
  list.sort(function (a, b) {
    return ascending ? getPrice(a) - getPrice(b) : getPrice(b) - getPrice(a);
  });
  list.forEach(function (card) {
    grid.appendChild(card);
  });
  ascending = !ascending;
});

// Add "Premium" badge on page load for items costing more than N x 100 = Rs 1800
cards.forEach(function (card) {
  if (getPrice(card) > 1800) {
    const tag = document.createElement("span");
    tag.textContent = "Premium";
    tag.className = "premium";
    card.querySelector(".card-title").appendChild(tag);
  }
});