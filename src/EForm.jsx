import React, { Component } from 'react';


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
 * @constructor
 * @param {Object} props - React.props
 * @param {Object} props.UISchema - The UISchema that describes the elements of the form.
 * @param {Entity} props.Entity - The Entity that is being presented by the Form.
 * 
 */
class EForm extends Component{
 render(){
  //get uischema
  let { UISchema } = this.props;
  
  return(
   <div>
    {
     Object.keys(this.props.UISchema).map(k=>{
      let element = UISchema[k];
      let children = null;
      //for select input element, add options as children
      if(element.el === "select" || (element.attributes && element.attributes.type === "select")){
       children = element.options.map(o => <option value={o.value}>{o.text}</option>)
      }

      return <div>
              { element.label ? <label htmlFor={k}>{element.label}</label> : null }
              { React.createElement(element.el, element.attributes,children) }
             </div>
      
     })
    }
   </div>
   
  )
 }
}

export default EForm;