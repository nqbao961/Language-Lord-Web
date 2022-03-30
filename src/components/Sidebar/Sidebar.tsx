import { Link } from 'react-router-dom';
import { adminRoutes } from '../../services/router/routes';

export function Sidebar() {
  return (
    <ul className="App-nav-list">
      {adminRoutes.map((route, i) => (
        <li key={i} className="App-nav-item">
          <Link to={route.path!}>{route.title}</Link>
        </li>
      ))}
    </ul>
  );
}
