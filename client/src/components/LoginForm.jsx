import { useState, useContext } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Formik, Form } from "formik";
import api from '../services/api';
import Input from "./Input";
import { AuthContext } from "../contexts/AuthContext";
import useNotification from '../hooks/useNotification';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [, , setDirty] = useContext(AuthContext);
    const notify = useNotification();
    const navigate = useNavigate();

    const LoginSchema = Yup.object().shape({
        username: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Required')
    });

    const handleSubmit = (credentials) => {
        setLoading(true);
        api.login(credentials)
            .then(user => {
                setDirty(true);
                // setSession({ user: { ...user }, loggedIn: true });
                notify.success(`Benvenuto ${user.name}!`)
                navigate('/', { replace: true });
            })
            .catch(err => notify.error(err))
            .finally(() => setLoading(false));
    }

    return (
        <Formik initialValues={{ username: '', password: '' }} validationSchema={LoginSchema}  onSubmit={(values) => handleSubmit(values)}>
            {({ touched, isValid }) => {
                const disableSubmit = (!touched.username && !touched.password) || !isValid || loading;
                return (
                    <Form>
                        <Input id="login-Email" name="username" type="email" placeholder="Inserisci il tuo indirizzo email" label="Email" />
                        <Input id="login-password" name="password" type="password" placeholder="Inserisci la tua password" label="Password" />
                        <Button variant={`secondary`} type="submit" className='p-3 rounded-3 my-4 w-100 fw-semibold' disabled={disableSubmit}>
                            {loading && <Spinner animation='grow' size='sm' as='span' role='status' aria-hidden='true' className='me-4' />}
                            Accedi
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default LoginForm;