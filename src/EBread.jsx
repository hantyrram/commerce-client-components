import React, { useState,useEffect} from 'react';
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom';
import EntityBrowser from './EntityBrowser';
import EFormAdd from './EFormAdd'
import PropTypes from 'prop-types';


const EBread = (props)=>{

 const [entities,setEntities] = useState(props.entities); //pass this up when EBread is wrapped in a Feature, No Need to save state

 const onSave = (entity) => {
  console.log(entity);
  setEntities([...entities,entity]);//update to immediately reflect on entitybrowser
  props.onAdd(entity);//delegate
 }

 
 return(
  <div>
   <Router>
   <Link to={props.addPath} >Add</Link>
   <Switch>
    <Route path={props.addPath} render={()=><EFormAdd UISchema={props.UISchema} onSave={onSave} />} /> 
   </Switch>
   
   <EntityBrowser UISchema={props.UISchema} title="Users" entities={props.entities}  onRead={props.onRead} onEdit={props.onEdit} onDelete={props.onDelete}/>
  </Router>
  </div>
 )
}

export default EBread;