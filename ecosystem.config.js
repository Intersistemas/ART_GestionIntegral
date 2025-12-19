module.exports = {
  apps: [
    {
      name: 'art_gestionintegral',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 8600
      }
    }
  ]
};
