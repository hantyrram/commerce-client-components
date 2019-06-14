import React, { Component } from 'react';
import EForm from './EForm';
import PropTypes from 'prop-types';

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
 * EFormRead supports the Read functionality of BREAD.
 * @constructor
 * @param {Object} props - React.props
 * @param {Object} props.UISchema - The UISchema that describes the elements of the form.
 * @param {Entity} [props.Entity] - The Entity that is being presented by the Form.
 * @param {Entity} props.entity - The entity instance/object that is being presented by the Form.
 * @param {Number} [props.Save=1] - If 1 the Save button is enabled.
 * @param {Number} [props.Delete=1] - If 1 the Delete button is enabled.
 */
class EFormRead extends Component{

 constructor(props){
  super(props);
  //find an element with default value,then set it
  this.state = {};

  if(props.entity){
   this.state = Object.getOwnPropertyNames(props.entity).reduce(function(acc,propName){
    acc[propName] = props.entity[propName];
    return acc;
   }, this.state);
  }
  

 }

 onChange(e){
  console.log(e.target.name);
  console.log(e.target.value);
  this.setState({[e.target.name]:e.target.value});
  console.log(this.state);
 }

 onSaveMiddleware(event){
  console.log('onSaveMiddlware called');
  this.props.onSave(this.state);

 }

 onDeleteMiddleware(event){
  console.log('onDeleteMiddlware called');
  this.props.onDelete(this.state);
 }

 render(){
  //get uischema
  let { UISchema, Entity, entity } = this.props;
  let save = this.props.onSave? <button className="action-button" id="eformread-save" onClick={this.onSaveMiddleware.bind(this)}>Save</button> :null;
  let del = this.props.onDelete? <button className="action-button" id="eformread-delete" onClick={this.onDeleteMiddleware.bind(this)}>Delete</button> :null;
  return(
   <div id="eform-container">
    <EForm UISchema = {UISchema} entity={entity} onChange={this.onChange.bind(this)}/>
    {save}   
    {del}
   </div>
   
  )
 }
}

EFormRead.propTypes = {
 /**
  * @prop {Object} entity - The data that is represented by the form.
  */
 entity : PropTypes.object.isRequired
}

//EntityAware
//submits the data to user

export default EFormRead;