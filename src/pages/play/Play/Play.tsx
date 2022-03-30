import { Link, useNavigate } from 'react-router-dom';

export default function Play() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <Link to="/admin">Admin</Link>
      <button onClick={logout}>Logout</button>
      Play
    </div>
  );
}
