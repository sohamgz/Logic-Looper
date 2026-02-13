declare global {
  interface Window {
    TruecallerSDK: any;
  }
}

let truecallerInitialized = false;

export const initTruecaller = () => {
  // Skip if already initialized
  if (truecallerInitialized) {
    console.log('✅ Truecaller already initialized');
    return;
  }

  // Check if SDK loaded
  if (typeof window === 'undefined' || !window.TruecallerSDK) {
    console.log('⚠️ Truecaller SDK not loaded yet');
    return;
  }

  try {
    console.log('🔄 Initializing Truecaller SDK...');
    truecallerInitialized = true;
    console.log('✅ Truecaller SDK ready');
  } catch (error) {
    console.error('❌ Truecaller SDK error:', error);
  }
};

export const loginWithTruecaller = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.TruecallerSDK) {
      reject(new Error('Truecaller SDK not loaded. Please refresh the page.'));
      return;
    }

    try {
      // Trigger Truecaller login
      window.TruecallerSDK.auth.login((response: any) => {
        if (response && response.successful) {
          resolve({
            phoneNumber: response.profile.phoneNumber,
            name: response.profile.firstName + ' ' + response.profile.lastName,
            email: response.profile.email || null,
            image: response.profile.image || null,
          });
        } else {
          reject(new Error('Truecaller login cancelled or failed'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const isTruecallerAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.TruecallerSDK;
};