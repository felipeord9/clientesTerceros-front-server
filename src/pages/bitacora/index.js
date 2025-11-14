import { useState, useEffect } from "react";
import * as GoIcons from "react-icons/go";
import TableBitacora from "../../components/TableBitacora";
import { findBitacoras } from "../../services/bitacoraService";
import "./styles.css";

export default function Bitacora() {
  const [bitacoras, setBitacoras] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllBitacoras();
  }, []);

  const getAllBitacoras = () => {
    setLoading(true);
    findBitacoras()
      .then(({ data }) => {
        setBitacoras(data);
        setSuggestions(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const searchBitacoras = (e) => {
    const { value } = e.target;
    if (value !== "") {
      const filteredBitacoras = bitacoras.filter((elem) => {
        if (elem.usuario.includes(value)) {
          return elem;
        }
      });
      if (filteredBitacoras.length > 0) {
        setSuggestions(filteredBitacoras);
      } else {
        setSuggestions(bitacoras);
      }
    } else {
      setSuggestions(bitacoras);
    }
    setSearch(value);
  };

  /* diseño de la tabla bitacora */
  const customStyles = {
    cells: {
      style: {
        fontSize: "15px", // ajustar el tamaño de la fuente de las celdas
      },
    },
    rows: {
      style: {
        height: "35px", // ajusta el alto de las filas según tus necesidades
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        height: "35px",
        backgroundColor: "#D92121",
        opacity: 0.9,
        color: "white",
      },
    },
  };

  //logica para saber si es celular
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900); // Establecer a true si la ventana es menor o igual a 768px
    };

    // Llama a handleResize al cargar y al cambiar el tamaño de la ventana
    window.addEventListener("resize", handleResize);
    handleResize(); // Llama a handleResize inicialmente para establecer el estado correcto

    // Elimina el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="wrap w-100 d-flex" style={{ userSelect: "none" }}>
      <div
        className={`container d-flex flex-column w-100 py-3 mt-5 rounded-4 ${
          !isMobile && "justify-content-center"
        }`}
      >
        <h1 className="text-danger fw-bold">
          Listado Bitacora (registro de actividad)
        </h1>
        <div
          className="d-flex flex-column gap-1"
          style={{ height: "calc(100% - 60px)" }}
        >
          <TableBitacora
            bitacoras={suggestions}
            loading={loading}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}
