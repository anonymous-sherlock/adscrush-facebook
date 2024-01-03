/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/auth/error",
  "/sign-in/reset-password",
  "/sign-in/reset-password/step-2"
];

export const authPages = {
  login: "/sign-in",
  register: "/sign-up",
  resetPassWord: "/sign-in/reset-password",
};


/**
 * The default onboarding redirect path after logging in
 * @type {string}
 */
export const ONBOARDING_REDIRECT = "/onboarding"
/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
