import { db, auth } from "../../config/firebase";
import firebase from "firebase/app";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { NavMenu } from "../../components/NavMenu";
import { ProductCartItem } from "../../components/ProductCartItem";
import { getDiscountValue } from "../../utils/index";
import { getPriceString } from "../../utils/index";

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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserAdditionalData(user);
        getCartData(user);
      }
    });

    return () => unsubscribe();
  }, []);

  function updateQuantity(e, product) {
    const newQuantity = e.target.value;
    const idx = cartProducts.findIndex(
      (p) => p.id === product.id && p.size === product.size
    );

    cartProducts[idx].quantity = newQuantity;
    db.collection("carts")
      .doc(user.uid)
      .update({
        products: cartProducts,
      })
      .then(() => {
        getCartData(user);
        console.log("updated quantity from dropdown");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeFromCart(product) {
    const idx = cartProducts.findIndex(
      (p) => p.id === product.id && p.size === product.size
    );

    cartProducts.splice(idx, 1);
    db.collection("carts")
      .doc(user.uid)
      .update({
        products: cartProducts,
      })
      .then(() => {
        getCartData(user);
        console.log("removed product from cart");
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
              <ProductCartItem
                product={product}
                key={product.id}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
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
