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
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig"; // Importa tu configuración de Firebase

const DenuncianteTable = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigate = useNavigate();

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

  const onNewDenuncia = () => {
    console.log("navigate ");
    navigate("/nueva_denuncia");
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
      <Typography variant="h4" gutterBottom>
        Mis Denuncias
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id de denuncia</TableCell>
            <TableCell>Denunciado</TableCell>
            <TableCell>Días restantes</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Pruebas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {denuncias.map((denuncia) => (
            <TableRow key={denuncia.id}>
              <TableCell>{denuncia.idConfidencial}</TableCell>
              <TableCell>{denuncia.denunciado}</TableCell>
              <TableCell>{denuncia.diasRestantes}</TableCell>
              <TableCell>{denuncia.estado}</TableCell>
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
      <Button
        variant="contained"
        color="primary"
        onClick={onNewDenuncia}
        sx={{ mt: 2 }}
      >
        Nueva Denuncia
      </Button>
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
/*
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
*/
const renderDocumentPreview = (prueba) => {
  const getFileType = (url) => {
    const decodedUrl = decodeURIComponent(url); // Decodificar caracteres especiales en la URL
    const fileName = decodedUrl.split("/").pop().split("?")[0]; // Extraer el nombre del archivo
    const extension = fileName.split(".").pop().toLowerCase(); // Obtener la extensión
    if (extension === "pdf") return "application/pdf";
    if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension))
      return "image/";
    if (["mp3", "wav", "ogg"].includes(extension)) return "audio/";
    if (["doc", "docx"].includes(extension)) return "application/msword";
    return "unsupported";
  };

  const tipo = getFileType(prueba);
  const url = prueba;

  console.log(`previsualizando ${prueba} con el tipo ${tipo}`);

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
  } else if (tipo === "application/msword") {
    // Usar el visor de Google Docs para Word
    const googleDocsViewer = `https://docs.google.com/gview?url=${encodeURIComponent(
      url
    )}&embedded=true`;
    return (
      <iframe
        src={googleDocsViewer}
        title="Word Document Preview"
        width="100%"
        height="500"
        style={{ border: "none" }}
      ></iframe>
    );
  } else {
    return <Typography variant="body2">Archivo no soportado</Typography>;
  }
};

export default DenuncianteTable;
