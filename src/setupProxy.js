var debug = require('debug')('harvest-app:proxy');

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/rest',
    createProxyMiddleware({
      changeOrigin: true,
			router: ( req ) => {
				const target = req.headers['x-target-url'];

				if ( target ) {
					debug(`[PROXY] Dynamic target URL: ${target}`);
					return target;
				}

				return 'http://localhost:3000';
			},

			on: {
				// Log the details of the request being proxied
				proxyReq: (proxyReq, req, res) => {
					// set the User-Agent
					proxyReq.setHeader('User-Agent', 'Harvest App');
					debug(`[PROXY] Proxying request to target: ${proxyReq.method} ${proxyReq.path}`);
					debug(`[PROXY] Proxying request headers:`, proxyReq._headers);
					debug(`[PROXY] ${proxyReq.method} ${proxyReq.path} ~> ${proxyReq.agent.protocol}//${proxyReq.getHeader('host')}${proxyReq.path}`);
				},

				// Log the response from the target server
				proxyRes: (proxyRes, req, res) => {
					debug(`[PROXY] Proxying response from target: ${proxyRes.statusCode}`);
				},

				// Log any errors
				error: (err, req, res) => {
					debug('[PROXY] Error occurred while proxying:', err);
				}
			}
    })
  );
};
