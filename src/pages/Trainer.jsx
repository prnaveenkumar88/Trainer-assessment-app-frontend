import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import { normalizeAssessmentList } from "../utils/normalize";

function Trainer() {

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchAssessments = async () => {
      try {
        setError("");
        const res = await httpClient.get("/assessments");

        if (isMounted) {
          setAssessments(normalizeAssessmentList(res.data));
        }
      } catch {
        if (isMounted) {
          setAssessments([]);
          setError("Unable to load assessments");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAssessments();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <div className="page">

        <h2>Trainer Dashboard</h2>

        {error && <p className="auth-error">{error}</p>}

        {loading ? (
          <p style={{ marginTop: "15px" }}>Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">

              <thead>
                <tr>
                  <th>Course</th>
                  <th>Attempt</th>
                  <th>Total Score</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {assessments.map((a, index) => (
                  <tr
                    key={
                      a.assessment_id ||
                      `${a.course_name || "course"}-${index}`
                    }
                  >
                    <td>{a.course_name || "-"}</td>
                    <td>{a.attempt_number}</td>
                    <td>{a.total_score}</td>
                    <td>{a.scorecard_status || "-"}</td>

                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          navigate(`/trainer/view/${a.assessment_id}`)
                        }
                        disabled={!a.assessment_id}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {!loading && assessments.length === 0 && (
          <p style={{ marginTop: "15px" }}>No assessments found</p>
        )}

      </div>
    </Layout>
  );
}

export default Trainer;
