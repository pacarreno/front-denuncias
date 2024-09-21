import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";

const NewDenuncia = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se enviaría la nueva denuncia al backend
    alert("Denuncia creada: " + titulo);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
      <Typography variant="h4">Nueva Denuncia</Typography>
      <TextField
        fullWidth
        label="Título"
        margin="normal"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <TextField
        fullWidth
        label="Descripción"
        margin="normal"
        multiline
        rows={4}
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Crear Denuncia
      </Button>
    </Box>
  );
};

export default NewDenuncia;
