const { createProxyMiddleware } = require('http-proxy-middleware');

// uncomment for testing
// console.log('Proxy middleware is being applied');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://nycfomo.com/',
      changeOrigin: true,
      secure: false, // Disable SSL verification (not recommended for production)
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding
      },
      logLevel: 'debug', // Enable detailed logging
      onProxyReq: (proxyReq, req, res) => {
        // Log additional details, uncomment for testing
        // console.log('Proxying request:', req.method, req.url);
        // console.log('Request headers:', req.headers);
        // console.log('Request body:', req.body);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong.');
      },
    })
  );
};
