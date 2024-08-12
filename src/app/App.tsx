import "./styles/index.scss";
import "./styles/reset.scss";
import { TypingTest } from "@/widgets/TypingTest";
import testText from "@/shared/assets/texts/testText.ts";
import { Stats } from "@/entiites/TypingTest";

function App() {

  return (
    <div className={"app"}>
      <TypingTest text={testText}/>

      <div className={"stats"}>
        <Stats />
      </div>
    </div>
  );
}

export default App;
