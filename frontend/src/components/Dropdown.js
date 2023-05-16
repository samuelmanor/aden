import { useState } from "react";

const Dropdown = ({ placeholder, arr, select }) => {
  const [show, setShow] = useState(false);

  const dropdownStyle ={
    // backgroundColor: 'red',
    option: {
      display: show ? '' : 'none'
    }
  };

  if (!arr) {
    return null;
  }

  const selectOption = (option) => {
    select(option);

    setShow(false);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const options = arr.map(o => <div key={o} style={dropdownStyle.option} onClick={(e) => selectOption(e.target.innerText)}>{o}</div>);

  return (
    <div style={dropdownStyle}>
      <p onClick={toggleShow}>{placeholder}</p>
      {options}
    </div>
  )
};

export default Dropdown;