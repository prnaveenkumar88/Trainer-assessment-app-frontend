import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import { getRole } from "../utils/auth";

function ViewAssessment() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {
    try {
      const res = await httpClient.get(`/assessments/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

          {[
            "knowledge_stem",
            "stem_integration",
            "updated_stem_info",
            "course_outline",
            "language_fluency",
            "lesson_preparation",
            "time_management",
            "student_engagement",
            "poise_confidence",
            "voice_modulation",
            "professional_appearance"
          ].map(field => (
            <div className="form-group" key={field}>
              <label>{field.replace(/_/g, " ")}</label>
              <input
                className="input"
                value={data[field]}
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
