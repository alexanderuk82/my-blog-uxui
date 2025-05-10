import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

/**
 * Login Page
 * 
 * Simple login page for authentication testing
 */
const Login = () => {
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Empty cart for header
  const cartItems = [];
  
  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google sign in...');
      // Set a flag in localStorage to indicate we're attempting login
      localStorage.setItem('auth_in_progress', 'true');
      
      await signInWithGoogle();
      
      // Clear the flag after successful login
      localStorage.removeItem('auth_in_progress');
      
      console.log('Successfully signed in');
      toast.success('Successfully signed in');
      navigate('/');
    } catch (error) {
      // Clear the flag if there's an error
      localStorage.removeItem('auth_in_progress');
      
      console.error('Login error:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      toast.error('Failed to sign in: ' + error.message);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Sign In - UI HUB</title>
        <meta name="description" content="Sign in to access UI HUB admin features" />
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
          <Header cartItems={cartItems} onCartClick={() => {}} />
          
          <main className="my-12">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
              
              {currentUser ? (
                <div className="text-center">
                  <p className="mb-4">You are already signed in as:</p>
                  <p className="font-medium">{currentUser.email}</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Go to Home
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Sign in with your Google account to access admin features
                  </p>
                  
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.514 0-10 4.486-10 10s4.486 10 10 10c8.837 0 10.966-8.137 10.214-11.666h-10.214z"
                        fill="#4285F4"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              )}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Login;
