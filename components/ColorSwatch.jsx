import styles from "../styles/Home.module.css";

// Component consisting of a single color used in the filter group
// component for filtering by color
export function ColorSwatch(props) {
  const { color, rgbColor, filterColors, setFilterColors } = props;

  function handleColorClick() {
    if (filterColors.includes(color)) {
      const idx = filterColors.findIndex((c) => c === color);

      let newFilterColors = JSON.parse(JSON.stringify(filterColors));
      newFilterColors.splice(idx, 1);
      setFilterColors(newFilterColors);
    } else {
      let newFilterColors = JSON.parse(JSON.stringify(filterColors));
      newFilterColors.push(color);

      setFilterColors(newFilterColors);
    }
  }

  return (
    <div
      className={styles.colorSwatch}
      style={{
        background: rgbColor,
        border: "1px solid #333",
        boxShadow: filterColors.includes(color)
          ? "5px 5px rgba(0,0,0,0.5)"
          : "none",
      }}
      onClick={() => handleColorClick()}
    />
  );
}
