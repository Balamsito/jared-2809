import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) return "El email es requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email inválido.";
    if (!password) return "La contraseña es requerida.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      refreshSession();
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="login-email" className="form-label">Email</label>
        <input
          id="login-email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="login-password" className="form-label">Contraseña</label>
        <input
          id="login-password"
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isLoading}
        />
      </div>
      {error && (
        <div className="alert alert-error" role="alert" id="login-error">
          {error}
        </div>
      )}
      <button
        id="btn-login-submit"
        type="submit"
        className="btn btn-primary btn-full"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
      <p className="auth-footer">
        ¿No tienes cuenta?{" "}
        <Link to="/register" id="link-to-register">Regístrate aquí</Link>
      </p>
    </form>
  );
}
