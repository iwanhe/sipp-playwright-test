// tests/sipp/form-laporan.spec.ts
import { test, expect } from '@playwright/test';
import { gotoSippPage, SIPP_PAGES, expectSuccess } from '../helpers/apex-helper';

test.describe('Form Laporan Pelanggaran', () => {

  // Test 1: Form dapat dibuka
  test('form laporan dapat dibuka', async ({ page }) => {
    await gotoSippPage(page, SIPP_PAGES.FORM_LAPORAN);

    // Verifikasi form muncul
    await expect(page.locator('#P3_TINDAKAN'))
         .toBeVisible({ timeout: 15000 });
  });

  // Test 2: Submit laporan baru (Happy Path)
  test('submit laporan baru berhasil', async ({ page }) => {
    await gotoSippPage(page, SIPP_PAGES.FORM_LAPORAN);

    // Tunggu form selesai load
    await page.waitForSelector('#P3_TINDAKAN', { state: 'visible' });

    // Isi field form
    await page.locator('#P3_NAMA_TERLAPOR')
         .fill('Test Terlapor Otomasi');
    await page.locator('#P3_JABATAN_TERLAPOR')
         .fill('Staff Testing');
    await page.locator('#P3_WAKTU_KEJADIAN')
         .fill('01/04/2026');
    await page.locator('#P3_LOKASI_KEJADIAN')
         .fill('Kantor Pusat - Lantai 3');
    await page.locator('#P3_KRONOLOGIS_KEJADIAN')
         .fill('Ini adalah laporan test otomasi. Mohon diabaikan.');

    // Pilih jenis tindakan dari dropdown (sesuaikan value dengan data SIPP)
    // await page.locator('#P3_TINDAKAN').selectOption({ index: 1 });

    // Klik tombol Submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verifikasi sukses
    await expectSuccess(page);
  });

  // Test 3: Validasi field wajib
  test('form menampilkan error jika field wajib kosong', async ({ page }) => {
    await gotoSippPage(page, SIPP_PAGES.FORM_LAPORAN);
    await page.waitForSelector('#P3_TINDAKAN', { state: 'visible' });

    // Klik Submit tanpa isi apapun
    await page.getByRole('button', { name: 'Submit' }).click();

    // APEX seharusnya menampilkan error validasi
    await expect(page.locator('.t-Alert--danger, #errorNotification'))
         .toBeVisible({ timeout: 10000 });
  });
});
