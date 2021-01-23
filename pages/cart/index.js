import { db, auth } from "../../config/firebase";
import firebase from "firebase/app";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { NavMenu } from "../../components/NavMenu";
import { ProductCartItem } from "../../components/ProductCartItem";
import { Address } from "../../components/Address";
import { AddressForm } from "../../components/AddressForm";
import { getDiscountValue } from "../../utils/index";
import { getPriceString } from "../../utils/index";

export default function Cart() {
  const [user, setUser] = useState();
  const [cartProducts, setCartProducts] = useState();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState();
  const [showAddressForm, setShowAddressForm] = useState(false);
  let totalWithDiscount = 0;

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserAdditionalData(user);
        getCartData(user);
        getAddressData(user);
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

  function addPointsToUser(total) {
    db.collection("users")
      .doc(user.uid)
      .update({
        points: user.points + Math.floor(total),
      })
      .then(() => {
        console.log("updated user points");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function clearCart() {
    db.collection("carts")
      .doc(user.uid)
      .update({
        products: [],
      })
      .then(() => {
        getCartData(user);
        console.log("cleared the cart");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function placeOrder() {
    const address = addresses.find((adr) => adr.id === selectedAddressId);

    db.collection("orders")
      .add({
        products: cartProducts,
        address: address,
        status: "processing",
        total: totalWithDiscount.toFixed(2),
      })
      .then(() => {
        addPointsToUser(totalWithDiscount);
        clearCart();
        getUserAdditionalData(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function toggleAddAddress() {
    setShowAddressForm(true);
  }

  function saveAddress(address) {
    if (addresses.length === 0) {
      db.collection("addresses")
        .doc(user.uid)
        .set({
          addresses: firebase.firestore.FieldValue.arrayUnion(address),
        })
        .then(() => {
          setSelectedAddressId(address.id);
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
          setSelectedAddressId(address.id);
          getAddressData(user);
          console.log("added a new address to existing list");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  if (cartProducts !== undefined && user !== undefined) {
    let totalWithoutDiscount = 0;

    for (const product of cartProducts) {
      totalWithoutDiscount += product.price * product.quantity;
    }

    let discount = getDiscountValue(user.points) * totalWithoutDiscount;
    totalWithDiscount = totalWithoutDiscount - discount;

    let isOrderInvalid =
      addresses.length <= 0 || selectedAddressId === undefined;

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
                key={product.id + product.size}
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

          <div className={styles.addresses}>
            {addresses.map((address) => (
              <Address
                key={address.id}
                address={address}
                selected={selectedAddressId === address.id}
                setSelectedAddressId={setSelectedAddressId}
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

          <div>Points: {user.points}</div>

          <button
            disabled={isOrderInvalid}
            className={styles.placeOrderButton}
            onClick={placeOrder}
          >
            PLASEAZĂ COMANDA
          </button>
        </main>
      </div>
    );
  } else return null;
}
