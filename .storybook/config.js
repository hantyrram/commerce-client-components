import { configure,addDecorator} from '@storybook/react';
import StoryRouter from 'storybook-react-router'; //React Router Wrapper to be able to use react Router on components



function loadStories() {
  require('../src/Button.stories.js');
  require('../src/EntityForm.stories.js');
  require('../src/EForm.stories.js');
  require('../src/EFormAdd.stories.js');
  require('../src/EFormRead.stories.js');
  require('../src/EntityBrowser.stories.js');
  require('../src/EBread.stories.js');
  // You can require as many stories as you need.
}
addDecorator(StoryRouter());
configure(loadStories, module);