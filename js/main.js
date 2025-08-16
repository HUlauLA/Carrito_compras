import { initialProducts } from './products.js';
import { renderProducts } from './ui.js';

const els = {
  productList: document.getElementById('product-list'),
};

// Estado de inventario
let inventory = [...initialProducts];

// Render inicial de productos
renderProducts(els.productList, inventory);
