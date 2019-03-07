// next.config.js
const path = require("path");
const withCSS = require("@zeit/next-css");
const Dotenv = require("dotenv-webpack");

module.exports = withCSS({
  /* config options here */
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    // Perform customizations to webpack config
    // Important: return the modified config
    config.resolve.alias = {
      "<components>": path.resolve(__dirname, "./components"),
      "<actions>": path.resolve(__dirname, "./stores/actions"),
      "<reducers>": path.resolve(__dirname, "./stores/reducers"),
      "<utils>": path.resolve(__dirname, "./utils"),
      "<routes>": path.resolve(__dirname, "./routes")
    };
    new Dotenv({
      path: path.join(__dirname, ".env"),
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true // hide any errors
    });

    return config;
  }
});
