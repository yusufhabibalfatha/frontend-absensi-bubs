import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// ESM tidak punya __dirname, jadi kita definisikan sendiri
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, "cert/localhost-key.pem")),
    //   cert: fs.readFileSync(path.resolve(__dirname, "cert/localhost.pem")),
    // },
    host: "localhost",
    port: 5173,
  },
});
