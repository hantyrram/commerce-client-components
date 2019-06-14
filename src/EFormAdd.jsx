import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EForm from './EForm';

/**
 * An Object that describes the elements of the form. This Object is the basis of the construction of the Entity Form.
 * @typedef {Object} UISchema
 * @property {Object} @name <name> - Property names are the field names.
 * @property {string} @name <name>.el - The html element name, e.g. "input".
 * @property {string} @name <name>.label - The label of the field.
 * @property {Object} @name <name>.attributes - The elements' html attributes.
 * @property {Array} @name [<name>.options] - The options of the "select" el. Only required if the <name>.el = "select".
 */

/**
 * Entity Form or EForm is a component that provides dynamic UI for single Entity.
 * @constructor
 * @param {Object} props - React.props
 * @param {Object} props.UISchema - The UISchema that describes the elements of the form.
 * @param {Entity} props.Entity - The Entity that is being presented by the Form.
 * 
 */
class EFormAdd extends Component{

 constructor(props){
  super(props);
  //find an element with default value,then set it
  this.state = Object.getOwnPropertyNames(props.UISchema).reduce(function(acc,propName){
   let defaultValue = props.UISchema[propName].attributes.defaultValue;
   defaultValue ? acc[propName] = defaultValue: ""; //mutate acc
   return acc;
  },{});
  
 }

 onChange(e){
  console.log(e.target.name);
  console.log(e.target.value);
  
  this.setState({[e.target.name]:e.target.value});
 }

 onSave(formData){
  this.props.onSave(formData);
 }

 render(){
  //get uischema
  let { UISchema, Entity } = this.props;
  
  return(
   <div id="eform-container">
    <EForm UISchema = {UISchema} onChange={this.onChange.bind(this)}/>
    <button className="action-button" onClick={this.onSave.bind(this,this.state)}>Save</button>    
   </div>
   
  )
 }
}

EFormAdd.propTypes = {
 /**
  *  The UISchema that describes the elements of the form.
  */
 UISchema : PropTypes.object.isRequired
}


//EntityAware
//submits the data to user

export default EFormAdd;