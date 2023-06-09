import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUser, selectUser } from "../reducers/userReducer";

const ProfileAny = ({ user, id }) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector(state => state.users.selectedUser);

  const currentUser = user === null ? { _doc: '' } : user;

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [editingState, toggleEditingState] = useState(false);
  
  useEffect(() => {
    dispatch(selectUser(id));
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();

    dispatch(editUser(currentUser.token, id, { name, bio }));

    toggleEditingState(false);
  };

  const profileStatic = <div>
    {currentUser._doc._id === selectedUser.id ? <button onClick={() => toggleEditingState(true)}>edit</button> : null}

    <p>{selectedUser.name}</p>
    <p>{selectedUser.username}</p>
    <p>{selectedUser.bio}</p>
  </div>

  const editForm = <form onSubmit={updateUser}>
    name:
    <input value={name} onChange={(e) => setName(e.target.value)} />

    <p>@{selectedUser.username}</p>

    bio:
    <input value={bio} onChange={(e) => setBio(e.target.value)} />

    <button type='submit'>save</button>
  </form>

  return (
    <div>
      <button onClick={() => console.log(selectedUser)}>cl</button>
      {editingState ? editForm : profileStatic}
    </div>
  )
};

export default ProfileAny;