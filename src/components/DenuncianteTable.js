import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import denuncianteData from "../mock/denuncianteData.json";

const DenuncianteTable = ({ onNewDenuncia }) => {
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    setDenuncias(denuncianteData);
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Mis Denuncias
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {denuncias.map((denuncia) => (
            <TableRow key={denuncia.id}>
              <TableCell>{denuncia.titulo}</TableCell>
              <TableCell>{denuncia.fecha}</TableCell>
              <TableCell>{denuncia.estado}</TableCell>
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
    </>
  );
};

export default DenuncianteTable;
