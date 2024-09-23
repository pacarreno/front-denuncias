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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Importa tu configuración de Firebase


const DenuncianteTable = ({ onNewDenuncia }) => {
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    const fetchDenuncias = async () => {
      const querySnapshot = await getDocs(collection(db, 'denuncias'));
      const denunciasList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDenuncias(denunciasList);    };

      fetchDenuncias();
  }, []);

  return (
    <>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {denuncias.map((denuncia) => (
            <TableRow key={denuncia.id}>
              <TableCell>{denuncia.idConfidencial}</TableCell>
              <TableCell>{denuncia.denunciado}</TableCell>
              <TableCell>{denuncia.diasRestantes}</TableCell>
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
