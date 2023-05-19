import { createRef, useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  user-select: none;
  display: flex;
  font-size: 50px;
  padding-top: 0.4em;
`

const Label = styled.p`
  margin-right: 1em;
  margin-left: 2em;
`

const Current = styled.p`
  border-bottom: 2px solid rgb(247, 247, 242);
  cursor: pointer;
`

const Options = styled.div`
  font-size: 25px;
  // border: 2px solid rgb(247, 247, 242);
  // border-top: none;
  background-color: red;
  height: 3.5em;
  overflow: scroll;
  cursor: pointer;

  position: absolute;
`

const Element = styled.p`
  user-select: none;
  display: block;
  margin: 0;
  padding: 0.5em 0 0.5em 0;
  &:hover {
    background-color: rgba(247, 247, 242, 0.2);
  }
`

const Dropdown = ({ placeholder, label, arr, select }) => {
  const [show, setShow] = useState(false);
  const [selectedText, setSelectedText] = useState(null);

  if (!arr) {
    return null;
  }

  const selectOption = (option) => {
    select(option);
    setSelectedText(option);
    setShow(false);
  };

  const options = arr.map(o => 
    <Element key={o} style={{ display: show ? '' : 'none' }} onClick={(e) => selectOption(e.target.innerText)}>
      {o}
    </Element>
  );


  return (
    <Container>
      <Label onClick={() => console.log(this)} id={label}>{label}</Label>

      <Current onClick={() => setShow(!show)}>{selectedText ? selectedText : placeholder}</Current>

      <Options>
        {options}
      </Options>

    </Container>
  )
};

export default Dropdown;