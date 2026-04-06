import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("getSession error:", error);
          setIsAuthenticated(false);
          setChecking(false);
          return;
        }

        setIsAuthenticated(!!session);
        setChecking(false);
      } catch (e) {
        console.error("checkSession unexpected error:", e);
        if (!mounted) return;
        setIsAuthenticated(false);
        setChecking(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthenticated(!!session);
      setChecking(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return <div>ログイン状態を確認中です...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // ここ追加
  }

  return children;
}