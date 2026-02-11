import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { LoginScreen } from '@features/auth/LoginScreen';
import { initTruecaller } from '@/services/truecaller';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Initialize Truecaller SDK
    const truecallerKey = import.meta.env.VITE_TRUECALLER_APP_KEY;
    if (truecallerKey) {
      initTruecaller(truecallerKey);
    }
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-primary-700 mb-4">
          Logic Looper 🧩
        </h1>
        <div className="card text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
          <p className="text-gray-600">
            Phase 1 Complete! Game features coming in Phase 2.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;