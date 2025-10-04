import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import AuthController from '~/modules/auth/auth-controller';

/**
 * Creates OAuth callback middleware for handling authentication responses
 * @param provider - The OAuth provider name (e.g., 'google', 'facebook')
 * @returns Express middleware function
 */
const createOAuthCallback = (provider: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(provider, function (err: any, user: any, info: any) {
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

      return AuthController.loginWithProvider(req, res);
    })(req, res, next);
  };
};

export const googleOAuthCallback = createOAuthCallback('google');
export const facebookOAuthCallback = createOAuthCallback('facebook');

export default createOAuthCallback;
