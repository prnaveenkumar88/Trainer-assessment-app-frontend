import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import { getRole } from "../utils/auth";
import {
  hasAssessmentCoreData,
  normalizeAssessment,
  SCORE_FIELDS
} from "../utils/normalize";

function ViewAssessment() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setError("");
        const res = await httpClient.get(`/assessments/${id}`);
        const normalized = normalizeAssessment(res.data);

        if (!normalized || !hasAssessmentCoreData(normalized)) {
          setData(null);
          setError("Assessment details are empty");
          return;
        }

        setData(normalized);
      } catch {
        setError("Unable to load assessment details");
      }
    };

    fetchAssessment();
  }, [id]);

  /* =====================
     BACK NAVIGATION
  ===================== */
  const handleBack = () => {
    const role = getRole();

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "trainer") {
      navigate("/trainer");
    } else {
      navigate("/assessor");
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="page">
          <h2>Assessment Details</h2>
          <p>{error}</p>
          <button className="btn-secondary" onClick={handleBack}>
            Back
          </button>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="page">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">

        <div className="page-header">
          <h2>Assessment Details</h2>

          <button
            className="btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Trainer Name</label>
            <input
              className="input"
              value={data.trainer_name}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Trainer Email</label>
            <input
              className="input"
              value={data.trainer_email}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Branch</label>
            <input
              className="input"
              value={data.branch || "-"}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Team</label>
            <input
              className="input"
              value={data.team || "-"}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Course</label>
            <input
              className="input"
              value={data.course_name}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Total Score</label>
            <input
              className="input"
              value={data.total_score}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input
              className="input"
              value={data.scorecard_status}
              disabled
            />
          </div>

          <h3 className="form-full">Scores</h3>

          {SCORE_FIELDS.map(field => (
            <div className="form-group" key={field}>
              <label>{field.replace(/_/g, " ")}</label>
              <input
                className="input"
                value={data[field] ?? 0}
                disabled
              />
            </div>
          ))}

          {data.feedback_attempt_1 && (
            <div className="form-group form-full">
              <label>Attempt 1 Feedback</label>
              <textarea
                className="input"
                value={data.feedback_attempt_1}
                disabled
              />
            </div>
          )}

          {data.feedback_attempt_2 && (
            <div className="form-group form-full">
              <label>Attempt 2 Feedback</label>
              <textarea
                className="input"
                value={data.feedback_attempt_2}
                disabled
              />
            </div>
          )}

          {data.feedback_attempt_3 && (
            <div className="form-group form-full">
              <label>Attempt 3 Feedback</label>
              <textarea
                className="input"
                value={data.feedback_attempt_3}
                disabled
              />
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
}

export default ViewAssessment;
