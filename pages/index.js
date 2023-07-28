import Image from 'next/image';
import { useState } from 'react'; // import useState
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(''); // state to hold input value

  const handleRedirect = () => {
    window.location.href = `https://venerable-melba-4bcccf.netlify.app/?redirect-url=${encodeURIComponent(
      inputValue // use inputValue as the redirect URL
    )}`;
  }

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
      <p className={styles.paragraph}>Amount Due: R100</p>
      {/* Input field to enter the redirect URL */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter redirect URL"
        className={styles.input}
      />
      <button className={styles.button} onClick={handleRedirect}>
        Link your crypto wallet
      </button>
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Footer content goes here */}
        </div>
      </div>
    </div>
  );
}
