import React, { useState, useEffect } from 'react';
import { URI_LOGIN } from '../../util/UriConstants';
import { AlertBox } from '../../components/alertbox/AlertBox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../util/AuthContext';


function Login () {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTrigger, setAlertTrigger] = useState(0);
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth();

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setAlertTrigger(Date.now());
  }

  // Store the previous URL on component mount
  useEffect(() => {
    sessionStorage.setItem('previousUrl', document.referrer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(URI_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      });

      if (response.ok) {
        await checkLoginStatus();
        const previousUrl = sessionStorage.getItem('previousUrl');
        navigate(previousUrl || '/');
      } else if (response.status === 403) {
        showAlert('Login failed. You do not have access to this resource.');
      } else {
        showAlert('Login failed. Please check your username and password.');
      }
    } catch (error) {
        console.error('Error:', error);
        showAlert('An unexpected error occurred.');
    }
  };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="PageTitle">Sign In</h2>
                    <form id="loginForm" onSubmit={handleSubmit}>
                        <AlertBox message={alertMessage} trigger={alertTrigger} />
                        <div className="form-group">
                            <label htmlFor="username" className="p-2">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                aria-describedby="usernameHelp"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="p-2">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <input type="hidden" id="redirectUrl" name="redirectUrl" value="" />
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary border-0 w-100 mt-3 p-2">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;