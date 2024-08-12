import {KeyboardEvent, useCallback, useEffect} from "react";

export interface InputHandlingProps {
  keyDownHandler: (e: KeyboardEvent) => void;
}

const InputHandling = (props: InputHandlingProps) => {
  const {
    keyDownHandler
  } = props;

  const handleKeyDown = useCallback((event) => {
    keyDownHandler(event);
  }, [keyDownHandler])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyDownHandler, handleKeyDown]);

  return (
    <></>
  );
};

export default InputHandling;