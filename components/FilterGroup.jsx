import styles from "../styles/Home.module.css";
import { ColorSwatch } from "../components/ColorSwatch";

export function FilterGroup(props) {
  const {
    showColorSwatches,
    setShowColorSwatches,
    filterColors,
    setFilterColors,
    showPriceRange,
    setShowPriceRange,
    priceRange,
    setPriceRange,
  } = props;

  const availableColors = [
    "black",
    "white",
    "gray",
    "beige",
    "yellow",
    "brown",
    "orange",
    "blue",
    "light blue",
    "green",
    "pink",
    "multi",
  ];

  const colorToRGB = {
    black: "rgb(0, 0,0)",
    white: "rgb(255, 255, 255)",
    gray: "rgb(125, 125, 125)",
    beige: "rgb(225, 198, 153)",
    yellow: "rgb(255, 220, 38)",
    brown: "rgb(149, 85, 31)",
    orange: "rgb(255, 94, 19)",
    blue: "rgb(0, 80, 180)",
    "light blue": "rgb(173, 216, 230)",
    green: "rgb(114, 255, 80)",
    pink: "rgb(254, 125, 156)",
    multi:
      "linear-gradient(48deg, rgba(131,58,180,1) 18%, rgba(253,29,29,1) 42%, rgba(252,241,69,1) 66%, rgba(69,252,79,1) 83%)",
  };

  function changePriceRange(event, idx) {
    const number = event.target.value;
    let newPriceRange = [priceRange[0], priceRange[1]];
    newPriceRange[idx] = parseInt(event.target.value);

    setPriceRange(newPriceRange);
  }

  return (
    <div className={styles.filters}>
      <div
        className={styles.filterName}
        onClick={() => setShowColorSwatches(!showColorSwatches)}
      >
        {showColorSwatches ? "Culori ▲" : "Culori ▼"}
      </div>

      {showColorSwatches ? (
        <div className={styles.colorSwatches}>
          {availableColors.map((color) => (
            <ColorSwatch
              color={color}
              rgbColor={colorToRGB[color]}
              filterColors={filterColors}
              setFilterColors={setFilterColors}
            />
          ))}
        </div>
      ) : null}

      <div
        onClick={() => setShowPriceRange(!showPriceRange)}
        className={styles.filterName}
      >
        {showPriceRange ? "Preț ▲" : "Preț ▼"}
      </div>
      {showPriceRange ? (
        <div className={styles.priceRangeContainer}>
          <input
            name="lowerPrice"
            type="number"
            value={priceRange[0]}
            className={styles.priceRangeInput}
            onChange={(e) => changePriceRange(e, 0)}
          />
          <div className={styles.priceRangeLine} />
          <input
            name="higherPrice"
            type="number"
            value={priceRange[1]}
            className={styles.priceRangeInput}
            onChange={(e) => changePriceRange(e, 1)}
          />
        </div>
      ) : null}
    </div>
  );
}
