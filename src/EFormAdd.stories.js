import React from 'react';
import { storiesOf } from '@storybook/react';
import EFormAdd from './EFormAdd';
import ProductUISchema from './schemas/ProductUISchema';


class Entity{
 save(){
  console.log('Saving',this);
 }

 remove(){
  console.log('Deleting',this);
 }
}

function Product(){}

Product.prototype = Entity;

storiesOf('EFormAdd', module)
  .add('Add Form for a Product Entity', () => <EFormAdd UISchema={ProductUISchema} Entity={Product}/>);