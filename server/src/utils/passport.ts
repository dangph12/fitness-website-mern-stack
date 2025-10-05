import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import AuthService from '~/modules/auth/auth-service';
import UserModel from '~/modules/users/user-model';
import UserService from '~/modules/users/user-service';

const configurePassport = () => {
  if (process.env.JWT_SECRET) {
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET
        },
        async (jwtPayload, done) => {
          try {
            const userId =
              jwtPayload.id ||
              jwtPayload._id ||
              jwtPayload.userId ||
              jwtPayload.sub;
            if (!userId) return done(null, false);

            const user = await UserModel.findById(userId);

            if (!user) {
              return done(null, false);
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: '/api/auth/facebook/callback',
          profileFields: ['id', 'displayName', 'photos', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await UserModel.findOne({
              email: profile.emails?.[0]?.value || ''
            });

            if (!user) {
              user = await UserService.create({
                email: profile.emails?.[0]?.value || '',
                name: profile.displayName || '',
                avatar: profile.photos?.[0]?.value || '',
                role: 'user'
              });
            }

            if (!user.isActive) {
              return done(null, false, {
                message: 'user_inactive'
              });
            }

            await AuthService.loginWithProvider('facebook', profile.id, user);

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await UserModel.findOne({
              email: profile.emails?.[0]?.value || ''
            });

            if (!user) {
              user = await UserService.create({
                email: profile.emails?.[0]?.value || '',
                name: profile.displayName || '',
                avatar: profile.photos?.[0]?.value || '',
                role: 'user'
              });
            }

            if (!user.isActive) {
              return done(null, false, {
                message: 'user_inactive'
              });
            }

            await AuthService.loginWithProvider('google', profile.id, user);

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }
};

export default configurePassport;
