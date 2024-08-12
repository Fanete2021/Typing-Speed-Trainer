export interface TypingTestResult {
  typedSymbols: number,
  errors: number,
  wpm: number,
  time: number,
}

export interface TypingTestSchema {
  data?: TypingTestResult;
}