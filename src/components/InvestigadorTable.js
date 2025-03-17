import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentIcon from "@mui/icons-material/Assignment";

const InvestigadorTable = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [detalleInforme, setDetalleInforme] = useState(null);
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

  const handleVerInforme = async (id) => {
    try {
      const docRef = doc(db, "denuncias", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDetalleInforme(docSnap.data());
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error al obtener el informe:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDetalleInforme(null);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 2 }}>
        <IconButton onClick={handleLogout} color="secondary">
          <ExitToAppIcon />
        </IconButton>
      </Box>
      <Typography variant="h4" gutterBottom>
        Lista de Denuncias Asignadas al Investigador
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID Confidencial</TableCell>
              <TableCell align="center">Fecha de Ingreso</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Etapa</TableCell>
              <TableCell align="center">Pruebas</TableCell>
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
                  {denuncia.pruebas?.map((prueba, index) => (
                    <Tooltip key={index} title="Ver Prueba">
                      <IconButton component="a" href={prueba} target="_blank" rel="noopener noreferrer">
                        <AssignmentIcon />
                      </IconButton>
                    </Tooltip>
                  ))}
                </TableCell>
                <TableCell align="center">
                  {denuncia.estado === "Sin Informe Entregado" ? (
                    <Tooltip title="Ingresar Informe">
                      <IconButton onClick={() => navigate(`/investigacion/${denuncia.id}`)}>
                        <AssignmentTurnedInIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Ver Informe">
                        <IconButton onClick={() => handleVerInforme(denuncia.id)}>
                          <VisibilityIcon color="info" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar Informe">
                        <IconButton onClick={() => navigate(`/investigacion/${denuncia.id}`)}>
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles del Informe</DialogTitle>
        <DialogContent>
          {detalleInforme && (
            <Box>
              <Typography variant="h6">Observaciones:</Typography>
              <Typography>{detalleInforme.observaciones || "No disponible"}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Archivo Adjunto:</Typography>
              {detalleInforme.archivoURL ? (
                <a href={detalleInforme.archivoURL} target="_blank" rel="noopener noreferrer">
                  Ver Archivo
                </a>
              ) : (
                <Typography>No disponible</Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InvestigadorTable;
