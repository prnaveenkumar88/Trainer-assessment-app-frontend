import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import {
  hasAssessmentCoreData,
  normalizeAssessment,
  SCORE_FIELDS
} from "../utils/normalize";

function EditAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoadError("");
        const res = await httpClient.get(`/assessments/${id}`);
        const normalized = normalizeAssessment(res.data);

        if (!normalized || !hasAssessmentCoreData(normalized)) {
          setForm(null);
          setLoadError("Assessment details are empty");
          return;
        }

        setForm({
          ...normalized,
          feedback: ""
        });
      } catch {
        setLoadError("Unable to load assessment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  /* =====================
     HANDLE CHANGE
  ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const limits = {
      knowledge_stem: 5,
      stem_integration: 10,
      updated_stem_info: 5,
      course_outline: 5,
      language_fluency: 5,
      lesson_preparation: 5,
      time_management: 5,
      student_engagement: 5,
      poise_confidence: 5,
      voice_modulation: 5,
      professional_appearance: 5
    };

    if (limits[name] && Number(value) > limits[name]) return;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.feedback) {
      setMessage("Feedback is required");
      return;
    }

    try {
      const scores = SCORE_FIELDS.reduce((acc, field) => {
        const value = Number(form[field]);
        acc[field] = Number.isFinite(value) ? value : 0;
        return acc;
      }, {});

      await httpClient.put(`/assessments/${id}/attempt`, {
        attempt_number: Number(form.attempt_number) + 1,
        feedback: form.feedback,
        scores
      });

      setMessage("Assessment updated successfully");

      setTimeout(() => navigate("/assessor"), 800);
    } catch {
      setMessage("Error updating assessment");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page">Loading...</div>
      </Layout>
    );
  }

  if (loadError) {
    return (
      <Layout>
        <div className="page">
          <h2>Edit Assessment</h2>
          <p>{loadError}</p>
          <button
            className="btn-secondary"
            onClick={() => navigate("/assessor")}
          >
            Back
          </button>
        </div>
      </Layout>
    );
  }

  if (!form) {
    return null;
  }

  /* =====================
     COMPLETED LOCK
  ===================== */
  if (form.scorecard_status.toUpperCase() === "COMPLETED") {
    return (
      <Layout>
        <div className="page">
          <h2>Assessment Completed</h2>
          <p>This assessment is locked.</p>

          <button
            className="btn-secondary"
            onClick={() => navigate("/assessor")}
          >
            Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h2>
            Edit Assessment (Attempt {Number(form.attempt_number) + 1})
          </h2>

          <button
            className="btn-secondary"
            onClick={() => navigate("/assessor")}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Trainer Name</label>
            <input className="input" value={form.trainer_name} disabled />
          </div>

          <div className="form-group">
            <label>Trainer Email</label>
            <input
              className="input"
              value={form.trainer_email || ""}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Course Name</label>
            <input className="input" value={form.course_name} disabled />
          </div>

          {/* PREVIOUS FEEDBACK */}
          {form.feedback_attempt_1 && (
            <div className="form-full">
              <h4>Attempt 1 Feedback</h4>
              <p>{form.feedback_attempt_1}</p>
            </div>
          )}

          {form.feedback_attempt_2 && (
            <div className="form-full">
              <h4>Attempt 2 Feedback</h4>
              <p>{form.feedback_attempt_2}</p>
            </div>
          )}

          <h3 className="form-full">Scores</h3>

          {SCORE_FIELDS.map((field) => (
            <div className="form-group" key={field}>
              <label>{field.replace(/_/g, " ")}</label>
              <input
                className="input"
                type="number"
                name={field}
                value={form[field] ?? 0}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group form-full">
            <label>New Feedback</label>
            <textarea
              className="input"
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
            />
          </div>

          <div className="form-full">
            <button className="btn-primary" type="submit">
              Update Attempt
            </button>
          </div>
        </form>

        {message && <p>{message}</p>}
      </div>
    </Layout>
  );
}

export default EditAssessment;
