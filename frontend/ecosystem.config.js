module.exports = {
  apps: [{
    name: 'ita-frontend',
    script: 'node_modules/.bin/next',
    args: 'dev -p 3001',
    cwd: '/home/human/indian-trading-agent/frontend',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    exp_backoff_restart_delay: 100
  }]
};
