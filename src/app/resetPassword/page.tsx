// app/resetPassword/page.tsx

import ResetPassword from "./ResetPassword";
import { Metadata } from "next";

// Las Page Props solo reciben `params` y `searchParams`
interface ResetPasswordPageProps {
    searchParams: { 
        token?: string; 
        email?: string; 
        errorMsg?: string; // Opcional, si quieres manejar un error de carga de servidor
    };
}

// Puedes definir metadatos específicos para esta página
export const metadata: Metadata = {
    title: 'Restablecer Contraseña',
    description: 'Establece una nueva contraseña para tu cuenta.',
};

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => {
    
    // Aquí podrías leer el errorMsg si viniera de una redirección o del servidor
    const initialErrorMsg = searchParams.errorMsg || null;

    // Nota: La lógica de leer el token y email se mantiene en el cliente
    // ya que usa `useSearchParams` (aunque podrías leerlos aquí si quieres)

    return (
        // Se renderiza el componente cliente. No pasamos 'onSuccess' ya que la lógica
        // interna del cliente redirige al login con el router.
        <ResetPassword
            errorMsg={initialErrorMsg}
            // No se pasa 'onSuccess' ya que no se usa un hook de router de la página padre
        />
    );
};

export default ResetPasswordPage;