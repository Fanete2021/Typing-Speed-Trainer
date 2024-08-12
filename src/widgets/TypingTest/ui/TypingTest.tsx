import { Word } from "@/shared/ui";
import { v4 as uuidv4 } from "uuid";
import {useCallback, useEffect, useRef, useState} from "react";
import styles from "./TypingTest.module.scss";
import {InputHandling} from "@/features/InputHandling";
import {Timer} from "@/features/Timer";
import {useAppDispatch} from "@/shared/lib/hooks/useAppDispatch.ts";
import {TypingTestResult, typingTestActions} from "@/entiites/TypingTest";

const maxRenderingWords = 100;
const maxWrongs = 5;
const maxHeightDifference   = 40; //максимальная разница высоты между кареткой и нижней границей блока
const seconds = 60;

export interface TypingTestProps {
  text: string;
}

const TypingTest = (props: TypingTestProps) => {
  const {
    text
  } = props;
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(text.split(" "));
  }, [setWords, text]);

  const [typedText, setTypedText] = useState<string>("");
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [isWorkTimer, setIsWorkTimer] = useState<boolean>(false);
  const [countTypedSymbols, setCountTypedSymbols] = useState<number>(0);
  const [countErrors, setCountErrors] = useState<number>(0);
  const [indexStartWord, setIndexStartWord] = useState<number>(0);

  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);
  const caretRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();

  const handleKeyDown = (event) => {
    const newLetter = event.key;

    if (isWorkTimer) {
      if (event.key === "Backspace") {
        const newTypedText = typedText.slice(0, -1);

        setTypedText(newTypedText);
        setTypedWords(newTypedText.split(" "));
      } else {
        //ignore Shift, ctrl ...
        if (newLetter.length > 1) return;

        //ignore чтобы не перескакивать через слова
        if (newLetter === " " && typedWords[typedWords.length - 1].length === 0) return;

        //отключение спама
        const isSpam = typedWords.length !== 0 && typedWords[typedWords.length - 1].length - words[typedWords.length - 1].length > maxWrongs;
        if (!isSpam) {
          setCountTypedSymbols(prev => prev + 1);

          const newTypedText = typedText + event.key;
          setTypedText(newTypedText);
          setTypedWords(newTypedText.split(" "));

          if (text[typedText.length] !== event.key) {
            setCountErrors(prev => prev + 1);
          }
        }
      }
    }
  }

  //Перемещение каретки
  useEffect(() => {
    if (wordRefs) {
      const currentWord = wordRefs.current[typedWords.length - 1 - indexStartWord];

      if (currentWord) {
        const spans = currentWord.querySelectorAll('span');
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
          setIndexStartWord(prev => typedWords.length - 1);
          caretRef.current!.style.left = `auto`;
          caretRef.current!.style.top = `auto`;
        }
      }
    }
  }, [wordRefs, typedWords, caretRef, setIndexStartWord]);

  const startTimerHandler = useCallback(() => {
    setIsWorkTimer(true);
    setCountTypedSymbols(0);
    setCountErrors(0);
    setTypedWords([]);
    setTypedText("");
    setIndexStartWord(0);

    caretRef.current!.style.left = 'auto';
    caretRef.current!.style.top = 'auto';
  }, [setIsWorkTimer]);

  const endTimerHandler = () => {
    setIsWorkTimer(false);

    const stats: TypingTestResult = {
      errors: countErrors,
      time: seconds,
      typedSymbols: countTypedSymbols,
      wpm: Math.round((countTypedSymbols / 5) / (seconds / 60)) //(Characters typed / 5) / (seconds typed / 60)
    }

    dispatch(typingTestActions.setData(stats));
  };

  return (
    <div className={styles.TypingTest}>
      <InputHandling keyDownHandler={handleKeyDown}/>

      <div className={styles.words}>
        {words.slice(indexStartWord, indexStartWord + maxRenderingWords).map((word, index) => (
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