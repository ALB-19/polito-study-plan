import { createContext, useEffect, useState } from 'react'
import api from '../services/api';
import { Spinner } from 'react-bootstrap';
import useNotification from '../hooks/useNotification';

const AuthContext = createContext([{}, () => { }]);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ user: null, plan: null, loggedIn: false });
    const [dirty, setDirty] = useState(true); // lo usiamo per ricaricare le info dell'utente 
    const notify = useNotification();
    

    useEffect(() => {
        if (dirty)
            api.getUserInfo()
                .then((user) => {
                    setUser((old) => ({ ...old, user: { ...user }, loggedIn: true }));
                    api.getStudyPlan()
                        .then((plan) => {
                            setUser((old) => ({ ...old, plan: { ...plan } }))
                            setDirty(false);
                        })
                        .catch((error) => {
                            if (error.status === 404)  setUser((old) => ({ ...old, plan: null }))
                            else notify.error(error.data)
                            setDirty(false);
                        })
                })
                .catch(() => {
                    setUser({ user: null, plan: null, loggedIn: false });
                    setDirty(false);
                })
    }, [dirty]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!dirty) {
        return (
            <AuthContext.Provider value={[user, setUser, setDirty]}>
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