import React, { useState,useEffect} from 'react';
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom';
import EntityBrowser from './EntityBrowser';
import EFormAdd from './EFormAdd'
import PropTypes from 'prop-types';

const EBread = (props)=>{

 const [entities,setEntities] = useState(props.entities); //pass this up when EBread is wrapped in a Feature, No Need to save state

 const onSave = (entity) => {
  console.log(entity);
  setEntities([...entities,entity]);
 }

 const onEdit = (entity)=>console.log("Editing Entity",entity);

 const onDelete = (entity)=> console.log("Deleting Entity",entity);

 const onRead = (entity)=>console.log("Reading Entity",entity);

 return(
  <div>
   <Router>
   <Switch>
    <Route path='/users/add' render={()=><EFormAdd UISchema={props.UISchema} onSave={onSave} />} /> 
   </Switch>
   <Link to="/users/add" >Add</Link>
   <EntityBrowser UISchema={props.UISchema} title="Users" entities={entities} onRead={onRead} onEdit={onEdit} onDelete={onDelete}/>
  </Router>
  </div>
 )
}

export default EBread;