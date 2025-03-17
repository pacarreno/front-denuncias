import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  IconButton,
  Container,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";


const InvestigacionInterna = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [observaciones, setObservaciones] = useState("");
  const [archivoURL, setArchivoURL] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchDenuncia = async () => {
      const docRef = doc(db, "denuncias", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setObservaciones(docSnap.data().observaciones || "");
        setArchivoURL(docSnap.data().archivoURL || null);
        setEditando(!!docSnap.data().archivoURL);
      }
    };
    fetchDenuncia();
  }, [id]);

  const handleCerrarSesion = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

 const handleVolver = () => {
    navigate("/investigador");
 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "denuncias", id);
      await updateDoc(docRef, {
        estado: "Con Informe Entregado",
        observaciones,
        archivoURL: archivo ? URL.createObjectURL(archivo) : archivoURL,
      });
      alert("Informe enviado correctamente");
      navigate("/investigador", { state: { refresh: true } });
    } catch (error) {
      console.error("Error al actualizar la denuncia:", error);
    }
  };

  return (
    <Container maxWidth="md">
       <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
        <IconButton onClick={handleVolver} color="primary" sx={{ backgroundColor: "#f0f0f0", borderRadius: "50px", p: 1.5 }}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handleCerrarSesion} color="secondary" sx={{ backgroundColor: "#f0f0f0", borderRadius: "50px", p: 1.5 }}>
          <ExitToAppIcon />
        </IconButton>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Denuncia ID: {id}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Observaciones"
              multiline
              rows={6}
              fullWidth
              required
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
            />
          </Box>

          {archivoURL && (
            <Box sx={{ my: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Archivo Subido:
              </Typography>
              <a href={archivoURL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
                Descargar Archivo
              </a>
            </Box>
          )}

          <Box sx={{ my: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              Subir un nuevo archivo:
            </Typography>
            <input type="file" onChange={(e) => setArchivo(e.target.files[0])} required={!editando} />
          </Box>

          <Button type="submit" variant="contained" color="primary" sx={{ width: "100%", py: 1.5, fontSize: "1rem" }}>
            {editando ? "Actualizar Informe" : "Enviar Informe"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default InvestigacionInterna;
