import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "denunciante") {
      onLogin("denunciante");
    } else if (username === "admin") {
      onLogin("admin");
    } else {
      alert("Usuario o contraseña incorrecta");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
      <Typography variant="h4">Login</Typography>
      <TextField
        fullWidth
        label="Usuario"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default Login;
