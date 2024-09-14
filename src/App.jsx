import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./Pages/Login/Login";
import QuoteList from "./Pages/QuoteList/quoteList";
import CreateQuote from "./Pages/CreateQuote/createQuote";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/quotes" element={<QuoteList />} />
          <Route exact path="/quotes/create-quote" element={<CreateQuote />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
