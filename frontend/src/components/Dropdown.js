import { useState } from "react";

const Dropdown = ({ placeholder, arr, select }) => {
  const [show, setShow] = useState(false);
  const [selectedText, setSelectedText] = useState(null);

  const dropdownStyle ={
    option: {
      display: show ? '' : 'none'
    }
  };

  if (!arr) {
    return null;
  }

  const selectOption = (option) => {
    select(option);
    setSelectedText(option);
    setShow(false);
  };

  const options = arr.map(o => <div key={o} style={dropdownStyle.option} onClick={(e) => selectOption(e.target.innerText)}>{o}</div>);

  return (
    <div style={dropdownStyle}>
      <p onClick={() => setShow(!show)}>{selectedText ? selectedText : placeholder}</p>
      {options}
    </div>
  )
};

export default Dropdown;