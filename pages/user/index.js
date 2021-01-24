import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { Navigation } from "../../components/Navigation";
import { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase";
import { NavMenu } from "../../components/NavMenu";
import { Address } from "../../components/Address";

export default function Home() {
  const [user, setUser] = useState();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState();
  const [showAddressForm, setShowAddressForm] = useState(false);

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

  function getAddressData(user) {
    return db
      .collection("addresses")
      .doc(user.uid)
      .get()
      .then((addressData) => {
        if (addressData.data()) {
          setAddresses(addressData.data().addresses);
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
        setOrders(dbProducts);
      });
  }

  function updateSelectedAddress(user, addressId) {
    db.collection("users")
      .doc(user.uid)
      .set({
        ...user,
        addressId: addressId,
      })
      .then(() => {
        getUserAdditionalData(user);
      });
  }

  function deleteAddress(address) {
    let newSelectedAddressId = user.addressId;
    if (newSelectedAddressId === address.id) {
      newSelectedAddressId = "none";
    }

    const addressIdx = addresses.findIndex((adr) => adr.id === address.id);
    addresses.splice(addressIdx, 1);

    db.collection("addresses")
      .doc(user.uid)
      .update({
        addresses: addresses,
      })
      .then(() => {
        getAddressData(user);
        updateSelectedAddress(user, newSelectedAddressId);
        getUserAdditionalData(user);
        console.log(user.addressId);
        console.log("deleted the address");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserAdditionalData(user);
        getAddressData(user);
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

          <h1 className={styles.pageTitle}>Contul meu</h1>
          <h2>Detaliile mele</h2>
          <span>E-mail</span>
          <span>{user.email}</span>

          <span>Nume</span>
          <span>{user.username}</span>

          <h2>Adresele mele</h2>
          <div className={styles.addresses}>
            {addresses.map((address) => (
              <Address
                key={address.id}
                address={address}
                selected={user.addressId === address.id}
                user={user}
                updateSelectedAddress={updateSelectedAddress}
                deleteAddress={deleteAddress}
              />
            ))}
          </div>
          <h2>Comenzile mele</h2>
        </main>
      </div>
    );
  } else return null;
}
