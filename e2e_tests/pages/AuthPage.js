export class AuthPage {
  constructor(page) {
    this.page = page
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập' })
    this.registerButton = page.getByRole('button', { name: 'Đăng ký' })
    this.loginMessage = page.getByText('Chào mừng bé trở lại! Vào lớp')
    this.registerMessage = page.getByText('Gia nhập hành trình học tập c')
    this.nameRegisterInput = page.getByRole('textbox', {
      name: 'Tên người dùng',
    })
    this.emailRegisterInput = page.getByRole('textbox', {
      name: 'Email (be@eduspark.vn)',
    })
    this.passwordRegisterInput = page.getByRole('textbox', { name: 'Mật khẩu' })
    this.emailLoginInput = page.getByRole('textbox', { name: 'Email của bạn' })
    this.passwordLoginInput = page.getByRole('textbox', { name: 'Mật khẩu' })
    this.registerConfirmButton = page.getByRole('button', {
      name: '🎒 Đăng ký ngay!',
    })
    this.loginConfirmButton = page.getByRole('button', {
      name: '✨ Vào lớp thôi!',
    })
  }

  async navigate() {
    await this.page.goto(`${process.env.FRONTEND_URL}/#/login`)
  }

  async register(name, email, password) {
    await this.registerButton.click()
    await this.nameRegisterInput.fill(name)
    await this.emailRegisterInput.fill(email)
    await this.passwordRegisterInput.fill(password)
    await this.registerConfirmButton.click()
  }
}
