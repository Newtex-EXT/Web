import Link from "next/link";
import Image from "next/image";

export default function Contacto() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-r from-[#000428] to-[#004e92] text-white">
      {/* Navbar */}
      <header className="w-full mx-auto flex  items-center justify-between px-5 py-5 object-contain">
      <Link href="/">
        <Image 
        src="/logo.svg" 
        alt="NEXA - Nueva era de automatización"
        width={200}
        height={70}
        priority>
        </Image>
        </Link>
        
        <nav className="flex gap-6 px-6 py-10 text-sm">
          <div className="rounded-xs p-2 flex items-center justify-center border yellow-500 ">
            <Link href="/servicios" className=" text-lg  hover:text-yellow-500">Servicios</Link>
          </div>
          <div className="rounded-xs p-2 flex items-center justify-center border yellow-500">
            <Link href="/Contacto" className="text-lg hover:text-yellow-500">Contacto</Link>
          </div>
          
        </nav>
      </header>

      {/* Contenido */}
      <section className="flex-1">
        <form
          action=""
          method="get"
          className="mx-auto mt-10 max-w-3xl space-y-6 rounded-xl bg-black/30 p-8 shadow-lg backdrop-blur"
        >
          <h2 className="text-2xl font-bold text-center">Contáctanos</h2>

          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label htmlFor="txtNombre" className="text-sm font-medium text-gray-200">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="txtNombre"
              id="txtNombre"
              placeholder="Escriba aquí su nombre"
              required
              className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300"
            />
          </div>

          {/* Correo */}
          <div className="flex flex-col gap-2">
            <label htmlFor="txtDireccion" className="text-sm font-medium text-gray-200">
              Correo electrónico <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="txtDireccion"
              id="txtDireccion"
              placeholder="correo@ejemplo.com"
              required
              className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300"
            />
          </div>

          {/* Motivo */}
          <div className="flex flex-col gap-2">
            <label htmlFor="sugerencias" className="text-sm font-medium text-gray-200">
              Motivo de contacto
            </label>
            <textarea
              name="sugerencias"
              id="sugerencias"
              rows="5"
              placeholder="Escriba aquí"
              className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300"
            ></textarea>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-900 transition hover:bg-yellow-400"
          >
            Enviar
          </button>
        </form>
      </section>

      {/* Footer (global abajo sin tapar nada) */}
      <footer className="w-full border-t">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-sm">
    {/* Izquierda */}
        <div>
      © {new Date().getFullYear()} NEXA S.L — Todos los derechos reservados
        </div>

    {/* Derecha */}
        <div className="flex gap-6">
          <span>Teléfono corporativo — +34 XXX XX XX XX</span>
          <span>Dirección: C/ Canutillo Nº420</span>
        </div>

      </div>
      </footer>

    </main>
  );
}
