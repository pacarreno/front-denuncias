import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Configuración de Firebase

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Autenticar usuario con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Usuario autenticado:", user);

      setError("");

      // Redirigir según el correo electrónico
      if (user.email === "denunciante@manon.cl") {
        navigate("/denunciante");
      } else if (user.email === "admin@manon.cl") {
        navigate("/admin");
      } else if (user.email === "investigador@manon.cl") {
        navigate("/investigador");
      } else {
        setError("Correo electrónico no autorizado.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Usuario o contraseña incorrecta.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 400,
        margin: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
      Gestión de casos de la ley Karin
      </Typography>
      <TextField
        label="Correo Electrónico"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        autoComplete="off"
      />
      <TextField
        label="Contraseña"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        autoComplete="off"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default Login;
