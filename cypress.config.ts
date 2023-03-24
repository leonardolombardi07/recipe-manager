import { defineConfig } from "cypress";
import { authTasks } from "cypress/tasks";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      authTasks(on, config);
      return config;
    },
  },
});
