import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Home = () => {
  const [userPhone, setUserPhone] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserPhone(user.phoneNumber);
    } else {
      navigate('/login');
    }
  }, [auth, navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <div className="container text-center" style={{ height: '100vh' }}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
          <p className="mt-3">Phone Number: {userPhone}</p>
          <Button variant="danger" onClick={handleLogout} className="mt-4 w-100">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
