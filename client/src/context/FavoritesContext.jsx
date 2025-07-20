// src/context/FavoritesContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const { user } = useAuth()

  // Load favorites from localStorage or API
  useEffect(() => {
    if (user) {
      // TODO: Fetch favorites from API for logged-in users
    } else {
      const savedFavorites = localStorage.getItem('sweetDelightsFavorites')
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    }
  }, [user])

  // Save favorites to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('sweetDelightsFavorites', JSON.stringify(favorites))
    }
  }, [favorites, user])

  const toggleFavorite = product => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === product._id)
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.id !== product._id)
      } else {
        return [...prevFavorites, product]
      }
    })
  }

  const isFavorite = productId => {
    return favorites.some(fav => fav.id === productId)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)