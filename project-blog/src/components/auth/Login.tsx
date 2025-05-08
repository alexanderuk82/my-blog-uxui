import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import { LogIn } from 'lucide-react';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      onClose();
    } catch (err) {
      setError('Failed to log in');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError('Failed to sign in with Google');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In"
      icon={<LogIn size={20} />}
    >
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 border-keyline"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 border-keyline"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-keyline"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-keyline text-black dark:text-white py-2 rounded-full hover:bg-surface transition-colors flex items-center justify-center gap-2"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          Google
        </button>
      </form>
    </Modal>
  );
};

export default Login;
