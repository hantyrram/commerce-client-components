import React, { useState,useEffect} from 'react';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
import EntityBrowser from './EntityBrowser';
import EFormAdd from './EFormAdd'
import PropTypes from 'prop-types';
import { Object } from 'core-js';




let UISchema = {
 name : {
  el : "input",//element tag
  label: "_id",//label of the element
  attributes : {//element attributes
   name : "_id",//currently required,see ?? improvement comment on EntityForm
   id:"permission-name",
   type: "text",
   minLength: 1,
   maxLength: 30
  }
 },
 label : {
  el : "input",
  label: "Username",
  attributes : {
   name : "username",
   id:"username",
   type:"text",
   minLength: 1,
   maxLength: 35
  }
 },
 // category : {
 //  el: "select",
 //  label: "Category",
 //  attributes: {
 //   name: "category",
 //   id: "product_category",
 //   defaultValue:"WineID" //default selected value
 //  },
  
 //  options: [ //required if el = "select"
 //   {value: "SpiritID",text:"Spirit"},
 //   {value: "BeerID",text:"Beer"},
 //   {value: "WineID",text:"Wine"}
 //  ]
 // }
}


const EBread = (props)=>{

 
 const [entities,setEntities] = useState([
  {_id:1234,username:"ron"},
  {_id:12345,username:"ronskie"},
 ]);

 const onSave = (entity) => {
  setEntities([...entities,entity]);
 }


 
 const onEdit = (entity)=>console.log("Editing Entity",entity);

 const onDelete = (entity)=> console.log("Deleting Entity",entity);

 const onRead = (entity)=>console.log("Reading Entity",entity);

 return(
  <div>
   {JSON.stringify(entities)}
   <button onClick={onSave.bind(this,{_id:11,username:"genesis"})}>Click Me</button>
   <Router>
   <Route path='/users/add' render={()=><EFormAdd UISchema={UISchema} onSave={onSave} />} />
   <Link to="/users/add" >Add</Link>
   <EntityBrowser title="Users" entities={entities} onRead={onRead} onEdit={onEdit} onDelete={onDelete}/>
  </Router>
  </div>
 )
}

export default EBread;