// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
import  proxy  from 'http2-proxy';

export default  {
 optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
  },
  mount: {
    /* ... */
    "src/Safr.Client/public": "/",
    "src/Safr.Client/src" : "/_dist_"
  },
  plugins: [
    /* ... */
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-typescript',
      ['./snowplug1.js'],
    '@jadex/snowpack-plugin-tailwindcss-jit' //temp fix for spack/jit issue

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



      //TODO: snowpack won't properly proxy our web socket! The dirty workaround I'm using is:
      // 1. use the Allow CORS chrome extension.
      // 2. connect direcly to websocket host url in code instead of routing through dev server proxy.
      //     -- remember to change the address or set a dev/prod switch in code to remove hardcode address.
      // Another hacky but works production from the fine people at NeedToGetShitDoneANDRunningOutOfTime Inc.
      //We'll come back to this when snowpack fixes it or I realize I was doing something stupid.
      /*
      {
            src: '/socket/fr/.*',  //pattern might not be right, need *?
            upgrade: (req, socket, head) => {

                const defaultWSHandler = (err, req, socket, head) => {
                  if (err) {
                    console.error('proxy error', err);
                    socket.destroy();
                  }
                };


                proxy.ws(
                  req,
                  socket,
                  head,
                  {
                    hostname: 'localhost',
                    port: 8085,
                  },
                  defaultWSHandler,
                );
              },
       },

       */

  ]
};
