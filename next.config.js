const withPlugins = require("next-compose-plugins");
const path = require("path");

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
};

module.exports = nextConfig;
