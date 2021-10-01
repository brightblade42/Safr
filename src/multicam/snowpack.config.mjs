// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
import  proxy  from 'http2-proxy';

export default  {
/*
    optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
  } ,
 */
  mount: {
    /* ... */
    "public": "/",
    "src" : "/_dist_"
  },
  plugins: [
    /* ... */
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-typescript',
      'snowpack-plugin-relative-css-urls',

  ],
  packageOptions: {
      namedExports: ['media-stream-library/MessageType']
    /* ... */
  },
  devOptions: {
    /* ... */
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    /* ... */
  },
  routes: [
      {
        src: '/api/fr/.*',
        dest: (req, res) => {

            return proxy.web(req, res, {
                hostname: 'localhost',
                port: 8085,
            });
        }
      },

  ]
};
