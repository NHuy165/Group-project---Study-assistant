import { test, expect } from '@playwright/test'
import { AuthPage } from '../../pages/AuthPage'

test.describe('App test', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://0.0.0.0:8000/api/dev/wipe-db')
  })

  test('registration', async ({ page }) => {
    const authPage = new AuthPage(page)
    await authPage.navigate()

    await authPage.register('new student', 'student1@gmail.com', 'password123')

    await expect(authPage.loginMessage).toBeVisible()
  })
})
