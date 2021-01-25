import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { Navigation } from "../../components/Navigation";
import { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase";
import { NavMenu } from "../../components/NavMenu";
import { Address } from "../../components/Address";
import { OrderSummary } from "../../components/OrderSummary";

export default function Orders() {
  const [user, setUser] = useState();
  const [orders, setOrders] = useState([]);

  function getUserAdditionalData(user) {
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

  function getOrdersData(user) {
    return db
      .collection("orders")
      .where("userId", "==", user.uid)
      .onSnapshot((snap) => {
        const dbProducts = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dbProducts.sort((prod1, prod2) => prod1.date <= prod2.date);
        setOrders(dbProducts);
      });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserAdditionalData(user);
        getOrdersData(user);
      }
    });

    return () => unsubscribe();
  }, []);

  if (user !== undefined) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Moda Bella</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navigation />
        <main className={styles.main}>
          <h1 className={styles.title}>MODA BELLA</h1>
          <NavMenu></NavMenu>

          <h1 className={styles.pageTitle}>Comenzile mele</h1>

          <div className={styles.cart}>
            {orders.map((order) => (
              <OrderSummary order={order} />
            ))}
          </div>
        </main>
      </div>
    );
  } else return null;
}
