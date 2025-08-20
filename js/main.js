//Importar los productos, el IVA
import { initialProducts, TAX_RATE } from './products.js';
import { renderProducts } from './ui.js';

// Referencias DOM
const els = {
  productList:  document.getElementById('product-list'),
  cartRows:     document.getElementById('cart-rows'),
  subtotalText: document.getElementById('subtotalText'),
  taxRateText:  document.getElementById('taxRateText'),
  taxesText:    document.getElementById('taxesText'),
  totalText:    document.getElementById('totalText'),
  btnConfirm:   document.getElementById('btnConfirm'),
  emptyCart:    document.getElementById('emptyCart'),
  badge:        document.getElementById('cartCount'),
};

let inventory = initialProducts.map(p => ({ ...p })); // copia el arreglo de productos para poder modificar el stock
const cart = new Map(); // carrito como Map: id -> { id, nombre, precio, cantidad }

renderProducts(els.productList, inventory);
renderCart();
els.taxRateText.textContent = `Impuestos (${(TAX_RATE * 100).toFixed(0)}%)`;

// Re-render del catálogo para reflejar stock y deshabilitados
function updateCatalog() {
  renderProducts(els.productList, inventory);
}
// Cambia stock
function changeStock(id, delta) {
  const prod = inventory.find(p => p.id === id);
  if (!prod) return false;
  const next = prod.stock + delta;
  if (next < 0) return false;       // no hay suficiente stock para reservar
  prod.stock = next;
  updateCatalog();                   // actualiza tarjetas (stock y botones)
  return true;
}

//Botones para agregar o eliminar cantidades desde  el area de productos
els.productList.addEventListener('click', (e) => { //lee los clics dentro de las tarjetas de los productos
  const minusBtn = e.target.closest('.btn-minus'); //si se presiona -
  const plusBtn  = e.target.closest('.btn-plus'); //si se presiona +
  const addBtn   = e.target.closest('.btn-add'); //si se ocupa el botón agregar

  // a) − / + en la CARD (solo ajusta el numerito visible antes de agregar)
  if (minusBtn || plusBtn) { // si la opción fue - o +
    const id   = (minusBtn || plusBtn).dataset.id;
    const prod = inventory.find(p => p.id === id);
    const lbl  = document.querySelector(`.qty-label[data-id="${id}"]`);
    let qty    = parseInt(lbl?.textContent || '1', 10);

    if (minusBtn) qty = Math.max(1, qty - 1); //si es menos baja sin pasar de 1
    if (plusBtn)  qty = Math.min(prod?.stock ?? qty, qty + 1); // no superar stock disponible

    if (lbl) lbl.textContent = String(qty);
    return;
  }

  // b) Agregar desde la CARD (reserva stock y pasa al carrito)
  if (addBtn) {
    const id   = addBtn.dataset.id;
    const prod = inventory.find(p => p.id === id);
    if (!prod) return;

    const lbl = document.querySelector(`.qty-label[data-id="${id}"]`);
    const q   = parseInt(lbl?.textContent || '1', 10);

    // Reserva: descuenta del stock del inventario
    if (!changeStock(id, -q)) {
      alert('No hay suficiente stock.');
      return;
    }

    // Suma al carrito
    const item = cart.get(id) || { id: prod.id, nombre: prod.nombre, precio: prod.precio, qty: 0 };
    item.qty += q;
    cart.set(id, item);

    if (lbl) lbl.textContent = '1'; // resetea selector visible
    renderCart();
  }
});

//Botones para agregar o eliminar cantidades desde  el area del carrito
els.cartRows.addEventListener('click', (e) => {
  const plus  = e.target.closest('[data-action="cart-plus"]'); 
  const minus = e.target.closest('[data-action="cart-minus"]'); 
  const rem   = e.target.closest('[data-action="cart-remove"]'); 

  // aumenta una unidad si todavía hay stock
  if (plus)  { increaseItem(plus.dataset.id); }
  // regresa una unidad y devuelve el stock
  if (minus) { decreaseItem(minus.dataset.id); }
  // se elimina el producto del carrito
  if (rem)   { removeItem(rem.dataset.id); }
});

//Botón vaciar carrito
els.emptyCart?.addEventListener('click', () => {
  // Devuelve todo el stock reservado
  for (const it of cart.values()) changeStock(it.id, +it.qty);
  cart.clear();
  renderCart();
});

// Parte lógica del carrito
function increaseItem(id) {
  const it = cart.get(id);
  if (!it) return;
  // Reserva 1 unidad más del inventario
  if (!changeStock(id, -1)) { alert('Sin stock disponible.'); return; }
  it.qty += 1;
  renderCart();
}

function decreaseItem(id) {
  const it = cart.get(id);
  if (!it) return;
  // Devuelve 1 unidad al inventario
  changeStock(id, +1);
  it.qty -= 1;
  if (it.qty <= 0) cart.delete(id);
  renderCart();
}

function removeItem(id) {
  const it = cart.get(id);
  if (!it) return;
  // Devuelve todo lo reservado para este producto
  changeStock(id, +it.qty);
  cart.delete(id);
  renderCart();
}

function renderCart() { //dibuja las filas del carrito
  if (!els.cartRows) return;

  if (cart.size === 0) { //si el carrito está vacío muestra un mensaje
    els.cartRows.innerHTML = `<tr><td colspan="4" class="text-muted">Tu carrito está vacío.</td></tr>`;
  } else {
    const rows = []; //acumulador de filas
    for (const it of cart.values()) { //por cada item de carrito genera una fila con nombre, controles, subtotal y botón de eliminar
      rows.push(`
        <tr>
          <td>${it.nombre}</td>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group" aria-label="Editar cantidad">
              <button class="btn btn-outline-secondary" data-action="cart-minus" data-id="${it.id}">−</button>
              <span class="px-2">${it.qty}</span>
              <button class="btn btn-outline-secondary" data-action="cart-plus"  data-id="${it.id}">+</button>
            </div>
          </td>
          <td class="text-end">$${(it.precio * it.qty).toFixed(2)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-link text-danger" data-action="cart-remove" data-id="${it.id}">x</button>
          </td>
        </tr>
      `);
    }
    els.cartRows.innerHTML = rows.join('');
  }

  // Totales 
  let sub = 0;
  for (const it of cart.values()) sub += Number(it.precio) * Number(it.qty);
  const taxes = sub * TAX_RATE;
  const total = sub + taxes;

  els.subtotalText.textContent = '$' + sub.toFixed(2);
  els.taxRateText.textContent  = `Impuestos (${(TAX_RATE * 100).toFixed(0)}%)`;
  els.taxesText.textContent    = '$' + taxes.toFixed(2);
  els.totalText.textContent    = '$' + total.toFixed(2);

  // Contador del carrito
  if (els.badge) {
    let count = 0;
    for (const it of cart.values()) count += it.qty;
    els.badge.textContent = String(count);
  }

  els.btnConfirm.disabled = cart.size === 0; //deshabilita el botón de confirmar compra si el carrito está vacío
}

//confirmar compra
els.btnConfirm?.addEventListener('click', () => {
  if (cart.size === 0) return;
  // Aquí solo faltaría: generar factura y redirigir (billing.js).
  alert('Acá ya viene la parte de la factura');
});