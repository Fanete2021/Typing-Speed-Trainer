import { useCallback, useEffect } from "react";

export const useInputHandling = (keyDownHandler: (event: KeyboardEvent) => void) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keyDownHandler(event);
  }, [ keyDownHandler ]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ handleKeyDown ]);
};
