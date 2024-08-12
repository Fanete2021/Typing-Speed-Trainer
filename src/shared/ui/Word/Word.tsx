import {classNames} from "@/shared/lib/utils/classNames.ts";
import { v4 as uuidv4 } from "uuid";
import styles from "./Word.module.scss";
import {useEffect, useState} from "react";

export interface WordProps {
  word: string;
  typedWord?: string;
}

const Word = (props: WordProps) => {
  const {
    word,
    typedWord,
    className
  } = props;

  return (
    <div className={classNames(className)}>
      {word.split("").map((letter, index) => (
        <span
          key={uuidv4()}
          className={classNames(!(typedWord && typedWord[index]) ? styles.letter : (typedWord[index] === letter ? styles.correct : styles.incorrect))}
        >
          {letter}
        </span>
      ))}

      {typedWord?.length > word.length &&
        (
        typedWord?.slice(word.length).split("").map((letter, index) => (
          <span
            key={uuidv4()}
            className={styles.extra}
          >
            {letter}
          </span>
        ))
        )
      }
    </div>
  );
};

export default Word;