import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Box,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SearchIcon from '@mui/icons-material/Search';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';

const AdminTable = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [detalleResultado, setDetalleResultado] = useState({ resultado: '', sancion: '' });
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchDenuncias = async () => {
      const querySnapshot = await getDocs(collection(db, 'denuncias'));
      const denunciasList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        diasRestantes: calcularDiasRestantes(doc.data().fechaIngreso, doc.data().etapa)
      }));
      setDenuncias(denunciasList);
    };
    fetchDenuncias();
  }, []);
  const calcularDiasRestantes = (fechaIngreso, etapaActual) => {
    if (!fechaIngreso || !etapaActual) return 'N/A';
    const MILISEGUNDOS_DIA = 1000 * 60 * 60 * 24;
    const fechaIngresoObj = new Date(fechaIngreso);
    const hoy = new Date();
    
    const diasPorEtapa = {
      'Derivación Caso': 3,
      'Derivación Caso Investigador': 10,
      'Sanción o Medida Final': 10,
    };
    const diasLimite = diasPorEtapa[etapaActual] || 0;
    const diffMilisegundos = hoy - fechaIngresoObj;
    const diasTranscurridos = Math.floor(diffMilisegundos / MILISEGUNDOS_DIA);
    const diasRestantes = diasLimite - diasTranscurridos;
    return diasRestantes > 0 ? diasRestantes : 'Terminada';
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate('/login'))
      .catch((error) => console.error('Error al cerrar sesión:', error));
  };

  const handleUpdateState = async (id, nuevoEstado, nuevaEtapa) => {
  try {
    const docRef = doc(db, 'denuncias', id);
    
    // Actualizar Firestore
    await updateDoc(docRef, { estado: nuevoEstado, etapa: nuevaEtapa });

    // Recargar denuncias para recalcular días restantes
    fetchDenuncias();

  } catch (error) {
    console.error('Error al actualizar estado:', error);
  }
  };


  const handleVerRegistro = async (id) => {
    const docRef = doc(db, 'denuncias', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDetalleResultado({
        resultado: docSnap.data().resultado,
        sancion: docSnap.data().sancion,
      });
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDetalleResultado({ resultado: '', sancion: '' });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
        <IconButton
          onClick={handleLogout}
          sx={{
            backgroundColor: '#d32f2f',
            color: '#fff',
            borderRadius: '50%',
            p: 1.5,
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
            '&:hover': { backgroundColor: '#b71c1c' },
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Box>

      <Box>
        <Typography variant='h4' gutterBottom>
          Denuncias Activas
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>ID Confidencial</TableCell>
                <TableCell align='center'>Fecha de Ingreso</TableCell>
                <TableCell align='center'>Estado</TableCell>
                <TableCell align='center'>Etapa</TableCell>
                <TableCell align='center'>Dias Restantes Etapa</TableCell>
                <TableCell align='center'>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {denuncias.map((denuncia) => (
                <TableRow key={denuncia.id}>
                  <TableCell align='center'>{denuncia.idConfidencial}</TableCell>
                  <TableCell align='center'>{denuncia.fechaIngreso}</TableCell>
                  <TableCell align='center'>{denuncia.estado}</TableCell>
                  <TableCell align='center'>{denuncia.etapa}</TableCell>
                  <TableCell align='center'>{denuncia.diasRestantes}</TableCell>
                  <TableCell align='center'>
                    {denuncia.estado === 'Por Derivar RRHH' && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title='Derivar a Inspección'>
                          <IconButton color='primary' onClick={() => handleUpdateState(denuncia.id, 'Sin Certificado Entregado', 'Derivación Caso Investigador')}>
                            <FactCheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Derivar a Investigación'>
                          <IconButton color='warning' onClick={() => handleUpdateState(denuncia.id, 'Sin Informe Entregado', 'Derivación Caso Investigador')}>
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                    {denuncia.estado === 'Con Informe Entregado' && (
                      <Tooltip title='Registrar Resultado'>
                        <IconButton color='success' onClick={() => navigate(`/registrarresultado/${denuncia.id}`)}>
                          <HowToRegIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {denuncia.estado === 'Resultado Ingresado' && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title='Ver Registro'>
                          <IconButton color='info' onClick={() => handleVerRegistro(denuncia.id)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Editar Registro'>
                          <IconButton color='secondary' onClick={() => navigate(`/registrarresultado/${denuncia.id}`)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    <Dialog open={openModal} onClose={handleCloseModal}>
    <DialogTitle>Detalle del Resultado</DialogTitle>
    <DialogContent>
      <DialogContentText>
        <strong>Resultado:</strong> {detalleResultado.resultado || "Sin resultado registrado"}
        <br />
        <strong>Sanción o Medida:</strong> {detalleResultado.sancion || "Sin sanción registrada"}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseModal}>Cerrar</Button>
    </DialogActions>
  </Dialog>
    </>
  );
};

export default AdminTable;
