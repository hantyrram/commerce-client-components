//props = model=jsonschema -> to determine which are required fields how long the fieldName is etc...
//onSubmit handler
import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import Form from './Form';
import Input from './Input';


const FormTitle = styled.div`
 background-color: #e7ebef;
 text-align: left;
 font-size: 1.2em;
 border-bottom: 1px solid #d3d5d8;
 margin-bottom: .6em;
 line-height: 2.5em;
 padding-left: 1em;
 font-weight: bold;
 color: #333131;
`;



const FormContent = styled.div`
 padding: 1em;
`;

const FormActionContainer = styled.div`
  text-align:right;
`

//NOTE: renderes will hold the entities, this forms are just to display or accept entities data from user
/**
 * Form used to add an Entity. Has a Save button. Requires onSubmit props to handle form submittion.
 * @param {object} props = {
 *  schema = REQUIRED, defines the input fields of the form.
 *  onSubmit = REQUIRED, A function that will handle the onSumbit event of the form.
 *  onChange = REQUIRED, A function that will handle the onChange events of the input elements.
 *  entity = [optional], the data to be displayed by the form by default.
 * }
 */
const EntityAddForm = (props)=>{
  return(
    <Form action="" onSubmit={props.onSubmit}>
      {props.title?<FormTitle id="form-title">{props.title}</FormTitle>:null}
      <FormContent>
       {
        Object.getOwnPropertyNames(props.schema).map((fieldName,i)=>{
         return (
          <div key={i} className="row">
           <div className="col s8 offset-s2" style={{zIndex:3}}>
             <label htmlFor={fieldName}>{fieldName.replace(fieldName[0],fieldName[0].toUpperCase())}</label> 
             <input id={fieldName} type="text" name={fieldName} onChange={props.onChange} defaultValue={props.entity?props.entity[fieldName]||'':''}/>
             {/* change the first letter to upperchase */}
           </div>
          </div>
         )
        })
       }
      </FormContent>
     <FormActionContainer className="form-action-wrapper">
      <Button primary name="save">Save</Button>
     </FormActionContainer>
    </Form>
  )
}

/**
 * Form used to update an Entity. Has a Save button. Requires onSubmit props to handle form submittion.
 * @param {object} props = {
 *  schema = REQUIRED, defines the input fields of the form.
 *  onSubmit = REQUIRED, A function that will handle the onSumbit event of the form.
 *  onChange = REQUIRED, A function that will handle the onChange events of the input elements.
 *  entity =  REQUIRED,An object with ._id property, to be displayed by the form. Represents the entity to be updated.
 * }
 */
const EntityUpdateForm = (props)=>{
  return(
    <Form action="" onSubmit={props.onSubmit}>
     {props.title?<FormTitle id="form-title">{props.title}</FormTitle>:null}
     <FormContent>
      <input type="hidden" name="_id" value={props.entity._id}/>
      {
       Object.getOwnPropertyNames(props.schema).map((fieldName,i)=>{
        return (
         <div key={i} className="row">
          <div className="col s8 offset-s2" style={{zIndex:3}}>
            <label htmlFor={fieldName}>{fieldName.replace(fieldName[0],fieldName[0].toUpperCase())}</label> 
            <input id={fieldName} type="text" name={fieldName} onChange={props.onChange} value={props.entity[fieldName]}/>
            {/* change the first letter to upperchase */}
          </div>
         </div>
        )
       })
      }
     </FormContent>
     
     <div className="form-action-wrapper">
      <Button primary name="save">Save</Button>
     </div>
    </Form>
  )
}

/**
 * Form used to view an Entity. Has Edit And Delete buttons Requires onSubmit props to handle form submittion.
 * @param {object} props = {
 *  schema = REQUIRED, defines the input fields of the form.
 *  onEdit = A function that will handle the onClick event of the Edit button.
 *  onDelete = A function that will handle the onClick event of the Delete button.
 *  entity =  REQUIRED,An object with ._id property, to be displayed by the form. 
 * }
 */
const EntityReadForm = (props)=>{

  let generateElementForField = (schema,fieldName,entity)=>{//we can access props.entity here,but just depend on param 
    
    if(typeof schema[fieldName] === 'object'){
      if(schema[fieldName]['editable']){//if schema field has editable property, {field:{editable:1}}
        console.log(entity[fieldName]);
        return <span>{entity[fieldName]}</span>
      }
      return !schema[fieldName]['editable'] ? <span>{entity[fieldName]}</span> : <Input id={fieldName} className="disabled" type="text" name={fieldName} value={entity[fieldName]}/> ;
    }
    //default
    return <Input id={fieldName} className="disabled" type="text" name={fieldName} value={entity[fieldName]}/> 
  }

  return(
    <Form action="" onSubmit={(e)=>{e.preventDefault()}}>
      {props.title?<FormTitle id="form-title">{props.title}</FormTitle>:null}
      <FormContent>
       {
       Object.getOwnPropertyNames(props.schema).map((fieldName,i)=>{
         return (
          <div key={i} className="row">
           <div className="col s8 offset-s2" style={{zIndex:3}}>
             <label htmlFor={fieldName}>{fieldName.replace(fieldName[0],fieldName[0].toUpperCase())}</label> 
             {/* setting value without onChange makes the input field readonly which is what we want on read */}
             {
               generateElementForField(props.schema,fieldName,props.entity)
             }
             
           </div>
          </div>
         )
        })
       }
      </FormContent>
      
     <FormActionContainer className="form-action-wrapper">
      <Button primary className="btn" name="edit" onClick={props.onEdit}> Edit </Button> <Button primary className="btn" name="delete" onClick={props.onDelete}> Delete </Button>
     </FormActionContainer>
    </Form>
  )
}
/**
 * props : {
 *  schema = Defines the labels and input fields of the form, 
 *           e.g. {username:1} will have a form with input element with name="username"
 *  entity = The data to populate the form.
 *  formType = May be one of the following.
 *           : 'add' returns a form with a Save button. REQUIRES onChange,onSubmit.
 *           : 'update' returns a form with a Save button. REQUIRES onChange,onSubmit props AND entity props with entity._id.
 *              -onChange handles the onChange events of the input elements.
 *              -onSubmit handles the onSubmit event of the form.
 *           : 'read' to display an entity, REQUIRES onEdit,onDelete AND entity props, props.entity MUST have atleast an ._id
 *              property.
 * }
 * 
 */
export default (props)=>{
 if(props.formType === 'add'){
   return <EntityAddForm {...props}/>
  }
  if(props.formType === 'update'){
    return <EntityUpdateForm {...props}/>
  }
  if(props.formType === 'read'){
    return <EntityReadForm {...props}/>
  }
 
}

//???future updates
// change schema to have a type e.g. what type of element should we use,or what type of input text?
// also which fields are required and the validator to use etc...
