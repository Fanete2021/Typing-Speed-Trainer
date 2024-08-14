import { classNames } from "@/shared/lib/utils/classNames.ts";
import styles from "./Word.module.scss";
import { useMemo } from "react";

export interface WordProps {
  word: string;
  typedWord: string;
  className: string;
}

interface Letter {
  value: string;
  status: "no-typed" | "error" | "ok" | "extra";
}

function getArrayLetters(word: string, typedWord: string): Letter[] {
  const result: Letter[] = [];

  for (let i = 0; i < word.length; ++i) {
    if (typedWord.length - 1 < i) {
      result.push({
        value: word[i],
        status: "no-typed"
      });

      continue;
    }

    if (word[i] === typedWord[i]) {
      result.push({
        value: word[i],
        status: "ok"
      });
    } else {
      result.push({
        value: word[i],
        status: "error"
      });
    }
  }

  if (typedWord.length > word.length) {
    for (let i = word.length; i < typedWord.length; ++i) {
      result.push({
        value: typedWord[i],
        status: "extra"
      });
    }
  }

  return result;
}

const Word = (props: WordProps) => {
  const {
    word,
    typedWord = "",
    className
  } = props;

  const arrayLetters = useMemo(() => getArrayLetters(word, typedWord), [ word, typedWord ]);

  return (
    <div className={classNames(className, [ styles.word ])}>
      {arrayLetters.map((letter, index) => (
        <span
          key={index}
          className={classNames("", [], {
            [styles.correct]: letter.status === "ok",
            [styles.extra]: letter.status === "extra",
            [styles.incorrect]: letter.status === "error",
            [styles.letter]: letter.status === "no-typed",
          })}
        >
          {letter.value}
        </span>
      ))}
    </div>
  );
};

export default Word;