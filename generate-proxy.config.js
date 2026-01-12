const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV !== 'production') {
  require('dotenv').config({ path: `.env.${NODE_ENV}`, silent: true });
}

const API_BASE_URL = process.env.API_BASE_URL;
const API_VERSION = process.env.API_VERSION;

const proxyConfigPath = 'proxy.conf.json';
const proxyConfig = {
  '/caserita-gateway': {
    target: API_BASE_URL,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/caserita-gateway': `/${API_VERSION}`,
    },
  },
};

try {
  fs.writeFileSync(proxyConfigPath, JSON.stringify(proxyConfig, null, 2));
  console.log(`✅ Proxy configuration successfully generated in ${proxyConfigPath}`);
} catch (error) {
  console.error('❌ Error generating proxy configuration file:', error);
}
