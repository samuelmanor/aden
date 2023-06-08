import { useState } from "react";
import usersService from '../services/users';
import { useDispatch } from "react-redux";
import { editUser } from "../reducers/userReducer";

const Profile = ({ user }) => {
  const currentUser = user === null ? { _doc: '' } : user;

  const [editingState, setEditingState] = useState(false);
  const [name, setName] = useState(user._doc.name);
  const [bio, setBio] = useState(user._doc.bio);

  const dispatch = useDispatch();

  const updateUser = async (e) => {
    e.preventDefault();

    dispatch(editUser(currentUser.token, currentUser._doc._id, { name, bio })); // doesnt update properly

    setEditingState(false);
  };

  const editForm = <form onSubmit={updateUser}>
    <p>name:</p>
    <input value={name} onChange={(e) => setName(e.target.value)} />

    <p>{currentUser._doc.username}</p>

    <p>bio:</p>
    <input value={bio} onChange={(e) => setBio(e.target.value)} />

    <button type='submit'>submit</button>
  </form>

  const profile = <div>
    <p>{currentUser._doc.name}</p>
    <p>@{currentUser._doc.username}</p>
    <p>{bio}</p>
    <button onClick={() => setEditingState(true)}>edit</button>
    <button onClick={() => console.log('users')}>cl</button>
  </div>

  return (
    <div>
      {editingState ? editForm : profile}
    </div>
  )
}

export default Profile;