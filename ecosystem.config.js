module.exports = {
  apps: [
    {
      name: "mr-black",
      script: "server.js",
      cwd: "./.next/standalone",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3990,
      },
    },
  ],
};
