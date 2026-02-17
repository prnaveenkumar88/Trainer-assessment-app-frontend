import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import { normalizeAssessmentList } from "../utils/normalize";

function Admin() {

  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  /* ======================
     FILTERING
  ====================== */
  const filtered = assessments.filter(a => {

    const trainerMatch =
      a.trainer_name.toLowerCase().includes(search.toLowerCase());

    const branchMatch =
      branchFilter === "" ||
      a.branch.toLowerCase().includes(branchFilter.toLowerCase());

    const teamMatch =
      teamFilter === "" ||
      a.team.toLowerCase().includes(teamFilter.toLowerCase());

    return trainerMatch && branchMatch && teamMatch;
  });

  /* ======================
     DATE FORMAT
  ====================== */
  const formatDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleDateString("en-IN");
  };

  return (
    <Layout>
      <div className="page">

        <h2>Admin Dashboard</h2>

        {/* ================= FILTERS ================= */}

        <div className="page-header">

          <input
            className="input"
            placeholder="Search Trainer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            className="input"
            placeholder="Filter Branch..."
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          />

          <input
            className="input"
            placeholder="Filter Team..."
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          />

        </div>

        {/* ================= TABLE ================= */}

        {error && <p className="auth-error">{error}</p>}

        {loading ? (
          <p style={{ marginTop: "15px" }}>
            Loading...
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Trainer Name</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>Team</th>
                  <th>Course</th>
                  <th>Assessment Date</th>
                  <th>Total Score</th>
                  <th>Status</th>
                  <th>Know More</th>
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
                    <td>{a.trainer_email || "-"}</td>
                    <td>{a.branch || "-"}</td>
                    <td>{a.team || "-"}</td>
                    <td>{a.course_name || "-"}</td>
                    <td>{formatDate(a.assessment_date)}</td>
                    <td>{a.total_score}</td>
                    <td>{a.scorecard_status || "-"}</td>

                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          navigate(`/admin/view/${a.assessment_id}`)
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

        {!loading && filtered.length === 0 && (
          <p style={{ marginTop: "15px" }}>
            No assessments found
          </p>
        )}

      </div>
    </Layout>
  );
}

export default Admin;
