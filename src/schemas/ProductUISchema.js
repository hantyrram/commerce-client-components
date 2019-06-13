export default {
 _id : {
  el : "input",//element tag
  label: "ID",//label of the element
  attributes : {//element attributes
   name : "_id",//currently required,see ?? improvement comment on EntityForm
   id:"product-id",
   type: "text",
   minLength: 1,
   maxLength: 30
  }
 },
 product_name : {
  el : "input",
  label: "Product",
  attributes : {
   name : "product_name",
   id:"product-name",
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
   id: "product-category",
   defaultValue:"WineID" //default selected value
  },
  
  options: [ //required if el = "select"
   {value: "SpiritID",text:"Spirit"},
   {value: "BeerID",text:"Beer"},
   {value: "WineID",text:"Wine"}
  ]
 }
}
