export function selectEnv<T>(envs: { dev?: T; staging?: T; prod?: T }): T {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return envs.dev as T;
  } else if (
    process.env.NODE_ENV === 'production' &&
    process.env.REACT_APP_PROD_ENV === 'true'
  ) {
    return (envs.prod ?? envs.dev) as T;
  } else {
    return (envs.staging ?? envs.dev) as T;
  }
}
