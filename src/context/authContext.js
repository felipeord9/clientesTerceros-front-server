import { createContext, useState } from "react";
import Cookies from 'js-cookie';

const AuthContext = createContext()

export function AuthContextProvider({ children }) {
  const valorCookie = Cookies.get('token')
  const [token, setToken] = useState(
    /* () => JSON.parse(window.localStorage.getItem("token")) */
    /* () => JSON.parse(Cookies.set('token', token, { secure: true, expires: 1, sameSite: 'strict' , httpOnly: true })) */
    () =>  Cookies.get('token')
  );
  const [user, setUser] = useState(
    () => JSON.parse(window.localStorage.getItem("user"))
  );

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext