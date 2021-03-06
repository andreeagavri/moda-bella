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
import { Title } from "../../components/Title";
import { PayPalButton } from "react-paypal-button-v2";

// Component for the shopping cart page
export default function Cart() {
  const [user, setUser] = useState();
  const [cartProducts, setCartProducts] = useState();
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  let totalWithDiscount = 0;
  let discount = 0;

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

  // Get information about the user, cart data and address data
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

  // Modify the product dropdown to update its quantity
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

  // Click the X near a product to remove it
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

  // Add the user points after paying
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

  // Clear the cart after paying
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

  // Register the order inside firebase
  function placeOrder() {
    const address = addresses.find((adr) => adr.id === user.addressId);

    let date = new Date();
    date.setHours(date.getHours() + 2);

    db.collection("orders")
      .add({
        products: cartProducts,
        address: address,
        userId: user.uid,
        date: date.toISOString().slice(0, 16).replace("T", " "),
        status: "În curs de procesare",
        discount: getPriceString(discount),
        total: getPriceString(totalWithDiscount),
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

  // Show/hide the address form after clicking on a button
  function toggleAddAddress() {
    setShowAddressForm(!showAddressForm);
  }

  // Click on an address to make it the primary one
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

  // Save the new address from the form
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

  // Delete one of the available addresses
  // If it was the selected address. The user will have to select a new one to complete the order
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
        console.log("deleted the address");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (
    cartProducts !== undefined &&
    user !== undefined &&
    cartProducts.length > 0
  ) {
    // Compute the total and the discount
    let totalWithoutDiscount = 0;

    for (const product of cartProducts) {
      totalWithoutDiscount += product.price * product.quantity;
    }

    discount = getDiscountValue(user.points) * totalWithoutDiscount;
    totalWithDiscount = totalWithoutDiscount - discount;

    let isOrderInvalid = addresses.length <= 0 || user.addressId === "none";

    return (
      <div className={styles.container}>
        <Head>
          <title>Moda Bella</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navigation />
        <main className={styles.main}>
          <Title />
          <NavMenu />
          <h1 className={styles.pageTitle}>Coş de cumpărături</h1>
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
          <div className={styles.addAddressButton} onClick={toggleAddAddress}>
            ADAUGĂ O ADRESĂ
          </div>
          {showAddressForm ? (
            <AddressForm
              setShowAddressForm={setShowAddressForm}
              saveAddress={saveAddress}
            />
          ) : null}

          {addresses.length > 0 ? (
            <PayPalButton
              amount="0.01"
              onSuccess={(details, data) => {
                placeOrder();
              }}
              options={{
                clientId:
                  "AWn7m8X6InffKImqACF-Ryg-SH3_GUUTKgE7HkqQNvKjDjWxFLXnhMkwudlgVXO005FPZt9UkAneB7O7",
              }}
            />
          ) : null}
        </main>
      </div>
    );
  } else if (cartProducts !== undefined && cartProducts.length === 0) {
    // If the cart is empty
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
          <h1 className={styles.pageTitle}>Coş de cumpărături</h1>
          <h2>Coşul este gol.</h2>
        </main>
      </div>
    );
  } else {
    return null;
  }
}
