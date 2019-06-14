export default {
 name : {
  el : "input",//element tag
  label: "_id",//label of the element
  attributes : {//element attributes
   name : "_id",//currently required,see ?? improvement comment on EntityForm
   id:"ID",
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
 }
}