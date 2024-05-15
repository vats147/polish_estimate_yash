import React, { Children } from 'react'
import { useContext, useState, createContext } from 'react'
import { useEffect } from 'react'

const AuthContext = createContext(null);

export const Auths = ({ children }) => {
    
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('roled');
        localStorage.removeItem('useremail');
        localStorage.removeItem('emailotp');
        
    

    };

    useEffect(() => {
        // Set up event listener to persist user data when storage changes
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up event listener when component unmounts
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}

// export default Auths