import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseConfig"; // Importa tanto Firestore como Storage
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const NewDenuncia = () => {
  const [denunciante, setDenunciante] = useState("");
  const [denunciado, setDenunciado] = useState("");
  const [relacion, setRelacion] = useState("");
  const [relato, setRelato] = useState("");
  const [pruebas, setPruebas] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Lista de posibles relaciones laborales
  const relacionesLaborales = [
    "Supervisor",
    "Compañero de trabajo",
    "Jefe directo",
    "Jefe indirecto",
    "Cliente",
    "Proveedor",
    "Otro",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const idConfidencial = uuidv4();

    const pruebasURLs = await Promise.all(
      pruebas.map((file) => subirArchivo(file))
    );

    const nuevaDenuncia = {
      denunciante,
      denunciado,
      relacion,
      relato,
      pruebas: pruebasURLs,
      idConfidencial,
      estado: "En revisión",
      diasRestantes: 30,
    };

    try {
      await addDoc(collection(db, "denuncias"), nuevaDenuncia);
      alert(
        `Denuncia ingresada correctamente. Su ID confidencial es: ${idConfidencial}`
      );
      navigate("/denunciante");
    } catch (error) {
      console.error("Error al guardar denuncia: ", error);
    }

    setUploading(false);
  };

  const handleFileChange = (e) => {
    setPruebas([...e.target.files]);
  };

  const subirArchivo = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `pruebas/${file.name}-${uuidv4()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Error al subir archivo:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Ingresar Denuncia
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
              <FormControl fullWidth required>
                <InputLabel>Relación con el Denunciado</InputLabel>
                <Select
                  value={relacion}
                  onChange={(e) => setRelacion(e.target.value)}
                  label="Relación con el Denunciado"
                >
                  {relacionesLaborales.map((relacionLaboral, index) => (
                    <MenuItem key={index} value={relacionLaboral}>
                      {relacionLaboral}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <Typography variant="body1" gutterBottom>
                Subir Pruebas (PDF, Fotos, Audios):
              </Typography>
              <Button variant="contained" component="label">
                Seleccionar archivos
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.mp3,.wav"
                  multiple
                  hidden
                />
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
                {uploading ? <CircularProgress size={24} /> : "Crear Denuncia"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default NewDenuncia;
