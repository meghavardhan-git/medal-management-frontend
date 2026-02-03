import { createContext, useContext, useEffect, useState } from "react";

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  // ✅ load from localStorage initially
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ persist whenever favourites change
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (country) => {
    if (!favourites.find((c) => c.name === country.name)) {
      setFavourites([...favourites, country]);
    }
  };

  const removeFavourite = (name) => {
    setFavourites(favourites.filter((c) => c.name !== name));
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouritesContext);
}
