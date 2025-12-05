import { type ChangeEvent, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState("finance@solidcam.org");
  const [password, setPassword] = useState("BudgetCare!23");
  const {
    login,
    status: authStatus,
    error,
    clearError,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: string } | null)?.from ?? "/app";

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const isValid = emailRegex.test(email) && password.length >= 8;
  const isSubmitting = authStatus === "loading";

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    if (error) {
      clearError();
    }
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    if (error) {
      clearError();
    }
    setPassword(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || isSubmitting) {
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
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
              onChange={handleEmailChange}
              placeholder="finance@solidcam.org"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-charcoal/70">
            Mot de passe
            <input
              type="password"
              className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
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
            disabled={!isValid || isSubmitting}
            className={`w-full rounded-full px-4 py-3 font-semibold text-white transition ${
              isValid && !isSubmitting
                ? "bg-teal shadow-card hover:translate-y-0.5"
                : "cursor-not-allowed bg-mist text-charcoal/40"
            }`}
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-sm text-charcoal/60">
          <p>Pas encore de compte ?</p>
          <Link
            to="/onboarding"
            className="font-semibold text-teal underline-offset-2 hover:underline"
          >
            Démarrer l'onboarding
          </Link>
        </div>
      </div>
    </div>
  );
}
