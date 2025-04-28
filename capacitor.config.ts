import { CapacitorConfig } from '@capacitor/cli';
import * as dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// 환경 변수 안전하게 가져오기
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Warning: ${key} is not set in environment variables`);
    return '';
  }
  return value;
};

const capacitorConfig: CapacitorConfig = {
  appId: 'com.autorise.cloudbridge',
  appName: '구름다리',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*.autoriseinsight.co.kr']
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
      keystorePassword: getEnvVar('KEYSTORE_PASSWORD'),
      keystoreAliasPassword: getEnvVar('KEY_PASSWORD'),
    }
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'cloudbridge',
    backgroundColor: '#ffffff'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP'
    }
  }
};

export default capacitorConfig; 