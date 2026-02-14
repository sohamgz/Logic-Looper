import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootState } from '@store/index';
import { LoginScreen } from '@features/auth/LoginScreen';
import { GameScreen } from '@features/game/GameScreen';
import { StatsScreen } from '@features/streak/StatsScreen';
import { Header } from '@components/layout/Header';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<GameScreen />} />
        <Route path="/stats" element={<StatsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;