import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  user-select: none;
  cursor: pointer;
  display: flex;
  font-size: 50px;
  padding-top: 0.4em;
`

const Title = styled.p`
  margin-right: 1em;
  margin-left: 2em;
`

const Current = styled.p`
  border-bottom: 2px solid rgb(247, 247, 242);
`

const Options = styled.div`
  // overflow: scroll;
  // border: 2px solid rgb(247, 247, 242);
  // border-top: none;
  // height: 3.5em;
  // overflow: scroll;
  // font-size: 25px;

  font-size: 25px;
  border-bottom: 2px solid rgb(247, 247, 242);
  height: 3.5em;
  overflow: scroll;

  position: absolute;
`

const Element = styled.p`
  user-select: none;
  display: block;
  // border-left: 2px solid rgb(247, 247, 242);
  // border-right: 2px solid rgb(247, 247, 242);
  margin: 0;
  padding: 0.5em 0 0.5em 0;
  &:hover {
    background-color: rgba(247, 247, 242, 0.2);
  }
`

const Dropdown = ({ placeholder, title, arr, select }) => {
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
  
  const calcWidth = () => {
    // const titleWidth = document.getElementById('title').offsetWidth;
    const filterWidth = document.getElementById('filter').offsetWidth;

    // return filterWidth - titleWidth - 250;
  };

  return (
    <Container>
      <Title id={title} >{title}</Title>

      <Current style={{ width: calcWidth() }} onClick={() => setShow(!show)}>{selectedText ? selectedText : placeholder}</Current>

      <Options>
        {options}
      </Options>

    </Container>
  )
};

export default Dropdown;