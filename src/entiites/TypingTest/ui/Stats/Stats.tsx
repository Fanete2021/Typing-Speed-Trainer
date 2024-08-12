import {useSelector} from "react-redux";
import {getTypingTestData} from "@/entiites/TypingTest";
import styles from "./Stats.module.scss";

const Stats = () => {
  const stats = useSelector(getTypingTestData);

  if (!stats) {
    return (
      <div className={styles.empty}>
        Не было проведено тестирование.
      </div>
    );
  }

  return (
    <div className={styles.stats}>
      <div className={styles.head}>
        Статистика:
      </div>

      <div className={styles.row}>
        <span className={styles.title}>WPM:</span>
        <span className={styles.result}>{stats.wpm}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.title}>Время:</span>
        <span className={styles.result}>{stats.time} сек.</span>
      </div>

      <div className={styles.row}>
        <span className={styles.title}>Введенно символов:</span>
        <span className={styles.result}>{stats.typedSymbols}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.title}>Ошибки:</span>
        <span className={styles.result}>{stats.errors}</span>
      </div>
    </div>
  );
};

export default Stats;