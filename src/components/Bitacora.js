
import React from 'react';

const Bitacora = ({ historial }) => (
  <div>
    <h3>Bitácora de Cambios</h3>
    <ul>
      {historial.map((entry, index) => (
        <li key={index}>
          {entry.fecha.toLocaleString()} - {entry.accion} (Estado: {entry.estado})
        </li>
      ))}
    </ul>
  </div>
);

export default Bitacora;
    