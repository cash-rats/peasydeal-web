import { installGlobals } from "@remix-run/node";
import "@testing-library/jest-dom/extend-expect";

installGlobals();

beforeAll(() => {
  process.env.REDIST_PORT = import.meta.env.VITE_REDIS_PORT;
  process.env.REDIS_HOST = import.meta.env.VITE_REDIS_HOST;
  window.ENV = {}
  window.ENV.ENV = {
    MYFB_ENDPOINT: import.meta.env.VITE_MYFB_ENDPOINT,
    PEASY_DEAL_ENDPOINT: import.meta.env.VITE_PEASY_DEAL_ENDPOINT
  }
})
