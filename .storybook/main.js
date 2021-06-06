module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async config => {
    // Enable CSS modules for the css-loader
    const cssRule = config.module.rules[7];
    cssRule.use[1].options['modules'] = true;

    return config;
  }
}