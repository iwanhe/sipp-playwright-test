// tests/sipp/homepage.spec.ts
import { test, expect } from '@playwright/test';
import { sippUrl } from '../helpers/apex-helper';

const BASE = process.env.SIPP_BASE_URL!;

test.describe('SIPP Homepage', () => {

  // Test 1: Halaman home muncul setelah login
  test('halaman home tampil dengan benar', async ({ page }) => {
    // Gunakan sippUrl() agar session ID otomatis disertakan di URL
    await page.goto(sippUrl('home'));
    await page.waitForLoadState('networkidle');

    // Guard: pastikan bukan halaman login
    expect(page.url()).not.toContain('/login');

    // Verifikasi judul halaman
    await expect(page).toHaveTitle(/SIPP/);

    // Verifikasi teks SIPP SYSTEM muncul di halaman
    await expect(page.locator('text=SIPP SYSTEM').first()).toBeVisible();
  });

  // Test 2: Menu navigasi tersedia
  test('menu navigasi tersedia', async ({ page }) => {
    await page.goto(sippUrl('home'));
    await page.waitForLoadState('networkidle');

    // Ambil screenshot untuk debug
    await page.screenshot({ path: 'test-results/debug-homepage.png' });

    // Guard: pastikan session aktif
    expect(page.url()).not.toContain('/login');

    // Cari elemen navigasi (salah satu class APEX cards)
    const navEl = page.locator([
      '.t-Card',
      '.t-Cards-item',
      'ul.t-Cards li',
      '.a-CardView-item',
      '.t-NavigationList-item',
    ].join(', '));

    await expect(navEl.first()).toBeVisible({ timeout: 15000 });
  });

  // Test 3: Tombol "Laporkan" tersedia di halaman login (akses publik)
  test('tombol laporkan tersedia untuk publik', async ({ page }) => {
    // Buka halaman login tanpa session (mode publik)
    await page.goto(BASE + '/login');
    await page.waitForLoadState('networkidle');

    // Verifikasi tombol Laporkan ada
    await expect(
      page.getByRole('button', { name: 'Laporkan' })
        .or(page.getByRole('link', { name: 'Laporkan' }))
        .first()
    ).toBeVisible({ timeout: 10000 });
  });
});
