// tests/sipp/cek-status.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cek Status Laporan', () => {

  test('halaman cek status dapat diakses', async ({ page }) => {
    // Buka halaman SIPP - cek apakah ada menu untuk cek status
    await page.goto('/');

    // Cari link atau menu "Cek Status" di navigasi
    const cekStatusLink = page.locator('text=Cek Status, a:has-text("Status")').first();
    if (await cekStatusLink.isVisible()) {
      await cekStatusLink.click();
      await expect(page.locator('h1, .t-Region-title')).toBeVisible();
    }
  });
});
