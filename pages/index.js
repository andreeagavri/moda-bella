import Head from "next/head";
import styles from "../styles/Home.module.css";
import products from "../products.json";
import { ProductGridItem } from "../components/ProductGridItem";
import { Navigation } from "../components/Navigation";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    db.collection("products").onSnapshot((snap) => {
      const dbProducts = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(dbProducts);
    });
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>Moda Bella</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>
        <h1 className={styles.title}>MODA BELLA</h1>
        <div className={styles.grid}>
          {products.map((prod) => (
            <ProductGridItem product={prod} />
          ))}
        </div>
      </main>
    </div>
  );
}
