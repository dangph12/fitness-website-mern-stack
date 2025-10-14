import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const RootLayout = lazy(() => import('~/layouts/root-layout'));
const AuthLayout = lazy(() => import('~/layouts/auth-layout'));
const AdminLayout = lazy(() => import('~/layouts/admin-layout'));

const ErrorComponent = lazy(() => import('~/components/error'));
const PrivateRoute = lazy(() => import('~/components/private-route'));

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
      },
      {
        path: 'nutrition',
        Component: lazy(() => import('~/app/nutrition/page'))
      },
      {
        path: 'nutrition/create-meal',
        Component: lazy(() => import('~/app/nutrition/create-meal/page'))
      },
      {
        path: 'nutrition/food/:foodId',
        Component: lazy(() => import('~/app/nutrition/food/[id]/page'))
      },
      {
        path: 'nutrition/edit-meal/:id',
        Component: lazy(() => import('~/app/nutrition/edit-meal/page'))
      },
      {
        path: 'exercise',
        Component: lazy(() => import('~/app/exercises/page'))
      },
      {
        path: 'exercise/:id',
        Component: lazy(() => import('~/app/exercises/[id]/page'))
      },
      {
        path: 'onboarding',
        Component: lazy(() => import('~/app/onboarding/page'))
      },
      {
        path: 'workouts',
        Component: lazy(() => import('~/app/workouts/workouts-list/page'))
      },
      {
        path: 'workouts/create-workout',
        Component: lazy(() => import('~/app/workouts/create-workout/page'))
      },
      {
        path: 'plans/rountine-builder',
        Component: lazy(() => import('~/app/plans/rountine-builder/page'))
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
  },
  {
    path: '/admin',
    children: [
      {
        path: 'login',
        Component: AuthLayout,
        children: [
          {
            index: true,
            Component: lazy(() => import('~/app/admin/login/page'))
          }
        ]
      },
      {
        path: '',
        Component: () => (
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout />
          </PrivateRoute>
        ),
        // Component: AdminLayout,
        children: [
          {
            index: true,
            Component: lazy(() => import('~/app/admin/page'))
          },
          {
            path: 'manage-users',
            Component: lazy(() => import('~/app/admin/manage-users/page'))
          },
          {
            path: 'manage-users/create',
            Component: lazy(
              () => import('~/app/admin/manage-users/create-user/page')
            )
          },
          {
            path: 'manage-users/update/:id',
            Component: lazy(
              () => import('~/app/admin/manage-users/update-user/page')
            )
          }
        ]
      }
    ]
  }
]);

export default router;
