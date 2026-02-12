import { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import { getName } from "../utils/auth";

function CreateAssessment() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    trainer_email: "",
    trainer_name: "",
    date_of_joining: "",

    course_name: "",
    due_assessment: "",
    branch: "",
    team: "",
    assessment_date: "",
    assessment_time: "",

    // ✅ auto-filled from logged-in user
    assessor_name: getName(),

    knowledge_stem: 0,
    stem_integration: 0,
    updated_stem_info: 0,
    course_outline: 0,
    language_fluency: 0,
    lesson_preparation: 0,
    time_management: 0,
    student_engagement: 0,
    poise_confidence: 0,
    voice_modulation: 0,
    professional_appearance: 0,

    feedback_attempt_1: ""
  });

  const [message, setMessage] = useState("");
  const [trainerError, setTrainerError] = useState("");

  /* ======================
     HANDLE CHANGE
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // call API only when email looks valid
    if (
      name === "trainer_email" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      fetchTrainer(value);
    }
  };

  /* ======================
     Fetch Trainer By Email
  ====================== */
  const fetchTrainer = async (email) => {
    try {

      const res = await httpClient.get(`/assessments/by-email/${email}`);

      setForm(prev => ({
        ...prev,
        trainer_email: res.data.email,
        trainer_name: res.data.name,
        date_of_joining: res.data.date_of_joining,
        branch: res.data.branch || "",
        team: res.data.department || ""
      }));

      setTrainerError("");

    } catch {
      setForm(prev => ({
        ...prev,
        trainer_name: "",
        date_of_joining: "",
        branch: "",
        team: ""
      }));

      setTrainerError("Trainer not found");
    }
  };

  /* ======================
     Submit
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.trainer_name) {
      setMessage("Please enter valid trainer email");
      return;
    }

    try {

      const payload = {
        ...form,
        attempt_number: "1"
      };

      await httpClient.post("/assessments", payload);

      setMessage("Assessment created successfully");

      setTimeout(() => navigate("/assessor"), 800);

    } catch {
      setMessage("Error creating assessment");
    }
  };

  return (
    <Layout>
      <div className="page">

        <div className="page-header">
          <h2>Create Assessment</h2>

          <button
            className="btn-secondary"
            onClick={() => navigate("/assessor")}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">

          {/* TRAINER EMAIL */}
          <div className="form-group">
            <label>Trainer Email</label>
            <input
              className="input"
              name="trainer_email"
              value={form.trainer_email}
              onChange={handleChange}
              required
            />
            {trainerError && (
              <span className="form-error">{trainerError}</span>
            )}
          </div>

          {/* TRAINER NAME */}
          <div className="form-group">
            <label>Trainer Name</label>
            <input
              className="input"
              value={form.trainer_name}
              disabled
            />
          </div>

          {/* DOJ */}
          <div className="form-group">
            <label>Date Of Joining</label>
            <input
              className="input"
              value={
                form.date_of_joining
                  ? new Date(form.date_of_joining)
                      .toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })
                  : ""
              }
              disabled
            />
          </div>

          {/* COURSE */}
          <div className="form-group">
            <label>Course Name</label>
            <input
              className="input"
              name="course_name"
              value={form.course_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Due Assessment</label>
            <input
              className="input"
              type="date"
              name="due_assessment"
              value={form.due_assessment}
              onChange={handleChange}
              required
            />
          </div>

          {/* AUTO FILLED */}
          <div className="form-group">
            <label>Branch</label>
            <input
              className="input"
              value={form.branch}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Team</label>
            <input
              className="input"
              value={form.team}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Assessment Date</label>
            <input
              className="input"
              type="date"
              name="assessment_date"
              value={form.assessment_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Assessment Time</label>
            <input
              className="input"
              type="time"
              name="assessment_time"
              value={form.assessment_time}
              onChange={handleChange}
            />
          </div>

          {/* ✅ AUTO FILLED FROM LOGIN */}
          <div className="form-group">
            <label>Assessor Name</label>
            <input
              className="input"
              value={form.assessor_name}
              disabled
            />
          </div>

          {/* SCORES */}
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

          {/* FEEDBACK */}
          <div className="form-group form-full">
            <label>Feedback</label>
            <textarea
              className="input"
              name="feedback_attempt_1"
              value={form.feedback_attempt_1}
              onChange={handleChange}
            />
          </div>

          <div className="form-full">
            <button className="btn-primary" type="submit">
              Create Assessment
            </button>
          </div>

        </form>

        {message && <p>{message}</p>}

      </div>
    </Layout>
  );
}

export default CreateAssessment;
