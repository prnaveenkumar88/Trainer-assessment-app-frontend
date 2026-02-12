import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";

function EditAssessment() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {
    const res = await httpClient.get(`/assessments/${id}`);

    setForm({
      ...res.data,
      feedback: ""
    });
  };

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

    setForm(prev => ({
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

      await httpClient.put(`/assessments/${id}/attempt`, {
        attempt_number: Number(form.attempt_number) + 1,
        feedback: form.feedback,
        scores: {
          knowledge_stem: Number(form.knowledge_stem),
          stem_integration: Number(form.stem_integration),
          updated_stem_info: Number(form.updated_stem_info),
          course_outline: Number(form.course_outline),
          language_fluency: Number(form.language_fluency),
          lesson_preparation: Number(form.lesson_preparation),
          time_management: Number(form.time_management),
          student_engagement: Number(form.student_engagement),
          poise_confidence: Number(form.poise_confidence),
          voice_modulation: Number(form.voice_modulation),
          professional_appearance: Number(form.professional_appearance)
        }
      });

      setMessage("Assessment updated successfully");

      setTimeout(() => navigate("/assessor"), 800);

    } catch {
      setMessage("Error updating assessment");
    }
  };

  if (!form) {
    return (
      <Layout>
        <div className="page">Loading...</div>
      </Layout>
    );
  }

  /* =====================
     COMPLETED LOCK
  ===================== */
  if (form.scorecard_status === "COMPLETED") {
    return (
      <Layout>
        <div className="page">
          <h2>Assessment Completed</h2>
          <p>This assessment is locked 🔒</p>

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
            <input className="input" value={form.trainer_email || ""} disabled />
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
                type="number"
                name={field}
                value={form[field]}
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
