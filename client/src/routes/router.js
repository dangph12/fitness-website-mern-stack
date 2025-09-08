import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const RootLayout = lazy(() => import('~/layouts/root-layout'));
const AuthLayout = lazy(() => import('~/layouts/auth-layout'));

const ErrorComponent = lazy(() => import('~/components/error'));

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: lazy(() => import('~/app/page'))
      },
      {
        path: 'playground',
        Component: lazy(() => import('~/app/playground/page'))
      },
      {
        path: 'profile',
        Component: lazy(() => import('~/app/profile/page'))
      }
    ],
    ErrorBoundary: ErrorComponent
  },
  {
    path: '/auth/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: lazy(() => import('~/app/auth/login/page'))
      },
      {
        path: 'sign-up',
        Component: lazy(() => import('~/app/auth/sign-up/page'))
      },
      {
        path: 'callback',
        Component: lazy(() => import('~/app/auth/callback/page'))
      },
      {
        path: 'forgot-password',
        Component: lazy(() => import('~/app/auth/forgot-password/page'))
      },
      {
        path: 'reset-password',
        Component: lazy(() => import('~/app/auth/reset-password/page'))
      }
    ]
  }
]);

export default router;
