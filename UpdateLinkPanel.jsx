import { useState } from "react";
import { updateAnimationLink } from "../services/api";

const UpdateLinkPanel = () => {
  const [uniqueIds, setUniqueIds] = useState("");
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    const idsArray = uniqueIds.split(",").map((id) => id.trim());

    const res = await updateAnimationLink({
      unique_id: idsArray,
      job_id: jobId,
      track_type: "email"
    });

    setMessage(res?.message || "Update failed");
  };

  return (
    <div>
      <h2>Update Animation Link</h2>

      <input
        placeholder="Unique IDs (comma separated)"
        value={uniqueIds}
        onChange={(e) => setUniqueIds(e.target.value)}
      />

      <input
        placeholder="Job ID"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
      />

      <button onClick={handleUpdate}>
        Update Link
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateLinkPanel;