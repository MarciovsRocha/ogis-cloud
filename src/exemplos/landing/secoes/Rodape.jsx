import { Link } from "react-router-dom";

export default function Rodape() {
  return (
    <footer className="bg-base-content text-base-100">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-6 text-sm sm:flex-row sm:items-center">
        <p>Exemplar de landing page feito pela ogis.cloud · Curitiba/PR</p>
        <Link to="/" className="font-bold underline-offset-4 hover:underline">
          Voltar ao site da ogis.cloud
        </Link>
      </div>
    </footer>
  );
}
