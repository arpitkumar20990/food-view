import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useDebounce } from '../hooks/useDebounce';
import Toast from './Toast';

export const AuthLoginCard = ({ defaultMode = 'user' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(defaultMode);

  useEffect(() => {
    setActiveTab(location.pathname.includes('food-partner') ? 'food-partner' : 'user');
  }, [location.pathname]);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const emailInputRef = useRef(null);

  // Focus email input on load
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [activeTab]);

  const debouncedEmail = useDebounce(formData.email, 300);
  const debouncedPassword = useDebounce(formData.password, 300);

  // Validation logic
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail);
  const isPasswordValid = debouncedPassword.length >= 4;

  const emailError =
    touched.email && formData.email.length > 0 && !isEmailValid
      ? 'Please enter a valid email address'
      : '';

  const passwordError =
    touched.password && formData.password.length > 0 && !isPasswordValid
      ? 'Password must be at least 6 characters'
      : '';

  const isFormValid = isEmailValid && isPasswordValid;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleTabSwitch = (mode) => {
    if (mode === activeTab) return;
    setActiveTab(mode);
    setFormData({ email: '', password: '' });
    setTouched({ email: false, password: false });
    if (mode === 'user') {
      navigate('/user/login', { replace: true });
    } else {
      navigate('/food-partner/login', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    const endpoint =
      activeTab === 'user'
        ? `${API_BASE_URL}/api/auth/user/login`
        : `${API_BASE_URL}/api/auth/food-partner/login`;

    const redirectPath = activeTab === 'user' ? '/home' : '/food-partner/home';

    try {
      await axios.post(
        endpoint,
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      setToast({ message: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        window.location.replace(redirectPath);
      }, 500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-gray-100 to-red-50 px-4 py-8">
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 transition-all duration-300">
        
        {/* Animated Sliding Tab Toggle */}
        <div className="mb-8">
          <div className="relative flex bg-gray-100 p-1.5 rounded-2xl select-none">
            {/* Sliding Pill Background */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-300 ease-out ${
                activeTab === 'food-partner' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'
              }`}
            />
            <button
              type="button"
              onClick={() => handleTabSwitch('user')}
              className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold rounded-xl text-center transition-colors duration-200 cursor-pointer ${
                activeTab === 'user' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="User Login Tab"
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('food-partner')}
              className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold rounded-xl text-center transition-colors duration-200 cursor-pointer ${
                activeTab === 'food-partner' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Food Partner Login Tab"
            >
              Food Partner
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {activeTab === 'user' ? 'Welcome Back 👋' : 'Partner Portal 🍳'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'user'
              ? 'Sign in to explore your personalized food reels'
              : 'Sign in to manage your culinary reels & store'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                ref={emailInputRef}
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                placeholder="you@example.com"
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 bg-gray-50/50 ${
                  emailError
                    ? 'border-red-500 ring-2 ring-red-100 bg-red-50/30'
                    : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:bg-white'
                }`}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />
            </div>
            {emailError && (
              <p id="email-error" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1 animate-fade-in">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 bg-gray-50/50 pr-11 ${
                  passwordError
                    ? 'border-red-500 ring-2 ring-red-100 bg-red-50/30'
                    : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:bg-white'
                }`}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
              />
              {/* Show / Hide Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 active:scale-95 transition-all cursor-pointer rounded-full"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.858A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1 animate-fade-in">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              isFormValid && !loading
                ? 'bg-red-600 hover:bg-red-700 text-white active:scale-95 hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthLoginCard;
