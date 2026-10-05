import { RegisterForm } from "../components/auth/RegisterForm";

export function RegisterPage() {
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
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Únete a la élite de apostadores de caracoles</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
