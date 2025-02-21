import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import { Container } from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (name: string, email: string) => {
    try {
      await authApi.login(name, email);
      authLogin();
      navigate('/search');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <LoginForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default LoginPage;
