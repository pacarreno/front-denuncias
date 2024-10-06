import React, {useState, useEffect} from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import DenuncianteTable from "./components/DenuncianteTable";
import AdminTable from "./components/AdminTable";
import NewDenuncia from "./components/NewDenuncia";
import { auth } from "../firebaseConfig";

// Función para manejar rutas privadas
const privateRoute = (isAuthenticated, Component, ...rest) => {
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  console.log("isAuth " + isAuthenticated);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes mostrar un loading spinner aquí
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/denunciante"
        element={privateRoute(isAuthenticated, DenuncianteTable)}
      />
      <Route
        path="/nueva_denuncia"
        element={privateRoute(isAuthenticated, NewDenuncia)}
      />
      <Route
        path="/admin"
        element={privateRoute(isAuthenticated, AdminTable)}
      />

      <Route
        path="/"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate
              to={user.email === "admin@manon.cl" ? "/admin" : "/denunciante"}
            />
          )
        }
      />

      {/* Redireccionar cualquier ruta desconocida al login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
