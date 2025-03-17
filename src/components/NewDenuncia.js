import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { generarNumeroConfidencial } from "../utils/generator.js";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const NewDenuncia = () => {
  const location = useLocation();
  const denunciaExistente = location.state?.denuncia || null;

  const [denunciante, setDenunciante] = useState(denunciaExistente?.denunciante || "");
  const [denunciado, setDenunciado] = useState(denunciaExistente?.denunciado || "");
  const [relato, setRelato] = useState(denunciaExistente?.relato || "");
  const [pruebas, setPruebas] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fechaIngreso, setFechaIngreso] = useState(
    denunciaExistente?.fechaIngreso || new Date().toISOString().split('T')[0]
  );
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (denunciaExistente) {
      const fetchDenuncia = async () => {
        const docRef = doc(db, "denuncias", denunciaExistente.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFechaIngreso(docSnap.data().fechaIngreso);
        }
      };
      fetchDenuncia();
    }
  }, [denunciaExistente]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setPruebas(selectedFiles);
  };

  const subirArchivo = (file, idConfidencial) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `pruebas/${idConfidencial}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const idConfidencial = denunciaExistente?.idConfidencial || (await generarNumeroConfidencial());
    const pruebasURLs = await Promise.all(pruebas.map((file) => subirArchivo(file, idConfidencial)));

    const nuevaDenuncia = {
      denunciante,
      denunciado,
      relato,
      pruebas: pruebasURLs,
      idConfidencial,
      estado: "Por Derivar RRHH",
      etapa: "Derivación Caso",
      fechaIngreso,
    };

    try {
      if (denunciaExistente) {
        const docRef = doc(db, "denuncias", denunciaExistente.id);
        await updateDoc(docRef, nuevaDenuncia);
      } else {
        await addDoc(collection(db, "denuncias"), nuevaDenuncia);
      }
      alert(`Denuncia guardada correctamente. ID: ${idConfidencial}`);
      navigate("/denunciante");
    } catch (error) {
      console.error("Error al guardar denuncia: ", error);
    }

    setUploading(false);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  const handleVolver = () => {
    navigate("/denunciante");
  };

  return (
    <Container component="main" maxWidth="md">
      {/* Botones circulares en la esquina superior derecha */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
        <IconButton onClick={handleVolver} color="primary" sx={{ backgroundColor: "#f0f0f0", borderRadius: "50px", p: 1.5 }}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handleLogout} color="secondary" sx={{ backgroundColor: "#f0f0f0", borderRadius: "50px", p: 1.5 }}>
          <ExitToAppIcon />
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {denunciaExistente ? "Editar Denuncia" : "Ingresar Denuncia"}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>ID: {denunciaExistente?.idConfidencial || "Nuevo"}</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Fecha de Ingreso"
                type="text"
                fullWidth
                required
                value={fechaIngreso}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre del Denunciante"
                variant="outlined"
                fullWidth
                value={denunciante}
                onChange={(e) => setDenunciante(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre del Denunciado"
                variant="outlined"
                fullWidth
                value={denunciado}
                onChange={(e) => setDenunciado(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Relato de los Hechos"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={relato}
                onChange={(e) => setRelato(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Subir Pruebas
                <input type="file" multiple hidden onChange={handleFileChange} />
              </Button>
              {pruebas.length > 0 && (
                <Box mt={2}>
                  {pruebas.map((file, index) => (
                    <Typography key={index} variant="body2">
                      {file.name}
                    </Typography>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={24} /> : "Guardar Denuncia"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default NewDenuncia;
