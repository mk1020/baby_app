module.exports = {
   apps : [{
      name: "server",
      script: 'app.js',
      instances: "max",
      exec_mode: "cluster",
      watch: '.',
      script: './app.js',
      restart_delay: 2000,
      ignore_watch: ["node_modules"]
      env_production: {
         NODE_ENV: "production",
         HOST: 'localhost',
         PORT: 3000,
         PGHOST: 'localhost',
         PGUSER: 'postgres',
         PGDATABASE: 'baby_db',
         PGPASSWORD: '14774',
         PGPORT: 5432,
         PASS_SALT: '/3KrQX8U7PDVvRAkpqY'
      }
   }],
   deploy : {
      production : {
         user : 'SSH_USERNAME',
         host : 'SSH_HOSTMACHINE',
         ref  : 'origin/master',
         repo : 'GIT_REPOSITORY',
         path : 'DESTINATION_PATH',
         'pre-deploy-local': '',
         'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
         'pre-setup': ''
      }
   }
};