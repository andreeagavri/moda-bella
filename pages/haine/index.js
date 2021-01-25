import Head from "next/head";
import styles from "../../styles/Home.module.css";
import products from "../../products.json";
import { ProductGridItem } from "../../components/ProductGridItem";
import { Navigation } from "../../components/Navigation";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import Link from "next/link";
import { NavMenu } from "../../components/NavMenu";
export default function ToateHainele() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (products.length === 0) {
      const unsubscribe = db
        .collection("products")
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
      return () => unsubscribe();
    }
  }, [products]);
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
        <NavMenu></NavMenu>

        <h1 className={styles.pageTitle}>Toate Hainele</h1>

        <div className={styles.grid}>
          {products.map((prod) => (
            <ProductGridItem product={prod} />
          ))}
        </div>
      </main>
    </div>
  );
}
