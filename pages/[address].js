import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import XionApi from "../pages/XionApi";
import styles from "../styles/[address].module.css";
import Image from 'next/image';
import axios from "axios";

const TRANSACTION_FEE_PERCENTAGE = 1; // Transaction fee percentage (1% in this example)
const exchangeApiUrl = "https://api.exchangerate-api.com/v4/latest/ZAR"; // Exchange rate API endpoint

export default function AddressPage() {
  const router = useRouter();
  const { address, redirectUrl } = router.query; // Add 'redirectUrl' to the query variables
  const [amount, setAmount] = useState("");
  const [transactionFee, setTransactionFee] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [zarToUsdRate, setZarToUsdRate] = useState(0);

  useEffect(() => {
    if (amount) {
      const fee = (parseFloat(amount) * TRANSACTION_FEE_PERCENTAGE) / 100;
      setTransactionFee(fee.toFixed(2));
      calculateUsdAmount(amount, fee);
    } else {
      setTransactionFee(0);
      setUsdAmount(0);
    }
  }, [amount]);

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const calculateUsdAmount = (amount, fee) => {
    const usdAmount = (parseFloat(amount) * zarToUsdRate + fee).toFixed(2);
    setUsdAmount(usdAmount);
  };
  

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(exchangeApiUrl);
      const exchangeRate = response.data.rates.USD;
      setZarToUsdRate(exchangeRate);
    } catch (error) {
      console.error("Error retrieving exchange rate:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/Asset 81.svg"
          alt="Header Image"
          layout="responsive"
          width={500}
          height={500}
        />
      </div>
      <h1 className={styles.productHeader}>SnapScan - Caltex</h1>
      <h1 className={styles.amountHeading}>
        Amount Due: R
        <input
          className={styles.amountInput}
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter ZAR Amount"
        />
      </h1>
      <h1>Transaction Fee: R{transactionFee}</h1>
      <h1>Wallet Address: {address}</h1>
      <XionApi address={address} amount={usdAmount} />
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Footer content goes here */}
        </div>
      </div>
    </div>
  );
}
