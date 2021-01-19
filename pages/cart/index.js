import { db } from "../../config/firebase";
import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { ProductGridItem } from "../../components/ProductGridItem";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { ProductCartItem } from "../../components/ProductCartItem";
import { NavMenu } from "../../components/NavMenu";

function getPriceString(price) {
  price = price.toFixed(2);
  return price.toString().replace(".", ",") + " RON";
}

function getDiscountValue(points) {
  if (points < 1000) {
    return 0;
  }
  if (points < 2000) {
    return 0.1;
  }
  if (points < 3000) {
    return 0.2;
  }
  if (points < 4000) {
    return 0.3;
  }

  return 0.4;
}

export default function Cart() {
  const [user, setUser] = useState();
  const [cartProducts, setCartProducts] = useState();

  async function getUserAdditionalData(user) {
    return db
      .collection("users")
      .doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.data()) {
          setUser({ ...userData.data() });
        }
      });
  }

  async function getCartData(user) {
    return db
      .collection("carts")
      .doc(user.uid)
      .get()
      .then((cartData) => {
        if (cartData.data()) {
          setCartProducts(cartData.data().products);
        }
      });
  }

  useEffect(() => {
    const unsubscribeAfterAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserAdditionalData(user);
        getCartData(user);
      }
    });

    return () => {
      unsubscribeAfterAuth();
    };
  }, []);

  if (cartProducts !== undefined && user !== undefined) {
    let totalWithoutDiscount = 0;

    for (const product of cartProducts) {
      totalWithoutDiscount += product.price * product.quantity;
    }

    let discount = getDiscountValue(user.points) * totalWithoutDiscount;
    let totalWithDiscount = totalWithoutDiscount - discount;

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
          <NavMenu />
          <div className={styles.cart}>
            {cartProducts.map((product) => (
              <ProductCartItem product={product} />
            ))}
          </div>
          <div className={styles.infoCartValue}>
            <div className={styles.infoLabelValue}>
              <div className={styles.infoLabel}>Valoare comandă: </div>
              <div className={styles.infoValue}>
                {getPriceString(totalWithoutDiscount)}
              </div>
            </div>
            <div className={styles.infoLabelValue}>
              <div className={styles.infoLabel}>Discount: </div>
              <div className={styles.infoValue}>{getPriceString(discount)}</div>
            </div>
            <div className={styles.infoLabelValueTotal}>
              <div className={styles.infoLabel}>Total: </div>
              <div className={styles.infoValue}>
                {getPriceString(totalWithDiscount)}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } else return null;
}
