import React from 'react';
import { storiesOf } from '@storybook/react';
import {BrowserRouter as Router} from 'react-router-dom';
import EntityBrowser from './EntityBrowser';

const entities = [
 {_id:1234,username:"ron"},
 {_id:12345,username:"ronskie"},
];

const onEdit = (entity)=>{
 console.log("Editing Entity",entity);
}

const onDelete = (entity)=>{
 console.log("Deleting Entity",entity);
}

const onRead = (entity)=>console.log("Reading Entity",entity);

storiesOf('EntityBrowser', module)
  .add('Users Browser', () =><Router> <EntityBrowser title="Users" entities={entities}onRead={onRead} onEdit={onEdit} onDelete={onDelete}/></Router>);