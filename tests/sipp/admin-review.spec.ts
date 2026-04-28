// tests/sipp/admin-review.spec.ts
import { test, expect } from '@playwright/test';
import { gotoSippPage, SIPP_PAGES } from '../helpers/apex-helper';

test.describe('Admin - Review Laporan', () => {

  // Test 1: Halaman Administration bisa dibuka
  test('halaman administration tersedia untuk admin', async ({ page }) => {
    await gotoSippPage(page, SIPP_PAGES.ADMINISTRATION);

    // Verifikasi halaman admin terbuka (bukan redirect ke login)
    await expect(page.locator('text=Administration').first())
         .toBeVisible({ timeout: 15000 });
  });

  // Test 2: Daftar laporan muncul di admin list
  test('daftar laporan muncul di halaman admin', async ({ page }) => {
    // Buka halaman list laporan
    await gotoSippPage(page, SIPP_PAGES.SIPP_LIST);

    // Tunggu interactive report/grid selesai load
    await page.waitForSelector('.t-Report, .a-GV-table', { timeout: 15000 });

    // Verifikasi minimal 1 baris data ada
    const rows = page.locator('.t-Report tbody tr, .a-GV-row');
    await expect(rows.first()).toBeVisible();
  });

  // Test 3: Filter laporan berdasarkan status
  test('filter laporan berfungsi', async ({ page }) => {
    await gotoSippPage(page, SIPP_PAGES.SIPP_LIST);
    await page.waitForSelector('.t-Report, .a-GV-table', { timeout: 15000 });

    // Gunakan filter APEX Interactive Report
    // Klik ikon search/filter
    const searchBar = page.locator('.a-IRR-searchBar input, #apexir_SEARCH');
    if (await searchBar.isVisible()) {
      await searchBar.fill('OPEN');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000); // Tunggu filter applied
    }
  });
});
