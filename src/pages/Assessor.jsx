import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import { normalizeAssessmentList } from "../utils/normalize";

function Assessor() {
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchAssessments = async () => {
    try {
      setError("");
      const res = await httpClient.get("/assessments");
      setAssessments(normalizeAssessmentList(res.data));
    } catch {
      setAssessments([]);
      setError("Unable to load assessments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filtered = assessments.filter(a =>
    (a?.trainer_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page">

        <div className="page-header">
          <h2>Assessor Dashboard</h2>

          <input
            className="input"
            placeholder="Search by Trainer Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("/assessor/create")}
        >
          + Create New Assessment
        </button>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        {loading ? (
          <p style={{ marginTop: "15px" }}>Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Trainer</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Attempt</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((a, index) => (
                  <tr
                    key={
                      a.assessment_id ||
                      `${a.trainer_email || "assessment"}-${index}`
                    }
                  >
                    <td>{a.assessment_id || "-"}</td>
                    <td>{a.trainer_name || "-"}</td>
                    <td>{a.course_name || "-"}</td>
                    <td>{a.total_score}</td>
                    <td>{a.attempt_number}</td>

                    <td>
                      {Number(a.attempt_number) < 3 ? (
                        <button
                          className="btn-secondary"
                          onClick={() =>
                            navigate(
                              `/assessor/edit/${a.assessment_id}`
                            )
                          }
                          disabled={!a.assessment_id}
                        >
                          Edit Attempt {Number(a.attempt_number) + 1}
                        </button>
                      ) : (
                        <button className="btn-disabled" disabled>
                          Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ marginTop: "15px" }}>No assessments found</p>
        )}

      </div>
    </Layout>
  );
}

export default Assessor;
