import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import AuthController from '~/modules/auth/auth-controller';

/**
 * Creates OAuth callback middleware for handling authentication responses
 * @param provider - The OAuth provider name (e.g., 'google', 'facebook')
 * @returns Express middleware function
 */
const createOAuthCallback = (provider: 'google' | 'facebook') => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      provider,
      { session: false },
      function (err: any, user: any, info: any) {
        if (err) {
          console.error(`${provider} OAuth error:`, err);
          return res.redirect(
            `${process.env.CLIENT_URL}/auth/login?error=oauth_failed`
          );
        }

        if (!user) {
          const message = info?.message || 'authentication_failed';
          console.error(`${provider} OAuth failed:`, message);
          return res.redirect(
            `${process.env.CLIENT_URL}/auth/login?error=${encodeURIComponent(message)}`
          );
        }

        req.user = user;

        // Ensure errors are passed to Express error middleware
        Promise.resolve(AuthController.loginWithProvider(req, res)).catch(next);
      }
    )(req, res, next);
  };
};

export const googleOAuthCallback = createOAuthCallback('google');
export const facebookOAuthCallback = createOAuthCallback('facebook');

export default createOAuthCallback;
