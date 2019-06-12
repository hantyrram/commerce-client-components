/**
 * Used for tabular representation of data, supports pagination of data.
 * props : {
 *  entities : The entities to tabulate and paginate
 *  follow : An object which represents a column value that is a Link to a path.
 *             : { 
 *                 pathname: REQUIRED! The pathname e.g. /users/:username
 *                 paramName:  REQUIRED! The entity property  e.g. if entities contains array of users then setting this
 *                          value to "username" will replace the :username on the path with "username".
 *                          The column values of "username" will be a Link.
 *                 entityName: REQUIRED! The name of the entity e.g. user, This is used as property of the location.state. 
 *                 //entityName deprecated, all state will contain "entity" prop name
 *               }
 *  remove : [OPTIONAL] A function that will handle the delete button click event.
 *  title: [OPTIONAL] The Title shown on top of the Entity Browser.
 *  onAdd: [OPTIONAL] The handler for the add button.Which is used to add a new Entity.
 * }
 */

import React,{Component} from 'react';
import {Link,withRouter,BrowserRouter as Router} from 'react-router-dom';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import "./EntityBrowser.css";


class EntityBrowser extends Component{

  constructor(props){
   super(props);
   this.state = {};
   this.renderActions = this.renderActions.bind(this);
  }
  
  async componentDidMount(){
    this.initOnReadActionHandler.call(this);
    //Can call Entity.browse here if we want this component to be Entity aware
  }

  componentDidUpdate(){
   this.initOnReadActionHandler.call(this);
  }
  
  initOnReadActionHandler(){
   let _self = this;
   let rows = document.getElementsByTagName("tr");
   for(let row of rows){
     row.addEventListener('click',function(e){
      if(e.eventPhase === Event.CAPTURING_PHASE && e.target.tagName.toLowerCase() === 'td'){
       if(e.target.className.includes("eb-entity-data")){
           //row.attributes[0] is the saved entity on tr ,MUST do additional check on attributes[0].name === ebentity
           //if additional attribute is added on the tr
           let {entity}= JSON.parse(row.attributes["tr-entity"].value);
           // let href = `/${pluralize(_self.props.Entity.name.toLowerCase())}/${entity[_self.props.entityPrimaryKey]}`;
           // _self.props.history.push(href,{entity});
           _self.props.onRead(entity);
        e.stopImmediatePropagation();
       }
      }
     },true);
   }
  }

  onEditActionHandler(entity,event){
   event.preventDefault();
   this.props.onEdit(entity);
  }

  onDeleteActionHandler(entity,event){
    event.preventDefault();
    this.props.onDelete(entity);
  } 

 renderTitle(){
  console.log(this.props.title);
  return this.props.title ? <caption className="table-title">{this.props.title}</caption> : null
 }

 /**
  * Checks the presence of the onEdit and onDelete action handlers. Calculates the width of the eb-action column based 
  * on this info. E.g. if both are present, then the eb-action column will divided into two, if only onEdit handler is
  * present the onEdit button will occupy the entire eb-action column space.
  * This is important because the column header "Action" will always occupy 100% of the space but the available actions
  * "Edit" & "Delete" varies based on whether the onEdit and onDelete action handlers are present.
  * 
  * @return {Array} - [action,actionStyleWidth]
  */
 get actionsAndActionStyleWidth(){
  let actions = [this.props.onEdit,this.props.onDelete];
  actions = actions.filter(a=>Boolean(a));

  let actionStyleWidth = {
    width: (actions.length > 0? 100 / actions.length : 0) + "%"
  };
  return [actions,actionStyleWidth];
 }

