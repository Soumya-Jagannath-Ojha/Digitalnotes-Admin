import React, { useState, useRef, useEffect } from 'react';
import { verifyVerificationCode } from '../services/api';
import { toast } from 'react-hot-toast';
import ResetPassword from './Reset_password';

const VerificationCode = ({ onVerificationComplete }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0].focus();
  }, []);

  const handleVerification = async (completeCode) => {
    try {
      const response = await verifyVerificationCode({ code: completeCode });
      toast.success('Code verified successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
      onVerificationComplete?.(response);
      setError('');
      setIsVerified(true);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Verification failed');
      // Reset code on error
      setCode(['', '', '', '', '', '']);
      inputs.current[0].focus();
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    if (element.value && index < 5) {
      inputs.current[index + 1].focus();
    }

    if (newCode.every(digit => digit !== '')) {
      const completeCode = newCode.join('');
      handleVerification(completeCode);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit;
          inputs.current[index].value = digit;
        }
      });
      setCode(newCode);
      inputs.current[Math.min(pastedData.length, 5)].focus();

      if (pastedData.length === 6) {
        handleVerification(pastedData);
      }
    }
  };

  if (isVerified) {
    return <ResetPassword />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Verification Code</h2>
          <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(ref) => inputs.current[index] = ref}
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 md:w-14 md:h-14 border-2 border-gray-300 rounded-lg text-center text-xl font-bold text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
