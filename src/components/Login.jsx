import React, { useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import toast from 'react-hot-toast';
import { login, sendVerificationEmail } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleFocus = (inputId) => {
    setFocusedInput(inputId);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await login(formData);
      setAuth();
      toast.success('Login successful! Welcome Admin');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      emailRef.current.value = '';
      passwordRef.current.value = '';
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsResetLoading(true);
    try {
      await sendVerificationEmail();
      toast.success('Verification code sent to your email');
      navigate('/password-reset');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const Loader = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
    </div>
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200"
          data-tooltip-id="close-tooltip"
          data-tooltip-content="Close"
        >
          <IoMdClose size={24} />
        </button>
        <Tooltip
          id="close-tooltip"
          place="right"
          className="z-50"
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }} />
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Please login to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-blue-500" />
              </div>
              <input
                type="email"
                id="emailid"
                ref={emailRef}
                className="w-full pl-10 pr-3 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder=" "
                required
                onFocus={() => handleFocus("emailid")}
                onBlur={handleBlur}
              />
              <label
                htmlFor="emailid"
                className={`absolute left-10 transition-all duration-200 ${focusedInput === "emailid" || (emailRef.current && emailRef.current.value)
                  ? "text-xs text-blue-600 top-[-0.5rem] bg-white px-1"
                  : "text-sm text-gray-600 top-[0.85rem]"
                  }`}
              >
                Email
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-red-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                ref={passwordRef}
                className="w-full pl-10 pr-12 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder=" "
                required
                onFocus={() => handleFocus("password")}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-200"
                data-tooltip-id="password-tooltip"
                data-tooltip-content={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
              <Tooltip
                id="password-tooltip"
                place="right"
                className="z-50"
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <label
                htmlFor="password"
                className={`absolute left-10 transition-all duration-200 ${focusedInput === "password" || (passwordRef.current && passwordRef.current.value)
                  ? "text-xs text-blue-600 top-[-0.5rem] bg-white px-1"
                  : "text-sm text-gray-600 top-[0.85rem]"
                  }`}
              >
                Password
              </label>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isResetLoading}
              className={`w-full sm:w-1/2 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${isResetLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isResetLoading ? <Loader /> : 'Reset Password'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-1/2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? <Loader /> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
