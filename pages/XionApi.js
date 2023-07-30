import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Button.module.css";
import { useAddress } from "@thirdweb-dev/react"; // Import useAddress

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMHhlQWQzZjNhNzJFMTdiZTEwODQzMzBEOWI3ODBjRTNCZDE1MjhkQUVmIiwiY2xpZW50X2lkIjoiNnI2Nmk4Z3ByYmM0czY4cnY1M2doOXNtYjMiLCJjbGllbnRfc2VjcmV0IjoiMXV0N2hwMDlrcGFiajJycXBoZ2lnMTR1Z3U2cTR2ZWMyNGV2czR2OHV1ZGtyOG5yYm1jbCIsImV4cCI6MTY5MjM5MzE2NywiaWF0IjoxNjg5ODAxMTY3LCJpc3MiOiJYaW9uIEdsb2JhbCBTZXJ2aWNlIEFQSSJ9.DLVFK4bspKmsKZkZxP8I82BmnvWl-XgNApJENVDtK2E"; // Use your key
const apiUrl = "https://prodp-api.xion.app/api/v2/single/payment";

export default function XionApi({ amount }) {
  const [loading, setLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const address = useAddress(); // Use the hook to get the address

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

      // Check for orderCode and transactionHash to determine success
      if (response.data.orderCode && response.data.transactionHash) {
        console.log("Payment successful:", response.data);
        showSuccessPopup(response.data.transactionHash, response.data.orderCode);
        setPaymentSuccessful(true);
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
  const popup = document.createElement("div");
  popup.className = styles.popup;
  const content = document.createElement("div");
  content.className = styles.popupContent;
  const heading = document.createElement("h2");
  heading.innerText = "Transaction Receipt";
  const orderCodeText = document.createElement("p");
  orderCodeText.innerText = `Order Code: ${orderCode}`;
  const txHashText = document.createElement("p");
  txHashText.innerHTML = `Transaction Hash: <a href="https://polygonscan.com/tx/${txHash}" target="_blank" rel="noopener noreferrer">${txHash}</a>`;
  content.appendChild(heading);
  content.appendChild(orderCodeText);
  content.appendChild(txHashText);
  popup.appendChild(content);
  document.body.appendChild(popup);
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
