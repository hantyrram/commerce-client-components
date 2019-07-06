import React, { useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import {ComponentContainer} from '../styled';
import PropTypes from 'prop-types';
/**
 * EFormRead supports the Read functionality of BREAD.
 * @constructor
 * @param {Object} props - React.props
 * @param {Object} props.UISchema - The UISchema that describes the elements of the form.
 * @param {Entity} [props.Entity] - The Entity that is being presented by the Form.
 * @param {Entity} props.entity - The entity instance/object that is being presented by the Form.
 * @param {Number} [props.editorPath] - If 1 the Edit button is enabled.
 * @param {function} [props.onEdit] - Handler for edit button, accepts entity as param.
 * @param {function} [props.onDelete] - Handler for delete button, accepts entity as param..
 * @param {function} [props.onSave] - Handler for save button, accepts entity as param..
 * @param {string} props.identifier - Part of the entity that will be used as identifier. e.g _id
 */
export default function EForm(props){

 if(!props.identifier && props.type !== 'adder'){
  throw new Error('Identifier must be present on a non adder type');
 }
 
 const IDENTIFIER = props.identifier;

 const [entity,setEntity] = useState(props.entity ? Object.assign({},props.entity): {});

 useEffect(()=> {
  if(props.type && props.type !== 'adder'){
   
   if(entity[IDENTIFIER] !== props.entity[IDENTIFIER]){
    setEntity(Object.assign({},props.entity));
   }
  }
 },[entity,IDENTIFIER,props.entity,props.type]);

 useEffect(()=>{
  return ()=>{console.log('Unmounting')};
 });
 
 if(!props.UISchema) return "No Schema";

 if(props.type && props.type !== 'adder' && !entity) return "No Entity";//non - adder type requires entity

 const saveButtonClickHandler = (e)=>{
  props.onSave(entity);
 }
 
 const onChangeHandler = e => {
  setEntity(Object.assign(entity,{[e.target.name]:e.target.value}));
 }
 
 const renderEditButton = () => 
  props.editorPath ? 
   <Button variant="contained" size="medium" color="primary">
    <Link style={{textDecoration:"none",color:"inherit"}} to = { {pathname:props.editorPath.replace(":identifier",entity[IDENTIFIER]),state:{entity}} }> 
     Edit 
    </Link> 
   </Button>
   
  : null;
  
 const renderDeleteButton = () => props.onDelete ? <Button variant="contained" size="medium" color="secondary" > Delete <DeleteIcon /></Button> : null;

 const renderSaveButton = () => props.onSave ? <Button variant="contained" size="medium" color="primary" className="action-button" onClick={saveButtonClickHandler}>Save</Button>:null;

 const readerActions = ()=> 
  <div className="eform-actions" style={{textAlign:"right"}}>
   {[renderEditButton(),renderDeleteButton()]}
  </div>;

 const editorActions = ()=> 
 <div className="eform-actions" style={{textAlign:"right"}}>
  {[renderSaveButton(),renderDeleteButton()]}
 </div>;

 const adderActions = () => 
  <div className="eform-actions" style={{textAlign:"right"}}>
  {[renderSaveButton()]}
  </div>;

 let renderActions = null;
 //type reader,editor,adder
 switch(props.type){
  case 'reader': 
  renderActions = readerActions;
   break;
  case 'editor':
  renderActions = editorActions;
   break;
  default :
  renderActions = adderActions;
 }



 const renderElements = ()=>{

  let elements = [];

  
  for(let key of Object.keys(props.UISchema)){
   //if prop contains the current key,use that as the component.
   if(props[key]){
    let Element = props[key];
           
    elements.push(
          <>
           <div className="eform-inputgroup">
            <label htmlFor={key}>{key.replace(/^[a-z]/,key.charAt(0).toUpperCase())}</label>
           </div>
           <Element />
          </>
           );
    continue;
   }

   let element;
   let attributes;
   if(props.type === 'adder' || !props.type){
    if(props.UISchema[key].attributes && props.UISchema[key].attributes.readOnly) continue; //skip readOnly fields on Add
    element = props.UISchema[key];
    attributes = { ...element.attributes, onChange:onChangeHandler, defaultValue: element.attributes.defaultValue || ""};
    
   }else{
    element = props.UISchema[key]; //input
    let value = entity && entity[key]? entity[key] : null;
    attributes = { ...element.attributes }; //add the onChangeHandler prop as additional attribute
    //the reason value is checked is value won't exist on type 'adder';
    if(props.type === 'editor') {
     attributes.onChange = onChangeHandler; //add onChangeHandler handler if editor
     attributes.defaultValue = ""; //clear by default, to clear previous value
     if(value) attributes.defaultValue = value;
    }
    if(props.type === 'reader'){
     attributes.value = ""; //clear by default, to clear previous value
     if(value) attributes.value = value; //makes readOnly
     attributes.readOnly = true;
    }
    //transform on none zero length value && if transform is available on UISchema
    if(String(attributes.value).length > 0 && props.UISchema[key].transform){
     if(attributes.value){
      attributes.value = props.UISchema[key].transform(attributes.value);
     }
     if(attributes.defaultValue){
      attributes.defaultValue = props.UISchema[key].transform(attributes.defaultValue);
     }
    }
   }

    let children = null;
    //for select input element, add options as children
    if(element.el === "select" || (element.attributes && element.attributes.type === "select")){
     if(element.options && element.options.length > 0){
      children = element.options.map((option,index) => <option key={index} value={option.value}>{option.text}</option>)
     }
    }
    elements.push(<div className="eform-inputgroup">
            { element.label ? <label htmlFor={key}>{element.label}</label> : null }
            { React.createElement(element.el, attributes, children) }
           </div>);
  }
  return elements;
 }
 
 return(
  <ComponentContainer id="eform-container" className="eform boxed">
  {renderElements()}
  {renderActions()}
 </ComponentContainer>
 
 )
}

EForm.propTypes = {
 /**
  * The identifier of the entity. e.g. _id
  */
 identifier: PropTypes.string,

}
