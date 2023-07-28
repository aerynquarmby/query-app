import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Button.module.css";

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMHhFMTMxNzJhODI5RjBiQTYyMDIwQ0M4MDJlOGQ2OGFkNDM5NjNGOTgzIiwiY2xpZW50X2lkIjoiNWtvc3U3NnAyNjA3cGVpbjUwZjIzbHJ2bGgiLCJjbGllbnRfc2VjcmV0IjoidmxwOG9pNjRsOGdndjNlOGxnNDJmdWhka2ltZjQwOGRlc2ZiNjJkZm9mdjdqanBwbnM0IiwiZXhwIjoxNjg0ODY5Mzk2LCJpYXQiOjE2ODIyNzczOTYsImlzcyI6Ilhpb24gR2xvYmFsIFNlcnZpY2UgQVBJIn0.RYWRfMR-w-4VI-Y2PItofDeMl8dNC240lAweOm5piuA";
const apiUrl = "https://prodp-api.xion.app/api/v2/single/payment"; // Xion API endpoint

export default function XionApi({ address, amount }) {
  const [loading, setLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (paymentSuccessful) {
      timeoutId = setTimeout(() => {
        setPaymentSuccessful(false);
      }, 10000);
    }

    return () => clearTimeout(timeoutId);
  }, [paymentSuccessful]);

  const handlePayClick = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        apiUrl,
        {
          productName: "ScantoPay-Demo",
          amount: parseFloat(amount),
          currency: "usdt",
          buyerAddress: address,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "successful" && response.data.orderCode) {
        console.log("Payment successful:", response.data);
        if (response.data.transactionHash) {
          showSuccessPopup(response.data.transactionHash, response.data.orderCode);
          setPaymentSuccessful(true);
        } else {
          console.warn("Payment successful, but no transaction hash found:", response.data);
          alert("Payment successful, but no transaction hash found. Please check your wallet or contact support.");
        }
      } else {
        console.error("Payment error:", response.data);
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessPopup = (txHash, orderCode) => {
    // Create a pop-up element
    const popup = document.createElement("div");
    popup.className = styles.popup;
  
    // Create content for the pop-up
    const content = document.createElement("div");
    content.className = styles.popupContent;
  
    const heading = document.createElement("h2");
    heading.innerText = "Transaction Receipt";
  
    const orderCodeText = document.createElement("p");
    orderCodeText.innerText = `Order Code: ${orderCode}`;
  
    const txHashText = document.createElement("p");
    txHashText.innerText = `Transaction Hash: ${txHash}`;
  
    // Append content to the pop-up element
    content.appendChild(heading);
    content.appendChild(orderCodeText);
    content.appendChild(txHashText);
    popup.appendChild(content);
  
    // Add the pop-up element to the document body
    document.body.appendChild(popup);
  
    // Set a timeout to remove the pop-up after 10 seconds
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 10000);
  };
  

  return (
    <div>
      <button className={`${styles.button} ${paymentSuccessful ? styles.success : ""}`} onClick={handlePayClick} disabled={loading}>
        {loading ? "Processing..." : paymentSuccessful ? "Payment Successful" : "PAY"}
      </button>
    </div>
  );
}
