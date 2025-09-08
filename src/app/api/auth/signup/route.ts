import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    // Extrae los datos del cuerpo de la petición.
    const { fullname, loginUser, loginPassword } = await request.json();

    // Puedes mantener una validación básica aquí para una respuesta más rápida.
    if (loginPassword.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // URL de tu API externa de registro. ¡Asegúrate de cambiarla!
    const apiUrl = "http://uatretest.intersistemas.net:8800/api/Usuario/registrarViaEmail";

    // Utiliza Axios para enviar la petición POST a tu API.
    const response = await axios.post(apiUrl, {
      fullname,
      loginUser,
      loginPassword,
    });

    // Tu API devuelve un 200 OK para un registro exitoso que requiere verificación.
    if (response.status === 200) {
      return NextResponse.json(
        {
          message: "Registro exitoso. Por favor, revisa tu correo para la verificación.",
          user: response.data // Opcionalmente, incluye los datos del usuario de la API
        },
        { status: 200 }
      );
    }

    // Maneja cualquier otra respuesta exitosa.
    return NextResponse.json(
      { message: "Registro exitoso, pero se recibió un estado desconocido." },
      { status: 200 }
    );

  } catch (error) {
    // Manejo robusto de errores de Axios.
    if (axios.isAxiosError(error)) {
      // Tu API devuelve un 401 para errores de validación como "el correo ya existe".
      if (error.response?.status === 401) {
        // Asume que la respuesta de tu API tiene una propiedad 'message'.
        const apiErrorMessage = (error.response.data as { message: string })?.message || "El correo ya existe o credenciales inválidas.";
        
        return NextResponse.json(
          {
            message: apiErrorMessage,
          },
          { status: 401 }
        );
      }
      
      // Maneja otros errores de la API (por ejemplo, 400 Bad Request).
      const defaultMessage = "Error en el registro debido a un problema en el servidor.";
      const apiErrorMessage = (error.response?.data as { message: string })?.message || defaultMessage;
      
      return NextResponse.json(
        { message: apiErrorMessage },
        { status: error.response?.status || 500 }
      );
    } 
    
    // Maneja errores inesperados (problemas de red, etc.).
    if (error instanceof Error) {
        return NextResponse.json(
          { message: `Ocurrió un error inesperado: ${error.message}` },
          { status: 500 }
        );
    }

    // Maneja errores de tipo desconocido.
    return NextResponse.json(
      { message: "Ocurrió un error desconocido." },
      { status: 500 }
    );
  }
}