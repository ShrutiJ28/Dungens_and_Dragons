import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  user: null,
  characters: [],
  updateCharacters: () => { },
  currentCharacter: null,
  setCurrentCharacter: () => { },
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedCharacters = JSON.parse(localStorage.getItem("characters")) || [];
    setUser(savedUser);
    setCharacters(savedCharacters);
  }, []);

  const updateCharacters = (newList) => {
    setCharacters(newList);
    localStorage.setItem("characters", JSON.stringify(newList));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        characters,
        updateCharacters,
        currentCharacter,
        setCurrentCharacter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
