import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Importa tu configuración de Firebase

const AdminTable = () => {
  const [denuncias, setDenuncias] = useState([]);

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

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Denuncias Activas
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id Confidencial</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Etapa</TableCell>
            <TableCell>Días Restantes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {denuncias.map((denuncia) => (
            <TableRow key={denuncia.id}>
              <TableCell>{denuncia.idConfidencial}</TableCell>
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
