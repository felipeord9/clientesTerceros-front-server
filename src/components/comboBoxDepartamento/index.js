import { useEffect, useRef, useState, useContext } from "react";
import DepartmentContext from "../../context/departamentoContext";
import "./styles.css";


function ComboBox({ id, options, item, setItem, invoiceType }) {
  const { departamento } = useContext(DepartmentContext);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const ref = useRef();

  useEffect(() => {
    if (!departamento) {
      setInputValue("");
      /* setItem(null); */
    }
    if (!item) {
      ref.current.selectedIndex = 0;
    }
    setSuggestions(options);
  }, [departamento, options, invoiceType]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (value !== "") {
      const filter = options?.filter((elem) =>
        elem.departamento.toLowerCase().includes(value.toLowerCase())
      );
      /* if (filter.length !== 1) {
        ref.current.selectedIndex = 0;
      } */
      setSuggestions(filter);
    } else {
      setSuggestions(options);
      //ref.current.selectedIndex = 0;
    }
    ref.current.selectedIndex = 0;
    setInputValue(value);
    setItem(null);
  };

  const selectedOption = async (e) => {
    const { value } = e.target;
    const object = JSON.parse(value);
    setItem(object);
    setInputValue(object.departamento);
    setSuggestions(options);
  };

  return (
    <div className="d-flex align-items-center position-relative w-100">
      <input
        type="search"
        value={item ? item.departamento : inputValue}
        className="form-control form-control-sm input-select"
        placeholder={`Buscar por departamento`}
        onChange={handleChange}
      />
      <select
        id={id}
        ref={ref}
        className="form-select form-select-sm"
        value={item && item.description}
        onChange={(e) => {
          selectedOption(e);
        }}
        required
      >
        <option selected disabled value="">
          {suggestions?.length === 0
            ? "-- Seleccione --"
            : "No se encontraron coincidencias..."}
        </option>
        {suggestions
          ?.sort((a, b) => a.branch - b.branch)
          .map((elem, index) => (
            <option key={index} id={elem.id} value={JSON.stringify(elem)}>
              {`${elem.id + ' - ' + elem.description} - ${elem.departamento}`}
            </option>
          ))}
      </select>
    </div>
  );
}

export default ComboBox;