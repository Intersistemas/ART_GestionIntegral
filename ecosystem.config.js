module.exports = {
  apps: [
    {
      // Use SITE_NAME environment variable if provided by the runner, otherwise fallback
      name: process.env.SITE_NAME || 'ArtFrontGestionIntegral',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 8600
      }
    }
  ]
};
