import { useState, useEffect, useContext } from "react";
import TableProveedores from "../../components/tableProveedores";
import { findProveedores } from "../../services/proveedorService";
import * as GoIcons from "react-icons/go";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import "./styles.css";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getAllProveedores();
  }, []);

  const getAllProveedores = () => {
    setLoading(true);
    findProveedores()
      .then(({ data }) => {
        setProveedores(data);
        setSuggestions(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const searchProveedores = (e) => {
    const { value } = e.target;
    if (value !== "") {
      const filteredProveedores = proveedores.filter((elem) => {
        if (
          /* elem.tipoPersona.includes(value) ||   */
          elem.cedula.includes(value.toUpperCase()) ||
          elem.razonSocial.includes(value.toUpperCase())
        ) {
          return elem;
        }
      });
      if (filteredProveedores.length > 0) {
        setSuggestions(filteredProveedores);
      } else {
        setSuggestions(proveedores);
      }
    } else {
      setSuggestions(proveedores);
    }
    setSearch(value);
  };
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
        fontSize: "15px",
        height: "35px",
        backgroundColor: "#D92121",
        opacity: 0.9,
        color: "white",
      },
    },
  };

  const handleClickInicio = (e) => {
    e = e.target.value;
    if (user.role === "cartera" || user.role === "agencias") {
      return navigate("/inicio");
    } else if (
      user.role === "compras" ||
      user.role === "asistente agencia" ||
      user.role === "comprasnv"
    ) {
      return navigate("/compras");
    } else {
      return navigate("/inicio/admin");
    }
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
          Listado de Proveedores registrados
        </h1>
        <div
          className="d-flex flex-column gap-1"
          style={{ height: "calc(100% - 60px)" }}
        >
          <div className="div-botons justify-content-end mt-1 gap-3 mb-1">
            <input
              type="search"
              value={search}
              className="form-control form-control-sm w-100 rounded-2"
              placeholder="Buscar Proveedor por 'ID' o 'Nombre'"
              onChange={searchProveedores}
              style={{ width: 500, fontSize: 20 }}
            />
            <button
              title="Nuevo Cliente"
              className="d-flex justify-content-center align-text-center text-nowrap btn btn-sm  text-light gap-1"
              style={{
                fontSize: 18,
                backgroundColor: "#D92121",
                color: "white",
              }}
              onClick={handleClickInicio}
            >
              Nuevo Proveedor
              <GoIcons.GoPersonAdd style={{ width: 25, height: 25 }} />
            </button>
          </div>
          <TableProveedores
            proveedores={suggestions}
            loading={loading}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}
