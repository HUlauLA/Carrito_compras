//Imprimir productos en la pantalla

export function renderProducts(container, inventory) {
  container.innerHTML = '';
  inventory.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="https://static.vecteezy.com/system/resources/previews/003/237/381/non_2x/line-icon-for-product-vector.jpg"
             class="card-img-top" alt="${escapeHtml(p.nombre)}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(p.nombre)}</h5>
          <p class="card-text text-muted mb-1">${p.precio}</p>
          <span class="badge text-bg-${p.stock > 0 ? 'success' : 'secondary'} mb-2">
            ${p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
          </span>

          <div class="d-flex align-items-center gap-2 mt-auto">
            <div class="btn-group" role="group" aria-label="Selector cantidad">
              <button class="btn btn-outline-secondary btn-sm btn-minus"
                      data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>-</button>
              <span class="px-2 fw-semibold qty-label" data-id="${p.id}">1</span>
              <button class="btn btn-outline-secondary btn-sm btn-plus"
                      data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>+</button>
            </div>
            <button class="btn btn-sm btn-primary btn-add"
                    data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
              Agregar
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
