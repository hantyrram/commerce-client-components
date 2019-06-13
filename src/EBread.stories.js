import React from 'react';
import { storiesOf } from '@storybook/react';
import EBread from './EBread';
import ProductUISchema from './schemas/ProductUISchema';
import SampleProducts from './sample_entities/Products';


storiesOf('EBread', module)
  .add('EBread', () => <EBread UISchema={ProductUISchema} entities={SampleProducts}/>);