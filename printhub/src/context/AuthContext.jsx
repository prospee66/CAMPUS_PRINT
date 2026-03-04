import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const ADMIN_EMAIL = 'admin@printhub.com';
const ADMIN_PASSWORD = 'admin123'; // In production: store hashed in env / backend

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function getLockout() {
  try { return JSON.parse(localStorage.getItem('ph_lockout') || 'null'); } catch { return null; }
}
function setLockout(data) {
  localStorage.setItem('ph_lockout', JSON.stringify(data));
}
function clearLockout() {
  localStorage.removeItem('ph_lockout');
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ph_users') || '[]'); } catch { return []; }
  });

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ph_session') || 'null'); } catch { return null; }
  });

  const saveSession = (u) => {
    setUser(u);
    localStorage.setItem('ph_session', JSON.stringify(u));
  };

  // ─── Public user registration ────────────────────────────────────────────────
  const register = ({ name, email, password }) => {
    if (!name || !email || !password)
      return { success: false, error: 'All fields are required' };
    // Prevent registering with the admin email
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
      return { success: false, error: 'This email cannot be used for registration' };

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing)
      return { success: false, error: 'An account with this email already exists' };

    const newUser = { id: Date.now().toString(), name, email, password, role: 'user' };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('ph_users', JSON.stringify(updated));
    saveSession({ id: newUser.id, name, email, role: 'user' });
    return { success: true, role: 'user' };
  };

  // ─── Public user login (students / general users only) ───────────────────────
  const login = (email, password) => {
    // Silently block anyone trying the admin email on the public login
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
      return { success: false, error: 'Incorrect email or password' };

    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found)
      return { success: false, error: 'Incorrect email or password' };

    saveSession({ id: found.id, name: found.name, email: found.email, role: found.role });
    return { success: true, role: found.role };
  };

  // ─── Admin-only login with brute-force protection ────────────────────────────
  const adminLogin = (email, password) => {
    // Check lockout
    const lockout = getLockout();
    if (lockout) {
      const remaining = lockout.until - Date.now();
      if (remaining > 0) {
        const mins = Math.ceil(remaining / 60000);
        return { success: false, error: `Too many failed attempts. Try again in ${mins} minute${mins > 1 ? 's' : ''}.`, locked: true };
      }
      clearLockout(); // lockout expired
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      clearLockout();
      saveSession({ id: 'admin', name: 'Admin', email: ADMIN_EMAIL, role: 'admin' });
      return { success: true, role: 'admin' };
    }

    // Track failed attempt
    const current = getLockout() || { attempts: 0, until: null };
    const attempts = (current.attempts || 0) + 1;
    const remaining = MAX_ATTEMPTS - attempts;

    if (attempts >= MAX_ATTEMPTS) {
      setLockout({ attempts, until: Date.now() + LOCKOUT_MS });
      return { success: false, error: `Too many failed attempts. Account locked for 15 minutes.`, locked: true };
    }

    setLockout({ attempts, until: null });
    return {
      success: false,
      error: `Incorrect credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
    };
  };

  // ─── Forgot password (public users only — admin excluded) ────────────────────
  const sendPasswordReset = (email) => {
    // Never confirm or deny admin email existence
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
      return { success: true }; // silent — don't reveal admin email exists

    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found)
      return { success: false, error: 'No account found with that email address' };

    // In production: call backend / Firebase sendPasswordResetEmail here
    return { success: true };
  };

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ph_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, register, logout, sendPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