 /**
  * Renders the Table column headers.
  */
 renderColumnHeaders(){
  let columnNames = [];
  if(this.props.entities && this.props.entities.length > 0){
   columnNames.push('#');//number column
   let sample = this.props.entities[0];//get a sample entity just to check the property names
   columnNames = columnNames.concat(Object.getOwnPropertyNames(sample).map((samplePropName)=>{return samplePropName}));
  }
  
  let [actions] = this.actionsAndActionStyleWidth;
  return (
  <tr>
    {
      columnNames.length > 0? columnNames.map((columnName,i)=>{
        return <th key={i}>{columnName}</th>
      }):null
    }
    <th className="fixed-column" colSpan={actions.length} style={{minWidth:"80px"}}>Action</th>
  </tr>
  )
 }

 renderRows(){
  return this.props.entities.map((entity,index)=>
          <tr id={`eb-row-${index}`} className="eb-row" key={index} tr-entity={JSON.stringify({entity})}>{/** Row is clickable if there is onRead handler else default = empty function*/}
           <td className="eb-data">{index + 1}</td> 
           {
             Object.getOwnPropertyNames(entity).map((entityFieldName,i)=>{
               return <td key={i} className="eb-entity eb-entity-data">{entity[entityFieldName]}</td>
             })
           }
           {
             this.props.editor || this.props.onDelete?
              <td className="fixed-column eb-entity eb-entity-action "  >
              {this.renderActions(entity)}
              </td>
             :null
           }
         </tr>
        )
 }

 /**
  * Renders the Edit & Delete action buttons if set.
  * @param {Object} entity - The entity to be passed to the onEdit & onDelete props.
  */
 renderActions(entity){

  let actionStyleWidth = this.actionsAndActionStyleWidth[1];
  let edit = ()=>{
   return this.props.onEdit?<a key="edit" style={actionStyleWidth} href=""  onClick={this.onEditMiddleware.bind(this,entity)} className="eb-action-edit">Edit</a>:null
  }
  let del = ()=>{
   return this.props.onDelete?<a key="delete" style={actionStyleWidth} href="" onClick={this.onDeleteMiddleware.bind(this,entity)} className="eb-action-delete">Delete</a>:null
  }

  return [edit(),del()];
 }

 onEditMiddleware(entity,e){
  e.preventDefault();
  this.props.onEdit(entity);
 }

 onDeleteMiddleware(entity,e){
  e.preventDefault();
  this.props.onDelete(entity);
 }

 render(){
  return(     
   <div>
    <div id="main-actions-container"> &nbsp;
     {/* BREAD should handle adder trigger no need here in browser */}
     {/* {this.props.adder? <Link to={{pathname:`/${pluralize(this.props.Entity.name.toLowerCase())}/add`}} className="eb-action-add" >+ Add New {this.props.entityName}</Link>:null} */}
     {/* <Link to="/users/add" >Add</Link> */}
    </div>
    {
     this.props.entities && this.props.entities.length > 0 ?
     <div id="table-container">
      <div id="table-wrapper">
        <table id="entitybrowser-table" >
         {this.renderTitle.bind(this)()}
         <thead>
          {this.renderColumnHeaders.bind(this)()}
         </thead>
         <tbody ref="ebTableTbody">
           {
             this.renderRows.bind(this)()
           }
          </tbody>
        </table>
      </div>
     
    </div>
    : <div>No available data</div>
    }
   
   </div>
  )
 }
}

EntityBrowser.propTypes = {
 /** The data to tabulate, the data will be shown in a Table */
 entities: PropTypes.array,
 /**
  * The onRead handler function.
  * 
  * @prop {function} props.onRead - Triggered when a row is clicked.
  */
 onRead: PropTypes.func,
 /**
  * Triggered when the edit action button is clicked.
  * @param {Object} entity - EBrowser will pass the entity to edit.
  */
 onEdit: PropTypes.func,

 /**
  * Triggered when the delete action button is clicked.
  * @param {Object} entity - EBrowser will pass the entity to delete.
  */
 onDelete: PropTypes.func,

  /**
  * The title of the entity browser table.
  */
 title: PropTypes.string
}
// export default withRouter(EntityBrowser);
export default EntityBrowser;


//entityname/:param/edit
//entityname/:param
// get each entity 
// on row click = read