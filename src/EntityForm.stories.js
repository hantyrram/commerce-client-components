import React from 'react';
import { storiesOf } from '@storybook/react';
import EntityForm from './EntityForm';

storiesOf('EntityForm', module)
  .add('Add Form', () => (
    <EntityForm formType="add" schema={{name:1,permission:1}} onSubmit={function(){}} onChange={function(){}}/>
  ));