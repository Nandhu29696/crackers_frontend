import { jsPDF } from "jspdf";
import type { ContactInfo, Order } from "../types";
import { toWords } from "number-to-words";

export function generateInvoicePdf(order: Order, content: ContactInfo) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 40;
  let y = 50;

  const amountInWords =
    toWords(Math.round(order.totalAmount))
      .replace(/\b\w/g, (c) => c.toUpperCase()) + " Rupees Only";

  doc.setFontSize(20);
  doc.setTextColor(234, 88, 12); // orange-600
  doc.text("Pyro Town", marginX, y);

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  y += 18;
  doc.text(`${content.address}`, marginX, y);
  y += 14;
  doc.text(`Phone: ${content.phone}  ·  ${content.email}`, marginX, y);

  y += 26;
  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, y, 555, y);

  y += 24;
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text("INVOICE / BILL", marginX, y);

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`Order ID: ${order.id}`, 555, y - 4, { align: "right" });
  y += 14;
  doc.text(
    `Date: ${new Date(order.paidAt || order.createdAt).toLocaleString("en-IN")}`,
    555,
    y,
    { align: "right" }
  );

  y += 26;
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text("Bill To:", marginX, y);
  y += 14;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(order.customer.name, marginX, y);
  y += 13;
  doc.text(order.customer.phone, marginX, y);
  if (order.customer.address) {
    y += 13;
    doc.text(order.customer.address, marginX, y, { maxWidth: 300 });
  }

  y += 28;
  // Table header
  doc.setFillColor(255, 247, 237); // orange-50
  doc.rect(marginX, y, 515, 22, "F");
  doc.setFontSize(9.5);
  doc.setTextColor(120, 53, 15);
  doc.text("#", marginX + 8, y + 15);
  doc.text("Item", marginX + 30, y + 15);
  doc.text("Unit", marginX + 300, y + 15);
  doc.text("Qty", marginX + 360, y + 15);
  doc.text("Price", marginX + 410, y + 15);
  doc.text("Total", marginX + 475, y + 15);
  y += 22;

  doc.setTextColor(30, 30, 30);
  order.items.forEach((item, i) => {
    if (y > 760) {
      doc.addPage();
      y = 50;
    }
    doc.setFontSize(9.5);
    doc.text(String(i + 1), marginX + 8, y + 15);
    doc.text(item.name, marginX + 30, y + 15, { maxWidth: 260 });
    doc.text(item.per, marginX + 300, y + 15);
    doc.text(String(item.qty), marginX + 360, y + 15);
    doc.text(`Rs.${item.unitPrice}`, marginX + 410, y + 15);
    doc.text(`Rs.${item.lineTotal}`, marginX + 475, y + 15);
    y += 22;
    doc.setDrawColor(240, 240, 240);
    doc.line(marginX, y - 6, marginX + 515, y - 6);
  });

  y += 14;
  doc.setDrawColor(230, 230, 230);
  doc.line(marginX + 350, y, marginX + 515, y);
  y += 16;
  doc.setFontSize(10);
  doc.text(`Total Items: ${order.totalQty}`, marginX + 350, y);
  y += 16;
  doc.setFontSize(13);
  doc.setTextColor(234, 88, 12);
  doc.text(`Grand Total: Rs.${order.totalAmount}`, marginX + 350, y);

  y += 16;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Amount in Words: ${amountInWords}`, marginX + 350, y, {
    maxWidth: 165,
  });

  y += 30;
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "Payment Status: PAID (demo payment - no real transaction processed).",
    marginX,
    y
  );
  y += 13;
  doc.text(
    "As per the 2018 Supreme Court Order, online sale of firecrackers is not",
    marginX,
    y
  );
  y += 13;
  doc.text(
    "permitted; this bill is generated for an in-person / phone-confirmed order.",
    marginX,
    y
  );

  doc.save(`PyroTown-Invoice-${order.id}.pdf`);
}
