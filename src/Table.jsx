import styled from 'styled-components';

export default styled.table`
 border-collapse:collapse;
 
 min-width:100%;
 & > thead {
  background-color: #dbdbdb;
  line-height: 2em;
  border-bottom: 1px solid #b8c2c3;
 }
 & tbody {
  margin: .2em;
 }
 & > tbody > tr > td {
  padding: .2em;
 }
`