import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import QRCode from "qrcode";
import { ArrowLeft, CheckCircle2, Download  } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { apiGet, apiPost } from "../api/client";
import { generateInvoicePdf } from "../utils/invoice";
import type { ContentResponse, Order } from "../types";

type Stage = "details" | "qr" | "confirming" | "done";

export default function Payment() {
  const { lines, totalQty, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stage, setStage] = useState<Stage>("details");
  const [order, setOrder] = useState<Order | null>(null);
  const [contactInfo, setContactInfo] = useState<ContentResponse | null>(null);
  // const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (lines.length === 0 && stage === "details") {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (stage !== "qr" || !order) return;
  //   const upiString = `upi://pay?pa=pyrotown@upi&pn=PyroTown&am=${order.totalAmount}&cu=INR&tn=${order.id}`;
  //   QRCode.toDataURL(upiString, { width: 260, margin: 1 })
  //     .then(setQrDataUrl)
  //     .catch(() => setError("Could not generate QR code."));
  // }, [stage, order]);

  // const handleBuyNow = async () => {
  //   setError("");
  //   if (!name.trim() || !phone.trim()) {
  //     setError("Please enter your name and phone number.");
  //     return;
  //   }
  //   try {
  //     const created = await apiPost<Order>("/api/orders", {
  //       items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
  //       customer: { name, phone, address },
  //     });
  //     setOrder(created);
  //     setStage("qr");
  //   } catch (e) {
  //     setError(e instanceof Error ? e.message : "Could not create order.");
  //   }
  // };

  const handleConfirmPayment = async () => {
    setStage("confirming");
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    try {
      const confirmed = await apiPost<Order>("/api/orders", {
        items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
        customer: { name, phone, address },
      });
      setOrder(confirmed);
      // Fetch website content
      const content = await apiGet<ContentResponse>("/api/content");
      setContactInfo(content);
      generateInvoicePdf(confirmed, content.contact);
      clearCart();
      setStage("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not confirm payment.");
      setStage("qr");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="max-w-md mx-auto px-4 py-6 pb-16">
        {stage === "details" && (
          <>
            <Link
              to="/cart"
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600 mb-4"
            >
              <ArrowLeft size={16} /> Back to cart
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Payment Info
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Confirm your details before payment.
            </p>

            <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total items</span>
                <span>{totalQty}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Amount payable</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Phone number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Delivery address (optional)
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Street, city, pincode"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                onClick={handleConfirmPayment}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full text-sm transition"
              >
                Buy Now
              </button>
            </div>
          </>
        )}

        {/* {(stage === "qr" || stage === "confirming") && order && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-1">Scan to pay</p>
            <p className="text-2xl font-bold text-gray-800 mb-4">
              ₹{order.totalAmount}
            </p>

            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Demo payment QR code"
                className="mx-auto rounded-lg border border-gray-200"
              />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" />
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Demo QR code for illustration only — no real payment gateway is
              connected. Order ID: {order.id}
            </p>

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

            <button
              onClick={handleConfirmPayment}
              disabled={stage === "confirming"}
              className="w-full mt-5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-full text-sm transition flex items-center justify-center gap-2"
            >
              {stage === "confirming" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Confirming...
                </>
              ) : (
                "I've Paid"
              )}
            </button>
          </div>
        )} */}

        {stage === "done" && order && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <CheckCircle2 className="mx-auto text-green-500 mb-3" size={48} />
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Payment Confirmed
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Order {order.id} · ₹{order.totalAmount}
            </p>
            <p className="text-sm text-gray-600 mb-5">
              Your bill has been downloaded as a PDF. We'll reach out on{" "}
              {order.customer.phone} to confirm delivery.
            </p>

            <button
              onClick={() => generateInvoicePdf(order, contactInfo!.contact)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full text-sm transition flex items-center justify-center gap-2 mb-3"
            >
              <Download size={16} /> Download Invoice Again
            </button>
            <Link
              to="/"
              className="block w-full border border-gray-300 text-gray-600 py-2.5 rounded-full text-sm hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
