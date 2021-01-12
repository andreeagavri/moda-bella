import { db } from "../../config/firebase";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import { Navigation } from "../../components/Navigation";
import styles from "../../styles/Home.module.css";
import { ProductGridItem } from "../../components/ProductGridItem";
import { getPriceString } from "../../components/ProductGridItem";
import Link from "next/link";
export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");

  if (product === null) {
    let docRef = db.collection("products").doc(id);
    docRef.get().then(function (doc) {
      if (doc.exists) {
        setProduct({
          id: id,
          ...doc.data(),
        });
      }
    });
  }
  if (product) {
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

          <div className={styles.productContainer}>
            <div className={styles.productImages}>
              <img className={styles.productImg} src={product.photos[0]}></img>
              <img className={styles.productImg} src={product.photos[1]}></img>
            </div>
            <div className={styles.productInfo}>
              <h1>{product.title}</h1>
              <span>Culoare: {product.color}</span>
              <span>Pret: {getPriceString(product.price)}</span>
              <div className={styles.sizes}>
                <div
                  className={
                    size === "XS"
                      ? styles.productSizeSelected
                      : styles.productSize
                  }
                  onClick={() => setSize("XS")}
                >
                  XS
                </div>
                <div
                  className={
                    size === "S"
                      ? styles.productSizeSelected
                      : styles.productSize
                  }
                  onClick={() => setSize("S")}
                >
                  S
                </div>
                <div
                  className={
                    size === "M"
                      ? styles.productSizeSelected
                      : styles.productSize
                  }
                  onClick={() => setSize("M")}
                >
                  M
                </div>
                <div
                  className={
                    size === "L"
                      ? styles.productSizeSelected
                      : styles.productSize
                  }
                  onClick={() => setSize("L")}
                >
                  L
                </div>
              </div>
              <div className={styles.addToCart}>Adauga in Cos</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <div></div>;
}
