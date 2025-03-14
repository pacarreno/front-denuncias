import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import DenuncianteTable from "./components/DenuncianteTable";
import AdminTable from "./components/AdminTable";
import InvestigadorTable from "./components/InvestigadorTable";
import InvestigacionInterna from "./components/InvestigacionInterna";
import RegistrarResultado from "./components/RegistrarResultado";
import NewDenuncia from "./components/NewDenuncia";
import { auth } from "../firebaseConfig";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isAuthRequired = !location.state?.skipAuth;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/denunciante"
        element={user?.email === "denunciante@manon.cl" ? <DenuncianteTable /> : <Navigate to="/login" />}
      />
      <Route
        path="/nueva_denuncia"
        element={user?.email === "denunciante@manon.cl" ? <NewDenuncia /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin"
        element={user?.email === "admin@manon.cl" ? <AdminTable /> : <Navigate to="/login" />}
      />
      <Route
        path="/investigador"
        element={user?.email === "investigador@manon.cl" ? <InvestigadorTable /> : <Navigate to="/login" />}
      />
      <Route
        path="/investigacion/:id"
        element={user?.email === "investigador@manon.cl" ? <InvestigacionInterna /> : <Navigate to="/login" />}
      />
      <Route
        path="/registrarresultado/:id"
        element={isAuthRequired && !user ? <Navigate to="/login" /> : <RegistrarResultado />}
      />
      <Route
        path="/"
        element={user ? <Navigate to={getRedirectPath(user.email)} /> : <Login />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const getRedirectPath = (email) => {
  if (email === "denunciante@manon.cl") {
    return "/denunciante";
  } else if (email === "admin@manon.cl") {
    return "/admin";
  } else if (email === "investigador@manon.cl") {
    return "/investigador";
  } else {
    return "/login";
  }
};

export default App;
