
const WHATSAPP_NUMBER = "03162253406";
// IMPORTANT: Replace this with your own WhatsApp number.
// Pakistan number format: 92 + number without the first 0.

const products = [
  { id: 1, name: "Dumbbell Set", price: 4500, category: "Weights", emoji: "🏋️", desc: "Strength training essentials" },
  { id: 2, name: "Olympic Barbell", price: 8500, category: "Weights", emoji: "💪", desc: "Heavy-duty training bar" },
  { id: 3, name: "Weight Plates", price: 3000, category: "Weights", emoji: "⚫", desc: "Build your strength" },
  { id: 4, name: "Gym Gloves", price: 1200, category: "Accessories", emoji: "🥊", desc: "Comfortable hand protection" },
  { id: 5, name: "Skipping Rope", price: 650, category: "Accessories", emoji: "🪢", desc: "Cardio training essential" },
  { id: 6, name: "Resistance Bands", price: 950, category: "Accessories", emoji: "🔴", desc: "Flexible workout training" },
  { id: 7, name: "Workout Bench", price: 12000, category: "Equipment", emoji: "🪑", desc: "Train at home or gym" },
  { id: 8, name: "Kettlebell", price: 2500, category: "Equipment", emoji: "🏋️", desc: "Functional strength workouts" }
];

const cart = [];

const money = amount =>
  "Rs. " + amount.toLocaleString("en-PK");

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) &&
    (category === "All" || product.category === category)
  );

  document.getElementById("no-results").hidden = filtered.length > 0;

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-art">${product.emoji}</div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

function changeQuantity(id, change) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart.splice(cart.indexOf(item), 1);
  }

  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty, 0
  );

  document.getElementById("cart-count").textContent = totalItems;
  document.getElementById("cart-total").textContent = money(totalPrice);

  const container = document.getElementById("cart-items");

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.emoji} ${item.name}</h4>
        <p>${money(item.price)} each</p>
        <div class="quantity-controls">
          <button data-minus="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button data-plus="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div>
        <strong>${money(item.price * item.qty)}</strong><br>
        <button class="remove-button" data-remove="${item.id}">Remove</button>
      </div>
    </div>
  `).join("");
}

function openCart() {
  document.getElementById("cart-panel").classList.add("open");
  document.getElementById("overlay").classList.add("open");
  document.getElementById("cart-panel").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.getElementById("cart-panel").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
  document.getElementById("cart-panel").setAttribute("aria-hidden", "true");
}

function sendWhatsApp(message) {
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER) ||
      WHATSAPP_NUMBER === "923001234567") {
    alert("Pehle script.js mein apna WhatsApp number set karein.");
    return;
  }

  const url = "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add a product first.");
    return;
  }

  let message = "Assalam-o-Alaikum SK R Gym! I want to order:\n\n";

  cart.forEach(item => {
    message += `${item.name} x ${item.qty} = ${money(item.price * item.qty)}\n`;
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty, 0
  );

  message += `\nTotal: ${money(total)}\n`;
  message += "\nPlease confirm product availability and delivery charges.";

  sendWhatsApp(message);
}

function chooseMembership(plan) {
  const message =
    `Assalam-o-Alaikum SK R Gym!\n` +
    `I am interested in the ${plan} membership plan.\n` +
    `Please share the joining details.`;

  sendWhatsApp(message);
}

// Product search and category filter
searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);

// Event delegation for product and cart buttons
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

document.getElementById("cart-items").addEventListener("click", event => {
  const target = event.target;

  if (target.matches("[data-minus]")) {
    changeQuantity(Number(target.dataset.minus), -1);
  }

  if (target.matches("[data-plus]")) {
    changeQuantity(Number(target.dataset.plus), 1);
  }

  if (target.matches("[data-remove]")) {
    const index = cart.findIndex(
      item => item.id === Number(target.dataset.remove)
    );
    if (index !== -1) cart.splice(index, 1);
    renderCart();
  }
});

// Cart controls
document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", checkout);

document.getElementById("clear-cart").addEventListener("click", () => {
  cart.length = 0;
  renderCart();
});

// Membership buttons
document.querySelectorAll(".plan-button").forEach(button => {
  button.addEventListener("click", () => {
    chooseMembership(button.dataset.plan);
  });
});

// Contact button
document.getElementById("contact-whatsapp").addEventListener("click", () => {
  sendWhatsApp("Assalam-o-Alaikum SK R Gym! I would like more information.");
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial display
renderProducts();
renderCart();
