import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

/**
 * Función para generar un número único aleatorio.
 * @returns {number} Un número de 6 dígitos.
 */
const generarNumeroUnico = () => {
  return Math.floor(100000 + Math.random() * 900000); // Número de 6 dígitos
};

/**
 * Función para verificar y guardar un número único en la colección "denuncias".
 * @param {number} maxIntentos Número máximo de intentos para evitar colisiones.
 * @returns {Promise<number>} El número de denuncia único que se guardó.
 */
export const generarNumeroConfidencial = async (
  maxIntentos = 5
) => {
  const denunciasRef = collection(db, "denuncias");

  for (let intento = 1; intento <= maxIntentos; intento++) {
    // Generar un nuevo número
    const numeroGenerado = generarNumeroUnico();

    // Crear una consulta para verificar si el número ya existe
    const q = query(
      denunciasRef,
      where("idConfidencial", "==", numeroGenerado)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Si el número no existe, retorna
      console.log(`Número único generado correctamente: ${numeroGenerado}`);
      return numeroGenerado; // Salir con el número generado
    } else {
      console.warn(
        `Intento ${intento}: El número ${numeroGenerado} ya existe. Reintentando...`
      );
    }
  }

  // Si se alcanzan todos los intentos sin éxito
  throw new Error(
    "No se pudo generar un número único después de varios intentos."
  );
};
