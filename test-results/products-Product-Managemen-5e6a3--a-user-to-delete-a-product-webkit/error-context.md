# Page snapshot

```yaml
- heading "Inventory Manager" [level=1]
- paragraph: Sign in to your account
- text: Welcome Back Enter your credentials to access your inventory Email Address
- textbox "Email Address"
- text: Password
- textbox "Password": password123
- button
- alert: Email and password are required
- button "Sign In"
- button "Try Demo Account"
- paragraph:
  - text: Don't have an account?
  - link "Create one here":
    - /url: /auth/signup
- paragraph: "Demo Credentials:"
- paragraph: "Email: admin@inventory.com"
- paragraph: "Password: admin123"
- alert
```