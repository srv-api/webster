import React, { useState, useEffect } from 'react';
import '../styles/DashboardStats.css';

const DashboardStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Post-test class data
  const postTestData = {
    students: [
      { id: 1, name: 'Ahmad Fauzi', score: 85, attendance: 'Present', category: 'Good' },
      { id: 2, name: 'Budi Santoso', score: 92, attendance: 'Present', category: 'Excellent' },
      { id: 3, name: 'Citra Dewi', score: 78, attendance: 'Present', category: 'Fair' },
      { id: 4, name: 'Dian Permata', score: 88, attendance: 'Present', category: 'Good' },
      { id: 5, name: 'Eka Pratama', score: 95, attendance: 'Present', category: 'Excellent' },
      { id: 6, name: 'Fajar Nugroho', score: 72, attendance: 'Sick', category: 'Fair' },
      { id: 7, name: 'Gina Lestari', score: 90, attendance: 'Present', category: 'Excellent' },
      { id: 8, name: 'Hendra Wijaya', score: 84, attendance: 'Present', category: 'Good' },
      { id: 9, name: 'Indah Sari', score: 76, attendance: 'Permit', category: 'Fair' },
      { id: 10, name: 'Joko Susilo', score: 89, attendance: 'Present', category: 'Good' }
    ]
  };

  // Calculate statistics
  const scoresList = postTestData.students.map(s => s.score);
  const averageScore = (scoresList.reduce((a, b) => a + b, 0) / scoresList.length).toFixed(1);
  const highestScore = Math.max(...scoresList);
  const lowestScore = Math.min(...scoresList);
  const passCount = postTestData.students.filter(s => s.score >= 75).length;
  const passRate = ((passCount / scoresList.length) * 100).toFixed(1);

  // Chart data
  const categoryData = {
    'Excellent (90-100)': postTestData.students.filter(s => s.score >= 90).length,
    'Good (80-89)': postTestData.students.filter(s => s.score >= 80 && s.score < 90).length,
    'Fair (70-79)': postTestData.students.filter(s => s.score >= 70 && s.score < 80).length,
    'Need Guidance (<70)': postTestData.students.filter(s => s.score < 70).length
  };

  const attendanceData = {
    'Present': postTestData.students.filter(s => s.attendance === 'Present').length,
    'Sick': postTestData.students.filter(s => s.attendance === 'Sick').length,
    'Permit': postTestData.students.filter(s => s.attendance === 'Permit').length,
    'Absent': postTestData.students.filter(s => s.attendance === 'Absent').length
  };

  // Bar Chart Component
  const BarChart = ({ data, title, color }) => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="chart-card">
        <div className="card-header">
          <h3>{title}</h3>
          <span className="card-icon">📊</span>
        </div>
        <div className="bar-chart">
          {Object.entries(data).map(([label, value]) => (
            <div key={label} className="bar-item">
              <div className="bar-label">{label}</div>
              <div 
                className="bar"
                style={{
                  height: `${(value / maxValue) * 180}px`,
                  backgroundColor: color
                }}
              >
                <span className="bar-value">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Horizontal Bar Chart Component
  const HorizontalBarChart = ({ data, title }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    
    return (
      <div className="chart-card">
        <div className="card-header">
          <h3>{title}</h3>
          <span className="card-icon">📈</span>
        </div>
        <div className="horizontal-bars">
          {Object.entries(data).map(([label, value]) => (
            <div key={label} className="horizontal-bar-item">
              <div className="horizontal-bar-label">{label}</div>
              <div className="horizontal-bar-container">
                <div 
                  className="horizontal-bar"
                  style={{ width: `${(value / total) * 100}%` }}
                >
                  <span className="horizontal-bar-value">{value} Students</span>
                </div>
              </div>
              <div className="horizontal-bar-percent">
                {((value / total) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Score Distribution Chart
  const ScoreDistribution = () => {
    const distribution = {
      '90-100': scoresList.filter(s => s >= 90).length,
      '80-89': scoresList.filter(s => s >= 80 && s < 90).length,
      '70-79': scoresList.filter(s => s >= 70 && s < 80).length,
      '60-69': scoresList.filter(s => s >= 60 && s < 70).length,
      '< 60': scoresList.filter(s => s < 60).length
    };

    return (
      <div className="chart-card">
        <div className="card-header">
          <h3>Score Distribution</h3>
          <span className="card-icon">📊</span>
        </div>
        <div className="distribution-container">
          {Object.entries(distribution).map(([range, count]) => (
            <div key={range} className="distribution-item">
              <div className="distribution-range">{range}</div>
              <div className="distribution-bar-wrapper">
                <div 
                  className="distribution-bar"
                  style={{ width: `${(count / scoresList.length) * 100}%` }}
                />
              </div>
              <div className="distribution-count">{count} Students</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple Donut Chart Component
  const DonutChart = ({ data, title, colors }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    let currentAngle = 0;
    const radius = 80;
    const center = 100;
    
    return (
      <div className="chart-card">
        <div className="card-header">
          <h3>{title}</h3>
          <span className="card-icon">🎯</span>
        </div>
        <div className="donut-container">
          <div className="donut-chart">
            <svg viewBox="0 0 200 200" width="180" height="180">
              {Object.entries(data).map(([label, value], index) => {
                if (value === 0) return null;
                const percentage = (value / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle = endAngle;
                
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = center + radius * Math.cos(startRad);
                const y1 = center + radius * Math.sin(startRad);
                const x2 = center + radius * Math.cos(endRad);
                const y2 = center + radius * Math.sin(endRad);
                
                const largeArc = angle > 180 ? 1 : 0;
                const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={colors[index % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
              <circle cx={center} cy={center} r="50" fill="white" />
            </svg>
            <div className="donut-center">
              <div className="donut-total">{total}</div>
              <div className="donut-label">Total</div>
            </div>
          </div>
          <div className="donut-legend">
            {Object.entries(data).map(([label, value], index) => {
              if (value === 0) return null;
              const percentage = ((value / total) * 100).toFixed(1);
              return (
                <div key={label} className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: colors[index % colors.length] }} />
                  <span className="legend-label">{label}</span>
                  <span className="legend-value">{value} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Student Table Component
  const StudentTable = () => {
    const sortedStudents = [...postTestData.students].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'attendance') return a.attendance.localeCompare(b.attendance);
      return 0;
    });

    const getScoreColor = (score) => {
      if (score >= 90) return 'score-excellent';
      if (score >= 80) return 'score-good';
      if (score >= 70) return 'score-average';
      return 'score-poor';
    };

    const getStatusBadge = (score) => {
      if (score >= 75) {
        return <span className="badge badge-success">Passed</span>;
      }
      return <span className="badge badge-danger">Remedial</span>;
    };

    return (
      <div className="chart-card table-card">
        <div className="card-header">
          <h3>📋 Student Score List</h3>
          <div className="sort-control">
            <label>Sort by: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="score">Highest Score</option>
              <option value="attendance">Attendance</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Student Name</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student, idx) => (
                <tr 
                  key={student.id} 
                  className="student-row"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td>{idx + 1}</td>
                  <td className="student-name">{student.name}</td>
                  <td className={getScoreColor(student.score)}>{student.score}</td>
                  <td>
                    {student.score >= 90 ? 'A' : student.score >= 80 ? 'B' : student.score >= 70 ? 'C' : 'D'}
                  </td>
                  <td>{getStatusBadge(student.score)}</td>
                  <td>
                    <span className={`attendance-badge attendance-${student.attendance.toLowerCase()}`}>
                      {student.attendance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Stat Card Component
  const StatCard = ({ icon, label, value, color }) => (
    <div className="stat-card-custom">
      <div className="stat-icon-custom" style={{ backgroundColor: color + '20', color: color }}>
        {icon}
      </div>
      <div className="stat-info-custom">
        <div className="stat-label-custom">{label}</div>
        <div className="stat-value-custom">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="slide-container">
      <div className={`dashboard-content ${isVisible ? 'slide-in-right' : ''}`}>
        {/* Header with Close Button */}
        <div className="dashboard-header">
          <div className="header-title">
            <h1>Class Dashboard</h1>
            <p>Post-Test Results Analysis • Even Semester 2024</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <StatCard icon="📊" label="Class Average" value={averageScore} color="#4F46E5" />
          <StatCard icon="🏆" label="Highest Score" value={highestScore} color="#10B981" />
          <StatCard icon="📝" label="Lowest Score" value={lowestScore} color="#EF4444" />
          <StatCard icon="✅" label="Pass Rate" value={`${passRate}%`} color="#F59E0B" />
          <StatCard icon="👥" label="Total Students" value={scoresList.length} color="#8B5CF6" />
        </div>

        {/* Charts Row 1 */}
        <div className="charts-row">
          <BarChart data={categoryData} title="Score Categories" color="#4F46E5" />
          <ScoreDistribution />
          <DonutChart 
            data={attendanceData} 
            title="Student Attendance" 
            colors={['#4F46E5', '#F59E0B', '#8B5CF6', '#EF4444']}
          />
        </div>

        {/* Charts Row 2 */}
        <div className="charts-row">
          <HorizontalBarChart data={categoryData} title="Score Categories Percentage" />
          <div className="chart-card info-card">
            <div className="card-header">
              <h3>ℹ️ Class Information</h3>
              <span className="card-icon">📌</span>
            </div>
            <div className="info-content">
              <div className="info-item">
                <span className="info-label">Passing Students:</span>
                <span className="info-value">{passCount} out of {scoresList.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Students Need Guidance:</span>
                <span className="info-value">{scoresList.length - passCount} students</span>
              </div>
              <div className="info-item">
                <span className="info-label">Score Range:</span>
                <span className="info-value">{lowestScore} - {highestScore}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Median Score:</span>
                <span className="info-value">
                  {[...scoresList].sort((a,b) => a-b)[Math.floor(scoresList.length/2)]}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Mode Score:</span>
                <span className="info-value">
                  {Object.entries(categoryData).reduce((a,b) => a[1] > b[1] ? a : b)[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <StudentTable />

        {/* Modal for Student Detail */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Student Details</h3>
                <button className="modal-close" onClick={() => setSelectedStudent(null)}>×</button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Score:</strong> {selectedStudent.score}</p>
                <p><strong>Grade:</strong> {selectedStudent.score >= 90 ? 'A' : selectedStudent.score >= 80 ? 'B' : selectedStudent.score >= 70 ? 'C' : 'D'}</p>
                <p><strong>Status:</strong> {selectedStudent.score >= 75 ? 'Passed' : 'Remedial'}</p>
                <p><strong>Attendance:</strong> {selectedStudent.attendance}</p>
                <p><strong>Category:</strong> {selectedStudent.category}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;