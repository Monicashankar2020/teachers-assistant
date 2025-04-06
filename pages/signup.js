import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'student' });
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  const sendVerificationCode = async () => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, action: 'send-code' })
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
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, verificationCode, action: 'verify-code' })
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      setVerified(true);
    } else {
      alert(data.error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!verified) return alert('Please verify your email first.');

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, action: 'signup' })
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
      <form className="bg-blueShade p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSignup}>
        <h2 className="text-3xl mb-6 text-center">Signup</h2>

        <input
          className="w-full mb-4 p-3 rounded-md bg-grey text-black"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <input className="w-full mb-4 p-3 rounded-md bg-grey text-black" placeholder="Username" required onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            <input className="w-full mb-4 p-3 rounded-md bg-grey text-black" placeholder="Password" type="password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

            <select
              className="w-full mb-4 p-3 rounded-md bg-grey text-black"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <button type="submit" className="w-full p-3 bg-blue-500 rounded-md hover:bg-blue-700">Signup</button>
          </>
        )}
      </form>
    </div>
  );
}
