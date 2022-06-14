import { NavLink } from 'react-router-dom';
import { Col, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = () => {
   
    const filters = [
        { label: 'Offerta formativa', url: '/', icon: 'list' },
        { label: 'Piano Di studio', url: '/studyPlan', icon: 'clipboard-list' },
    ];
    

    return (
            <Nav className="flex-column gap-2 d-flex py-3" variant='pills'>
                {filters.map((filter, index) => {
                    return (
                        <NavLink 
                            key={index}
                            to={filter.url} 
                            className={ ({ isActive }) => `d-flex sidebar-item align-items-center rounded-3 text-decoration-none bg-white p-3 ${isActive ? 'text-danger' : 'text-black'}`}
                        >
                            <FontAwesomeIcon icon={filter.icon} size='lg' className='me-3' />                   
                            {filter.label}
                        </NavLink>
                    );
                })}
            </Nav>
    );
}

export default Sidebar;