import { useState } from 'react';
import './style.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Auth from '../../utils/auth';
import{useMutation} from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';

function SignUp() {
    const [formState, setFormState] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [addUser, { error, data }] = useMutation(ADD_USER);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleFormSubmit = async(event) => {
        event.preventDefault();
        console.log(formState);

        try {
            const {data} = await addUser({
                variables: {...formState},
            });
            Auth.login(data.addUser.token);
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <section>
            <Container className="container">
                <div className="column">
                    <h1>Sign up</h1>
                    {data ? (
                        <p> Login Successful! You may now head {' '}
                        <Link to="/">back to the homepage.</Link></p>
                    ) : ( <>
                    <div className="column">
                        <Form onSubmit = {handleFormSubmit}>
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextUser">
                                <Form.Label column sm="2">Username</Form.Label>
                                <Col sm="10">
                                    <Form.Control type="username" name= "username" placeholder="name" value={formState.name} onChange={handleChange}/>  
                                </Col>   
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                <Form.Label column sm="2">Email</Form.Label>
                                <Col sm="10">
                                    <Form.Control type="email" name = "email" placeholder="name@email.com" value={formState.email} onChange={handleChange}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="2">Password</Form.Label>
                                <Col sm="10">
                                    <Form.Control type="password" name="password" value={formState.password} onChange={handleChange}/>
                                </Col>
                            </Form.Group>
                            <Button variant="primary" className="button" type="submit">Sign Up</Button>
                        </Form>
                    </div>
                        </>
                    )}

                </div>
            </Container>
        </section>
    )
};

export default SignUp;