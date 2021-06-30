
module.exports = function config() {
      return {
              name: 'snowpack-config-resolveProxyImports-plugin',
              config(config) {
                  console.log("SNOW PLUG ONE -- ROGER THAT")
                        setTimeout(() => {
                                    config.buildOptions.resolveProxyImports = true
                                  })
                      },
            };
}

