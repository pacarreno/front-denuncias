import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import adminData from "../mock/adminData.json";

const AdminTable = () => {
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    setDenuncias(adminData);
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Denuncias Activas
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Etapa</TableCell>
            <TableCell>Días Restantes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {denuncias.map((denuncia) => (
            <TableRow key={denuncia.id}>
              <TableCell>{denuncia.titulo}</TableCell>
              <TableCell>{denuncia.estado}</TableCell>
              <TableCell>{denuncia.etapa}</TableCell>
              <TableCell>{denuncia.diasRestantes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AdminTable;
