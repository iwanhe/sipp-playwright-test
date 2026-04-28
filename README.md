# 🎭 SIPP Playwright Test

> Automated QA Testing Suite for **SIPP (Sistem Informasi Perencanaan Proyek)** — Oracle APEX PWA  
> Tim PANDAWA · KCSI (Karya Cipta Solusi Internasional) · Nojorono Group

---

## 📋 Overview

Repository ini berisi automated end-to-end testing untuk aplikasi **SIPP**, sebuah Oracle APEX PWA yang dikelola oleh Tim PANDAWA KCSI. Test suite ini dibangun menggunakan [Playwright](https://playwright.dev/) dengan TypeScript untuk memastikan kualitas dan stabilitas aplikasi sebelum deployment ke production.

**Target Aplikasi:** `oracleapex.com/ords/r/kcsi/wbs`

---

## 🛠️ Tech Stack

| Tool | Versi | Keterangan |
|------|-------|------------|
| [Playwright](https://playwright.dev/) | Latest | E2E testing framework |
| TypeScript | Latest | Language |
| Node.js | ≥ 18.x | Runtime |
| npm | ≥ 9.x | Package manager |

---

## 📁 Struktur Project

```
sipp-playwright-test/
├── tests/                              # Test files
│   └── *.spec.ts                       # Test specifications
├── playwright.config.ts                # Playwright configuration
├── package.json                        # Dependencies & scripts
├── .gitignore
├── SIPP_Playwright_Testing_Guide.docx          # Panduan testing v1.0
└── SIPP_Playwright_Testing_Guide_v1.1.docx     # Panduan testing v1.1
```

---

## 🚀 Getting Started

### Prerequisites

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v18 atau lebih baru
- npm v9 atau lebih baru

### Installation

```bash
# 1. Clone repository
git clone https://github.com/iwanhe/sipp-playwright-test.git
cd sipp-playwright-test

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## ▶️ Menjalankan Tests

### Semua test (headless)
```bash
npm test
# atau
npx playwright test
```

### Dengan UI Mode (recommended untuk development)
```bash
npx playwright test --ui
```

### Specific test file
```bash
npx playwright test tests/login.spec.ts
```

### Dengan browser tertentu
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Mode headed (browser terlihat)
```bash
npx playwright test --headed
```

### Debug mode
```bash
npx playwright test --debug
```

---

## 📊 Laporan Test

Setelah test selesai, buka laporan HTML:

```bash
npx playwright show-report
```

---

## ⚙️ Konfigurasi

Konfigurasi utama ada di `playwright.config.ts`. Untuk mengubah base URL target:

```typescript
// playwright.config.ts
use: {
  baseURL: 'https://oracleapex.com/ords/r/kcsi/wbs',
  // ...
}
```

Untuk environment berbeda (DEV/UAT/PROD), gunakan environment variable:

```bash
# Contoh override base URL via env
BASE_URL=https://apps.kdk-id.com/ords/r/kcsi/wbs npx playwright test
```

---

## 📖 Dokumentasi

Panduan lengkap penggunaan dan penulisan test tersedia di:

- 📄 [`SIPP_Playwright_Testing_Guide_v1.1.docx`](./SIPP_Playwright_Testing_Guide_v1.1.docx) — Versi terbaru *(recommended)*
- 📄 [`SIPP_Playwright_Testing_Guide.docx`](./SIPP_Playwright_Testing_Guide.docx) — Versi sebelumnya

---

## ✍️ Menulis Test Baru

```typescript
// tests/contoh.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Nama Modul', () => {
  test('harus berhasil login', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Username').fill('user_test');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

---

## 🔄 CI/CD Integration

Untuk menjalankan di pipeline (GitHub Actions / Jenkins):

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 👥 Tim

**Tim PANDAWA** — IT Upstream Development  
KCSI (Karya Cipta Solusi Internasional) · Nojorono Group · Kudus, Jawa Tengah

---

## 📝 Changelog

| Versi | Tanggal | Keterangan |
|-------|---------|------------|
| v1.1 | 2025 | Update testing guide, penambahan test coverage |
| v1.0 | 2025 | Initial release |

---

*Maintained by Tim PANDAWA KCSI*
