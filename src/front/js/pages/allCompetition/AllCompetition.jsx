import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import MapView from "../../component/MapView/MapView.jsx";
import Mensaje from "../../component/mensaje/Mensaje.jsx";
import logo from "../../../img/logo-GOutside.png";
import "./allCompetition.css";

const AllCompetition = () => {
  const [competitions, setCompetitions] = useState([]);
  const { store, actions } = useContext(Context);

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [navegar, setNavegar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getCardsInfo();
  }, []);

  const getCardsInfo = () => {
    const url = process.env.BACKEND_URL + "/api/competitions";
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + actions.getTokenLS(),
      },
      method: "GET",
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        setCompetitions(data.competitions);
      });
  };

  const addCompetitorToCompetition = (competition_id) => {
    const url = process.env.BACKEND_URL + "/api/my-competitions";

    const body = {
      competition_id,
    };

    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + actions.getTokenLS(),
      },
      method: "POST",
      body: JSON.stringify(body),
    };
    const resp = fetch(url, options).then((response) => response.json());
    console.log(resp);
    if (resp.status === 200) {
      setMensaje(
        "¡FELICIDADES! Tu inscripción se ha realizado con éxito. Por favor, acude a tu correo electrónico para finalizar el proceso"
      );
      setTipoMensaje("mensaje-correcto");
      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 7000);
      return;
    } else {
      setMensaje(
        "se ha producido un error en la inscripción. Contacte con el administrador"
      );
      setTipoMensaje("mensaje-error");

      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 3000);
      return;
    }
  };

  const navigateProfile = () => {
    navigate("/edit-profile");
  };

  const handleInscription = () => {
    if (
      store.userName === null ||
      store.userLastName === null ||
      store.userAdress === null ||
      store.userGender === null ||
      store.userPhone === null
    ) {
      setMensaje(
        "Para poder inscribirse debe completar todos los datos de su perfil. Una vez completados, vuelva a la inscripción."
      );
      setTipoMensaje("mensaje-error");
      setNavegar(true);
      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
        setNavegar(false);
      }, 3000);
      return;
    } else {
      addCompetitorToCompetition();
    }
  };

  return (
    <>
      {mensaje && <Mensaje tipo={tipoMensaje}>{mensaje}</Mensaje>}

      {navegar && (
        <button className="btn btn-sucessfull" onClick={navigateProfile}>
          Editar Perfil
        </button>
      )}
      <div className="row">
        {competitions.map((param) => {
          return (
            <div key={param.id} className="card m-2 allcompetition-card-size">
              <img
                src={!param.poster_image_url ? logo : param.poster_image_url}
                className="competition-img-card"
                alt="cartel competicion"
              />
              <div className="card-body">
                <h5 className="fw-bold card-title">{param.competition_name}</h5>
                <p className="m-0 allcompetition-text-p">
                  {param.qualifier_date}
                </p>
                <p className="m-0 allcompetition-text-p">{param.category}</p>
                <p className="allcompetition-text-p">{param.stage}</p>
                <div className="d-flex justify-content-center gap-3 mb-3 position-absolute bottom-0 start-50 translate-middle-x">
                  <Link to={`/competition/${param.id}`}>
                    <button className="btn btn-sucessfull">+INFO</button>
                  </Link>
                  <button
                    className="btn btn-validacion"
                    onClick={handleInscription}
                  >
                    Participar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllCompetition;
