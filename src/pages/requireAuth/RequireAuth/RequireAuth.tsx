import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Location } from '../../../services/models';

export default function RequireAuth() {
  const navigate = useNavigate();
  const location: Location = useLocation();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      location.pathname === '/' && navigate('/play', { replace: true });
    } else {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [token]);

  return token ? <Outlet /> : <div></div>;
}
