import { createDevApp } from '@backstage/dev-utils';
import { iframeFrotendWayPlugin, IframeFrotendWayPage } from '../src/plugin';

createDevApp()
  .registerPlugin(iframeFrotendWayPlugin)
  .addPage({
    element: <IframeFrotendWayPage />,
    title: 'Root Page',
    path: '/iframe-frotend-way',
  })
  .render();
