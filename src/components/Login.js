import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate =  useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Usuario autenticado
      const user = userCredential.user;
      console.log("User logged in: ", user);
      setError("");
      // Redireccionar según el rol (mock)
      if (user.email === "denunciante@manon.cl") {
        console.log("denunciante");
        navigate("/denunciante");
      } else if (user.email === "admin@manon.cl") {
        navigate("/admin");
      }
    } catch (error) {
      setError("Usuario o contraseña incorrecta");
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
      }}
    >
      <Typography variant="h4" mb={2}>
        Gestión de casos de la ley Karin
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default Login;
