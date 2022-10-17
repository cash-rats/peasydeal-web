import { RemixStub } from "./RemixStub";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <RemixStub>
      <Story />
    </RemixStub>
  ),
];