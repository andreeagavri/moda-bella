import Head from "next/head";
import styles from "../../styles/Home.module.css";
import products from "../../products.json";
import { ProductGridItem } from "../../components/ProductGridItem";
import { Navigation } from "../../components/Navigation";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import Link from "next/link";

export default function ToateHainele() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (products.length === 0) {
      db.collection("products")
        .where("type", "in", [
          "sacouri",
          "pantaloni",
          "rochii",
          "fuste",
          "imbracaminte sport",
          "bluze si tricouri",
          "paltoane si geci",
        ])
        .onSnapshot((snap) => {
          const dbProducts = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(dbProducts);
        });
    }
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>Moda Bella</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>
        <Link href="/">
          <h1 className={styles.title}>MODA BELLA</h1>
        </Link>
        <div>
          <Link href={"/brands/mango"}>
            <div>Mango</div>
          </Link>
          <Link href={"/brands/only"}>
            <div>Only</div>
          </Link>
          <Link href={"/brands/levis"}>
            <div>Levi's</div>
          </Link>
        </div>

        <div className={styles.grid}>
          {products.map((prod) => (
            <ProductGridItem product={prod} />
          ))}
        </div>
      </main>
    </div>
  );
}
