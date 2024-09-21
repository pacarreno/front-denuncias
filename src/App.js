import React, { useState } from "react";
import Login from "./components/Login";
import DenuncianteTable from "./components/DenuncianteTable";
import AdminTable from "./components/AdminTable";
import NewDenuncia from "./components/NewDenuncia";
import { Container } from "@mui/material";

function App() {
  const [userRole, setUserRole] = useState(null); // Rol del usuario
  const [view, setView] = useState("login"); // Control de vistas

  const handleLogin = (role) => {
    setUserRole(role);
    setView(role === "denunciante" ? "denuncianteTable" : "adminTable");
  };

  const handleNewDenuncia = () => {
    setView("newDenuncia");
  };

  return (
    <Container>
      {view === "login" && <Login onLogin={handleLogin} />}
      {view === "denuncianteTable" && (
        <DenuncianteTable onNewDenuncia={handleNewDenuncia} />
      )}
      {view === "adminTable" && <AdminTable />}
      {view === "newDenuncia" && <NewDenuncia />}
    </Container>
  );
}

export default App;
