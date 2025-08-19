const { jsPDF } = window.jspdf;

    const products = [
      { id: "P001", nombre: "Café en grano", precio: 6.5, stock: 12 },
      { id: "P002", nombre: "Taza cerámica", precio: 4.25, stock: 20 },
      { id: "P003", nombre: "Galletas artesanales", precio: 3.95, stock: 15 },
      { id: "P004", nombre: "Termo 1L", precio: 12.9, stock: 6 },
      { id: "P005", nombre: "Filtro reusable", precio: 2.75, stock: 30 },
    ];

document.getElementById("download-button").addEventListener("click", () => {
    const doc = new jsPDF();

      doc.setFillColor(255, 87, 34);
      doc.rect(15, 15, 40, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);

      doc.setFillColor(33, 33, 33);
      doc.rect(60, 15, 135, 20, "F");
      doc.setTextColor(255, 87, 34);
      doc.setFontSize(16);
      doc.text("Factura", 128, 28, { align: "center" });

      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.text("Cliente", 15, 50);
      doc.text("Nombre: Juan Pérez", 15, 56);
      doc.text("Lugar: San Salvador", 15, 62);

      doc.text("Correlativo: 00001", 150, 50);
      doc.text("Fecha: 18/08/2025", 150, 56);

      const producto = products[0];
      const cantidad = 2;
      const total = producto.precio * cantidad;

      doc.autoTable({
        startY: 75,
        head: [["Código", "Producto", "Precio", "Cantidad", "Total"]],
        body: [
          ["1", producto.nombre, `$${producto.precio.toFixed(2)}`, cantidad, `$${total.toFixed(2)}`]
        ],
        theme: "grid",
        headStyles: {
          fillColor: [33, 33, 33],
          textColor: [255, 255, 255],
          halign: "center"
        },
        columnStyles: {
          0: { halign: "center" },
          2: { halign: "right" },
          3: { halign: "center" },
          4: { halign: "right" },
        },
      });

      let finalY = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(10);
      doc.text("Total:", 150, finalY + 20);

      doc.setFillColor(255, 87, 34);
      doc.setTextColor(255, 255, 255);
      doc.rect(170, finalY + 12, 40, 12, "F");
      doc.text(`$${total.toFixed(2)}`, 190, finalY + 20, { align: "center" });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(33, 33, 33);
      doc.rect(0, pageHeight - 25, 210, 25, "F");

      doc.save("factura_ejemplo.pdf");
});
