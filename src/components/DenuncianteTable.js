import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  IconButton,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const DenuncianteTable = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [selectedDenuncia, setSelectedDenuncia] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchDenuncias = async () => {
      const querySnapshot = await getDocs(collection(db, "denuncias"));
      const denunciasList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDenuncias(denunciasList);
    };

    fetchDenuncias();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  const handleNewDenuncia = () => {
    navigate("/nueva_denuncia");
  };

  const handleViewDetails = (denuncia) => {
    setSelectedDenuncia(denuncia);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDenuncia(null);
  };

  const handleEditDenuncia = (denuncia) => {
    navigate("/nueva_denuncia", { state: { denuncia, editMode: true } });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
        <IconButton
          onClick={handleNewDenuncia}
          color="primary"
          sx={{ backgroundColor: "#f0f0f0", borderRadius: "50px", p: 1.5 }}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handleLogout}
          color="secondary"
          sx={{ backgroundColor: "#f0f0f0", borderRadius: "50px", p: 1.5 }}
        >
          <ExitToAppIcon fontSize="large" />
        </IconButton>
      </Box>

      <Typography variant="h4" gutterBottom>
        Lista de Denuncias del Denunciante
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID Confidencial</TableCell>
              <TableCell align="center">Fecha de Ingreso</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Etapa</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {denuncias.map((denuncia) => (
              <TableRow key={denuncia.id}>
                <TableCell align="center">{denuncia.idConfidencial}</TableCell>
                <TableCell align="center">{denuncia.fechaIngreso || "No disponible"}</TableCell>
                <TableCell align="center">{denuncia.estado}</TableCell>
                <TableCell align="center">{denuncia.etapa}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetails(denuncia)}
                    sx={{ marginRight: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditDenuncia(denuncia)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal para ver detalles de la denuncia */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
            {selectedDenuncia && (
              <>
                <Typography variant="h6" gutterBottom>
                  Detalles de la Denuncia
                </Typography>
                <Typography><strong>Fecha de Ingreso:</strong> {selectedDenuncia.fechaIngreso || "No disponible"}</Typography>
                <Typography><strong>Nombre del Denunciante:</strong> {selectedDenuncia.nombreDenunciante || "Anónimo"}</Typography>
                <Typography><strong>Denunciado:</strong> {selectedDenuncia.denunciado || "No especificado"}</Typography>
                <Typography><strong>Relato de los Hechos:</strong> {selectedDenuncia.relato || "No disponible"}</Typography>
                <Typography><strong>Pruebas:</strong></Typography>
                {selectedDenuncia.pruebas?.map((prueba, index) => (
                  <Box key={index} mb={1}>
                    <a href={prueba} target="_blank" rel="noopener noreferrer">
                      Ver Prueba {index + 1}
                    </a>
                  </Box>
                ))}
                <Box mt={2} textAlign="right">
                  <IconButton color="primary" onClick={handleCloseModal}>
                    Cerrar
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default DenuncianteTable;
