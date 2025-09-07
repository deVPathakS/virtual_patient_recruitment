import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome,
  FaUser, 
  FaUpload, 
  FaChartBar 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose, currentPath }) => {
  const role = localStorage.getItem("role"); // get role from login

  // Menu items based on role
  const menuItems = role === "admin"
    ? [
        { path: '/bulk-upload', icon: FaUpload, label: 'Bulk Upload' },
        { path: '/analytics', icon: FaChartBar, label: 'Analytics' }
      ]
    : [
        { path: '/dashboard', icon: FaHome, label: 'Home' },
        { path: '/patient-application', icon: FaUser, label: 'Patient Application' }
      ];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <div className="menu-icon">
                  <IconComponent />
                </div>
                <div className="menu-content">
                  <span className="menu-label">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
