import { useAuth } from './useAuth';
import { useCart } from './useCart';
export const useClearCart = () => {
  const { logout: authLogout } = useAuth();
  const { clearCart } = useCart();
  const logout = () => {
    authLogout(); 
    clearCart(); 
  };
  return { logout };
};
