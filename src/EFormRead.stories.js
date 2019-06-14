import React from 'react';
import { storiesOf } from '@storybook/react';
import EFormRead from './EFormRead';
import ProductUISchema from './schemas/ProductUISchema';
import products from './sample_entities/Products';
const SampleProduct = products[0];


function onSave(e){
 console.log('Saving', e);
}

function onDelete(e){
 console.log('Deleting', e);
}

storiesOf('EFormRead', module)
  .add('View Permission Entity', () => <EFormRead UISchema={ProductUISchema}  entity={SampleProduct} onSave={onSave} onDelete={onDelete}/>);