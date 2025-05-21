import DatePicker from "./components/datePicker/datePicker";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <DatePicker />
    </div>
  );
}
