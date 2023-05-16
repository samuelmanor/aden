const MainContainer = (props) => {
  
  const style = {
    width: '900px',
    height: '550px',
    margin: '0 auto',
    fontFamily: "'Epilogue', sans-serif",
    color: '#f7f7f2'
  }

  return (
    <div className='main-container' style={style}>
      {props.children}
    </div>
  )
};

export default MainContainer;