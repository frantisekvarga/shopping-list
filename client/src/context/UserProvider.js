import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/api/token/refresh'); 
      const { accessToken } = response.data;
      localStorage.setItem('userToken', accessToken);
      Cookies.set('userToken', accessToken, { expires: 1 }); 
      return accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout(); 
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      let token = Cookies.get('userToken') || localStorage.getItem('userToken');
      
      if (token) {
        try {
          let decodedUser = jwtDecode(token); 
          const currentTime = Date.now() / 1000;
  
          
          if (decodedUser.exp < currentTime) {
            token = await refreshAccessToken();
            decodedUser = jwtDecode(token);
          }
  
          setUser(decodedUser);
        } catch (error) {
          console.error('Error decoding token:', error);
          logout();
        }
      }
  
      setIsLoading(false);
    };
  
    initAuth();
  }, []);
  
  

  const login = (userData) => {
    const { token } = userData;
    localStorage.setItem('userToken', token);
    Cookies.set('userToken', token, { expires: 7 });
    const parsedUserData = jwtDecode(token); 
    setUser(parsedUserData);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    Cookies.remove('userToken');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
