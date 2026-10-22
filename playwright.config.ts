import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'e2e', workers:1, use:{baseURL:'http://127.0.0.1:4173/last-viewer/',viewport:{width:390,height:844},isMobile:true,hasTouch:true,browserName:'chromium',launchOptions:{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}},
  webServer:{command:'npm run preview -- --port 4173',url:'http://127.0.0.1:4173/last-viewer/',reuseExistingServer:!process.env.CI}
});
