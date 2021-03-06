import React, { useState, useEffect, useReducer,useRef} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/DeleteSharp';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import './EBrowser.css';

//ok
const ComponentContainer = styled.div`
   padding: 1em;
`;

const TableContainer = styled.div`
 font-family: 'Roboto Slab',sans-serif;
 min-width:100%;
 width: 100%;
 overflow: hidden;
 position:relative;
 text-align:center;
`;

const TableWrapper = styled.div`
 min-width:100%;
 overflow-x:auto;
`;

const Table = styled.table`
 border-collapse: collapse;
 min-width:100%;
 // margin-bottom: .5em;
 & tr {
  border-top: 1px solid #d6cccc;
  text-align:left;
 }
 & tr:hover{
  background-color:#f3ffee;
 }
`;

const Th = styled.th`
 white-space:nowrap;
 padding: .5em;
 text-align:left;
`;

//border-box,because the DummyTd width depends on the computed style of Fixed
const ThFixed = styled(Th)`
 position:absolute;
 right: 0px;
 min-width:8%;
 box-sizing:border-box; 
 text-align:center;
`;


const Td = styled.td`
 white-space:nowrap;
 padding: .5em;
 cursor:default;
`;

//border-box,because the DummyTd width depends on the computed style of Fixed
const TdFixed = styled(Td)`
 padding-top:.2em;
 padding-bottom:0px;
 position:absolute;
 right: 0px;
 min-width:8%;
 height:inherit;
 border-top:none;
 background-color:white;
 box-sizing:border-box; 
`;

const DummyTd = styled.td`
 border-bottom:none;

`;

const StyledDeleteIcon = styled(DeleteIcon)`
 &:hover {
  background-color: #ebe4e4;
  border-radius: 25px;
  padding: .1em;
 }
 color:#118d08eb;
 margin-left:.1em;
 margin-right:.1em;
`;

const StyledEditIcon = styled(EditIcon)`
 &:hover {
  background-color: #ebe4e4;
  border-radius: 25px;
  padding: .1em;
 }
 color:#bd3d30eb;
 margin-left:.1em;
 margin-right:.1em;
`;

const SearchAddPanel = styled.div`
 display:flex;
 justify-content: space-between;
 align-items:normal;
`;

const rowDeletingStyle = {
   filter: "opacity(0.5)",
   backgroundColor: "#fdeaea",
}

const StatusBar = styled.div`
   font-style: italic;
   color: grey;
   border: none;
   text-align: left;
`;

const ActionButton = styled.button`
   height:inherit;
   padding:0;
   margin:0;
`;

function AdderModal(props){
   const [open,setOpen] = useState(false);
   const Content = props.content;
   const onCloseHandler = (e)=>{
      setOpen(false);
   }

   const trigger = (e)=>{
      setOpen(true);
   }

   return(
      <React.Fragment>
         <Button size="small" style={{borderRadius:"50%",color:"green"}} onClick={trigger} onClick={trigger}><AddIcon /></Button> 
         <Dialog open={open} onClose={onCloseHandler}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
               <Content />
            </DialogContent>
            <DialogActions>{props.actions.map(a=>a)}</DialogActions>
         </Dialog>
      </React.Fragment>
   )
}

/**
 * A Search component for the EBrowser.
 * 
 * @author Ronaldo Ramano <rongrammer@hotmail.com>
 * @version 0.0.1
 */
function EBrowserSearch({searchableFields,data,onResult}){
   const onChange = (e)=>{
      let searchStr = e.target.value;
      (async ()=>{
       let filtered = data.filter((entity)=>{
        let truthAccumulator;
        if(searchableFields && searchableFields.length > 0){
         for(let field of searchableFields){//search on the searchlookUpFields
          truthAccumulator |= RegExp(`${searchStr}`,'i').test(entity[field]);
         }
        }else{
         for(let field of Object.keys(entity)){//search all prop by default
          truthAccumulator |= RegExp(`${searchStr}`,'i').test(entity[field]);
         }
        }
        
        return truthAccumulator;
       });
      console.log(filtered);
      onResult(filtered);
      })();
   }

   return(
   <div style={{textAlign:"left",marginBottom:"1em"}}>
     <TextField 
      onChange={onChange}
      label="Search" 
      InputProps={
       {
        endAdornment:(
         <InputAdornment position="end" >
          <IconButton>
           <SvgIcon xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">>
            {/* //from https://www.materialui.co/icon/search */}
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>			
           </SvgIcon>
          </IconButton>
         </InputAdornment>
        )
       }}
      />
    </div>
   )
}

