import React from 'react';
import { storiesOf } from '@storybook/react';
import EFormRead from './EFormRead';

let UISchema = {
 name : {
  el : "input",//element tag
  label: "Permission Name",//label of the element
  attributes : {//element attributes
   name : "name",//currently required,see ?? improvement comment on EntityForm
   id:"permission-name",
   type: "text",
   minLength: 1,
   maxLength: 30
  }
 },
 label : {
  el : "input",
  label: "Permission Label",
  attributes : {
   name : "label",
   id:"permission-label",
   type:"text",
   minLength: 1,
   maxLength: 35
  }
 },
 category : {
  el: "select",
  label: "Category",
  attributes: {
   name: "category",
   id: "product_category",
   defaultValue:"WineID" //default selected value
  },
  
  options: [ //required if el = "select"
   {value: "SpiritID",text:"Spirit"},
   {value: "BeerID",text:"Beer"},
   {value: "WineID",text:"Wine"}
  ]
 }
}


class Entity{
 save(){
  console.log('Saving',this);
 }

 remove(){
  console.log('Deleting',this);
 }
}


class Permission extends Entity{}

let permission = new Permission();
permission.name = "permission_name";
permission.label = "permission_label";
permission.category = "WineID";
storiesOf('EFormRead', module)
  .add('View Permission Entity', () => <EFormRead UISchema={UISchema} Entity={Permission} entity={permission} save delete/>);