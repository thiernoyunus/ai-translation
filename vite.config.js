import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = command === "serve";
  const aiOrigin = new URL(env.AI_URL).origin;

  return {
    define: {
      "process.env.AI_URL": JSON.stringify(isDev ? "/v1" : env.AI_URL),
      "process.env.AI_MODEL": JSON.stringify(env.AI_MODEL),
      "process.env.AI_KEY": JSON.stringify(env.AI_KEY),
    },
    server: {
      proxy: {
        "/v1": {
          target: aiOrigin,
          changeOrigin: true,
        },
      },
    },
  };
});
