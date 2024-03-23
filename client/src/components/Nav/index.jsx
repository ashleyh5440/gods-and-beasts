import '../Nav/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';

function Nav() {
    return (
      <section>
        <Button variant="primary"><NavLink to="/"></NavLink>Home</Button>
        <Button variant="primary">Contents</Button>
      </section>  
    )
};

export default Nav;
