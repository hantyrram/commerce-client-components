import { configure } from '@storybook/react';

function loadStories() {
 require('../src/Button.stories.js');
  require('../src/EntityForm.stories.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);