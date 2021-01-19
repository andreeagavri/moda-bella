import { db } from "../../config/firebase";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import { Navigation } from "../../components/Navigation";
import styles from "../../styles/Home.module.css";
import { ProductGridItem } from "../../components/ProductGridItem";
import { getPriceString } from "../../components/ProductGridItem";
import Link from "next/link";
import { auth } from "../../config/firebase";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [showSizeWarning, setShowSizeWarning] = useState(false);

  const [userId, setUserId] = useState();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUserId(user.uid);
    }
  });

  async function handleAddToCart() {
    if (size === "") {
      setShowSizeWarning(true);
    } else if (userId !== undefined) {
      let userIdRef = db.collection("carts").doc(userId);
      const doc = await userIdRef.get();

      if (!doc.exists) {
        db.collection("carts")
          .doc(userId)
          .set({
            products: firebase.firestore.FieldValue.arrayUnion({
              ...product,
              size: size,
              quantity: 1,
            }),
          })
          .then(() => {
            setSize("");
            console.log("added product in empty cart");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        db.collection("carts")
          .doc(userId)
          .update({
            products: firebase.firestore.FieldValue.arrayUnion({
              ...product,
              size: size,
              quantity: 1,
            }),
          })
          .then(() => {
            setSize("");
            console.log("added product in non-empty cart");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      // If user is not logged in
    }
  }

  function handleSize(size) {
    setSize(size);
    setShowSizeWarning(false);
  }

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
                  onClick={() => handleSize("XS")}
                >
                  XS
                </div>
                <div
                  className={
                    size === "S"
                      ? styles.productSizeSelected
                      : styles.productSize
                  }
                  onClick={() => handleSize("S")}
                >
                  S
                </div>
                <div
                  className={
                    size === "M"
                      ? styles.productSizeSelected
                      : styles.productSize
                  }
                  onClick={() => handleSize("M")}
                >
                  M
                </div>
                <div
                  className={
                    size === "L"
                      ? styles.productSizeSelected
                      : styles.productSize
                  }
                  onClick={() => handleSize("L")}
                >
                  L
                </div>
              </div>
              <p
                style={{
                  display: showSizeWarning ? "block" : "none",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                Selectaţi o mărime înainte de a adăuga în coş.
              </p>
              <div className={styles.addToCart} onClick={handleAddToCart}>
                Adaugă în Coş
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <div></div>;
}
