import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import CreateUser from './components/CreateUser';
import SpellSheet from "./components/SpellSheet";
import CreateCharacter from './components/CreateCharacter'; // ADD this

import { AppProvider } from "./Context/Context"; // Wrap App

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createcharacter" element={<CreateCharacter />} /> {/* Add this route */}
          <Route path="/character/:id" element={<SpellSheet />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
