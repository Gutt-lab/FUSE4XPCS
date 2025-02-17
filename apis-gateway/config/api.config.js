export const config = {
  version: process.env.API_VERSION || 'v1',
  basePath: process.env.API_BASE_PATH || 'api',
  endpoints: {
    users: {
      base: 'users',
      login: 'login',
      signup: 'signup',
      checkName: 'check-name-availability',
      location: 'location'
    }
  }
};

export const buildPath = (...parts) => {
  return '/' + [config.basePath, config.version, ...parts]
    .filter(Boolean)
    .join('/');
}; 