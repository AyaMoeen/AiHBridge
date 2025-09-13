# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])


```
reactapp
├─ .env
├─ build
│  ├─ asset-manifest.json
│  ├─ favicon.ico
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  ├─ robots.txt
│  └─ static
│     ├─ css
│     │  ├─ main.f855e6bc.css
│     │  └─ main.f855e6bc.css.map
│     ├─ js
│     │  ├─ 453.9ee576b5.chunk.js
│     │  ├─ 453.9ee576b5.chunk.js.map
│     │  ├─ main.d07e3984.js
│     │  ├─ main.d07e3984.js.LICENSE.txt
│     │  └─ main.d07e3984.js.map
│     └─ media
│        └─ logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.cjs
├─ public
│  ├─ favicon.ico
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  ├─ robots.txt
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ components
│  │  ├─ app-sidebar.tsx
│  │  ├─ common
│  │  │  ├─ AuthStatus.tsx
│  │  │  ├─ DemoCredentials.tsx
│  │  │  ├─ ProtectedRoute.tsx
│  │  │  └─ ThemeToggle.tsx
│  │  ├─ Header.tsx
│  │  ├─ HighlightedTools.tsx
│  │  ├─ nav-main.tsx
│  │  ├─ nav-projects.tsx
│  │  ├─ nav-user.tsx
│  │  ├─ RightBar.tsx
│  │  ├─ team-switcher.tsx
│  │  ├─ TrendingTools.tsx
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ input.tsx
│  │     ├─ InputWithIcon.tsx
│  │     ├─ label.tsx
│  │     ├─ LearnMoreButton.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     ├─ TextAreaWithButton.tsx
│  │     ├─ toggle.tsx
│  │     └─ tooltip.tsx
│  ├─ context
│  │  ├─ AuthContext.tsx
│  │  └─ ThemeContext.tsx
│  ├─ features
│  │  ├─ auth
│  │  │  ├─ components
│  │  │  │  └─ empty
│  │  │  ├─ forms
│  │  │  │  ├─ ForgotPasswordForm.tsx
│  │  │  │  ├─ LoginForm.tsx
│  │  │  │  ├─ ResetPasswordForm.tsx
│  │  │  │  └─ VerificationForm.tsx
│  │  │  ├─ pages
│  │  │  │  ├─ ForgotPasswordPage.tsx
│  │  │  │  ├─ LoginPage.tsx
│  │  │  │  ├─ ResetPasswordPage.tsx
│  │  │  │  └─ VerificationPage.tsx
│  │  │  └─ services
│  │  │     └─ authService.ts
│  │  └─ posts
│  │     ├─ components
│  │     │  ├─ Comment.tsx
│  │     │  ├─ Comments.tsx
│  │     │  ├─ DeletePostAlert.tsx
│  │     │  ├─ EditPostDialog.tsx
│  │     │  ├─ empty
│  │     │  ├─ FilterSelect.tsx
│  │     │  ├─ Post.tsx
│  │     │  ├─ PostContent.tsx
│  │     │  ├─ PostFooter.tsx
│  │     │  ├─ PostHeader.tsx
│  │     │  ├─ RatingDialog.tsx
│  │     │  ├─ RatingFace.tsx
│  │     │  └─ ShareAi.tsx
│  │     ├─ forms
│  │     │  └─ empty
│  │     ├─ mock-data
│  │     │  └─ mockPosts.ts
│  │     ├─ pages
│  │     │  └─ empty
│  │     └─ services
│  │        └─ empty
│  ├─ hooks
│  │  ├─ use-mobile.ts
│  │  ├─ useAuth.ts
│  │  └─ useTheme.ts
│  ├─ index.css
│  ├─ lib
│  │  └─ utils.ts
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ AboutusPage.tsx
│  │  ├─ ContactusPage.tsx
│  │  ├─ CreatePostPage.tsx
│  │  ├─ HomePage.tsx
│  │  ├─ MyPost.tsx
│  │  ├─ MySavedPost.tsx
│  │  ├─ PostDetails.tsx
│  │  ├─ ProfilePages.tsx
│  │  └─ SingUp.tsx
│  ├─ routes
│  │  └─ empty
│  ├─ services
│  │  ├─ authService.ts
│  │  └─ empty
│  ├─ types
│  │  ├─ auth.ts
│  │  └─ profile.ts
│  ├─ utils
│  │  ├─ passwordValidation.ts
│  │  └─ tokenManager.ts
│  └─ vite-env.d.ts
├─ tailwind.config.cjs
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ tsconfig.tsbuildinfo
└─ vite.config.ts

```