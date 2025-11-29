import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/weatherboard.css';

function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const linkItems = [
    { label: '매출 입력', path: '/sales-input' },
    { label: '통계', path: '/stats' },
    { label: '매출 리스트', path: '/sales-list' },
  ];

  return (
    <div className="wb-topnav">
      <div className="wb-topnav-inner">
        <div className="wb-topnav-title">웨더보드</div>
        {linkItems.map((item) => (
          <div
            key={item.path}
            className={
              'wb-topnav-link' +
              (location.pathname === item.path ? ' wb-topnav-link-active' : '')
            }
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopNav;