/*
* Test Scenario for Login Page (E2E)
*
* - should display login page correctly
* - should display alert when login credentials are not valid
* - should login successfully when valid credentials are provided
*/

describe('Login Page E2E Test', () => {
  beforeEach(() => {
    // Visit the login page before each test, using a full URL
    cy.visit('http://localhost:3000/login');
    // Tambahkan perintah ini untuk menunggu form login stabil dan terlihat
    cy.get('button[type=\'submit\']').should('be.visible');
  });

  it('should display login page correctly', () => {
    // Scenario: Verify that login page elements are visible
    // Assert
    cy.get('h2').contains('Login').should('be.visible');
    cy.get('label[for=\'email\']').contains('Email').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('label[for=\'password\']').contains('Password').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('button[type=\'submit\']').contains('Login').should('be.visible');
    cy.get('p').contains('Belum punya akun?').should('be.visible');
    cy.get('a').contains('Daftar di sini').should('be.visible');
  });

  it('should display alert when login credentials are not valid', () => {
    // Scenario: User attempts to login with invalid credentials and sees an alert
    // Arrange
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: 'Email atau password salah',
      },
    }).as('loginFailed');

    cy.get('input#email').type('invalid@example.com');
    cy.get('input#password').type('invalidpassword');
    cy.get('button[type=\'submit\']').click();

    // Act & Assert
    cy.wait('@loginFailed');
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Email atau password salah');
    });
  });

  it('should login successfully when valid credentials are provided', () => {
    // ... (definitions of email, password, mockToken, mockAuthUser, mockUsers, mockThreads)

    const email = 'geraldnael@gmail.com'; // Menggunakan email Anda
    const password = '123456'; // Menggunakan password Anda
    // -----------------------------------------------------------------

    // Arrange
    const mockToken = 'mock-valid-token'; // Token ini masih di-mock, karena kita hanya menguji alur login
    const mockAuthUser = {
      id: 'geraldnael_id', // Ganti dengan ID pengguna Anda yang sebenarnya jika diperlukan untuk verifikasi lebih lanjut
      name: 'Gerald Nael', // Ganti dengan nama pengguna Anda
      email,
      avatar: 'https://www.gravatar.com/avatar/somehash?s=200&d=retro',
    };
    const mockUsers = [
      mockAuthUser,
      { id: 'jane_doe', name: 'Jane Doe', email: 'jane@example.com', avatar: '' },
    ];
    // Pastikan mockThreads dideklarasikan sebelum digunakan
    const mockThreads = []; // Deklarasi mockThreads di sini agar tidak 'no-undef'

    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'Login berhasil',
        data: { token: mockToken },
      },
    }).as('loginSuccess');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { user: mockAuthUser },
      },
    }).as('getOwnProfile');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { users: mockUsers },
      },
    }).as('getAllUsers');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { threads: mockThreads },
      },
    }).as('getAllThreads');


    cy.get('input#email').type(email);
    cy.get('input#password').type(password);
    cy.get('button[type=\'submit\']').click();

    // Pastikan urutan ini:
    cy.wait('@loginSuccess'); // Tunggu panggilan login
    cy.wait('@getOwnProfile'); // Tunggu panggilan profil pengguna

    // Tunggu hingga URL berubah ke homepage.
    // Ini memastikan komponen HomePage sudah di-mount dan dispatch API-nya sudah terpicu.
    cy.url().should('include', '/');

    // Setelah navigasi, baru tunggu panggilan API dari HomePage
    cy.wait('@getAllUsers');
    cy.wait('@getAllThreads');

    // Verifikasi redirection ke homepage
    cy.get('h1').contains('Forum Diskusi').should('be.visible');
    cy.get('.app-header .avatar-small').should('have.attr', 'alt', mockAuthUser.name);
    cy.get('.app-header').contains(mockAuthUser.name).should('be.visible');
    cy.get('.app-header button').contains('Logout').should('be.visible');
  });
});
// Pastikan ada satu baris kosong di akhir file (eol-last)
