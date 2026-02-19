import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";
import { normalizeAssessmentListResponse } from "../utils/normalize";

const PAGE_SIZE = 25;

const EMPTY_PAGINATION = {
  total: 0,
  page: 1,
  limit: PAGE_SIZE,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false
};

function Trainer() {

  const [assessments, setAssessments] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchAssessments = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await httpClient.get("/assessments", {
          params: {
            page,
            limit: PAGE_SIZE
          }
        });

        const normalized = normalizeAssessmentListResponse(
          res.data,
          page,
          PAGE_SIZE
        );

        if (isMounted) {
          setAssessments(normalized.items);
          setPagination(normalized.pagination);

          if (normalized.pagination.page !== page) {
            setPage(normalized.pagination.page);
          }
        }
      } catch {
        if (isMounted) {
          setAssessments([]);
          setPagination(EMPTY_PAGINATION);
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
  }, [page]);

  const fromRow = pagination.total === 0
    ? 0
    : (pagination.page - 1) * pagination.limit + 1;
  const toRow = Math.min(
    pagination.total,
    fromRow + Math.max(assessments.length - 1, 0)
  );

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

        {!loading && (
          <div className="pagination-bar">
            <p className="pagination-info">
              Showing {fromRow}-{toRow} of {pagination.total}
            </p>

            <div className="pagination-actions">
              <button
                className="btn-secondary pagination-btn"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                Previous
              </button>

              <span className="pagination-page">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                className="btn-secondary pagination-btn"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Trainer;
