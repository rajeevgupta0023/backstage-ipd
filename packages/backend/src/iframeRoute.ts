import { PluginEnvironment } from '../types';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import fetch from 'node-fetch';
import Router from 'express-promise-router';
import Request from 'express-promise-router';
import Response from 'express-promise-router';
import NextFunction from 'express-promise-router';
import { HttpAuthService, HttpRouterService, LoggerService  } from '@backstage/backend-plugin-api';

// res.setHeader('X-Frame-Options', 'ALLOWALL');
// res.setHeader('Content-Security-Policy', "frame-ancestors *");

export async function createRouter({
  logger,
  httpAuth,
  httpRouter
  // todoListService,
}: {
  logger: LoggerService;
  httpAuth: HttpAuthService;
  httpRouter: HttpRouterService;
  // todoListService: TodoListService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  httpRouter.addAuthPolicy({
    path: '/myiframe',
    allow: 'unauthenticated',
  });

   router.use(
    '/myiframe', (req, res, next) => {
      const url = req.query.url;
      if (!url || typeof url !== 'string') {
         return res.status(400).send('Missing ?url param');
      }

      createProxyMiddleware({
        target: url, // or dynamic target
        changeOrigin: true,
        selfHandleResponse: false, // let proxy handle the response fully
        onProxyReq(proxyReq) {
          // optionally add headers or auth tokens
          // if (req.headers.cookie) {
          //   proxyReq.setHeader('cookie', req.headers.cookie);
          // }
        },
        onProxyRes(proxyRes, req, res) {
          const cookies = proxyRes.headers['set-cookie'];
          if (cookies) {
            const newCookies = cookies.map(cookie => 
              // Rewrite cookie domain if necessary
              cookie.replace(/Domain=[^;]+/, 'Domain=localhost')  // cookie.replace(/Path=\/name/, 'Path=/')
            );
            res.setHeader('Set-Cookie', newCookies);
          }// optionally modify headers, e.g., allow embedding
          res.setHeader('X-Frame-Options', 'ALLOWALL');
          res.setHeader('Content-Security-Policy', 'frame-ancestors *');
          // proxyReq.setHeader('X-Real-IP', req.ip);
          // proxyReq.setHeader('X-Forwarded-For', req.headers['x-forwarded-for'] || req.ip);
        },
        cookieDomainRewrite: '', // ensures cookies are set for the browser domain
        followRedirects: true,
      })(req, res, next);
    }
  );



  // router.get('/myiframe', async (req, res) => {
  //     let user = 'Anonymous';
  //     try {
  //       const creds = await httpAuth.credentials(req, { allow: ['user'] });
  //       user = creds.principal.userEntityRef;
  //     } catch {
  //       // no creds available, keep "Anonymous"
  //     }
  //     const { url } = req.query;
  //     if (!url || typeof url !== 'string') {
  //       res.status(400).send('Missing ?url param');
  //       return;
  //     }

  //     logger.info(`Serving /myiframe for user: ${user}`);
  //     // res.setHeader('X-Frame-Options', 'ALLOWALL');
  //     // res.setHeader('Content-Security-Policy', "frame-ancestors *");

  //     try {
  //       const upstreamRes = await fetch(url);
  //       const body = await upstreamRes.text();

  //       // Override headers to allow embedding
  //       res.setHeader('X-Frame-Options', 'ALLOWALL');
  //       res.setHeader('Content-Security-Policy', "frame-ancestors *");
  //       res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'text/html');

  //       logger.info(`Serving /myiframe for user: ${user}, url: ${url}`);
  //       res.send(body);
  //     } catch (e: any) {
  //       logger.error(`Failed to fetch ${url}: ${e.message}`);
  //       res.status(500).send(`Failed to fetch ${url}`);
  //     }


      // res.send(`
      //   <!DOCTYPE html>
      //   <html>
      //     <head>
      //       <title>Hello World</title>
      //     </head>
      //     <body>
      //       <h1>Hello World!</h1>
      //       <p>This page is served from the backend router.</p>
      //       <p>User: ${user}</p>
      //     </body>
      //   </html>
      // `);
    // });

  return router;
}
