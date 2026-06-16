import React, { useState } from 'react';
import './DataTable.css';

const DataTable = () => {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Ahmad Fauzi', class: 'XII RPL 1', gender: 'Male', matematika: 85, bahasaIndonesia: 78, bahasaInggris: 90, pemrograman: 88, basisData: 82 },
    { id: 2, name: 'Siti Nurhaliza', class: 'XII RPL 2', gender: 'Female', matematika: 92, bahasaIndonesia: 88, bahasaInggris: 85, pemrograman: 95, basisData: 90 },
    { id: 3, name: 'Budi Santoso', class: 'XI RPL 1', gender: 'Male', matematika: 75, bahasaIndonesia: 80, bahasaInggris: 70, pemrograman: 78, basisData: 72 },
    { id: 4, name: 'Dewi Anggraini', class: 'X RPL 1', gender: 'Female', matematika: 88, bahasaIndonesia: 85, bahasaInggris: 87, pemrograman: 82, basisData: 84 },
    { id: 5, name: 'Citra Lestari', class: 'XII RPL 1', gender: 'Female', matematika: 95, bahasaIndonesia: 92, bahasaInggris: 94, pemrograman: 96, basisData: 93 },
    { id: 6, name: 'Eko Prasetyo', class: 'XI RPL 2', gender: 'Male', matematika: 68, bahasaIndonesia: 72, bahasaInggris: 65, pemrograman: 70, basisData: 68 },
    { id: 7, name: 'Fitri Handayani', class: 'X RPL 2', gender: 'Female', matematika: 82, bahasaIndonesia: 86, bahasaInggris: 84, pemrograman: 80, basisData: 83 },
    { id: 8, name: 'Gilang Ramadan', class: 'XII RPL 2', gender: 'Male', matematika: 78, bahasaIndonesia: 74, bahasaInggris: 76, pemrograman: 72, basisData: 70 }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [editParticipant, setEditParticipant] = useState(null);
  const [formData, setFormData] = useState({
    name: '', class: '', gender: '', matematika: 0, bahasaIndonesia: 0,
    bahasaInggris: 0, pemrograman: 0, basisData: 0
  });

  // Helper Functions
  const calculateAverage = (participant) => {
    const total = participant.matematika + participant.bahasaIndonesia + 
                  participant.bahasaInggris + participant.pemrograman + participant.basisData;
    return (total / 5).toFixed(2);
  };

  const getGrade = (average) => {
    if (average >= 90) return { letter: 'A', color: '#10b981' };
    if (average >= 80) return { letter: 'B', color: '#3b82f6' };
    if (average >= 70) return { letter: 'C', color: '#f59e0b' };
    if (average >= 60) return { letter: 'D', color: '#f97316' };
    return { letter: 'E', color: '#ef4444' };
  };

  const getScoreClass = (score) => {
    if (score >= 85) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-poor';
  };

  const getStatistics = () => {
    const averages = participants.map(s => parseFloat(calculateAverage(s)));
    const subjectStats = {
      matematika: { total: 0, count: participants.length },
      bahasaIndonesia: { total: 0, count: participants.length },
      bahasaInggris: { total: 0, count: participants.length },
      pemrograman: { total: 0, count: participants.length },
      basisData: { total: 0, count: participants.length }
    };
    
    participants.forEach(participant => {
      subjectStats.matematika.total += participant.matematika;
      subjectStats.bahasaIndonesia.total += participant.bahasaIndonesia;
      subjectStats.bahasaInggris.total += participant.bahasaInggris;
      subjectStats.pemrograman.total += participant.pemrograman;
      subjectStats.basisData.total += participant.basisData;
    });
    
    return {
      totalAverage: averages.length > 0 ? (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(2) : '0',
      highestScore: averages.length > 0 ? Math.max(...averages) : 0,
      lowestScore: averages.length > 0 ? Math.min(...averages) : 0,
      totalParticipants: participants.length,
      subjectAverages: {
        matematika: (subjectStats.matematika.total / subjectStats.matematika.count).toFixed(2),
        bahasaIndonesia: (subjectStats.bahasaIndonesia.total / subjectStats.bahasaIndonesia.count).toFixed(2),
        bahasaInggris: (subjectStats.bahasaInggris.total / subjectStats.bahasaInggris.count).toFixed(2),
        pemrograman: (subjectStats.pemrograman.total / subjectStats.pemrograman.count).toFixed(2),
        basisData: (subjectStats.basisData.total / subjectStats.basisData.count).toFixed(2)
      }
    };
  };

  // Sorting
  const sortedParticipants = [...participants].sort((a, b) => {
    if (sortConfig.key === 'average') {
      const avgA = parseFloat(calculateAverage(a));
      const avgB = parseFloat(calculateAverage(b));
      return sortConfig.direction === 'asc' ? avgA - avgB : avgB - avgA;
    }
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (typeof aValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipants = sortedParticipants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedParticipants.length / itemsPerPage);

  // Event Handlers
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this participant data?')) {
      setParticipants(participants.filter(participant => participant.id !== id));
    }
  };

  const handleEdit = (participant) => {
    setEditParticipant(participant);
    setFormData({
      name: participant.name, class: participant.class, gender: participant.gender,
      matematika: participant.matematika, bahasaIndonesia: participant.bahasaIndonesia,
      bahasaInggris: participant.bahasaInggris, pemrograman: participant.pemrograman, basisData: participant.basisData
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditParticipant(null);
    setFormData({
      name: '', class: '', gender: '', matematika: 0, bahasaIndonesia: 0,
      bahasaInggris: 0, pemrograman: 0, basisData: 0
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editParticipant) {
      setParticipants(participants.map(participant =>
        participant.id === editParticipant.id ? { ...participant, ...formData } : participant
      ));
    } else {
      const newParticipant = { 
        id: participants.length > 0 ? Math.max(...participants.map(s => s.id)) + 1 : 1, 
        ...formData 
      };
      setParticipants([...participants, newParticipant]);
    }
    setShowModal(false);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    const scoreFields = ['matematika', 'bahasaIndonesia', 'bahasaInggris', 'pemrograman', 'basisData'];
    if (scoreFields.includes(name)) {
      let score = parseInt(value) || 0;
      if (score > 100) score = 100;
      if (score < 0) score = 0;
      newValue = score;
    }
    
    setFormData({ ...formData, [name]: newValue });
  };

  const stats = getStatistics();

  return (
    <div className="nilai-container">
      {/* Statistics Cards */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="stat-icon">📈</div>
          <div className="dash-content">
            <span className="stat-label">Class Average</span>
            <span className="dash-number">{stats.totalAverage}</span>
          </div>
        </div>
        <div className="dash-card">
          <div className="stat-icon">🏆</div>
          <div className="dash-content">
            <span className="stat-label">Highest Score</span>
            <span className="dash-number">{stats.highestScore}</span>
          </div>
        </div>
        <div className="dash-card">
          <div className="stat-icon">📉</div>
          <div className="dash-content">
            <span className="stat-label">Lowest Score</span>
            <span className="dash-number">{stats.lowestScore}</span>
          </div>
        </div>
        <div className="dash-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="dash-content">
            <span className="stat-label">Total Participants</span>
            <span className="dash-number">{stats.totalParticipants}</span>
          </div>
        </div>
      </div>

      {/* Subject Averages */}
      <div className="subject-stats">
        <div className="subject-stats-title">📚 Average per Subject</div>
        <div className="subject-dash-grid">
          <div className="subject-stat-item">
            <span className="subject-name">Mathematics</span>
            <span className="subject-average">{stats.subjectAverages.matematika}</span>
          </div>
          <div className="subject-stat-item">
            <span className="subject-name">Indonesian Language</span>
            <span className="subject-average">{stats.subjectAverages.bahasaIndonesia}</span>
          </div>
          <div className="subject-stat-item">
            <span className="subject-name">English</span>
            <span className="subject-average">{stats.subjectAverages.bahasaInggris}</span>
          </div>
          <div className="subject-stat-item">
            <span className="subject-name">Programming</span>
            <span className="subject-average">{stats.subjectAverages.pemrograman}</span>
          </div>
          <div className="subject-stat-item">
            <span className="subject-name">Database</span>
            <span className="subject-average">{stats.subjectAverages.basisData}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="nilai-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">No {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('name')} className="sortable">Participant Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('class')} className="sortable">Class {sortConfig.key === 'class' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Gender</th>
              <th onClick={() => handleSort('matematika')} className="sortable">Math {sortConfig.key === 'matematika' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('bahasaIndonesia')} className="sortable">Indonesian {sortConfig.key === 'bahasaIndonesia' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('bahasaInggris')} className="sortable">English {sortConfig.key === 'bahasaInggris' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('pemrograman')} className="sortable">Programming {sortConfig.key === 'pemrograman' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('basisData')} className="sortable">Database {sortConfig.key === 'basisData' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('average')} className="sortable">Average {sortConfig.key === 'average' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentParticipants.length > 0 ? (
              currentParticipants.map((participant, index) => {
                const average = calculateAverage(participant);
                const grade = getGrade(average);
                return (
                  <tr key={participant.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td className="participant-name">{participant.name}</td>
                    <td>{participant.class}</td>
                    <td>{participant.gender === 'Male' ? 'M' : 'F'}</td>
                    <td><span className={getScoreClass(participant.matematika)}>{participant.matematika}</span></td>
                    <td><span className={getScoreClass(participant.bahasaIndonesia)}>{participant.bahasaIndonesia}</span></td>
                    <td><span className={getScoreClass(participant.bahasaInggris)}>{participant.bahasaInggris}</span></td>
                    <td><span className={getScoreClass(participant.pemrograman)}>{participant.pemrograman}</span></td>
                    <td><span className={getScoreClass(participant.basisData)}>{participant.basisData}</span></td>
                    <td className="average-cell">{average}</td>
                    <td><span className="grade-badge" style={{ backgroundColor: grade.color }}>{grade.letter}</span></td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(participant)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(participant.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="empty-state">
                    <p>📭 No participant data available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedParticipants.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editParticipant ? 'Edit Participant Data' : 'Add Participant Data'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <select name="class" value={formData.class} onChange={handleInputChange} required>
                    <option value="">Select Class</option>
                    <option value="X RPL 1">X RPL 1</option>
                    <option value="X RPL 2">X RPL 2</option>
                    <option value="XI RPL 1">XI RPL 1</option>
                    <option value="XI RPL 2">XI RPL 2</option>
                    <option value="XII RPL 1">XII RPL 1</option>
                    <option value="XII RPL 2">XII RPL 2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="scores-form">
                <h3>Subject Scores</h3>
                <div className="scores-grid">
                  <div className="score-field">
                    <label>Mathematics (0-100)</label>
                    <input
                      type="number"
                      name="matematika"
                      value={formData.matematika}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div className="score-field">
                    <label>Indonesian (0-100)</label>
                    <input
                      type="number"
                      name="bahasaIndonesia"
                      value={formData.bahasaIndonesia}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div className="score-field">
                    <label>English (0-100)</label>
                    <input
                      type="number"
                      name="bahasaInggris"
                      value={formData.bahasaInggris}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div className="score-field">
                    <label>Programming (0-100)</label>
                    <input
                      type="number"
                      name="pemrograman"
                      value={formData.pemrograman}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div className="score-field">
                    <label>Database (0-100)</label>
                    <input
                      type="number"
                      name="basisData"
                      value={formData.basisData}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editParticipant ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;