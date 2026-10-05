import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../services/auth.service";

export function RegisterForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!displayName.trim()) return "El nombre es requerido.";
    if (!email.trim()) return "El email es requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email inválido.";
    if (password.length < 8) return "La contraseña debe tener mínimo 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "La contraseña debe incluir al menos una letra mayúscula.";
    if (!/[a-z]/.test(password)) return "La contraseña debe incluir al menos una letra minúscula.";
    if (!/\d/.test(password)) return "La contraseña debe contener al menos un número.";
    if (password !== confirm) return "Las contraseñas no coinciden.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    const result = await register(email, displayName, password);

    if (!result.success) {
      setIsLoading(false);
      setError(result.error);
      return;
    }

    // Auto-login after register
    const loginResult = await login(email, password);
    setIsLoading(false);

    if (loginResult.success) {
      refreshSession();
      navigate("/dashboard");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="register-name" className="form-label">Nombre</label>
        <input
          id="register-name"
          type="text"
          className="form-input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Tu nombre"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="register-email" className="form-label">Email</label>
        <input
          id="register-email"
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
        <label htmlFor="register-password" className="form-label">Contraseña</label>
        <input
          id="register-password"
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres (A-Z, a-z, 0-9)"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
          Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.
        </span>
      </div>
      <div className="form-group">
        <label htmlFor="register-confirm" className="form-label">Confirmar Contraseña</label>
        <input
          id="register-confirm"
          type="password"
          className="form-input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          disabled={isLoading}
        />
      </div>
      {error && (
        <div className="alert alert-error" role="alert" id="register-error">
          {error}
        </div>
      )}
      <button
        id="btn-register-submit"
        type="submit"
        className="btn btn-primary btn-full"
        disabled={isLoading}
      >
        {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
      </button>
      <p className="auth-footer">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" id="link-to-login">Inicia sesión</Link>
      </p>
    </form>
  );
}
