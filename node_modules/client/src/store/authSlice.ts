import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@app-types/auth.types';
import { signInWithGoogle, logout as firebaseLogout } from '@/services/firebase';
import { loginWithTruecaller } from '@/services/truecaller';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginGoogle = createAsyncThunk(
  'auth/loginGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const firebaseUser = await signInWithGoogle();
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName!,
        avatar: firebaseUser.photoURL || undefined,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      
      // Sync to server
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginTruecaller = createAsyncThunk(
  'auth/loginTruecaller',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await loginWithTruecaller();
      const user: User = {
        id: profile.phoneNumber,
        email: profile.email || `${profile.phoneNumber}@truecaller.temp`,
        name: profile.name,
        avatar: profile.image,
        provider: 'truecaller',
        createdAt: new Date().toISOString(),
      };
      
      // Sync to server
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginGuest = createAsyncThunk(
  'auth/loginGuest',
  async () => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      id: guestId,
      email: `${guestId}@guest.local`,
      name: 'Guest Player',
      provider: 'guest',
      createdAt: new Date().toISOString(),
    };
    
    // Store in localStorage (no server sync for guests)
    localStorage.setItem('guestUser', JSON.stringify(user));
    return user;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.user?.provider === 'google') {
      await firebaseLogout();
    }
    localStorage.removeItem('guestUser');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Google login
    builder.addCase(loginGoogle.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginGoogle.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    builder.addCase(loginGoogle.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Truecaller login
    builder.addCase(loginTruecaller.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginTruecaller.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    builder.addCase(loginTruecaller.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Guest login
    builder.addCase(loginGuest.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;