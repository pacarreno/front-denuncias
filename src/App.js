
import React, { useState } from 'react';
import { Denuncia, EstadosDenuncia } from './denunciaEstados';
import Bitacora from './components/Bitacora';

const App = () => {
  const [denuncia, setDenuncia] = useState(new Denuncia({ id: 'DEN-12345' }));

  const realizarAccion = (accion) => {
    try {
      denuncia.transicionar(accion);
      setDenuncia({ ...denuncia });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Gestión de Denuncias</h1>
      <p>ID Denuncia: {denuncia.id}</p>
      <p>Estado Actual: {denuncia.estado}</p>

      <div>
        <button onClick={() => realizarAccion('revisar')}>Revisar</button>
        <button onClick={() => realizarAccion('derivar_a_inspeccion')}>
          Derivar a Inspección
        </button>
        <button onClick={() => realizarAccion('investigacion_interna')}>
          Investigación Interna
        </button>
      </div>

      <Bitacora historial={denuncia.historial} />
    </div>
  );
};

export default App;
    