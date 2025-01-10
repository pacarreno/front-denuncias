import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Link,
  Box,
  Button,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig"; // Importa tu configuración de Firebase

const AdminTable = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

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
        console.log("Sesión cerrada con éxito");
        // Redirigir al usuario a la página de login o página de bienvenida
        navigate("/login"); // Asegúrate de usar el hook de navegación (useNavigate)
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  // Función para abrir el modal con el documento seleccionado
  const handlePreviewClick = (docUrl) => {
    setSelectedDoc(docUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoc(null);
  };

  const renderDocumentPreview = (prueba) => {
    const tipo = prueba.includes("pdf") ? "application/pdf" : "image/";
    const url = prueba;

    if (tipo === "application/pdf") {
      return (
        <iframe
          src={url}
          title="PDF Preview"
          width="100%"
          height="500"
          style={{ border: "none" }}
        ></iframe>
      );
    } else if (tipo.startsWith("image/")) {
      return <img src={url} alt="Prueba" style={{ width: "100%" }} />;
    } else if (tipo.startsWith("audio/")) {
      return <audio controls src={url} />;
    } else {
      return <Typography variant="body2">Archivo no soportado</Typography>;
    }
  };

  // Función para forzar la descarga del archivo
  const downloadInNewTab = (url) => {
    const newWindow = window.open(url, "_blank"); // Abrir en nueva pestaña
    if (newWindow) {
      newWindow.focus(); // Asegura que la pestaña se traiga al frente
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
      <Box>
        <Typography variant="h4" gutterBottom>
          Denuncias Activas
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id Confidencial</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Etapa</TableCell>
                <TableCell>Días Restantes</TableCell>
                <TableCell>Pruebas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {denuncias.map((denuncia) => (
                <TableRow key={denuncia.id}>
                  <TableCell>{denuncia.idConfidencial}</TableCell>
                  <TableCell>{denuncia.estado}</TableCell>
                  <TableCell>{denuncia.etapa}</TableCell>
                  <TableCell>{denuncia.diasRestantes}</TableCell>
                  <TableCell>
                    {denuncia.pruebas.map((prueba, index) => (
                      <Box key={index} mb={2}>
                        <Link
                          onClick={() => handlePreviewClick(prueba)}
                          target="_blank"
                          rel="noopener"
                          sx={{ mr: 2 }}
                        >
                          Previsualizar
                        </Link>
                        <Link onClick={() => downloadInNewTab(prueba)}>
                          Descargar
                        </Link>
                      </Box>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      {/* Modal para la previsualización de documentos */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Previsualización de Documento
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedDoc && renderDocumentPreview(selectedDoc)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminTable;
