declare global {
  interface Window {
    TruecallerSDK: any;
  }
}

export const initTruecaller = (appKey: string) => {
  if (typeof window !== 'undefined' && window.TruecallerSDK) {
    window.TruecallerSDK.init({
      appKey: appKey,
      appName: 'Logic Looper',
      buttonColor: '#0ea5e9',
      buttonText: 'Continue with Truecaller',
      consentHeading: 'Welcome to Logic Looper',
      consentText: 'By continuing, you agree to our Terms & Privacy Policy',
      skipOption: 'skip',
    });
  }
};

export const loginWithTruecaller = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.TruecallerSDK) {
      reject(new Error('Truecaller SDK not loaded'));
      return;
    }

    window.TruecallerSDK.login((response: any) => {
      if (response.successful) {
        resolve(response.profile);
      } else {
        reject(new Error(response.error || 'Truecaller login failed'));
      }
    });
  });
};