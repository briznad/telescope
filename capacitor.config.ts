import { CapacitorConfig } from '@capacitor/cli';


const appId = 'com.briznad.cartmigo';
const appName = 'Cartmigo';
const server = process.argv.includes('-hmr') ? {
  'url': 'http://192.168.7.132:5173',   // always have http:// in url
  'cleartext': true
} : {};
const webDir = 'dist';

const config : CapacitorConfig = {
  appId,
  appName,
  webDir,
  server
};

if (process.argv.includes('-hmr')) {
  console.log('WARNING: running capacitor with livereload config', config);
}

export default config;
