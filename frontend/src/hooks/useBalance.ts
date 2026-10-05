import { useAuth } from "../context/AuthContext";

export function useBalance() {
  const { session, addBalance } = useAuth();

  const balanceCents = session?.balance ?? 0;
  const balanceDollars = balanceCents / 100;
  const balanceFormatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(balanceDollars);

  return { balanceCents, balanceDollars, balanceFormatted, addBalance };
}
