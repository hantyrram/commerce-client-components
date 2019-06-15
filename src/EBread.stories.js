import React from 'react';
import { storiesOf } from '@storybook/react';
import EBread from './EBread';
import ProductUISchema from './schemas/ProductUISchema';
import SampleProducts from './sample_entities/Products';

const onAdd = (entity)=>console.log('Adding Entity',entity);
const onEdit = (entity)=>console.log('Editing Entity',entity);
const onRead = (entity)=>console.log('Reading Entity',entity);
const onDelete = (entity)=>console.log('Deleting Entity',entity);

storiesOf('EBread', module)
  .add('EBread', () => <EBread UISchema={ProductUISchema} addPath="/products/add" entities={SampleProducts} {...{onAdd,onEdit,onRead,onDelete}}/>);