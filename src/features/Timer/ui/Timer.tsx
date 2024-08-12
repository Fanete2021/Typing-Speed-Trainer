import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Timer.module.scss";

export interface TimerProps {
  endHandler?: () => void;
  startHandler?: () => void;
  seconds: number;
}

const Timer = (props: TimerProps) => {
  const { endHandler, seconds, startHandler } = props;

  const [ isWork, setIsWork ] = useState<boolean>(false);
  const [ remainingTime, setRemainingTime ] = useState<number>(seconds);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setRemainingTime(seconds);
  }, [ seconds ]);

  const changeRemainingTime = useCallback(() => {
    setRemainingTime(prev => prev - 1);
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      if (timer.current) {
        clearInterval(timer.current);
      }

      setIsWork(false);
      endHandler?.();
    }
  }, [ remainingTime, endHandler ]);

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const start = useCallback(() => {
    setRemainingTime(seconds);
    setIsWork(true);

    if (timer.current) {
      clearInterval(timer.current);
    }

    timer.current = setInterval(() => {
      changeRemainingTime();
    }, 1000);

    startHandler?.();
  }, [ seconds, changeRemainingTime, startHandler ]);

  const retryHandler = useCallback(() => {
    clearInterval(timer.current!);
    start();
  }, [ start ]);

  return (
    <div className={styles.Timer}>
      <button onClick={start} disabled={isWork} className={styles.start}>
        {isWork ? remainingTime : "Старт"}
      </button>

      <button className={styles.retry} disabled={!isWork} onClick={retryHandler}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
          {/* eslint-disable-next-line max-len */}
          <path d="M 25 2 A 1.0001 1.0001 0 1 0 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 18.307314 7.130711 12.364806 12 8.5195312 L 12 15 A 1.0001 1.0001 0 1 0 14 15 L 14 6.5507812 L 14 5 L 4 5 A 1.0001 1.0001 0 1 0 4 7 L 10.699219 7 C 5.4020866 11.214814 2 17.712204 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z"/>
        </svg>
      </button>
    </div>
  );
};

export default Timer;
