import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    async function Logout() {
        const response = await fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' });

        if (!response.ok) {
          alert("Logout failed");
        } else {
          const data = await response.json();
          console.log(data);

          navigate('/'); 
        }
    }
    
    Logout();
  }, []);
  return null;
}