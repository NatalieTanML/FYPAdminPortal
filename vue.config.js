/* https://cli.vuejs.org/config/#target-browsers */
/* This file is placed next to the package.json */
// You provide configurations to proxy HTTP calls to your APIs running on localhost
// Coding note: Took hours to find some hints how to proxy api calls.
// Reference: https://stackoverflow.com/questions/50912749/vue-proxy-setting-does-not-work 
   module.exports = {
    configureWebpack: {
        devtool: 'source-map'/* https://medium.com/@marshallswain/debugging-a-new-vue-cli-app-with-vs-code-ade4945e75f0 */
      },
    devServer: {
        proxy: {
          '/api': {
            target: 'https://localhost:44393',
            ws: true,
            changeOrigin: true
          }
        }
      }
    
   

    
  }