function TableHeader({columnNames,withActionColumn,actionColumnWidth,numbered}){
   return(
      <thead>
         <tr>
         {
            numbered ? <Th>#</Th> : null
         }
         {
            columnNames.map((col,i)=> <Th key={i}>{col}</Th>)
         }
         { withActionColumn ?<ThFixed className="ThFixed" colSpan={actionColumnWidth || 2}>Action</ThFixed> : null}
         </tr>
     </thead>     
   )
}

function Status({text,timeout}){
   let t = timeout || 5;
   let [counter,setCounter] = useState(t);

   let i = setTimeout(()=>{
      if(counter !== 0){
         setCounter(counter - 1);
         return;
      }
      clearTimeout(i);
   },1000);

   useEffect(()=>{
      setCounter(t);
   },[text]);
   return(
      counter && text? <StatusBar>{`${text} `}</StatusBar>: null
   )
}
/**
 * An entity browser displays a list of entities.
 * 
 * @author Ronaldo Ramano <rongrammer@hotmail.com>
 * @version 0.0.1
 */
function EBrowser(props){
   //reducer action types
   const ACTION_TYPE = {
      DELETE: 'delete',
      ADD: 'add',
      EDIT: 'edit',
      SEARCH: 'search',
      CHANGE_STATUS: 'change_statusText',
      SELECT: 'select',
      DESELECT: 'deselect' 
   }
   //maxRowExceededBehaviour enum
   const MREB = {
      PAGINATE: 'paginate',
      SCROLL: 'scroll'
   }

   //Setting up defaults
   let maxRowExceededBehaviour = 
      props.maxRowExceededBehaviour && props.maxRowExceededBehaviour === MREB.PAGINATE ? 
         props.maxRowExceededBehaviour : MREB.SCROLL;
   let pageCount = 1;   
   //maxRowPerPage prop value or the length of the entities array by default
   let maxRowPerPage = props.maxRowPerPage || (
      props.entities instanceof Array? props.entities.length : 0
   ); 

   //compute # of pages
   if(maxRowExceededBehaviour === MREB.PAGINATE && props.entities.length > 0){
      if(maxRowPerPage > 0){ // 1/0 = Infinity hence the check.
         pageCount = Math.floor(props.entities.length / maxRowPerPage);
      }
   }


   //setting up initial state
   let initialState = {
   entities: props.entities instanceof Array? props.entities: [],
   searchResult: [],
   searching: false,
   maxRowExceededBehaviour,
   pageCount,
   currentPage:1,
   statusText: null,
   status: null,
   // selectedEntities default undefined
  }

  let [state, dispatch] = useReducer((state,action)=>{
   if(state.statusText && action.type !== ACTION_TYPE.CHANGE_STATUS){
      //always reset statusText
      state.statusText = null;
   }
   switch(action.type){      
      case ACTION_TYPE.SELECT: {
         let selectedEntities = [];
         if(state.selectedEntities){
            selectedEntities = Object.assign([],[...state.selectedEntities]);
         }
         //indexOnState is the original index of the entity from state.entities;
         let newLength = selectedEntities.push({entity: action.entity, indexOnState: action.entityIndex, rowId: action.rowId});
         action.onAddToSelectedEntities(newLength -1);
         return { ...state, selectedEntities };
      }
      case ACTION_TYPE.DESELECT: {
         let selectedEntities = Object.assign([],[...state.selectedEntities]);
         selectedEntities.splice(action.selectedEntityIndex,1);
         return { ...state, selectedEntities };
      }
      case ACTION_TYPE.BROWSE: return { ...state, entities : action.entities  }
      case ACTION_TYPE.SEARCH: return { ...state, searchResult : action.searchResult  }
      case ACTION_TYPE.DELETE: {
         //delete failed,reverse
         let splicedEntities = Object.assign([],[...state.entities]);
         console.log(splicedEntities);
         if(action.reversal){
            splicedEntities.splice(action.entityIndex,0,action.entity);//insert on original position
         }else{
            splicedEntities.splice(action.entityIndex,1);//delete
         }
         return {...state, entities: splicedEntities};
      }
      case ACTION_TYPE.ADD : {
         return { ...state, entities: [ action.entity, ...state.entities ] }//push
      }
      case ACTION_TYPE.CHANGE_STATUS : {
         return { ...state, statusText: action.statusText, status:action.status}
      }
      default:  return {...state}
   }
  }, initialState);

   const onSearchResult = searchResult => {
      dispatch({ type: ACTION_TYPE.SEARCH, searchResult });
   }

 
   function initOnReadActionHandler(){
      console.log(props.onRead);
      if(!props.onRead) return;
      
      let rows = document.getElementsByTagName("tr");
      for(let row of rows){
         row.addEventListener('click',function(e){
         if(e.eventPhase === Event.CAPTURING_PHASE && e.target.tagName.toLowerCase() === 'td'){
         if(e.target.className.includes("ebrowser-entity-data")){
               let {entity}= JSON.parse(row.attributes["row-entity"].value);
               console.log(props.onRead);
               props.onRead(entity);
               e.stopImmediatePropagation();
         }
         }
         },true);
      }
   }

   /**Intercepts click event of the edit button, serves as a proxy to props.onEdit*/
   const onEditClickHandler = async (entity,e)=>{
      console.log('Editing ',entity);
   }

   /**Intercepts click event of the delete button, serves as a proxy to props.onDelete*/
   const onDeleteClickHandler = async (entity,index,rowId,e)=>{
      //cache entity for dispatching DELETE action with reversal
      console.log(`index`,index);
      let cacheEntity = Object.assign({},entity); 
      dispatch({type: ACTION_TYPE.DELETE, entityIndex:index});//delete immediately
      dispatch({type: ACTION_TYPE.CHANGE_STATUS, statusText:'deleting...'});//delete immediately
      try {
         let ok = await props.onDelete(entity);
         if(ok){
            dispatch({type: ACTION_TYPE.CHANGE_STATUS, statusText:'deletion done!'});//delete immediately
         }else{
            dispatch({ type:ACTION_TYPE.DELETE,entityIndex:index, reversal:true, entity: cacheEntity });   
         }
         
      } catch (error) {
         console.log('Error caught deleting: ',entity);
         dispatch({ type:ACTION_TYPE.DELETE,entityIndex:index, reversal:true, entity: cacheEntity });
         
      }
   }

   /** Check boxes onchange handler*/
   const selectChangeHandler = (entity,entityIndex,rowId,e)=>{
      e.persist();//persist event, needed on onAddToSelectedEntities callback.

      if(e.target.checked){
         dispatch({ type: ACTION_TYPE.SELECT, entity, entityIndex, onAddToSelectedEntities : (index)=> {
            e.target.value = index;
         } });
         
      }else{
         dispatch({type: ACTION_TYPE.DESELECT,selectedEntityIndex: e.target.value});
      }
      
   } 



   const renderRows = ()=>{
   let activeEntities = state.searchResult.length > 0? state.searchResult : state.entities;
   return activeEntities && activeEntities.length> 0 ? activeEntities.map((entity,entityIndex)=> {
      let rowId = `ebrowser-row-${entityIndex}`; //tr's id attribute
      return ( //mapped
         <tr id={rowId} className="ebrowser-row" key={entityIndex} row-entity={JSON.stringify({entity})}>{/** Row is clickable if there is onRead handler else default = empty function*/}
         <Td className="TdData ebrowser-entity-data">{entityIndex + 1}</Td> 
         {
            Object.getOwnPropertyNames(props.uischema).map((uiSchemaProp,i)=>{
               let transform = props.uischema[uiSchemaProp].transform;
               let data = entity[uiSchemaProp];
               let cellValue = data;
               if(data instanceof Array){
               // just an ellipse,indicating that the value is an array
               // perhaps will improve on this.
                  cellValue = <i>{`[...${uiSchemaProp}]`}</i>
               }else{
                  cellValue = data && transform? transform(data): data;
               }

               return <Td key={i} className="ebrowser-entity-data">{cellValue}</Td>
            })
         }
         {
            props.actions && props.actions.length > 0? <>
            <DummyTd className="DummyTd" /> 
            <TdFixed className="TdFixed">
               {
               props.actions.map((action,actionIndex) => {

               switch(action.type){
                  case 'select' : {
                     return <input type="checkbox" onChange={selectChangeHandler.bind(null,entity,entityIndex,rowId)}/>
                  }

                  case 'edit': {
                     if(typeof action.ui === 'string'){
                        return <ActionButton color="secondary">{action.ui}</ActionButton>
                     }

                     if(action.ui){
                        let UI = action.ui;
                        return <UI onClick={onEditClickHandler.bind(null,entity)} />;
                     }
                     return <StyledEditIcon onClick={onEditClickHandler.bind(null,entity)}/>;
                  }
                  case 'delete': {
                     if(typeof action.ui === 'string'){
                        return <ActionButton color="secondary" onClick={onDeleteClickHandler.bind(null,entity,entityIndex,rowId)}>{action.ui}</ActionButton>
                     }

                     if(action.ui){
                        let UI = action.ui;
                        return <UI onClick={onDeleteClickHandler.bind(null,entity,entityIndex,rowId)} />;
                     }
                     return <StyledDeleteIcon key={actionIndex} onClick={onDeleteClickHandler.bind(null,entity,entityIndex,rowId)}/>;
                  }
                  default : return <Button color="primary">{action.ui}</Button>;
                  }
               })
               }
            </TdFixed>
            </>:null
            }
         </tr>
      )
   }
           
         )  //.map
         :null
   }

  /**
   * Modify Fixed Column / Action Column. 
   */
  const modifyActionColumn = ()=>{
   // let tdFixed = document.getElementsByClassName("TdFixed");

      let dataTds = document.getElementsByClassName("TdData");
      

      if(dataTds && dataTds.length > 0){
         let computedStyleOfTd = window.getComputedStyle(dataTds[0]); //get a td sample
       
         let fixedTds = document.getElementsByClassName("TdFixed");
         let actionTh = document.getElementsByClassName("ThFixed")[0];
        
         for(let fTd of fixedTds){
            fTd.style.minHeight = computedStyleOfTd.height;
         }
         let computedStyleOfFixedTds = window.getComputedStyle(fixedTds[0]);//get a TdFixed sample
         actionTh.style.width = computedStyleOfFixedTds.width;
         //DummyTd is the extra cell behind the positioned action td, this will be the hidden td on scroll
         //instead of a td with entity data on it
         for(let dTd of document.getElementsByClassName("DummyTd")){
            dTd.style.minWidth = computedStyleOfFixedTds.width;//set the dummy td to the width of the TdFixed
         }
      
      }
   
   // if(tdFixed.length > 0){
   //  //set the dummy cells to the computed value of the fixed column width;
   //  let computedWidthOfTdElement = window.getComputedStyle(tdFixed[0]).width;
    
   //  for(let dTd of document.getElementsByClassName("DummyTd")){
   //   dTd.style.minWidth = computedWidthOfTdElement;
   //  }
   //  //set the height of fixedTd
   //  let computedHeightofTdElement = window.getComputedStyle(tdFixed[0]).height;
   //  for(let fTd of document.getElementsByClassName("TdFixed")){
   //   fTd.style.height = computedHeightofTdElement;
   //  }


   // }
  
  }

  const callOnSelectEffect = ()=>{
     if(props.onSelect) props.onSelect(state.selectedEntities);
  }

  useEffect(callOnSelectEffect);


  useEffect(()=>{
   if(props.entities instanceof Promise){
      dispatch({type: ACTION_TYPE.CHANGE_STATUS, status:'waiting', statusText:'Fetching Entities...'});
      props.entities.then(e=>{
         console.log(e);
         dispatch({type: ACTION_TYPE.BROWSE, entities:e });
         dispatch({type: ACTION_TYPE.CHANGE_STATUS,statusText:'Entities Received!'});
      }).catch(e=>{
         dispatch({type: ACTION_TYPE.BROWSE, entities:[] });
      });
   }else{
      // if(JSON.stringify(state.entities) !== JSON.stringify(props.entities)){
      //    dispatch({type: ACTION_TYPE.BROWSE, entities:props.entities });
      // }
      dispatch({type: ACTION_TYPE.BROWSE, entities:props.entities });
   }
     
   
  },[]);

  useEffect(()=>{
   if(props.onRead){
      initOnReadActionHandler(); 
   }
   
   modifyActionColumn();
   
  })
  

  function onAddClickHandler(e){
     //addMode = modal? display modal
   //   (async ()=>{
   //    let entity = await props.onAdd();
   //    dispatch({type: 'ADD', entity });
   //   })()
  }

  const AdderButton = ()=>{
     console.log(props.adderUi);
     if(props.adderType === 'modal'){
        
        return <AdderModal content={props.adderModalContent} actions={props.adderModalActions} title={props.adderModalTitle}/>
     }
     
     return null;
  }
  return(
   
   <ComponentContainer>
    { state.entities && state.entities.length > 0 ?
    <>  
      <SearchAddPanel>
         {
            props.searchable ? 
               <EBrowserSearch onResult={onSearchResult} data={state.entities} searchableFields={props.searchableFields} /> 
            : null
         }
         <AdderButton />
      </SearchAddPanel>
      
      <TableContainer>
         <TableWrapper >
         <Table>
            <TableHeader columnNames={Object.keys(props.uischema)} numbered withActionColumn={props.actions && props.actions.length > 0}/> 
            <tbody>
            {
               renderRows()
            }
            </tbody>
         </Table>
         </TableWrapper>
      </TableContainer>
    </> :null }
    {state.statusText ? <Status text={state.statusText}/> : null}
   </ComponentContainer>

  
  )
}

