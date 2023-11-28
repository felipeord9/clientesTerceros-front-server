import { useState, createContext } from "react";

const Context = createContext({})

export function DepartmentContextProvider({ children }) {
  const [ departamento, setDepartamento ] = useState(null)

  return (
    <Context.Provider value={{ departamento, setDepartamento}}>{children}</Context.Provider>
  )
}

export default Context