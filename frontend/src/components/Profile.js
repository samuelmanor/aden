import { useState } from "react";
import usersService from '../services/users';

const Profile = ({ user }) => {
  const currentUser = user === null ? { _doc: '' } : user;

  const [editingState, setEditingState] = useState(false);
  const [name, setName] = useState(currentUser._doc.name);
  const [bio, setBio] = useState(currentUser._doc.bio);

  const editUser = (e) => {
    e.preventDefault();

    setEditingState(false);

    usersService.setToken(currentUser.token);

    console.log(currentUser)

    usersService.update(currentUser._doc._id, { name, bio })
      .then((returnedUser) => {
        console.log(returnedUser);
      })
  };

  const editForm = <form onSubmit={(e) => editUser(e)}>
    <p>name:</p>
    <input value={name} onChange={({ target }) => setName(target.value)} />

    <p>{user._doc.username}</p>

    <p>bio:</p>
    <input value={bio} onChange={({ target }) => setBio(target.value)} />

    <button type='submit'>submit</button>
  </form>

  const profile = <div>
    <p>{user._doc.name}</p>
    <p>@{user._doc.username}</p>
    <p>{user._doc.bio}</p>
    <button onClick={() => setEditingState(true)}>edit</button>
    <button onClick={() => console.log(user._doc)}>cl</button>
  </div>

  return (
    <div>
      {editingState ? editForm : profile}
    </div>
  )
}

export default Profile;