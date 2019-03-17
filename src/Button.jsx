import React, { Component } from 'react';
import styled from 'styled-components';




const types = {
 basic: "#878e92",
 primary: "#1784b7"
}



const Primary = styled.button`
 display: inline-block;
 color: white;
 background-color: #1784b7;
 border: none;
 font-weight: bold;
 font-size:1em;
 padding: 1em 2em 1em 2em;
 margin: 5px;
`;


const Basic = styled.button`
 display: inline-block;
 color: white;
 background-color: #1784b7;
 border: none;
 font-weight: bold;
 font-size:1em;
 padding: 1em 2em 1em 2em;
 margin: 5px;
`;

export default (props)=>{
  if(props.primary) return <Primary>{props.children}</Primary>;
  if(props.basic) return <Basic>{props.children}</Basic>
}

