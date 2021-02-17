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
import { capitalize } from "../../utils";
import { Title } from "../../components/Title";

// Component for a grid view page of a certain accessory category
export default function Accesorii() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterColors, setFilterColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showColorSwatches, setShowColorSwatches] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [sortPrice, setSortPrice] = useState(0);

  function applyFilters() {
    let sortedProducts = JSON.parse(JSON.stringify(products));
    if (sortPrice === 1) {
      sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortPrice === -1) {
      sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
    }

    let filteredProducts = sortedProducts.filter((prod) => {
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

  const router = useRouter();
  const { accesorii } = router.query;

  useEffect(() => {
    if (accesorii) {
      const unsubscribe = db
        .collection("products")
        .where("type", "==", accesorii)
        .onSnapshot((snap) => {
          const dbProducts = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(dbProducts);
          setFilteredProducts(dbProducts);
          setFilterColors([]);
          setPriceRange([0, 1000]);
          setSortPrice(0);
        });
      return () => unsubscribe();
    }
  }, [accesorii]);

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
        <h1 className={styles.pageTitle}>{capitalize(accesorii)}</h1>

        <FilterGroup
          showColorSwatches={showColorSwatches}
          setShowColorSwatches={setShowColorSwatches}
          filterColors={filterColors}
          setFilterColors={setFilterColors}
          showPriceRange={showPriceRange}
          setShowPriceRange={setShowPriceRange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortPrice={sortPrice}
          setSortPrice={setSortPrice}
        />
        <div
          className={styles.applyFiltersButton}
          onClick={() => applyFilters()}
        >
          APLICAŢI FILTRELE
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((prod) => (
            <ProductGridItem product={prod} />
          ))}
        </div>
      </main>
    </div>
  );
}
