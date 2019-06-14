import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
 
 display:${props=>props.display || 'block'};
 background-color:white;
 margin-bottom: .5em;
 box-shadow: rgba(0, 0, 0, 0.2) -1px -1px 5px, rgba(0, 0, 0, 0.19) 1px 1px 5px;
 & div.card-close-container {
  text-align: right;
  float:right;
  background-color:transparent;
 }
 & div > button.card-close {
  transform: rotate(90deg);
  background-color:transparent;
  border:none;
  font-weight:bold;
  color: red;
  font-size: 1.5em;
 }
`
/**
 * props: {
 *  closeable - If true or if prop present, the card can be closed by clicking the close button.
 * }
 */

export default (props)=>{
 let display = 'block';

 let onClose = (e)=>{
  props.onClose();
  display = 'none' ;
 }

 return(
  <Div display={display}>
   {props.closable?<div className="card-close-container"><button className="card-close" onClick={onClose}>x</button></div>:null}
   <div>
    {props.children}
   </div>
  </Div>
 )
}