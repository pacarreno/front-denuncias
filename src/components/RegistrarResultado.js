import React, { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";

const RegistrarResultado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [resultado, setResultado] = useState("");
  const [sancion, setSancion] = useState("");

  useEffect(() => {
    const fetchDenuncia = async () => {
      const docRef = doc(db, "denuncias", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setResultado(docSnap.data().resultado || "");
        setSancion(docSnap.data().sancion || "");
      }
    };
    fetchDenuncia();
  }, [id]);

  const handleCerrarSesion = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  const handleVolver = () => {
    navigate("/admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "denuncias", id);
      await updateDoc(docRef, {
        estado: "Resultado Ingresado",
        etapa: "Sancion o Medida Final",
        resultado,
        sancion,
      });
      alert("Resultado registrado correctamente");
      navigate("/admin");
    } catch (error) {
      console.error("Error al registrar resultado:", error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
        <IconButton
          onClick={handleVolver}
          color="primary"
          sx={{ backgroundColor: "#f0f0f0", borderRadius: "50px", p: 1.5 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={handleCerrarSesion}
          color="secondary"
          sx={{ backgroundColor: "#f0f0f0", borderRadius: "50px", p: 1.5 }}
        >
          <ExitToAppIcon />
        </IconButton>
      </Box>
      <Paper sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Registrar Resultado (Denuncia ID: {id})
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Resultado de la Investigación"
            fullWidth
            required
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Sanción o Medida"
            fullWidth
            required
            multiline
            rows={4}
            value={sancion}
            onChange={(e) => setSancion(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Registrar Resultado
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default RegistrarResultado;