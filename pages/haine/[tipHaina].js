import Head from "next/head";
import styles from "../../styles/Home.module.css";
import products from "../../products.json";
import { ProductGridItem } from "../../components/ProductGridItem";
import { Navigation } from "../../components/Navigation";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavMenu } from "../../components/NavMenu";

export default function Haine() {
  const [products, setProducts] = useState([]);

  const slugToHaine = {
    "bluze-si-tricouri": "bluze si tricouri",
    pantaloni: "pantaloni",
    rochii: "rochii",
    fuste: "fuste",
    "paltoane-si-geci": "paltoane si geci",
    "imbracaminte-sport": "imbracaminte sport",
    sacouri: "sacouri",
  };

  const router = useRouter();
  const { tipHaina } = router.query;

  let haina;
  if (tipHaina) {
    haina = slugToHaine[tipHaina];
  }

  useEffect(() => {
    if (haina) {
      const unsubscribe = db
        .collection("products")
        .where("type", "==", haina)
        .onSnapshot((snap) => {
          const dbProducts = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(dbProducts);
        });
      return () => unsubscribe();
    }
  }, [haina]);
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
        <NavMenu></NavMenu>
        <h1>{haina}</h1>
        <div className={styles.grid}>
          {products.map((prod) => (
            <ProductGridItem product={prod} />
          ))}
        </div>
      </main>
    </div>
  );
}
