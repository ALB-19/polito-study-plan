import { createContext, useEffect, useState } from 'react'
import api from '../services/api';
import { Spinner } from 'react-bootstrap';
import useNotification from '../hooks/useNotification';

const AuthContext = createContext([{}, () => { }]);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const notify = useNotification();

    useEffect(() => {
        api.getUserInfo()
            .then((user) => {
                setUser({ user: { ...user }, plan: null, loggedIn: true });
                api.getStudyPlan()
                    .then((plan) => {
                        setUser({ user: { ...user }, plan: { ...plan }, loggedIn: true })
                    })
                    .catch((error) => {
                        if (error.status === 404) setUser({ user: { ...user }, plan: null, loggedIn: true })
                        else notify.error(error.data)
                    })
            })
            .catch(() => {
                setUser({ user: undefined, loggedIn: false });
            })
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (user) {
        return (
            <AuthContext.Provider value={[user, setUser]}>
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <div className='h-100 d-flex align-items-center justify-content-center'>
            <Spinner animation='border' variant='primary' className='opacity-25' />
        </div>
    );
}

export { AuthContext, AuthProvider };