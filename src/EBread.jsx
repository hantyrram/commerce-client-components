import React, { useState,useEffect} from 'react';
import {BrowserRouter as Router,Route,Link,Switch,withRouter} from 'react-router-dom';
import EntityBrowser from './EntityBrowser';
import EFormAdd from './EFormAdd';
import EFormRead from './EFormRead';
import PropTypes from 'prop-types';


const EBread = (props)=>{
 

 const [entities,setEntities] = useState(props.entities); //pass this up when EBread is wrapped in a Feature, No Need to save state
 const [currentAction,setCurrentAction] = useState("browse");

 const onSave = (entity) => {
  setEntities([...entities,entity]);//update to immediately reflect on entitybrowser
  props.onAdd(entity);//delegate
 }

 const onRead = (entity)=>{
  props.history.push(`${props.readPath.replace(":id",entity._id)}`,{entity});  
 }

 return(
  <div>
     <Route path={props.addPath} exact render={(props)=><EFormAdd UISchema={props.UISchema} onSave={onSave} {...props}/>} /> 
     <Route path={props.readPath} exact render={(props)=><EFormRead UISchema={props.UISchema} entity={props.location.state} onEdit={props.onEdit} onDelete={props.onDelete} {...props}/>} /> 
     <EntityBrowser UISchema={props.UISchema} title="Users" entities={props.entities}  
      onEdit={props.onEdit} onDelete={props.onDelete} readPath={props.readPath} addPath={props.addPath} onRead={onRead} />
  </div>
 )
}

// export default withRouter(EBread);
export default withRouter(EBread);