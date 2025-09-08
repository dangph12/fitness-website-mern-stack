import { configureStore } from '@reduxjs/toolkit';

import authReducer from '~/store/features/auth-slice';
import avatarReducer from '~/store/features/avatar-slice';

export default configureStore({
  reducer: {
    auth: authReducer,
    avatar: avatarReducer
  }
});