EBrowser.propTypes = {
 /** The entities to tabulate. Can be a Promise (that resolves to an array of entities), or array of entities */
 entities: PropTypes.oneOfType([
  PropTypes.instanceOf(Promise),
  PropTypes.array
 ]),
 /**
  * The name of the property whose value [uniquely] idenfities an entity. E.g. _id.
  */
 entityIdentifier: PropTypes.string,

 /**
  * A function that returns an array of @see {EBrowser.action}.
  * @type {function}
  * @param {Object} entity The entity that will be affected by a particular action.
  */
 actions: PropTypes.array,

 /*
  * Uses the UISchema's properties index as bases in arranging the columns. Uses labels as column labels, these
  * are the only required properties.
  */
 uiSchema: PropTypes.object,

 /**
  * The onRead handler function. Triggered when a row on table that represents a single entity is clicked.
  * @type {function} 
  * @param {Object} entity The entity that is on the row.
  */
 onRead: PropTypes.func,

 /**
  * Triggered when the edit action button is clicked.
  * @type {function} 
  * @param {Object} entity The entity affected by the edit action.
  * @return {Promise} A promise that resolves to an entity.EBrowser does not care if the entity was updated,or not
  * as long as it recieves an entity. It's the responsibility of the Promise provider to inform the user if the 
  * update was successful.
  */
 onEdit: PropTypes.func,

 /**
  * A function that is called when the add button is clicked. 
  * @type {function}
  * @return {Promise} A promise that resolves an entity that was added. 
  */
 onAdd: PropTypes.func,

 /**
  * Triggered when the delete action button is clicked.
  * @prop {function} [onDelete] - EBrowser will pass the entity to delete.
  * @param {Object} entity 
  */
 onDelete: PropTypes.func,

 /**
  * The max number of rows displayed per page.
  * 
  * @default 10
  */
 maxRowPerPage: PropTypes.number,

 /**
  * The display behaviour of the EBrowser when the entities exceeds the maxRowPerPage value.
  * @default scroll
  */
 maxRowExceededBehaviour: PropTypes.oneOf(['scroll','paginate']),

 /**
  * If true search input box is enabled.
  * 
  * @default true
  */
 searchable: PropTypes.bool,

 /**
  * An array containing the property names of an entity. The search function will look at the values of the 
  * given property names, an will be the bases of the search result.
  * 
  * @default all
  */
 searchableFields: PropTypes.array,

 /**
  * If true the row can be edited inline.
  * @default false
  */
 inlineEdit: PropTypes.bool,

  /**
  * The title of the entity browser table.
  */
 title: PropTypes.string,
 
 /**
  * Determines that the + or Add button when present will do.
  * 'inline' means entity can be added inline, a row is inserted on top, with x and check buttons to cancel or save.
  * 'external' default, means the Adder is an external ui, EBrowser won't care.
  * 'internal' requires adderUI which will be displayed on top of EBrowser.
  * 'modal', requireds adderUI which will be displayed as modal.
  */
 adderType: PropTypes.oneOf['inline','modal','internal','external'],
 adderModalTitle: PropTypes.string,
 adderModalContent: PropTypes.object,
 adderModalActions: PropTypes.array

}


/**
 * An object that defines an action that can be peformed on the EBrowser.
 * 
 * @typedef  {Object} EBrowser.action 
 * @property {String} type The action name valid values are 'delete','edit','add' || 'select', 'add'
 * @property {String|React.Component|React.Element|undefined} ui The string or component that the user interacts with. 
 * If value is a string, it is display as simple button without border. If ui is undefined EBrowser will use the 
 * default ui for the given type.
 * 
 * 
 * 
 */

 /**
 * A call back that is one of the property of the ACTION_TYPE.SELECT. This function recieves the index,
 * of the entity added to the selectedEntities state. This makes DESELECTing the entity from selectedEntities
 * easier.
 * 
 * @typedef  {function} EBrowser~onAddToSelectedEntities
 * @param {Number} index The index of the entity on the selectedEntities state array.
 */

 /**
 * Defines the state of the EBrowser component.
 * 
 * @typedef  {Object} EBrowser~state
 * @property {Array} selectedEntities  An array containing the selected entities, if the 'select' action type
 * is on.
 */

export default EBrowser;