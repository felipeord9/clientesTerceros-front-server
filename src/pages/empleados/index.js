import { useState, useEffect, useContext } from "react";
import TablaEmpleados from "../../components/tablaEmpleados";
import { findEmpleados } from "../../services/empleadoService";
import * as GoIcons from "react-icons/go";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import "./styles.css";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getAllEmpleados();
  }, []);

  const getAllEmpleados = () => {
    setLoading(true);
    findEmpleados()
      .then(({ data }) => {
        setEmpleados(data);
        setSuggestions(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const searchEmpleado = (e) => {
    const { value } = e.target;
    if (value !== "") {
      const filteredEmpleados = empleados.filter((elem) => {
        const name = `${elem.primerNombre} ${elem.otrosNombres} ${elem.primerApellido} ${elem.segundoApellido}`;
        if (
          elem.rowId.includes(value.toUpperCase()) ||
          name.toLowerCase().includes(value.toLowerCase())
        ) {
          return elem;
        }
      });
      if (filteredEmpleados.length > 0) {
        setSuggestions(filteredEmpleados);
      } else {
        setSuggestions(empleados);
      }
    } else {
      setSuggestions(empleados);
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
    if (user.role === "agencias" || user.role === "cartera") {
      return navigate("/inicio");
    } else if (
      user.role === "compras" ||
      user.role === "comprasnv" ||
      user.role === "asistente agencia"
    ) {
      return navigate("/compras");
    } else if (user.role === "admin") {
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
    <div
      className="fondo justify-content-center h-100 w-100 m-auto"
      style={{ userSelect: "none" }}
    >
      {/* <div className='rounder-4'> */}
      <div className="container d-flex flex-column pt-5 h-100 contenedor1 gap-1 pb-4">
        {isMobile &&
          <div style={{height: isMobile && '25px'}}></div>
        }
        <h1 className="titulo text-danger fw-bold pt-2 w-100 justify-content-center text-align-center">
          Listado de empleados registrados
        </h1>
        <div className="div-botons gap-2">
          <input
            type="search"
            className="form-control form-control-sm"
            style={{ fontSize: 18, textTransform: "uppercase" }}
            placeholder="Buscar Empleado por 'ID' o 'Nombre'"
            onChange={(e) => searchEmpleado(e)}
          />
          <button
            type="submit"
            title="Nuevo Cliente"
            className="d-flex  text-nowrap btn btn-sm  text-light gap-1"
            style={{
              right: 0,
              fontSize: 18,
              backgroundColor: "#D92121",
              color: "white",
            }}
            onClick={(e) => navigate("/registrar/empleado")}
          >
            Nuevo Empleado
            <GoIcons.GoPersonAdd style={{ width: 25, height: 25 }} />
          </button>
          {/* </div> */}
        </div>
        <TablaEmpleados
          empleados={suggestions}
          loading={loading}
          style={{ fontSize: 20 }}
          customStyles={customStyles}
        />
      </div>
      {/* </div> */}
    </div>
  );
}
