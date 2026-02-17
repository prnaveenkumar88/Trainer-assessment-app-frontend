const VALID_ROLES = ["admin", "assessor", "trainer"];

export const SCORE_FIELDS = [
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
];

const isObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const safeString = (value) => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
};

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizeLoginPayload = (payload) => {
  if (!isObject(payload)) return null;

  const token = safeString(payload.token);
  const role = safeString(payload.role).toLowerCase();

  if (!token || !VALID_ROLES.includes(role)) {
    return null;
  }

  return {
    token,
    role,
    email: safeString(payload.email),
    name: safeString(payload.name)
  };
};

export const normalizeTrainerLookup = (payload) => {
  if (!isObject(payload)) return null;

  const name = safeString(payload.name);
  if (!name) {
    return null;
  }

  return {
    email: safeString(payload.email),
    name,
    date_of_joining: safeString(payload.date_of_joining),
    branch: safeString(payload.branch),
    department: safeString(payload.department)
  };
};

export const normalizeAssessment = (payload) => {
  if (!isObject(payload)) return null;

  const normalized = {
    assessment_id: safeString(payload.assessment_id),
    trainer_name: safeString(payload.trainer_name),
    trainer_email: safeString(payload.trainer_email),
    date_of_joining: safeString(payload.date_of_joining),
    course_name: safeString(payload.course_name),
    due_assessment: safeString(payload.due_assessment),
    branch: safeString(payload.branch),
    team: safeString(payload.team),
    assessment_date: safeString(payload.assessment_date),
    assessment_time: safeString(payload.assessment_time),
    assessor_name: safeString(payload.assessor_name),
    total_score: safeNumber(payload.total_score),
    scorecard_status: safeString(payload.scorecard_status),
    attempt_number: safeNumber(payload.attempt_number),
    feedback_attempt_1: safeString(payload.feedback_attempt_1),
    feedback_attempt_2: safeString(payload.feedback_attempt_2),
    feedback_attempt_3: safeString(payload.feedback_attempt_3)
  };

  SCORE_FIELDS.forEach((field) => {
    normalized[field] = safeNumber(payload[field]);
  });

  return normalized;
};

export const hasAssessmentCoreData = (assessment) => {
  if (!assessment) return false;

  return Boolean(
    assessment.assessment_id ||
      assessment.trainer_name ||
      assessment.trainer_email ||
      assessment.course_name
  );
};

export const normalizeAssessmentList = (payload) => {
  if (!Array.isArray(payload)) return [];

  return payload
    .map((item) => normalizeAssessment(item))
    .filter((item) => hasAssessmentCoreData(item));
};
