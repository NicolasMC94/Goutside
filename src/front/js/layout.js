import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import Home from "./pages/Home.jsx";
import injectContext, { Context } from "./store/appContext";
import { Navbar } from "./component/navbar/navbar.jsx";
import Signup from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import HomeUser from "./pages/homeUser/HomeUser.jsx";
import EditProfile from "./pages/editProfile/EditProfile.jsx";
import Sidebar from "./component/sidebar/Sidebar.jsx";
import AllCompetition from "./pages/allCompetition/AllCompetition.jsx";
import InfoCompetition from "./pages/infoCompetition/InfoCompetition.jsx";
import Clasification from "./pages/clasification/Clasification.jsx";
import AboutUs from "./pages/aboutUs/AboutUs.jsx";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  const { store, actions } = useContext(Context);

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Signup />} path="/signup" />
            <Route element={<Login />} path="/login" />
            <Route element={<AboutUs />} path="/aboutus" />

            <Route
              element={
                !(store.tokenLS === null) ? <HomeUser /> : <Navigate to="/" />
              }
            >
              <Route path="/home/user" element={<Navbar />} />
              <Route path="edit-profile" element={<EditProfile />} />

              {/*               <Route
                path="create-competition"
                element={<CreateCompetition.jsx />}
              /> */}
              <Route
                path="/all-commpetition"
                element={<AllCompetition.jsx />}
              />
              <Route
                path="/competition/<int:id/>"
                element={<InfoCompetition />}
              />
              <Route
                path="/clasification/<int:id/>"
                element={<Clasification />}
              />
            </Route>

            <Route element={<h1>Not found!</h1>} />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
