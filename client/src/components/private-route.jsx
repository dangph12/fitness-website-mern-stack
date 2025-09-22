import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const PrivateRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector(state => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    const isAdminRoute =
      allowedRoles.includes('admin') && !allowedRoles.includes('user');
    const loginPath = isAdminRoute ? '/admin/login' : '/auth/login';

    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-4'>
        <h2 className='text-xl font-semibold'>Access Denied</h2>
        <p className='text-gray-600'>
          You need to be logged in to access this page.
        </p>
        <button
          onClick={() => navigate(loginPath)}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Go to Login
        </button>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
