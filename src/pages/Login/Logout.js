import { URI_LOGOUT } from '../../util/UriConstants';

export async function logoutUser(checkLoginStatus, navigate) {
    try {
      const response = await fetch(URI_LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        await checkLoginStatus();
        const previousUrl = sessionStorage.getItem('previousUrl');
        navigate(previousUrl || '/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
}
  