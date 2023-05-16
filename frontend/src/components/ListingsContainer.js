const ListingsContainer = ({ listings }) => {
  if (!listings) {
    return null;
  };

  return (
    <div>
      {listings.map(l => 
        <div key={l.id}>
          <h1>{l.name}</h1>
          <h3>{l.address}</h3>
          <p>{l.description}</p>

          <div>
            {l.phone}
            {l.website}
          </div>

          <div>
            <p>posted by {l.user.name}</p>
            <p>@{l.user.username}</p>
          </div>
        </div>)}
    </div>
  )
}

export default ListingsContainer;