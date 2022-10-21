import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import "./deleteprofile.css";

const DeleteProfile = () => {
  const { store, actions } = useContext(Context);

  return (
    <div>
      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="btn btn-warning profile-btn-delete-bg"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={actions.deleteUser()}
      >
        Eliminar cuenta
      </button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              ¿Seguro que desea eliminar su cuenta? Una vez eliminada, se
              perderán todos sus datos
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button type="button" className="btn btn-primary">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
