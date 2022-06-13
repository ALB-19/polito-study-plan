import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react";


import Course from "../components/Course";


const EditPlan = (props) => {
    const [session, setSession] = useContext(AuthContext);
    const [planCourses, setPlanCourses] = useState(session.plan.courses);
    const [credits, setCredits]= useState(session.plan.Crediti);

    

    return (
        <div>
            <h4>Crediti attuali: {credits}</h4>
        </div>
    )
}

export default EditPlan;