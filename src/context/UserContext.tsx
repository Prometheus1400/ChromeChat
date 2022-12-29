import { createContext } from "react"
import {User} from "../config/config"

export const UserContext = createContext<User | null>(null)