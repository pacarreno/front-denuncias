import React, { useState } from "react";

const InspeccionTrabajo = ({ next }) => {
  const [certificado, setCertificado] = useState(null);
  const [subido, setSubido] = useState(false); // **Cambio: Estado para confirmar subida**

  const handleUpload = () => {
    // **Cambio: Simulación de subida**
    if (certificado) {
      alert("Certificado subido correctamente.");
      setSubido(true);
      next(); // Avanzar al siguiente estado del flujo
    } else {
      alert("Seleccione un certificado antes de continuar.");
    }
  };

  return (
    <div>
      <h3>Inspección del Trabajo</h3>
      <input
        type="file"
        onChange={(e) => setCertificado(e.target.files[0])}
        accept=".pdf,.jpg,.png"
      />
      <br />
      <input
        type="checkbox"
        checked={subido}
        onChange={(e) => setSubido(e.target.checked)}
        disabled={!certificado}
      />{" "}
      Confirmar que se subió a la Inspección
      <br />
      <button onClick={handleUpload}>Subir Certificado</button>
    </div>
  );
};

export default InspeccionTrabajo;
