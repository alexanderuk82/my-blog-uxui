import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import { UserPlus } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';

interface SignUpProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ isOpen, onClose, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      toast.success('Account created successfully!');
      onClose();
    } catch (err) {
      if (err instanceof FirebaseError) {
        // Handle specific Firebase errors
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered');
            toast.error('This email is already registered');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/weak-password':
            setError('Password is too weak');
            break;
          default:
            setError('Failed to create account');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in successfully!');
      onClose();
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/account-exists-with-different-credential') {
          toast.error('An account already exists with the same email address');
          setError('An account already exists with the same email address');
        } else {
          setError('Failed to sign in with Google');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    onClose();
    onLoginClick();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Account"
      icon={<UserPlus size={20} />}
    >
      {error && <p className="text-red-500 mb-4 text-sm" role="alert">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 border-keyline"
            required
            aria-required="true"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 border-keyline"
            required
            aria-required="true"
            disabled={isLoading}
            minLength={6}
          />
          <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="signup-confirm-password">
            Confirm Password
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 border-keyline"
            required
            aria-required="true"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-full hover:opacity-90 transition-opacity flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          Create Account
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
          disabled={isLoading}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          Google
        </button>
        <div className="text-center text-sm">
          <span className="text-gray-500">Already have an account?</span>{' '}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-black dark:text-white font-medium hover:underline focus:outline-none"
            disabled={isLoading}
          >
            Sign In
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SignUp;
