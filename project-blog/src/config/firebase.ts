import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC4XePlD9yCypx20ETtstNnlLTqQJzHS4A",
  authDomain: "uihub-9f59a.firebaseapp.com",
  projectId: "uihub-9f59a",
  storageBucket: "uihub-9f59a.firebasestorage.app",
  messagingSenderId: "1097665555937",
  appId: "1:1097665555937:web:c26444b10ef45f74fef6a0",
  measurementId: "G-V3R9RJC81G"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;
