import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Button.module.css";

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMHhlQWQzZjNhNzJFMTdiZTEwODQzMzBEOWI3ODBjRTNCZDE1MjhkQUVmIiwiY2xpZW50X2lkIjoiMmJkbDd0MGI4Z3RsNGU0M2ZsZjZucmJyOTgiLCJjbGllbnRfc2VjcmV0IjoiMXIwNWc5Z2VkbjQ2aW9rZGwwdnVyMjE0ODVwNzE4bHVwcXV1NDY4MW5mdW1wYXFxcWtsZyIsImV4cCI6MTY5MzMxNzMxNCwiaWF0IjoxNjkwNzI1MzE0LCJpc3MiOiJYaW9uIEdsb2JhbCBTZXJ2aWNlIEFQSSJ9.yU3xuU5oE2AoLoPhpy9eJjgXzB80YDN7JMcB1DOso98";
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
    txHashText.innerHTML = `Transaction Hash: <a href="https://polygonscan.com/tx/${txHash}" target="_blank" rel="noopener noreferrer">${txHash}</a>`;

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
