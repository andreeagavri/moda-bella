import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { Navigation } from "../../components/Navigation";
import { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase";
import { NavMenu } from "../../components/NavMenu";
import { Address } from "../../components/Address";
import { OrderSummary } from "../../components/OrderSummary";
import { ProductOrderItem } from "../../components/ProductOrderItem";
import { AddressOrder } from "../../components/AddressOrder";

export default function Order() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState();
  const [order, setOrder] = useState();

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserAdditionalData(user);
      }
    });

    return () => unsubscribe();
  }, []);

  if (order === undefined) {
    db.collection("orders")
      .doc(id)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setOrder({
            id: id,
            ...doc.data(),
          });
        }
      });
  }

  if (user !== undefined && order !== undefined) {
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
          <h2 className={styles.pageTitle}>Comanda #{order.id.slice(0, 8)}</h2>

          <div className={styles.orderDetailAndAddress}>
            <div className={styles.orderDetailItem}>
              <div>Plasată pe {order.date}</div>
              <div>Discount Bella Card: {order.discount}</div>
              <div>Total: {order.total}</div>
            </div>
            <AddressOrder address={order.address} />
          </div>

          <div className={styles.cart}>
            {order.products.map((product) => (
              <ProductOrderItem product={product} />
            ))}
          </div>
        </main>
      </div>
    );
  } else return null;
}
