//Perform Browse, Read, Add, edit, delete and other special functionalities
//Minimum products required = products_read for this feature to appear on the menu
//displayed as productss
//Under User Management Feature Group

//how Feature works
//feature advertises the supported actions it can do, each action requires certain products action name maps to products name
 //E.g. productss.supportedActions = [products_browse,products_read,products_edit]
 // Action = {name:products_browse,route:<if any e.g. delete is not a routable feature>}



 import React, { useState, useEffect} from 'react';
 import PropTypes from 'prop-types';
 // import featureGroups from '../featureGroups';
 import EBread from './EBread';
 // import {
 //  products_create as addproducts,
 //  products_edit as updateproducts,
 //  products_delete as removeproducts,
 //  products_browse as fetchproductss,
 // } from '../requesters';
 
 import samples from './sample_entities/Products.json';
 import UISchema from './schemas/ProductUISchema';
 // const fetchproducts = Promise.resolve(products);

 function Products(props){

  const [products,setProducts] = useState([]);
  const onAdd = (entity)=>console.log('Adding Entity',entity);
  const onEdit = (entity)=>console.log('Editing Entity',entity);
  const onRead = (entity)=>console.log('Reading Entity',entity);
  const onDelete = (entity)=>console.log('Deleting Entity',entity);

  const ADD_PRODUCT_PATH = "/products/add";
  const READ_PRODUCT_PATH = "/products/:id";
  const EBreadConfig = {
   UISchema,
   ...{onAdd,onEdit,onRead,onDelete},
   addPath: ADD_PRODUCT_PATH,
   readPath: READ_PRODUCT_PATH,
   entities:products,
   title: "Products"
  };

  useEffect(()=>{
   //emitates api call fetchproducts
   Promise.resolve(samples).then(p=>{
    setProducts(p);
   })
  });
 

  return (
   <div className="feature">
    {/* <EBread UISchema={schema} {...{onAdd,onEdit,onRead,onDelete}} addPath={ADD_PRODUCT_PATH} entities={products} title="Products"/> */}
    <EBread {...EBreadConfig}/>
   </div>
  );
 
 }
 
 //Minimum Required products for the feature to be available
 Object.defineProperty(Products,'path',{ get: () => '/products'});
 Object.defineProperty(Products,'featureGroup',{ get: () => 'User Management'});
 // Object.defineProperty(productss,'primaryLink',{ get: () => true});
 Object.defineProperty(Products,'requiredPermissions',{ get: () => 'products_read' });
 

 export default Products;