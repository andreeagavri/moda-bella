import { db } from "../../config/firebase";
import firebase from "firebase/app";
import { useState } from "react";
import { auth } from "../../config/firebase";
import { ProductGridItem } from "../../components/ProductGridItem";

export default function Cart() {
  const [userId, setUserId] = useState();
  const [cartProducts, setCartProducts] = useState();

  async function getCartData(user) {
    return db
      .collection("carts")
      .doc(user.uid)
      .get()
      .then((cartData) => {
        if (cartData.data()) {
          setCartProducts(cartData.data());
        }
      });
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUserId(user.uid);
      getCartData(user);
    }
  });

  if (cartProducts !== undefined) {
    return (
      <div>
        {cartProducts.products.map((prod) => (
          <ProductGridItem product={prod} />
        ))}
      </div>
    );
  } else return null;
}
