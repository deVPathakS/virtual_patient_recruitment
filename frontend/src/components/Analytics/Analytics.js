import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaFlask,
  FaHeartbeat,
  FaBone,
  FaBrain,
  FaVial,
  FaDownload,
  FaSync
} from 'react-icons/fa';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [selectedTrial, setSelectedTrial] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedTrial && selectedTrial !== 'all') {
      fetchPatients(selectedTrial);
    } else {
      setPatients([]); // Clear patients when "all" is selected
    }
  }, [selectedTrial]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAnalytics();
      console.log('Analytics response:', response.data); // Debug log
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
      // Set mock data for development/testing
      setAnalytics({
        summary: [
          { trial_type: 'hypertension', total_applications: 45, eligible: 32, ineligible: 13 },
          { trial_type: 'arthritis', total_applications: 38, eligible: 28, ineligible: 10 },
          { trial_type: 'migraine', total_applications: 29, eligible: 21, ineligible: 8 },
          { trial_type: 'phase1', total_applications: 52, eligible: 35, ineligible: 17 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async (trialType) => {
    try {
      setLoadingPatients(true);
      const response = await apiService.getPatients(trialType);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patient data');
      // Set mock patient data for development/testing
      setPatients([
        {
          id: 1,
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          eligibility: 'Eligible',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Jane Smith',
          age: 38,
          gender: 'Female',
          eligibility: 'Ineligible',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const getTrialIcon = (trialType) => {
    const icons = {
      hypertension: FaHeartbeat,
      arthritis: FaBone,
      migraine: FaBrain,
      phase1: FaVial
    };
    return icons[trialType] || FaFlask;
  };

  const getTrialColor = (trialType) => {
    const colors = {
      hypertension: '#ef4444',
      arthritis: '#f59e0b',
      migraine: '#9333ea',
      phase1: '#2563eb'
    };
    return colors[trialType] || '#2563eb';
  };

  const calculateTotals = () => {
    if (!analytics?.summary || !Array.isArray(analytics.summary)) {
      console.log('No analytics summary data available');
      return { total: 0, eligible: 0, ineligible: 0 };
    }

    const totals = analytics.summary.reduce(
      (acc, trial) => {
        const totalApps = parseInt(trial.total_applications) || 0;
        const eligible = parseInt(trial.eligible) || 0;
        const ineligible = parseInt(trial.ineligible) || 0;
        
        return {
          total: acc.total + totalApps,
          eligible: acc.eligible + eligible,
          ineligible: acc.ineligible + ineligible
        };
      },
      { total: 0, eligible: 0, ineligible: 0 }
    );

    console.log('Calculated totals:', totals); // Debug log
    return totals;
  };

  const preparePieData = () => {
    const totals = calculateTotals();
    return [
      { name: 'Eligible', value: totals.eligible, color: '#10b981' },
      { name: 'Ineligible', value: totals.ineligible, color: '#ef4444' }
    ];
  };

  const exportData = () => {
    if (!patients.length) {
      toast.error('No patient data to export');
      return;
    }

    const csvContent = [
      Object.keys(patients[0]).join(','),
      ...patients.map(patient => Object.values(patient).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTrial}_patients_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const totals = calculateTotals();
  const eligibilityRate = totals.total > 0 ? ((totals.eligible / totals.total) * 100).toFixed(1) : 0;
  const pieData = preparePieData();
  const activeTrials = analytics?.summary?.length || 0;

  return (
    <div className="analytics fade-in">
      <div className="analytics-header">
        <h1>Detailed Analytics</h1>
        <p>Comprehensive insights into clinical trial applications and patient eligibility</p>
        <button className="refresh-btn" onClick={fetchAnalytics}>
          <FaSync />
          Refresh Data
        </button>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-icon blue">
            <FaUsers />
          </div>
          <div className="stats-info">
            <h3>{totals.total.toLocaleString()}</h3>
            <p className="stats-label">Total Applications</p>
            <span className="stats-change positive">
              {activeTrials} Active Trials
            </span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon green">
            <FaUserCheck />
          </div>
          <div className="stats-info">
            <h3>{totals.eligible.toLocaleString()}</h3>
            <p className="stats-label">Eligible Patients</p>
            <span className="stats-change positive">
              {eligibilityRate}% Success Rate
            </span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon red">
            <FaUserTimes />
          </div>
          <div className="stats-info">
            <h3>{totals.ineligible.toLocaleString()}</h3>
            <p className="stats-label">Ineligible Patients</p>
            <span className="stats-change negative">
              {totals.total > 0 ? (100 - parseFloat(eligibilityRate)).toFixed(1) : 0}% Rejection Rate
            </span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon purple">
            <FaFlask />
          </div>
          <div className="stats-info">
            <h3>{activeTrials}</h3>
            <p className="stats-label">Active Trials</p>
            <span className="stats-change positive">
              {activeTrials > 0 ? 'All Systems Online' : 'No Active Trials'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Trial Applications by Type</h3>
          {analytics?.summary && analytics.summary.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analytics.summary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="trial_type" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="eligible" fill="#10b981" name="Eligible" />
                <Bar dataKey="ineligible" fill="#ef4444" name="Ineligible" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <FaFlask />
              <p>No trial data available</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>Eligibility Distribution</h3>
          {totals.total > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Patients']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <FaUsers />
              <p>No eligibility data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Trial Selection and Patient Data */}
      <div className="patient-data-section">
        <div className="section-header">
          <h3>Patient Data by Trial</h3>
          <div className="trial-selector">
            <select
              value={selectedTrial}
              onChange={(e) => setSelectedTrial(e.target.value)}
              className="form-select"
            >
              <option value="all">Select a trial to view patients</option>
              <option value="hypertension">Hypertension Trial</option>
              <option value="arthritis">Arthritis Trial</option>
              <option value="migraine">Migraine Trial</option>
              <option value="phase1">Phase 1 Trial</option>
            </select>
            {selectedTrial !== 'all' && patients.length > 0 && (
              <button className="export-btn" onClick={exportData}>
                <FaDownload />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {loadingPatients && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {selectedTrial !== 'all' && !loadingPatients && patients.length > 0 && (
          <div className="patients-table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  {Object.keys(patients[0]).map(key => (
                    <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 100).map((patient, index) => (
                  <tr key={patient.id || index}>
                    {Object.entries(patient).map(([key, value], i) => (
                      <td key={i} className={key === 'eligibility' ?
                        `eligibility ${value?.toString().toLowerCase()}` : ''}>
                        {key === 'created_at' && value ?
                          new Date(value).toLocaleDateString() :
                          value?.toString() || 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length > 100 && (
              <p className="table-footer">
                Showing first 100 patients out of {patients.length} total
              </p>
            )}
          </div>
        )}

        {selectedTrial !== 'all' && !loadingPatients && patients.length === 0 && (
          <div className="no-data">
            <FaUsers />
            <p>No patient data found for this trial</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;