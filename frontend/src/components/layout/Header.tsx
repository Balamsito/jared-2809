import { useAuth } from "../../context/AuthContext";
import { useBalance } from "../../hooks/useBalance";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onRecharge: () => void;
}

export function Header({ onRecharge }: HeaderProps) {
  const { session, logout } = useAuth();
  const { balanceFormatted } = useBalance();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-brand">
        <img
          src="/assets/emblem.png"
          alt="TurboSnail Derby emblem"
          className="header-emblem"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div>
          <div className="header-title">TurboSnail Derby</div>
          <div className="header-subtitle">Provably Fair · Live Racing</div>
        </div>
      </div>

      <div className="header-right">
        {/* Live badge */}
        <div className="badge-live">
          <span className="badge-live-dot" />
          Live
        </div>

        {/* Balance */}
        <div className="header-balance">
          <span className="balance-label">Saldo</span>
          <span className="balance-amount" id="header-balance">{balanceFormatted}</span>
        </div>

        {/* User */}
        <div className="header-user">
          <div className="user-avatar">
            <img
              src="/assets/avatar.png"
              alt="avatar"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent) parent.textContent = session?.displayName.charAt(0).toUpperCase() ?? "U";
              }}
            />
          </div>
          <span className="user-name">{session?.displayName}</span>
        </div>

        <button
          id="btn-recharge"
          className="btn btn-primary btn-sm"
          onClick={onRecharge}
          aria-label="Recargar saldo con SnailPay"
        >
          + Depositar
        </button>
        <button
          id="btn-logout"
          className="btn btn-ghost btn-sm"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        >
          Salir
        </button>
      </div>
    </header>
  );
}
