import { Routes, Route, useLocation } from 'react-router-dom';
import AppContainer from './components/AppContainer';
import { useState, useEffect } from 'react';

import * as View from './views';
import api from './services/api';
import ProtectedRoute from './components/ProtectedRoute';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faClipboardList, faList, faPencil } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faList, faClipboardList, faPencil)

const App = () => {
  const location = useLocation();
  const [course, setCourse] = useState([]);

  useEffect(() => {
    api.getAllCourse()
      .then(courses => {
        setCourse(courses);
      })

      .catch(err => {
        if (err.status === 404) setCourse([]);
        else console.log(err.message) //SCRIVERE NOTIFY 

      })
  }, []);

  const pageNotFoundError = {
    status: 404,
    statusText: "Page Not Found",
    message: "Sorry, but the requested page does not exists..."
  };

  return (
    <AppContainer setCourse={setCourse}>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<View.Home course={course} />} />
        <Route path='/login' element={<View.LogIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/studyPlan' element={<View.StudyPlan course={course} />} />
          <Route path='/studyPlan/edit' element={<View.EditPlan course={course} />} />
        </Route>
        <Route path='*' element={<View.ErrorView error={pageNotFoundError} />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
