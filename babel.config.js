const plugins = [
  [
    "@babel/plugin-transform-runtime",
    {
      helpers: true,
      // regenerator: true,
    },
  ],
  ["@babel/plugin-proposal-decorators", { legacy: true }],
  "@babel/plugin-transform-flow-strip-types",
  ["@babel/plugin-proposal-class-properties", { loose: false }],
];

module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["@babel/preset-env"],
    plugins,
    env: {
      test: {
        plugins: [...plugins, "@babel/plugin-transform-modules-commonjs"],
      },
    },
  };
};
