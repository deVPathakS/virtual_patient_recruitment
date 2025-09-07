import React, { useState, useEffect } from 'react';
import { 
  FaHeartbeat, 
  FaBone, 
  FaBrain, 
  FaVial, 
  FaArrowLeft, 
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

const PatientApplication = () => {
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const trialTypes = [
    {
      id: 'hypertension',
      name: 'Hypertension Trial',
      description: 'Clinical trial for hypertension treatment and blood pressure management',
      icon: FaHeartbeat,
      color: 'red'
    },
    {
      id: 'arthritis',
      name: 'Arthritis Trial', 
      description: 'Rheumatoid arthritis treatment study with new therapeutic approaches',
      icon: FaBone,
      color: 'orange'
    },
    {
      id: 'migraine',
      name: 'Migraine Trial',
      description: 'Migraine prevention medication trial for chronic sufferers',
      icon: FaBrain,
      color: 'purple'
    },
    {
      id: 'phase1',
      name: 'Phase 1 Trial',
      description: 'Phase 1 safety and dosage study for new investigational drugs',
      icon: FaVial,
      color: 'blue'
    }
  ];

  useEffect(() => {
    if (selectedTrial) {
      fetchFormFields();
    }
  }, [selectedTrial]);

  const fetchFormFields = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTrialFields(selectedTrial);
      setFormFields(response.data);
      
      // Initialize form data with default values
      const initialData = {};
      response.data.forEach(field => {
        if (field.options && field.options.length > 0) {
          // For select fields, don't set a default to force user selection
          initialData[field.name] = '';
        } else {
          initialData[field.name] = '';
        }
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error fetching form fields:', error);
      toast.error('Failed to load form fields');
    } finally {
      setLoading(false);
    }
  };

  const handleTrialSelect = (trialId) => {
    setSelectedTrial(trialId);
    setFormData({});
    setResult(null);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = formFields.filter(field => field.required);
    const missingFields = [];

    requiredFields.forEach(field => {
      const value = formData[field.name];
      if (value === '' || value === null || value === undefined) {
        missingFields.push(field.label);
      }
    });

    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // Convert form data to appropriate types
      const processedData = {};
      formFields.forEach(field => {
        let value = formData[field.name];
        
        if (field.type === 'number') {
          value = parseFloat(value) || 0;
        } else if (field.type === 'select' && field.options) {
          // For select fields with value/label options, use the value
          const option = field.options.find(opt => opt.value == value || opt.label === value);
          if (option && typeof option === 'object' && 'value' in option) {
            value = option.value;
          }
        }
        
        processedData[field.name] = value;
      });

      const response = await apiService.submitPatientApplication({
        trial_type: selectedTrial,
        patient_data: processedData
      });

      setResult(response.data);
      toast.success('Application submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormField = (field) => {
    const value = formData[field.name] || '';

    if (field.type === 'select') {
      return (
        <select
          className="form-select"
          value={value}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          required={field.required}
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option, index) => (
            <option 
              key={index} 
              value={typeof option === 'object' ? option.value : option}
            >
              {typeof option === 'object' ? option.label : option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        className="form-input"
        value={value}
        onChange={(e) => handleInputChange(field.name, e.target.value)}
        min={field.min}
        max={field.max}
        step={field.step}
        required={field.required}
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
    );
  };

  const resetApplication = () => {
    setSelectedTrial(null);
    setFormData({});
    setResult(null);
    setFormFields([]);
  };

  if (result) {
    return (
      <div className="patient-application fade-in">
        <div className="application-result">
          <div className={`result-card ${result.eligibility === 'Eligible' ? 'success' : 'failure'}`}>
            <div className="result-icon">
              {result.eligibility === 'Eligible' ? (
                <FaCheckCircle className="success-icon" />
              ) : (
                <FaTimesCircle className="error-icon" />
              )}
            </div>
            
            <h2>Application Result</h2>
            <div className="result-status">
              <span className={`status-badge ${result.eligibility === 'Eligible' ? 'eligible' : 'ineligible'}`}>
                {result.eligibility}
              </span>
            </div>
            
            <p className="result-message">{result.message}</p>
            
            <div className="result-details">
              <p><strong>Patient ID:</strong> #{result.patient_id}</p>
              <p><strong>Trial Type:</strong> {result.trial_type}</p>
              <p><strong>Application Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="result-actions">
              <button className="submit-btn" onClick={resetApplication}>
                Submit Another Application
              </button>
            </div>
            
            {result.eligibility === 'Eligible' && (
              <div className="next-steps">
                <h3>Next Steps</h3>
                <p>Congratulations! You are eligible for this clinical trial. 
                   Our research team will contact you within 2-3 business days with further instructions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTrial) {
    return (
      <div className="patient-application fade-in">
        <div className="application-header">
          <h1>Patient Application</h1>
          <p>Select a clinical trial to check your eligibility and apply for participation</p>
        </div>

        <div className="trial-selector">
          <h2>Available Clinical Trials</h2>
          <div className="trials-grid">
            {trialTypes.map((trial) => {
              const IconComponent = trial.icon;
              return (
                <div 
                  key={trial.id} 
                  className={`trial-card clickable ${trial.color}`}
                  onClick={() => handleTrialSelect(trial.id)}
                >
                  <div className="trial-icon">
                    <IconComponent />
                  </div>
                  <h3>{trial.name}</h3>
                  <p>{trial.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-application fade-in">
      <div className="dynamic-form">
        <div className="form-header">
          <button className="back-btn" onClick={() => setSelectedTrial(null)}>
            <FaArrowLeft />
            Back to Trials
          </button>
          <h2>{trialTypes.find(t => t.id === selectedTrial)?.name} Application</h2>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <form className="patient-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {formFields.map((field, index) => (
                <div key={index} className="form-field">
                  <label className="form-label">
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  {renderFormField(field)}
                  {field.min !== undefined && field.max !== undefined && (
                    <small className="field-hint">
                      Range: {field.min} - {field.max}
                    </small>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="spinning" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PatientApplication;
