import React from 'react';
import { storiesOf } from '@storybook/react';

import EBread from './EBread';
import ProductUISchema from './schemas/ProductUISchema';
import SampleProducts from './sample_entities/Products';
import StoryRouter from 'storybook-react-router';
const onAdd = (entity)=>console.log('Adding Entity',entity);
const onEdit = (entity)=>console.log('Editing Entity',entity);
const onRead = (entity)=>console.log('Reading Entity',entity);
const onDelete = (entity)=>console.log('Deleting Entity',entity);
const readPath = "/products/:id";
const addPath = "/products/add";
storiesOf('EBread', module)
  .addDecorator(StoryRouter())
  .add('EBread', () => <EBread addPath={addPath} readPath={readPath} UISchema={ProductUISchema} entities={SampleProducts} {...{onAdd,onEdit,onRead,onDelete}}/>);