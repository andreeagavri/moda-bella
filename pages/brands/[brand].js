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
export default function BrandPage() {
  const [products, setProducts] = useState([]);

  const slugToBrand = {
    levis: "Levi's",
    only: "Only",
    mango: "Mango",
    nakd: "Na-Kd",
    missguided: "Missguided",
    gap: "Gap",
    motivi: "Motivi",
    moschino: "Moschino",
    veromoda: "Vero Moda",
    liujo: "Liu Jo",
  };

  const router = useRouter();
  const { brand } = router.query;

  let brandName;
  if (brand) {
    brandName = slugToBrand[brand];
  }

  useEffect(() => {
    if (brandName) {
      db.collection("products")
        .where("brand", "==", brandName)
        .onSnapshot((snap) => {
          const dbProducts = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(dbProducts);
        });
    }
  });
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
        <h1>{brandName}</h1>
        <div className={styles.grid}>
          {products.map((prod) => (
            <ProductGridItem product={prod} />
          ))}
        </div>
      </main>
    </div>
  );
}
