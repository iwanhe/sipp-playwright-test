// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load file .env
dotenv.config();

export default defineConfig({
  // Folder tempat file test berada
  testDir: './tests',

  // Timeout 45 detik per test (APEX kadang lambat load)
  timeout: 45000,

  // Coba ulang 1x jika test gagal
  retries: 1,

  // Jalankan 2 test secara parallel
  workers: 2,

  use: {
    // URL dasar SIPP (diambil dari .env)
    baseURL: process.env.SIPP_BASE_URL,

    // Screenshot hanya jika test gagal
    screenshot: 'only-on-failure',

    // Video rekaman hanya jika test gagal
    video: 'retain-on-failure',

    // Trace untuk debug (hanya di retry pertama)
    trace: 'on-first-retry',
  },

  projects: [
    // Project setup: jalankan login dulu
    // TIDAK pakai storageState di sini — setup yang membuat file-nya
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Project utama: test dengan Chromium
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Gunakan session hasil login — HANYA untuk chromium project
        storageState: 'playwright/.auth/user.json',
      },
      // Wajib login dulu sebelum test lain dijalankan
      dependencies: ['setup'],
    },
  ],
});
