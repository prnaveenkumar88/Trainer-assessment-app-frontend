import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import Layout from "../components/layout/Layout";

function Trainer() {

  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  const fetchAssessments = async () => {
    try {
      const res = await httpClient.get("/assessments");
      setAssessments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <Layout>
      <div className="page">

        <h2>Trainer Dashboard</h2>

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
              {assessments.map((a) => (
                <tr key={a.assessment_id}>
                  <td>{a.course_name}</td>
                  <td>{a.attempt_number}</td>
                  <td>{a.total_score}</td>
                  <td>{a.scorecard_status}</td>

                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        navigate(`/trainer/view/${a.assessment_id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </Layout>
  );
}

export default Trainer;
