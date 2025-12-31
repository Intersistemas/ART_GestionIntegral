module.exports = {
  apps: [
    {
      // Use SITE_NAME environment variable if provided by the runner, otherwise fallback
      name: process.env.SITE_NAME || 'ArtFrontGestionIntegral',
      // On Windows, pm2 may try to require the npm.cmd file as a Node module which fails.
      // Run npm through cmd.exe so the command executes correctly: `cmd /c npm start`.
      script: 'npm',
      args: 'start',
      interpreter: process.platform === 'win32' ? 'C:\\Windows\\System32\\cmd.exe' : undefined,
      interpreter_args: process.platform === 'win32' ? '/c' : undefined,
      // Capture logs to a deploy logs folder (runner should create/own this folder)
      out_file: './_deploy_logs/pm2_out.log',
      error_file: './_deploy_logs/pm2_err.log',
      env: {
        NODE_ENV: 'production',
        PORT: 8600
      }
    }
  ]
};
