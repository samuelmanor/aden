import { useCallback, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  user-select: none;
  display: flex;
  font-size: 60px;
  margin-bottom: -0.2em;
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
  font-size: 30px;
  height: 3em;
  overflow: scroll;
  cursor: pointer;
  position: absolute;
  right: 11.2em;
  margin-top: 4.05em;
  border: 2px solid rgb(247, 247, 242);
`

const Element = styled.p`
  user-select: none;
  display: block;
  margin: 0;
  padding: 0.5em 0 0.5em 0.5em;
  &:hover {
    background-color: rgba(247, 247, 242, 0.2);
  }
`

const Dropdown = ({ placeholder, label, arr, select, filter }) => {
  const [show, setShow] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [labelWidth, setLabelWidth] = useState(0);

  const labelRef = useCallback(node => {
    if (node !== null) {
      setLabelWidth(node.getBoundingClientRect().width);
    }
  }, [])

  if (!arr) {
    return null;
  }

  const selectOption = (option) => {
    select(option);
    setSelectedText(option);
    setShow(false);
  };

  const currentWidth = () => {
    return filter.current.offsetWidth - labelWidth - 280;
  };

  const options = arr.map(o => 
    <Element key={o} style={{ display: show ? '' : 'none' }} onClick={(e) => selectOption(e.target.innerText)}>
      {o}
    </Element>
  );

  return (
    <Container>
      <Label ref={labelRef} id={label} >{label}</Label>

      <Current style={{ width: currentWidth() }} onClick={() => setShow(!show)}>{selectedText ? selectedText : placeholder}</Current>

      <Options style={{ width: currentWidth(), display: show ? '' : 'none' }}>
        {options}
      </Options>

    </Container>
  )
};

export default Dropdown;