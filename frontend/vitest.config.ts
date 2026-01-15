import { defineConfig } from 'vitest/config';
import { preview } from '@vitest/browser-preview';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

export default defineConfig({
  test: {
    browser: {
      headless: true,
      provider: preview(),
    },
  },
});
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);
