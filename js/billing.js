const { jsPDF } = window.jspdf;

document.getElementById("download-button").addEventListener("click", () => {
  const products = JSON.parse(localStorage.getItem("cart"));
  const doc = new jsPDF();

  doc.setFillColor(255, 87, 34);
  doc.rect(15, 15, 40, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("LOGO", 35, 28, { align: "center" });

  doc.setFillColor(33, 33, 33);
  doc.rect(60, 15, 135, 20, "F");
  doc.setTextColor(255, 87, 34);
  doc.setFontSize(16);
  doc.text("FACTURA", 128, 28, { align: "center" });

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text("Factura para:", 15, 50);
  doc.text("Nombre: Juan Pérez", 15, 56);
  doc.text("Ubicación: San Salvador", 15, 62);

  doc.text("Número: 00001", 150, 50);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 56);

  const body = products.map((p, i) => {
    const qty = (i + 1) * 2;
    return [
      (i + 1).toString(),
      p.nombre,
      `$${p.precio.toFixed(2)}`,
      qty,
      `$${(p.precio * qty).toFixed(2)}`,
    ];
  });

  const subtotal = body.reduce((acc, row) => {
    return acc + parseFloat(row[4].replace("$", ""));
  }, 0);

  doc.autoTable({
    startY: 75,
    head: [["N°", "DESCRIPCIÓN", "PRECIO", "CANTIDAD", "TOTAL"]],
    body,
    theme: "grid",
    headStyles: {
      fillColor: [33, 33, 33],
      textColor: [255, 255, 255],
      halign: "center",
    },
    columnStyles: {
      0: {
        halign: "center",
        fillColor: [255, 87, 34],
        textColor: [255, 255, 255],
      },
      2: { halign: "right" },
      3: { halign: "center" },
      4: { halign: "right" },
    },
  });

  let finalY = doc.lastAutoTable.finalY + 10;

  doc.text("TOTAL:", 150, finalY + 20);

  doc.setFillColor(255, 87, 34);
  doc.setTextColor(255, 255, 255);
  doc.rect(170, finalY + 12, 40, 12, "F");
  doc.text(`$${subtotal.toFixed(2)}`, 190, finalY + 20, { align: "center" });

  const randomNumber = Math.floor(Math.random() * 100000);
  doc.save(`factura_${randomNumber}.pdf`);
});
