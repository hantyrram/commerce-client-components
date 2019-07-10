import React from 'react';
import { storiesOf } from '@storybook/react';
import EBrowser from './EBrowser';
import ProductUISchema from './schemas/ProductUISchema';
import products from './sample_entities/Products.json';

const searchableFields = [
 'product_name',
 'category'
];

const actionsProvider = function(entity){
   return [
      { type: 'edit', ui:'Edit' },
      { type: 'delete', ui:'Delete' },
   ]
}

const entitiesPromise = new Promise((res)=>{
 console.log('Promise Called');
//  res(entities);
})

const onRead = (entity)=>console.log(entity);
const onAdd = ()=>{
   return new Promise((res)=>{
     let t = setTimeout(()=>{
        res( {"_id":1236,"product_name":"Tuba","category":"NewCategory"})
     },2000);
   })
}
const onEdit = (entity)=>console.log(entity);
const onDelete = (entity)=>{
   console.log('Deleting');
   return new Promise((res,rej)=>{
      let t = setTimeout(()=>{
         res(true);
         clearTimeout(t);
      },5000);
   });
}

const innerEBrowserOnSelect = (selectedEntities)=>{
   //save this,
   console.log(selectedEntities);
}
const actions = [
   {
      type : 'select'
   },
   // {
   //    name: 'delete'
   // }
]

storiesOf('EBrowser', module)
  .add('EBrowser',() => 
      <EBrowser 
         uischema={ProductUISchema}
         entities={products} 
         entityIdentifier='name'
         onRead={onRead} 
         onAdd={onAdd}
         adderType="modal"
         adderModalTitle="This Will Be Added to permission"
         adderModalContent={()=>{
            return <EBrowser actions={[{type:'select'}]} entities={products} uischema={ProductUISchema} onSelect={innerEBrowserOnSelect}/>
            }
         }
         adderModalActions={
            [<button>Add Permission To Admin</button>]
         }
        
         onEdit={onEdit}
         onDelete={onDelete}
         searchable
         actions={actions}
         onSelect={(selectedEntities)=>{
            console.log(JSON.stringify(selectedEntities));
         }}
         // maxRowPerPage
         // maxRowExceeded
         searchableFields={searchableFields}
      />
);