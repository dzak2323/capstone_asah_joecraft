import { createContext, useContext } from 'react'

export const KonteksAuth = createContext(null)

export const useAuth = () => useContext(KonteksAuth)
