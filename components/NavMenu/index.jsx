import styles from "../../styles/Home.module.css";
import Link from "next/link";

export function NavMenu() {
  return (
    <div className={styles.navMenu}>
      <div className={styles.dropdown}>
        <Link href={"/haine"}>
          <button className={styles.dropbtn}>Haine</button>
        </Link>
        <div className={styles.dropdownContent}>
          <Link href={"/haine/pantaloni"}>Pantaloni</Link>
          <Link href={"/haine/bluze-si-tricouri"}>Bluze și Tricouri</Link>
          <Link href={"/haine/rochii"}>Rochii</Link>
          <Link href={"/haine/fuste"}>Fuste</Link>
          <Link href={"/haine/geci-si-paltoane"}>Geci și Paltoane</Link>
          <Link href={"/haine/imbracaminte-sport"}>Îmbrăcăminte Sport</Link>
          <Link href={"/haine/sacouri"}>Sacouri</Link>
        </div>
      </div>
      <div className={styles.dropdown}>
        <Link href={"/accesorii"}>
          <button className={styles.dropbtn}>Accesorii</button>
        </Link>
        <div className={styles.dropdownContent}>
          <Link href={"/accesorii/genti"}>Genti</Link>
          <Link href={"/accesorii/esarfe"}>Esarfe</Link>
          <Link href={"/accesorii/bijuterii"}>Bijuterii</Link>
        </div>
      </div>
      <div className={styles.dropdown}>
        <button className={styles.dropbtn}>Brands</button>

        <div className={styles.dropdownContent}>
          <Link href={"/brands/mango"}>Mango</Link>
          <Link href={"/brands/veromoda"}>Vero Moda</Link>
          <Link href={"/brands/only"}>Only</Link>
          <Link href={"/brands/moschino"}>Moschino</Link>
          <Link href={"/brands/motivi"}>Motivi</Link>
          <Link href={"/brands/levis"}>Levi's</Link>
          <Link href={"/brands/nakd"}>Na-Kd</Link>
          <Link href={"/brands/missguided"}>Missguided</Link>
          <Link href={"/brands/gap"}>Gap</Link>
          <Link href={"/brands/liujo"}>Liu Jo</Link>
        </div>
      </div>

      <Link href={"/bella-card"}>Bella Card</Link>
    </div>
  );
}
