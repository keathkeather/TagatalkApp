import { createAction } from '@reduxjs/toolkit';

// Define a simple action creator
// redux/initMiddlewareAction.js
export const INIT_MIDDLEWARE = 'INIT_MIDDLEWARE';

export const initMiddlewareAction = () => ({
  type: INIT_MIDDLEWARE,
});
