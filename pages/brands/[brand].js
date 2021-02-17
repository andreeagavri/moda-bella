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
import { FilterGroup } from "../../components/FilterGroup";
import { Title } from "../../components/Title";

// Component for a grid view page for a certain clothing brand
export default function BrandPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterColors, setFilterColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showColorSwatches, setShowColorSwatches] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);

  function applyFilters() {
    let filteredProducts = products.filter((prod) => {
      if (filterColors.length === 0) {
        return true;
      }
      if (filterColors.includes(prod.color)) {
        return true;
      }
      return false;
    });

    filteredProducts = filteredProducts.filter(
      (prod) => prod.price >= priceRange[0] && prod.price <= priceRange[1]
    );
    setFilteredProducts(filteredProducts);
  }

  // Use slugs because names have apostrophes and spaces
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

  // Get only the products of a certain brand from firebase
  useEffect(() => {
    if (brandName) {
      const unsubscribe = db
        .collection("products")
        .where("brand", "==", brandName)
        .onSnapshot((snap) => {
          const dbProducts = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(dbProducts);
          setFilteredProducts(dbProducts);
        });
      return () => unsubscribe();
    }
  }, [brandName]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Moda Bella</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className={styles.main}>
        <Title />
        <NavMenu></NavMenu>
        <h1 className={styles.pageTitle}>{brandName}</h1>

        <FilterGroup
          showColorSwatches={showColorSwatches}
          setShowColorSwatches={setShowColorSwatches}
          filterColors={filterColors}
          setFilterColors={setFilterColors}
          showPriceRange={showPriceRange}
          setShowPriceRange={setShowPriceRange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        <div
          className={styles.applyFiltersButton}
          onClick={() => applyFilters()}
        >
          APLICAŢI FILTRELE
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((prod) => (
            <ProductGridItem product={prod} key={prod.id} />
          ))}
        </div>
      </main>
    </div>
  );
}
