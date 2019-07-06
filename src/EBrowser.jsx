import React, { useState, useEffect, useReducer,useRef} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/DeleteSharp';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

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
 background-color:white;
 box-sizing:border-box; 
 text-align:center;
`;

const Tr= styled.tr`
 text-align:left;
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
         {
            numbered ? <Th>#</Th> : null
         }
         {
            columnNames.map((col,i)=> <Th key={i}>{col}</Th>)
         }
         { withActionColumn ?<ThFixed className="ThFixed" colSpan={actionColumnWidth || 2}>Action</ThFixed> : null}
     </thead>     
   )
}

function EBrowser(props){

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
   let maxRowPerPage = props.maxRowPerPage || props.entities.length; 

   //compute # of pages
   if(maxRowExceededBehaviour === MREB.PAGINATE && props.entities.length > 0){
      if(maxRowPerPage > 0){ // 1/0 = Infinity hence the check.
         pageCount = Math.floor(props.entities.length / maxRowPerPage);
      }
   }

   //setting up initial state
   let initialState = {
   entities: props.entities,
   searchResult: [],
   searching: false,
   maxRowExceededBehaviour,
   pageCount,
   currentPage:1
  }

  let [state, dispatch] = useReducer((state,action)=>{
   switch(action.type){
      case 'SEARCH': return { ...state, searchResult : action.searchResult  }
      case 'DELETE': return { ...state , entities: action.entities }
      case 'ADD' : return { ...state, entities: [ action.entity, ...state.entities ] }//push 
      default:  return {...state}
   }
  }, initialState);

  const onSearchResult = searchResult => {
   dispatch({ type: 'SEARCH', searchResult });
  }

 
  function initOnReadActionHandler(){
   if(props.onRead){
     let rows = document.getElementsByTagName("tr");
     for(let row of rows){
       row.addEventListener('click',function(e){
        if(e.eventPhase === Event.CAPTURING_PHASE && e.target.tagName.toLowerCase() === 'td'){
         if(e.target.className.includes("ebrowser-entity-data")){
             let {entity}= JSON.parse(row.attributes["row-entity"].value);
             props.onRead(entity);
          e.stopImmediatePropagation();
         }
        }
       },true);
     }
    }
  }


  const renderHeaders = ()=>{
   let headers = Object.keys(props.uischema);
   if(state.entities && state.entities.length > 0){
   return( 
    <thead>
     {
      props.numbered ? <Th>#</Th> : null
     }
     {
      headers.map((header,i)=> <Th key={i}>{header}</Th>)
     }
     { props.onEdit || props.onDelete ?<ThFixed className="ThFixed" colSpan="2">Action</ThFixed> : null}
    </thead>     
    )
    }
  }

  const renderRows = ()=>{
   let activeEntities = state.searchResult.length > 0? state.searchResult : state.entities;
   return activeEntities && activeEntities.length> 0 ? activeEntities.map((entity,index)=>
           <Tr id={`ebrowser-row-${index}`} className="ebrowser-row" key={index} row-entity={JSON.stringify({entity})}>{/** Row is clickable if there is onRead handler else default = empty function*/}
            <Td className="ebrowser-entity-data">{index + 1}</Td> 
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

                // if(data && transform){
                //  data = transform(data);
                // }
                return <Td key={i} className="ebrowser-entity-data">{cellValue}</Td>
              })
            }
            {
              props.actions && props.actions.length > 0? <>
              <DummyTd className="DummyTd" /> 
               <TdFixed className="TdFixed">
                {
                 props.actions.map(action => {
                  if(typeof action.icon === 'string'){
                   switch(action.icon){
                    case 'edit': return <StyledEditIcon />;
                    case 'delete': return <StyledDeleteIcon />;
                    default : return <button>{action.label}</button>;
                   }
                  }
                  return action.icon;
                 })
                }
                {/* { props.onEdit ? <StyledEditIcon /> : null}
                { props.onDelete ? <StyledDeleteIcon /> : null} */}
               </TdFixed>
              </>:null
             }
          </Tr>
         )  //.map
         :null
  }

  /**
   * Modify Fixed Column / Action Column. 
   */
  const modifyActionColumn = ()=>{
   let tdFixed = document.getElementsByClassName("TdFixed");
   
   if(tdFixed.length > 0){
    //set the dummy cells to the computed value of the fixed column width;
    let computedWidthOfTdElement = window.getComputedStyle(tdFixed[0]).width;
    
    for(let dTd of document.getElementsByClassName("DummyTd")){
     dTd.style.minWidth = computedWidthOfTdElement;
    }
    //set the height of fixedTd
    let computedHeightofTdElement = window.getComputedStyle(tdFixed[0]).height;
    for(let fTd of document.getElementsByClassName("TdFixed")){
     fTd.style.height = computedHeightofTdElement;
    }
   }
  
  }

  useEffect(()=>{
   modifyActionColumn();
   initOnReadActionHandler();
  });
  

  function onAddClickHandler(e){
     (async ()=>{
      let entity = await props.onAdd();
      dispatch({type: 'ADD', entity });
     })()
  }

  return(
   state.entities && state.entities.length > 0 ?
   <ComponentContainer>
    <SearchAddPanel>
      {
         props.searchable ? 
            <EBrowserSearch onResult={onSearchResult} data={state.entities} searchableFields={props.searchableFields} /> 
         : null
      }
      {
         props.onAdd ? 
            <Button size="small" style={{borderRadius:"50%",color:"green"}} onClick={onAddClickHandler}><AddIcon /></Button> 
         : null
      }
    </SearchAddPanel>
   
    <TableContainer>
      <TableWrapper >
       <Table>
         <TableHeader columnNames={Object.keys(props.uischema)} numbered /> 
         <tbody>
         {
            renderRows()
         }
         </tbody>
       </Table>
      </TableWrapper>
    </TableContainer>
   </ComponentContainer>
   : null
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
 actionsProvider: PropTypes.func,

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

}


/**
 * An object that defines an action that can be peformed on the EBrowser.
 * 
 * @typedef  {Object} EBrowser.action 
 * @property {String} type The action name valid values are 'delete','edit','add'
 * @property {String|React.Component|React.Element|undefined} ui The string or component that the user interacts with. 
 * If value is a string, it is display as simple button without border. If ui is undefined EBrowser will use the 
 * default ui for the given type.
 * 
 */

export default EBrowser;