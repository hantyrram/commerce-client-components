import pluralize from 'pluralize';
import axios from './axios';
import apis from './apis';
import {emit,subscribe} from "./artifactEmitter";

/**
 * A function that returns the api version of the BREAD action. Entity Child classes MUST implement this function as static
 * function.
 * 
 * @typedef {function} Entity~apiVersion
 * @param {string} [action] - The BREAD action e.g. "add" 
 * @return {string} - The api version that'll be used as url prefix. Example, if action = "add" returned value will be used
 * as prefix for the add action url, e.g. /apiv1/<add path>
 */


 /**
 * A static string that an Entity subclass may provide. This string is used by Entity as path when saving the entity.
 * 
 * @typedef {string} Entity~addPath 
 */

/**
 * @classdesc Represents the base class of all entities. This class must be extended and not to be instantiated directly.
 * 
 * @constructor
 * @param {?object} object - If present initializes the entity with this object.
 */
class Entity{
 constructor(object){
  if(object && typeof object !== 'object') throw new Error(`@Entity : ${object} is not of type object `);
  Object.assign(this,object);
 }

 /**
  * Saves the entity. Checks if the derived class has a static property @link{Entity~addPath} and uses it as
  * the path to the post request.
  * If instance has no _id, then this method will add the entity. If _id is present it will send an UPDATE 
  * request.
  */
 async save(){
  if(!this._id){
   try {
     let response = await axios.post(apis(this.createActionName()),this);
     let artifact = response.data.data;
     if(artifact.status === 'ok'){
      Object.assign(this,artifact.data.entity);
      emit(this.createActionName(),artifact);
      return this;
     }
      return false;
   } catch (error) {
      console.log(error);
     return false;
   }
  }

  try {
   let response = await axios.post(apis(this.updateActionName()),this);
   let artifact = response.data;
    if(artifact.status === 'ok'){
      Object.assign(this,artifact.data.entity);
      emit(this.updateActionName(),artifact);
      return this;
    }
    emit(artifact);
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
  
 }

 async delete(){
  let artifact;
  try {
   let response = await axios.delete(this.deleteActionName(),this);
   artifact = response.data;
   if(artifact.status === 'ok'){
     let id = this._id;
     Object.getOwnPropertyNames(this).forEach(p=>{
       delete this[p];
     });
     return id;
   }
   emit(artifact);
   return false;
  } catch (error) {
   console.log(error);
  }
  
 }

 /**
  * Proxy to emitter so that subclasses can emit artifacts.
  * @param {string} action - The action name.
  * @param {Object} artifact - The artifact.
  */
 emit(action,artifact){
  emit(action,artifact);
 }

 /**
  * Proxy to emitter subscriber so that subclasses can be used to subscribed to action events.
  * @param {string} action - The action name.
  * @param {function} callback - The listener.
  * @return {function} ArtifactEmitter~unsubscribe.
  */
 subscribe(action,callback){
  return subscribe(action,callback);
 }

 /**
  * 
  * @abstract
  * @return {string} - The specific name of the add action. E.g. 'user_add'
  */
 createActionName(){
  throw new Error('Create action name required!');
 }

  /**
  * 
  * @abstract
  * @return {string} - The specific name of the add action. E.g. 'user_add'
  */
 updateActionName(){
  throw new Error('Edit action name required!');
 }

  /**
  * 
  * @abstract
  * @return {string} - The specific name of the add action. E.g. 'user_add'
  */
 deleteActionName(){
  throw new Error('Delete action name required!');
 }



}



Object.defineProperty(Entity.prototype,'save',{writable:false,configurable:false});
Object.defineProperty(Entity.prototype,'delete',{writable:false,configurable:false});

export default Entity;




