import "./EditProfileModal.css";

function EditProfileModal({ close, name, setName, save }) {
  return (
    <div className="modal-bg">
      <div className="modal">
        <h2>Edit Profile</h2>

        <input
          class="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <button onClick={save}>Save</button>

          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
