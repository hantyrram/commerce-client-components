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
import {Link,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import "./EntityBrowser.css";


class EntityBrowser extends Component{

  constructor(props){
  }
  
  async componentDidMount(){
    this.initOnReadActionHandler.call(this);
    let entities = await this.props.Entity.browse();
    this.setState({entities: entities});
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
           let href = `/${pluralize(_self.props.Entity.name.toLowerCase())}/${entity[_self.props.entityPrimaryKey]}`;
           _self.props.history.push(href,{entity});
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

 render(){
  let columnNames = [];
  if(this.state.entities && this.state.entities.length > 0){
   columnNames.push('#');//number column
   let sample = this.props.entities[0];//get a sample entity just to check the property names
   columnNames = columnNames.concat(Object.getOwnPropertyNames(sample).map((samplePropName)=>{return samplePropName}));
  }

  let actions = [this.props.editor,this.props.deleter];
  actions = actions.filter(a=>Boolean(a));

  let actionStyleWidth = {
    width: (actions.length > 0? 100 / actions.length : 0) + "%"
  };

  
  //edit action
  let edit = (entity)=>{
   let to = {
    pathname: `/${pluralize(this.props.entityName.toLowerCase())}/${entity[this.props.entityPrimaryKey]}/edit`,
    state: {entity:entity}
   }
   return this.props.editor?<Link style={actionStyleWidth} to={to} className="eb-action-edit">Edit</Link>:null
  }
  
  let del = (entity)=>{
   return this.props.deleter?<a style={actionStyleWidth} href="" onClick={this.onDeleteActionHandler.bind(this,entity)} className="eb-action-delete">Delete</a>:null
  }

  return(     
   <div>
    {/* {this.props.title? <EntityBrowserTitle>{this.props.title}</EntityBrowserTitle>:null} */}
    <div id="main-actions-container"> &nbsp;
     {this.props.adder? <Link to={{pathname:`/${pluralize(this.props.Entity.name.toLowerCase())}/add`}} className="eb-action-add" >+ Add New {this.props.entityName}</Link>:null}
    </div>
    {
     this.props.entities && this.props.entities.length > 0 ?
     <div id="table-container">
      <div id="table-wrapper">
        <table id="entitybrowser-table" >
         <thead>
           <tr>
             {
               columnNames.length > 0? columnNames.map((columnName,i)=>{
                 return <th key={i}>{columnName}</th>
               }):null
             }
             <th className="fixed-column" colSpan={actions.length} style={{minWidth:"80px"}}>Action</th>
           </tr>
         </thead>
         <tbody ref="ebTableTbody">
           {
             this.props.entities.map((entity,index)=>{
              return <tr key={index} tr-entity={JSON.stringify({entity})}>{/** Row is clickable if there is onRead handler else default = empty function*/}
                      <td>{index + 1}</td> 
                      {
                        Object.getOwnPropertyNames(entity).map((entityFieldName,i)=>{
                          return <td key={i} className="eb-entity eb-entity-data">{entity[entityFieldName]}</td>
                        })
                      }
                      {
                        this.props.editor || this.props.onDelete?
                         <td className="fixed-column eb-entity eb-entity-action " style={{zIndex:"3"}} >
                          {/* by convention edit path = read path + /edit */}
                          {/* {this.props.editor?<Link className="eb-action-edit" style={actionStyleWidth}  to={{pathname: `/${pluralize(this.props.entityName.toLowerCase())}/${entity[this.props.routingParamKey]}/edit`,state:{entity}}}>Edit</Link>:null} */}
                          {edit(entity)}
                          {del(entity)}
                         </td>
                        :null
                      }
                    </tr>
             })
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
 /** The text that will be shown at the top */
 title: PropTypes.string
}
export default withRouter(EntityBrowser);


//entityname/:param/edit
//entityname/:param
// get each entity 
// on row click = read