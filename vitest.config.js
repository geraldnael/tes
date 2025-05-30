// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // This line enables Jest-like globals (describe, it, expect, jest)
    environment: 'jsdom', // If you are testing React components, you need a DOM environment
    // You might also want to add setupFiles if you have a test setup file
    // setupFiles: './src/setupTests.js',
  },
});
