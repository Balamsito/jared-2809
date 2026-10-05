import { LoginForm } from "../components/auth/LoginForm";

export function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-wrap">
            <img
              src="/assets/emblem.png"
              alt="TurboSnail Derby"
              className="auth-logo-img"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
              }}
            />
          </div>
          <span className="auth-brand">TurboSnail Derby</span>
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">La pista más veloz del mundo te espera</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
