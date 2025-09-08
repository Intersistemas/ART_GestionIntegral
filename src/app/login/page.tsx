"use client";
import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function Signin() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      loginUser: formData.get("loginUser"),
      loginPassword: formData.get("loginPassword"),
      redirect: false,
    });

    if (res?.error) setError(res.error as string);

    if (res?.ok) return router.push("/");
  };

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-950 px-8 py-10 w-3/12"
      >
        {error && <div className="bg-red-500 text-white p-2 mb-2">{error}</div>}
        <h1 className="text-4xl font-bold mb-7 text-white">Ingreso</h1>

        <label className="text-slate-300">Usuario:</label>
        <input
          type="text"
          placeholder="CUIT/CUIL/EMAIL"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
          name="loginUser"
        />

        <label className="text-slate-300">Clave:</label>
        <input
          type="password"
          placeholder="Clave"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
          name="loginPassword"
        />

        <button className="bg-blue-500 text-white px-4 py-2 block w-full mt-4">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Signin;
