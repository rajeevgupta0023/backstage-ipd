import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const iframeFrotendWayPlugin = createPlugin({
  id: 'iframe-frotend-way',
  routes: {
    root: rootRouteRef,
  },
});

export const IframeFrotendWayPage = iframeFrotendWayPlugin.provide(
  createRoutableExtension({
    name: 'IframeFrotendWayPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
