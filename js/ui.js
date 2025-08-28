//Imprimir productos en la pantalla

export function renderProducts(container, inventory) {
  container.innerHTML = '';
  inventory.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class='card-img-top store-color'>
        <img src="${p.img}" class="card-img-top" alt="${escapeHtml(p.nombre)}">
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-uppercase">${escapeHtml(p.nombre)}</h5>
          <p class="card-text text-muted fs-5 mb-3">$${p.precio}</p>
          <span class="badge mb-3" style="background-color: ${p.stock > 0 ? '#67d48d' : '#9da29e'}">
            ${p.stock > 0 ? `Stock: ${p.stock} unidades` : 'Agotado'}
          </span>

          <div class="d-flex align-items-center gap-2 mt-auto">
            <div class="btn-group" role="group" aria-label="Selector cantidad">
              <button class="btn btn-outline-secondary btn-sm btn-minus"
                      data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>-</button>
              <span class="px-3 fw-semibold qty-label" data-id="${p.id}">1</span>
              <button class="btn btn-outline-secondary btn-sm btn-plus"
                      data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>+</button>
            </div>
            <button class="btn btn-success btn-add w-100"
                    data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
              <i class="bi bi-cart-plus"></i> Agregar al carrito
            </button>
          </div>
        </div>
      </div>`;
    container.appendChild(col);
  });
}

//Limpiar texto
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;', 
    '<': '&lt;', 
    '>': '&gt;', 
    '"': '&quot;', 
    "'": '&#39;'
  }[m]));
}
