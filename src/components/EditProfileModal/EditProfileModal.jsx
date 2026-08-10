import "./EditProfileModal.css";
import { useState } from "react";
import * as Yup from "yup";

function EditProfileModal({ close, name, setName, save }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const profileSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
  });

  const handleSave = async () => {
    setError("");

    try {
      await profileSchema.validate({ name }, { abortEarly: true });

      setLoading(true);

      await save();
    } catch (err) {
      console.log("Validation Error:", err);

      if (err.name === "ValidationError") {
        setError(err.message);
        return;
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <h2>Edit Profile</h2>

        <input
          className="form-control"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          disabled={loading}
        />

        {error && (
          <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px", marginBottom: "0px" }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: "15px" }}>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          <button onClick={close} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;