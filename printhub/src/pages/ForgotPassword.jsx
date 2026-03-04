import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { sendPasswordReset } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const result = sendPasswordReset(email);
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      toast.error(result.error || 'Could not send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary-600">
            <div className="bg-primary-600 text-white p-2 rounded-xl">
              <Printer size={22} />
            </div>
            CampusPrint
          </Link>
        </div>

        <div className="card">
          {!sent ? (
            <>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot your password?</h2>
                <p className="text-sm text-gray-500">
                  Enter the email address linked to your account and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input pl-9"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-accent" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Check your inbox</h3>
              <p className="text-sm text-gray-500 mb-1">
                We've sent a password reset link to:
              </p>
              <p className="font-semibold text-gray-800 mb-4">{email}</p>
              <p className="text-xs text-gray-400">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-primary-600 hover:underline font-medium"
                >
                  try again
                </button>.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
