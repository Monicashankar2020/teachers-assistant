import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  const sendVerificationCode = async () => {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, action: 'send-code' })
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      setCodeSent(true);
    } else {
      alert(data.error);
    }
  };

  const verifyCode = async () => {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, verificationCode, action: 'verify-code' })
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      setVerified(true);
    } else {
      alert(data.error);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!verified) return alert('Please verify your email first.');

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, action: 'reset-password' })
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      router.push('/login');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="h-screen bg-dark text-white flex items-center justify-center">
      <form className="bg-blueShade p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={resetPassword}>
        <h2 className="text-3xl mb-6 text-center">Reset Password</h2>

        <input
          className="w-full mb-4 p-3 rounded-md bg-grey text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!codeSent && (
          <button type="button" onClick={sendVerificationCode} className="w-full p-3 bg-blue-500 rounded-md hover:bg-blue-700">
            Send Verification Code
          </button>
        )}

        {codeSent && !verified && (
          <>
            <input
              className="w-full mb-4 p-3 rounded-md bg-grey text-black"
              placeholder="Enter Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button type="button" onClick={verifyCode} className="w-full p-3 bg-green-500 rounded-md hover:bg-green-700">
              Verify Code
            </button>
          </>
        )}

        {verified && (
          <>
            <input
              className="w-full mb-4 p-3 rounded-md bg-grey text-black"
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full p-3 bg-blue-500 rounded-md hover:bg-blue-700">Reset Password</button>
          </>
        )}
      </form>
    </div>
  );
}
