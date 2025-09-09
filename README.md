
```
AiHBridge
├─ accounts
│  ├─ admin.py
│  ├─ apps.py
│  ├─ migrations
│  │  └─ __init__.py
│  ├─ models.py
│  ├─ serializers.py
│  ├─ tests.py
│  ├─ urls.py
│  ├─ utils.py
│  ├─ views.py
│  └─ __init__.py
├─ core
│  ├─ apps.py
│  ├─ management
│  │  ├─ commands
│  │  │  ├─ seed.py
│  │  │  └─ __init__.py
│  │  └─ __init__.py
│  └─ __init__.py
├─ interactions
│  ├─ admin.py
│  ├─ apps.py
│  ├─ migrations
│  │  └─ __init__.py
│  ├─ mixins.py
│  ├─ models.py
│  ├─ serializers.py
│  ├─ services.py
│  ├─ tests.py
│  ├─ urls.py
│  ├─ views.py
│  └─ __init__.py
├─ manage.py
├─ media
│  └─ profile_pics
│     ├─ defaultpic.png
│     ├─ test.png
│     ├─ test_nLGjkuL.png
│     ├─ test_sJ9edCH.png
│     └─ YousefJaar.PNG
├─ poetry.lock
├─ posts
│  ├─ admin.py
│  ├─ apps.py
│  ├─ migrations
│  │  └─ __init__.py
│  ├─ models.py
│  ├─ serializers.py
│  ├─ tests.py
│  ├─ urls.py
│  ├─ views.py
│  └─ __init__.py
├─ profiles
│  ├─ admin.py
│  ├─ apps.py
│  ├─ migrations
│  │  └─ __init__.py
│  ├─ models.py
│  ├─ serializers.py
│  ├─ signals.py
│  ├─ tests.py
│  ├─ urls.py
│  ├─ views.py
│  └─ __init__.py
├─ project
│  ├─ asgi.py
│  ├─ settings.py
│  ├─ urls.py
│  ├─ wsgi.py
│  └─ __init__.py
├─ pyproject.toml
├─ reactapp
│  ├─ .env
│  ├─ build
│  │  ├─ asset-manifest.json
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  ├─ robots.txt
│  │  └─ static
│  │     ├─ css
│  │     │  ├─ main.f855e6bc.css
│  │     │  └─ main.f855e6bc.css.map
│  │     ├─ js
│  │     │  ├─ 453.9ee576b5.chunk.js
│  │     │  ├─ 453.9ee576b5.chunk.js.map
│  │     │  ├─ main.d07e3984.js
│  │     │  ├─ main.d07e3984.js.LICENSE.txt
│  │     │  └─ main.d07e3984.js.map
│  │     └─ media
│  │        └─ logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg
│  ├─ components.json
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.cjs
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  ├─ robots.txt
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ app-sidebar.tsx
│  │  │  ├─ common
│  │  │  │  ├─ AuthStatus.tsx
│  │  │  │  ├─ DemoCredentials.tsx
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  └─ ThemeToggle.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ HighlightedTools.tsx
│  │  │  ├─ nav-main.tsx
│  │  │  ├─ nav-projects.tsx
│  │  │  ├─ nav-user.tsx
│  │  │  ├─ RightBar.tsx
│  │  │  ├─ team-switcher.tsx
│  │  │  ├─ TrendingTools.tsx
│  │  │  └─ ui
│  │  │     ├─ avatar.tsx
│  │  │     ├─ badge.tsx
│  │  │     ├─ breadcrumb.tsx
│  │  │     ├─ button.tsx
│  │  │     ├─ card.tsx
│  │  │     ├─ collapsible.tsx
│  │  │     ├─ dialog.tsx
│  │  │     ├─ dropdown-menu.tsx
│  │  │     ├─ form.tsx
│  │  │     ├─ input.tsx
│  │  │     ├─ InputWithIcon.tsx
│  │  │     ├─ label.tsx
│  │  │     ├─ LearnMoreButton.tsx
│  │  │     ├─ select.tsx
│  │  │     ├─ separator.tsx
│  │  │     ├─ sheet.tsx
│  │  │     ├─ sidebar.tsx
│  │  │     ├─ skeleton.tsx
│  │  │     ├─ tabs.tsx
│  │  │     ├─ textarea.tsx
│  │  │     ├─ TextAreaWithButton.tsx
│  │  │     ├─ toggle.tsx
│  │  │     └─ tooltip.tsx
│  │  ├─ context
│  │  │  ├─ AuthContext.tsx
│  │  │  └─ ThemeContext.tsx
│  │  ├─ features
│  │  │  ├─ auth
│  │  │  │  ├─ components
│  │  │  │  │  └─ empty
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ ForgotPasswordForm.tsx
│  │  │  │  │  ├─ LoginForm.tsx
│  │  │  │  │  ├─ ResetPasswordForm.tsx
│  │  │  │  │  └─ VerificationForm.tsx
│  │  │  │  ├─ pages
│  │  │  │  │  ├─ ForgotPasswordPage.tsx
│  │  │  │  │  ├─ LoginPage.tsx
│  │  │  │  │  ├─ ResetPasswordPage.tsx
│  │  │  │  │  └─ VerificationPage.tsx
│  │  │  │  └─ services
│  │  │  │     └─ authService.ts
│  │  │  └─ posts
│  │  │     ├─ components
│  │  │     │  ├─ Comment.tsx
│  │  │     │  ├─ Comments.tsx
│  │  │     │  ├─ DeletePostAlert.tsx
│  │  │     │  ├─ EditPostDialog.tsx
│  │  │     │  ├─ empty
│  │  │     │  ├─ FilterSelect.tsx
│  │  │     │  ├─ Post.tsx
│  │  │     │  ├─ PostContent.tsx
│  │  │     │  ├─ PostFooter.tsx
│  │  │     │  ├─ PostHeader.tsx
│  │  │     │  ├─ RatingDialog.tsx
│  │  │     │  ├─ RatingFace.tsx
│  │  │     │  └─ ShareAi.tsx
│  │  │     ├─ forms
│  │  │     │  └─ empty
│  │  │     ├─ mock-data
│  │  │     │  └─ mockPosts.ts
│  │  │     ├─ pages
│  │  │     │  └─ empty
│  │  │     └─ services
│  │  │        └─ empty
│  │  ├─ hooks
│  │  │  ├─ use-mobile.ts
│  │  │  ├─ useAuth.ts
│  │  │  └─ useTheme.ts
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  └─ utils.ts
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ AboutusPage.tsx
│  │  │  ├─ ContactusPage.tsx
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ MyPost.tsx
│  │  │  ├─ MySavedPost.tsx
│  │  │  ├─ PostDetails.tsx
│  │  │  ├─ ProfilePages.tsx
│  │  │  └─ SingUp.tsx
│  │  ├─ routes
│  │  │  └─ empty
│  │  ├─ services
│  │  │  ├─ authService.ts
│  │  │  └─ empty
│  │  ├─ types
│  │  │  ├─ auth.ts
│  │  │  └─ profile.ts
│  │  ├─ utils
│  │  │  ├─ passwordValidation.ts
│  │  │  └─ tokenManager.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.cjs
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  ├─ tsconfig.tsbuildinfo
│  └─ vite.config.ts
└─ search
   ├─ admin.py
   ├─ apps.py
   ├─ migrations
   │  └─ __init__.py
   ├─ models.py
   ├─ serializers.py
   ├─ tests.py
   ├─ urls.py
   ├─ utils.py
   ├─ views.py
   └─ __init__.py

```