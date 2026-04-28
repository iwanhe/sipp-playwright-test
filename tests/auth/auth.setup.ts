// tests/auth/auth.setup.ts
// File ini menangani login ke SIPP dan menyimpan session

import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Lokasi file session yang akan disimpan
const authFile = path.join('playwright/.auth/user.json');

setup('authenticate - login ke SIPP', async ({ page }) => {
  // 1. Buka halaman login SIPP
  await page.goto(process.env.SIPP_BASE_URL + '/login');
  await page.waitForLoadState('networkidle');

  // 2. Isi username
  await page.locator('#P9999_USERNAME')
       .fill(process.env.SIPP_USERNAME!);

  // 3. Isi password
  await page.locator('#P9999_PASSWORD')
       .fill(process.env.SIPP_PASSWORD!);

  // 4. Klik tombol Sign In
  await page.getByRole('button', { name: 'Sign In' }).click();

  // 5. Tunggu sampai redirect SELESAI dari halaman login
  //    Gunakan fungsi predicate agar tidak resolve terlalu cepat
  await page.waitForURL(
    url => !url.toString().includes('/login'),
    { timeout: 30000 }
  );

  // 6. Tunggu halaman home benar-benar selesai load (cookie APEX sudah di-set)
  await page.waitForLoadState('networkidle');

  // 7. Log URL setelah login untuk debugging
  console.log('URL setelah login:', page.url());

  // 8. Verifikasi kita TIDAK di halaman login lagi
  if (page.url().includes('/login')) {
    throw new Error('Login gagal - masih di halaman login. Cek username/password di .env');
  }

  // 9. Ekstrak session ID dari URL (format: ?session=XXXXXXXXXX)
  const postLoginUrl = page.url();
  const sessionMatch  = postLoginUrl.match(/[?&]session=(\d+)/);
  const sessionId     = sessionMatch?.[1] ?? '0';

  if (sessionId === '0') {
    throw new Error('Session ID tidak ditemukan di URL: ' + postLoginUrl);
  }

  // 10. Simpan session ID ke file terpisah supaya bisa dipakai semua test
  const sessionFile = 'playwright/.auth/session.json';
  fs.writeFileSync(sessionFile, JSON.stringify({ sessionId, postLoginUrl }, null, 2));

  // 11. Simpan cookies ke storageState
  await page.context().storageState({ path: authFile });

  console.log('Login berhasil!');
  console.log('Session ID :', sessionId);
  console.log('Session file:', sessionFile);
});
