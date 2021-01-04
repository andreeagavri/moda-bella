import Head from "next/head";
import styles from "../styles/Home.module.css";
import products from "../products.json";
import { ProductGridItem } from "../components/ProductGridItem";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Moda Bella</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>MODA BELLA</h1>
        <div className={styles.grid}>
          {products.map((prod) => (
            <ProductGridItem product={prod} />
          ))}
        </div>
      </main>
    </div>
  );
}
