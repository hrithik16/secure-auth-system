# Authentication System

## Overview

This project implements a basic authentication system with features such as **login**, **logout**, **forgot password**, and **reset password**.

## Features

- **Login:** Users can log in with their credentials.
- **Logout:** Users can log out to end their session.
- **Forgot Password:** Users can request a password reset.
- **Reset Password:** Users can reset their password using a secure token.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** (or your database of choice)
- **bcrypt.js** (for password hashing)
- **nodemailer** (for sending emails)
- **Express Session** (for session management)

## Setup

1. Clone the repository: `git clone [repository_url]`
2. Install dependencies: `npm install`
3. Set up your database configuration in `config.js` (or any other configuration file you use).
4. Set up your email configuration in `config.js`.
5. Start the application: `npm start`

## Usage

1. Visit the **login page** and enter your credentials.
2. Use the **forgot password** link if you need to reset your password.
3. **Log out** when you are done.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
