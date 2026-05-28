import { test, expect } from '@playwright/test'
import { AuthPage } from '../../pages/AuthPage'

test.describe('App test', () => {
  test.beforeEach(async ({ page, request }) => {
    const response = await request.post(
      `${process.env.BACKEND_URL}/dev/wipe-db`,
    )
    expect(response.ok()).toBeTruthy()
  })

  test('registration', async ({ page }) => {
    const authPage = new AuthPage(page)
    await authPage.navigate()

    await authPage.register('new student', 'student1@gmail.com', 'password123')

    await expect(authPage.loginMessage).toBeVisible()
  })
})
