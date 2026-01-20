import { useState, useEffect, useContext } from "react";
import TablaSolicitudes from "../../components/tablaSolicitudes";
import { findClientes, duoFind } from "../../services/clienteService";
import { findProveedores } from "../../services/proveedorService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AuthContext from "../../context/authContext";
import { IoMenu } from "react-icons/io5";
import ModalVistaTercero from "../../components/modalVistaTercero";

export default function Solicitudes() {
  const { user } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModalVistaTercero, setShowModalVistaTercero] = useState(false);
  const [selectedTercero, setSelectedTercero] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (user.role === "admin") {
      duoFind().then((data) => {
        setSuggestions(data);
        setSolicitudes(data);
        setLoading(false);
      });
    } else if (user.role === "cartera") {
      findClientes().then(({ data }) => {
        setSuggestions(data);
        setSolicitudes(data);
        setLoading(false);
      });
    } else if (user.role === "asistente agencia") {
      duoFind().then((data) => {
        const filtro = data.filter((item) => {
          if (
            item.tipoFormulario === "PMJ" ||
            item.tipoFormulario === "PMN" ||
            item.tipoFormulario === "PS" ||
            item.tipoFormulario === "PVJ" ||
            item.tipoFormulario === "PVN" ||
            item.tipoFormulario === "CCP"
          ) {
            return item;
          }
        });
        setSolicitudes(filtro);
        setSuggestions(filtro);
        setLoading(false);
      });
    }
  }, []);

  const searchSolicitudes = (e) => {
    const { value } = e.target;
    if (value !== "") {
      const filteredSolicitudes = solicitudes.filter((elem) => {
        if (
          elem.cedula.includes(value.toUpperCase()) ||
          elem.razonSocial.includes(value.toUpperCase())
        ) {
          return elem;
        }
      });
      if (filteredSolicitudes.length > 0) {
        setSuggestions(filteredSolicitudes);
      } else {
        setSuggestions(solicitudes);
      }
    } else {
      setSuggestions(solicitudes);
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
        height: "40px", // ajusta el alto de las filas según tus necesidades
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

  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "clientes") {
      setLoading(true);
      setSolicitudes([]);
      setSuggestions([]);
      findClientes().then(({ data }) => {
        setSolicitudes(data);
        setSuggestions(data);
        setLoading(false);
      });
    } else if (value === "proveedores") {
      setLoading(true);
      setSolicitudes([]);
      setSuggestions([]);
      findProveedores().then(({ data }) => {
        setSolicitudes(data);
        setSuggestions(data);
        setLoading(false);
      });
    } else if (value === "todos") {
      setLoading(true);
      setSolicitudes([]);
      setSuggestions([]);
      duoFind().then((data) => {
        setSuggestions(data);
        setSolicitudes(data);
        setLoading(false);
      });
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
          Listado de Solicitudes de Terceros
        </h1>
        <ModalVistaTercero
          tercero={selectedTercero}
          setTercero={setSelectedTercero}
          showModal={showModalVistaTercero}
          setShowModal={setShowModalVistaTercero}
        />
        <div
          className="d-flex flex-column gap-1"
          style={{ height: "calc(100% - 60px)" }}
        >
          <div className="div-botons justify-content-end mt-1 gap-3 mb-1">
            <input
              type="search"
              value={search}
              className="form-control form-control-sm w-100 rounded-2"
              placeholder="Buscar Terceros por 'NIT' ó por 'Nombre'"
              onChange={searchSolicitudes}
              style={{ width: 500, fontSize: 20 }}
            />
            {user.role === "admin" && (
              <button
                className="btn btn-sm d-flex flex-row btn-primary w-25 "
                type="button"
              >
                <select
                  id="filtro"
                  className={`form-select form-select-sm text-center`}
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                    border: "none",
                    fontSize: 18,
                  }}
                  onChange={handleChange}
                >
                  <option selected value="" disabled>
                    <strong>
                      <IoMenu />
                      Filtro por Tercero
                    </strong>
                  </option>
                  <option value="clientes" className="text-danger">
                    Clientes
                  </option>
                  <option value="proveedores" className="text-success">
                    Proveedores
                  </option>
                  <option value="todos" className="text-info">
                    Todos
                  </option>
                </select>
              </button>
            )}
          </div>
          <TablaSolicitudes
            solicitudes={suggestions}
            setShowModal={setShowModalVistaTercero}
            setSelectedTercero={setSelectedTercero}
            loading={loading}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}
