import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@store/authSlice';
import { AppDispatch, RootState } from '@store/index';

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentStreak } = useSelector((state: RootState) => state.streak);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-primary-700 hover:text-primary-800 transition-colors"
          >
            🧩 Logic Looper
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {/* Streak Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-orange-700">{currentStreak}</span>
              <span className="text-sm text-orange-600">streak</span>
            </div>

            {/* Stats Button */}
            <button
              onClick={() => navigate('/stats')}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Stats
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-primary-500"
                />
              )}
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};