// tests/helpers/apex-helper.ts
// Helper functions untuk navigasi dan interaksi SIPP/APEX

import { Page, expect } from '@playwright/test';
import fs from 'fs';

// Konstanta Page ID SIPP yang sering digunakan
export const SIPP_PAGES = {
  HOME:           1,
  FORM_LAPORAN:   3,
  LOGIN:          9999,
  ADMINISTRATION: 10000,
  SIPP_LIST:      10010,  // Daftar laporan
  SETTINGS:       20000,
} as const;

// Alias halaman SIPP (untuk friendly URL)
export const SIPP_ALIAS = {
  HOME:           'home',
  FORM_LAPORAN:   'wbs',      // alias dari page 3
  ADMINISTRATION: 'administration',
  SETTINGS:       'settings',
} as const;

// ── Baca session ID yang disimpan oleh auth.setup.ts ──────────────────────────
function getSessionId(): string {
  try {
    const raw  = fs.readFileSync('playwright/.auth/session.json', 'utf-8');
    const data = JSON.parse(raw);
    return data.sessionId ?? '0';
  } catch {
    return '0';
  }
}

// ── Buat URL SIPP dengan session ID (friendly URL) ────────────────────────────
// Contoh: sippUrl('home') → https://server/ords/r/xtd/wbs/home?session=12345
export function sippUrl(alias: string): string {
  const base      = process.env.SIPP_BASE_URL!;
  const sessionId = getSessionId();
  return `${base}/${alias}?session=${sessionId}`;
}

// ── Navigasi ke page SIPP tertentu (pakai f?p format) ────────────────────────
export async function gotoSippPage(
  page: Page,
  pageId: number,
  itemValues: string = ''
) {
  const appId     = 211068;
  const sessionId = getSessionId();
  // Format URL APEX: f?p=APP_ID:PAGE_ID:SESSION
  await page.goto(
    `${process.env.SIPP_BASE_URL}/f?p=${appId}:${pageId}:${sessionId}:::${itemValues}`
  );
  await page.waitForLoadState('networkidle');
}

// Tunggu APEX selesai load (loading indicator hilang)
export async function waitForApexLoad(page: Page) {
  // Tunggu spinner APEX hilang
  await page.waitForFunction(() => {
    const spinner = document.querySelector('.apex-busy-indicator');
    return !spinner || spinner.classList.contains('u-hidden');
  }, { timeout: 30000 });
}

// Verifikasi sukses message muncul
export async function expectSuccess(page: Page) {
  await expect(page.locator('.t-Alert--success')).toBeVisible({ timeout: 10000 });
}

// Verifikasi error message muncul
export async function expectError(page: Page) {
  await expect(page.locator('.t-Alert--danger, .t-Alert--warning')).toBeVisible({ timeout: 10000 });
}
