// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
import  proxy  from 'http2-proxy';

export default  {
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



      //TODO: snowpack won't properly proxy out web socket! The workaround I'm useing is to use
      //Down and dirtoy workaround:
      // 1. use Allow CORS chrome extension.
      // 2. connect direcly to websocket host instead of routing through dev server proxy.
      //     -- remember to change the address or set a dev/prod switch in code to remove hardcode address.
      // Another hacky but works production from the fine people at NeedToGetShitDoneANDRunningOutOfTime Inc.
      //We'll come back to this when snowpack fixes it. It's a known problem.
      /*
      {
            src: '/socket/fr/.*',  //pattern might not be right, need *?
            upgrade: (req, socket, head) => {

                const defaultWSHandler = (err, req, socket, head) => {
                    console.log("HELLO MCFLY..WE want  a socket!");
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
