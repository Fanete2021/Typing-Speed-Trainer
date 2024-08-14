import { Switcher, Word } from "@/shared/ui";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TypingTest.module.scss";
import { Timer } from "@/features/Timer";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch.ts";
import { TypingTestResult, typingTestActions } from "@/entiites/TypingTest";
import { useIsMobile } from "@/shared/lib/hooks/useIsMobile.ts";
import { useInputHandling } from "@/shared/lib/hooks/useInputHandling.ts";

const maxRenderingWordsDesktop = 80;
const maxRenderingWordsMobile = 25;
const maxWrongs = 5;
const maxHeightDifference   = 40; //максимальная разница высоты между кареткой и нижней границей блока
const timeOptions = [ 100, 60, 30, 15 ];
const backspace = "Backspace";

export interface TypingTestProps {
  text: string;
}

const TypingTest = (props: TypingTestProps) => {
  const {
    text
  } = props;

  const words = useMemo(() => {
    return text.split(" ");
  }, [ text ]);

  const [ typedText, setTypedText ] = useState<string>("");
  const [ typedWords, setTypedWords ] = useState<string[]>([]);
  const [ isWorkTimer, setIsWorkTimer ] = useState<boolean>(false);
  const [ countTypedSymbols, setCountTypedSymbols ] = useState<number>(0);
  const [ countErrors, setCountErrors ] = useState<number>(0);
  const [ indexStartWord, setIndexStartWord ] = useState<number>(0);
  const [ selectedTimeIndex, setSelectedTimeIndex ]  = useState<number>(0);
  const [ seconds, setSeconds ] = useState<number>(100);

  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);
  const caretRef = useRef<HTMLDivElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null); //Для клавиатуры на мобильных устройствах

  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const handleKeyDown = (newLetter: string) => {
    if (!isWorkTimer) return;

    if (newLetter === backspace) {
      const newTypedText = typedText.slice(0, -1);

      setTypedText(newTypedText);
      setTypedWords(newTypedText.split(" "));
    } else {
      //ignore Shift, ctrl ...
      if (newLetter.length > 1) return;

      //ignore чтобы не перескакивать через слова
      if (newLetter === " " && typedWords[typedWords.length - 1].length === 0) return;

      //отключение спама
      const isSpam = typedWords.length &&
        typedWords[typedWords.length - 1].length - words[typedWords.length - 1].length > maxWrongs;

      if (isSpam) return;

      setCountTypedSymbols(prev => prev + 1);

      const newTypedText = typedText + newLetter;
      setTypedText(newTypedText);
      setTypedWords(newTypedText.split(" "));

      if (text[typedText.length] !== newLetter) {
        setCountErrors(prev => prev + 1);
      }
    }
  };

  useInputHandling((e) => handleKeyDown(e.key));

  const handleMobileKeyDown = (event) => {
    const { value } = event.target;

    if (value.length < typedText.length) {
      handleKeyDown(backspace);
    } else {
      handleKeyDown(value.slice(-1));
    }
  };

  //Перемещение каретки
  useEffect(() => {
    if (!wordRefs) return ;
    
    const currentWord = wordRefs.current[typedWords.length - 1 - indexStartWord];

    if (!currentWord) return;
  
    const spans = currentWord.querySelectorAll("span");
    const targetSpan = spans[typedWords[typedWords.length - 1].length - 1];

    const rect = targetSpan ? targetSpan.getBoundingClientRect() : currentWord.getBoundingClientRect();
    const parentRect = caretRef.current!.parentElement!.getBoundingClientRect();

    const relativeTop = rect.top - parentRect.top;

    if (targetSpan) {
      const relativeLeft = rect.right - parentRect.left;

      const offsetCaret = 2.5;
      caretRef.current!.style.left = `${relativeLeft}px`;
      caretRef.current!.style.top = `${relativeTop - offsetCaret}px`;
    } else {
      const relativeLeft = rect.left - parentRect.left;

      const offsetCaret = -1.5;
      caretRef.current!.style.left = `${relativeLeft}px`;
      caretRef.current!.style.top = `${relativeTop - offsetCaret}px`;
    }

    if (parentRect.top - relativeTop < maxHeightDifference) {
      setIndexStartWord(typedWords.length - 1);
      caretRef.current!.style.left = "auto";
      caretRef.current!.style.top = "auto";
    }
  }, [ wordRefs, typedWords, caretRef, setIndexStartWord, indexStartWord ]);

  const resetStates = () => {
    setCountTypedSymbols(0);
    setCountErrors(0);
    setTypedWords([]);
    setTypedText("");
    setIndexStartWord(0);
  };

  const startTimerHandler = () => {
    setSeconds(timeOptions[selectedTimeIndex]);
    setIsWorkTimer(true);
    resetStates();

    caretRef.current!.style.left = "auto";
    caretRef.current!.style.top = "auto";

    if (hiddenInputRef.current) {
      hiddenInputRef.current!.value = "";
    }
  };

  const endTimerHandler = () => {
    setIsWorkTimer(false);

    const stats: TypingTestResult = {
      errors: countErrors,
      time: seconds,
      typedSymbols: countTypedSymbols,
      wpm: Math.round((countTypedSymbols / 5) / (seconds / 60)) //(Characters typed / 5) / (seconds typed / 60)
    };

    dispatch(typingTestActions.setData(stats));
  };

  const indexLastWord = indexStartWord + (isMobile ? maxRenderingWordsMobile : maxRenderingWordsDesktop);

  return (
    <div className={styles.TypingTest}>
      <div className={styles.time}>
        <div className={styles.title}>Настройка времени:</div>

        <Switcher
          options={timeOptions}
          changeIndex={i => setSelectedTimeIndex(i)}
          currentIndex={selectedTimeIndex}
        />
      </div>

      {isMobile &&
        <input
          type="text"
          className={styles.hiddenInput}
          ref={hiddenInputRef}
          onChange={(e) => handleMobileKeyDown(e)}
        />
      }

      <div
        className={styles.words}
        onClick={() => hiddenInputRef.current?.focus()}
      >
        {words.slice(indexStartWord, indexLastWord).map((word, index) => (
          <div
            key={uuidv4()}
            ref={el => wordRefs.current[index] = el}
          >
            <Word
              word={word}
              typedWord={typedWords[index + indexStartWord]}
              className={styles.word}
            />
          </div>
        ))}

        <div className={styles.caret} ref={caretRef} />
      </div>

      <div className={styles.actions}>
        <Timer seconds={seconds} startHandler={startTimerHandler} endHandler={endTimerHandler} />
      </div>
    </div>
  );
};

export default TypingTest;