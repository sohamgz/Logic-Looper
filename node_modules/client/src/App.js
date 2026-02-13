import { useSelector } from 'react-redux';
import { LoginScreen } from '@features/auth/LoginScreen';
import { GameScreen } from '@features/game/GameScreen';
function App() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    if (!isAuthenticated) {
        return <LoginScreen />;
    }
    return <GameScreen />;
}
export default App;
