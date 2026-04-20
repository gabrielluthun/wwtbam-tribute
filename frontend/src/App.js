import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SetupQuestions } from "./pages/SetupQuestions";
import { Game } from "./pages/Game";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<SetupQuestions />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
