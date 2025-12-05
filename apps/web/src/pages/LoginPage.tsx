import { useState } from "react";
import { Link } from "react-router-dom";

const MOCK_API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState("finance@solidcam.org");
  const [password, setPassword] = useState("BudgetCare!23");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const isValid = emailRegex.test(email) && password.length >= 8;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || status === "loading") {
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch(`${MOCK_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Identifiants invalides");
      }

      setStatus("success");
      // AuthContext will handle storing the session and redirecting to /app
      // during the upcoming tasks.
    } catch (err) {
      setStatus("idle");
      setError((err as Error).message ?? "Une erreur est survenue.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-mist to-white px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-mist bg-white p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-teal">
          BudgetCare
        </p>
        <h1 className="mt-2 font-display text-3xl text-ocean">
          Connexion administrateur
        </h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Utilisez vos identifiants pour accéder au tableau de bord ONG.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-charcoal/70">
            Email professionnel
            <input
              type="email"
              className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-charcoal/70">
            Mot de passe
            <input
              type="password"
              className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
            <span className="text-xs text-charcoal/50">
              Minimum 8 caractères avec majuscule et caractère spécial.
            </span>
          </label>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || status === "loading"}
            className={`w-full rounded-full px-4 py-3 font-semibold text-white transition ${
              isValid && status !== "loading"
                ? "bg-teal shadow-card hover:translate-y-0.5"
                : "cursor-not-allowed bg-mist text-charcoal/40"
            }`}
          >
            {status === "loading" ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-sm text-charcoal/60">
          <p>Pas encore de compte ?</p>
          <Link
            to="/onboarding"
            className="font-semibold text-teal underline-offset-2 hover:underline"
          >
            Démarrer l onboarding
          </Link>
        </div>
      </div>
    </div>
  );
}