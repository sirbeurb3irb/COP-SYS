import { test, expect } from '@playwright/test';

test('loads home and navigates to login', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('ENDFCOP')).toBeVisible();
	await page.goto('/login');
	await expect(page.getByText('Login')).toBeVisible();
});