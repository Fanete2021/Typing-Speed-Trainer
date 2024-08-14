import styles from "./Switcher.module.scss";
import { classNames } from "@/shared/lib/utils/classNames.ts";

export interface SwitcherProps {
  options: string[] | number[],
  currentIndex: number,
  changeIndex: (i: number) => void,
}

const Switcher = (props: SwitcherProps) => {
  const {
    changeIndex,
    currentIndex,
    options
  } = props;

  return (
    <div className={styles.Switcher}>
      {options.map((option, index) => (
        <button
          className={classNames(styles.option, [ index === currentIndex && styles.selected ])}
          onClick={() => changeIndex(index)}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Switcher;