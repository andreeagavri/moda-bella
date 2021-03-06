import { db, auth } from "../../config/firebase";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Navigation } from "../../components/Navigation";
import styles from "../../styles/Home.module.css";
import { ProductGridItem } from "../../components/ProductGridItem";
import { getPriceString } from "../../components/ProductGridItem";
import Link from "next/link";
import firebase from "firebase/app";
import { Title } from "../../components/Title";
import { CartPreview } from "../../components/CartPreview";
import { NavMenu } from "../../components/NavMenu";

// Component for the single product details page. On it
// the user can select the size and then add it to the cart
// Adding to the cart without selecting the size will prompt the user to do so.
export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [userId, setUserId] = useState();
  const [cartProducts, setCartProducts] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showSizes, setShowSizes] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        getCartData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  async function getCartData(userId) {
    return db
      .collection("carts")
      .doc(userId)
      .get()
      .then((cartData) => {
        if (cartData.data()) {
          setCartProducts(cartData.data().products);
        }
      });
  }

  async function handleAddToCart() {
    if (size === "") {
      setShowSizeWarning(true);
    } else if (userId !== undefined) {
      // If the user is logged in

      let userIdRef = db.collection("carts").doc(userId);
      const doc = await userIdRef.get();

      if (!doc.exists) {
        // If the cart does not exist, create it
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
            getCartData(userId);
            setShowCartPreview(true);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // If the cart exists
        let cartData;
        await db
          .collection("carts")
          .doc(userId)
          .get()
          .then((cart) => (cartData = cart.data().products));

        const prodIdx = cartData.findIndex(
          (p) => p.id === product.id && p.size === size
        );

        if (prodIdx >= 0) {
          // If the same product of the same size has been added before, update its quantity
          cartData[prodIdx].quantity++;
          db.collection("carts")
            .doc(userId)
            .update({
              products: cartData,
            })
            .then(() => {
              setSize("");
              console.log("update quantity for product in non-empty cart");

              getCartData(userId);
              setShowCartPreview(true);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // If the same product has not been added
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
              console.log("added unique product in non-empty cart");
              getCartData(userId);
              setShowCartPreview(true);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
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
        if (
          doc.data().type === "genti" ||
          doc.data().type === "esarfe" ||
          doc.data().type === "bijuterii"
        ) {
          setSize("One Size");
          setShowSizes(false);
        }
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
          <Title />

          {showCartPreview ? (
            <CartPreview
              products={cartProducts}
              setShowCartPreview={setShowCartPreview}
            />
          ) : null}

          <NavMenu />
          <div className={styles.productContainer}>
            <div className={styles.productImages}>
              <img className={styles.productImg} src={product.photos[0]}></img>
              <img className={styles.productImg} src={product.photos[1]}></img>
            </div>
            <div className={styles.productInfo}>
              <h1>{product.title}</h1>
              <span>Culoare: {product.color}</span>
              <span>Preţ: {getPriceString(product.price)}</span>
              {showSizes ? (
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
              ) : null}
              <p
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  display: showSizeWarning ? "block" : "none",
                }}
              >
                Selectaţi o mărime înainte de a adăuga în coş.
              </p>
              {userId === undefined ? (
                <div className={styles.productNonSignedInMessage}>
                  <span>
                    Pentru a adauga produsul în coş, autentificaţi-vă aici:
                  </span>
                  <Link href="/signin">
                    <span className={styles.signinLink}>Autentificare</span>
                  </Link>
                </div>
              ) : (
                <div onClick={handleAddToCart} className={styles.addToCart}>
                  ADAUGĂ ÎN COŞ
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <div></div>;
}
