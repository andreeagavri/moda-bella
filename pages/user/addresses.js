import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { Navigation } from "../../components/Navigation";
import { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase";
import { NavMenu } from "../../components/NavMenu";
import { Address } from "../../components/Address";
import { AddressForm } from "../../components/AddressForm";
import firebase from "firebase/app";
import { OrderSummary } from "../../components/OrderSummary";
import Link from "next/link";

export default function Addresses() {
  const [user, setUser] = useState();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState();
  const [showAddressForm, setShowAddressForm] = useState(false);

  function toggleAddAddress() {
    setShowAddressForm(!showAddressForm);
  }

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

  function saveAddress(address) {
    if (addresses.length === 0) {
      db.collection("addresses")
        .doc(user.uid)
        .set({
          addresses: firebase.firestore.FieldValue.arrayUnion(address),
        })
        .then(() => {
          updateSelectedAddress(user, address.id);
          getAddressData(user);
          console.log("added address in empty address list");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      db.collection("addresses")
        .doc(user.uid)
        .update({
          addresses: firebase.firestore.FieldValue.arrayUnion(address),
        })
        .then(() => {
          updateSelectedAddress(user, address.id);
          getAddressData(user);
          console.log("added a new address to existing list");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserAdditionalData(user);
        getAddressData(user);
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

          <h1 className={styles.pageTitle}>Adresele mele</h1>

          {addresses.length === 0 ? (
            <h3>Nu ai nicio adresă ascoiată cu contul tău.</h3>
          ) : null}
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
          <div className={styles.addToCart} onClick={toggleAddAddress}>
            Adaugă o Adresă
          </div>
          {showAddressForm ? (
            <AddressForm
              setShowAddressForm={setShowAddressForm}
              saveAddress={saveAddress}
            />
          ) : null}
        </main>
      </div>
    );
  } else return null;
}
