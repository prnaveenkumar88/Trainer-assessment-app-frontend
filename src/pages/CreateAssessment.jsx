import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import { getName } from "../utils/auth";
import { normalizeTrainerLookup, SCORE_FIELDS } from "../utils/normalize";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDateOfJoining = (value) => {
  if (!value) return "";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

function CreateAssessment() {

  const navigate = useNavigate();
  const trainerRequestRef = useRef(0);

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
  const [isTrainerLoading, setIsTrainerLoading] = useState(false);

  /* ======================
     HANDLE CHANGE
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setMessage("");

    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "trainer_email" && !EMAIL_REGEX.test(value)
        ? {
            trainer_name: "",
            date_of_joining: "",
            branch: "",
            team: ""
          }
        : {})
    }));

    if (name === "trainer_email") {
      setTrainerError("");

      if (!EMAIL_REGEX.test(value)) {
        setIsTrainerLoading(false);
        trainerRequestRef.current += 1;
      }
    }
  };

  useEffect(() => {
    const email = form.trainer_email.trim();

    if (!EMAIL_REGEX.test(email)) {
      return undefined;
    }

    const requestId = trainerRequestRef.current + 1;
    trainerRequestRef.current = requestId;

    const timeoutId = setTimeout(() => {
      fetchTrainer(email, requestId);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [form.trainer_email]);

  /* ======================
     Fetch Trainer By Email
  ====================== */
  const fetchTrainer = async (email, requestId) => {
    setIsTrainerLoading(true);

    try {

      const res = await httpClient.get(
        `/assessments/by-email/${encodeURIComponent(email)}`
      );
      const trainerData = normalizeTrainerLookup(res.data);

      if (requestId !== trainerRequestRef.current) {
        return;
      }
      if (!trainerData) {
        throw new Error("Trainer not found");
      }

      setForm(prev => ({
        ...prev,
        trainer_email: trainerData.email || email,
        trainer_name: trainerData.name,
        date_of_joining: trainerData.date_of_joining,
        branch: trainerData.branch,
        team: trainerData.department
      }));

      setTrainerError("");

    } catch {
      if (requestId !== trainerRequestRef.current) {
        return;
      }

      setForm(prev => ({
        ...prev,
        trainer_name: "",
        date_of_joining: "",
        branch: "",
        team: ""
      }));

      setTrainerError("Trainer not found");
    } finally {
      if (requestId === trainerRequestRef.current) {
        setIsTrainerLoading(false);
      }
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
            {isTrainerLoading && (
              <span className="form-help">Checking trainer...</span>
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
                formatDateOfJoining(form.date_of_joining)
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

          {SCORE_FIELDS.map(field => (
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
