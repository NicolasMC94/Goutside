import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";

const MyAllCompetitions = () => {
  const [myCompetitions, setMyCompetitions] = useState([]);
  const { store, actions } = useContext(Context);

  useEffect(() => {
    getMyCompetitions();
  }, []);

  const getMyCompetitions = () => {
    const url = process.env.BACKEND_URL + "/api/my-competitions";

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
        console.log(data);
        setMyCompetitions(data);
      });
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        {myCompetitions.map((myCompetition) => {
          return (
            <div key={myCompetition.id} className=" col-md-6 col-lg-4">
              <div className="card m-2">
                <img
                  src={
                    !myCompetition.poster_image_url
                      ? logo
                      : myCompetition.poster_image_url
                  }
                  className="competition-img-card"
                  alt="cartel competicion"
                />
                <div className="card-body">
                  <h4 className="card-title">
                    {myCompetition.competition_name}
                  </h4>
                  <h5 className="card-text">{myCompetition.qualifier_date}</h5>
                  <h5 className="card-text">{myCompetition.category}</h5>
                  <h5 className="card-text">{myCompetition.stage}</h5>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to={`/competition/${myCompetition.id}`}>
                      <button className="home-button2">+INFO</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MyAllCompetitions;
