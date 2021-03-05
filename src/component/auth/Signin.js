import React,{useState} from 'react';
import Axios from 'axios';

import { toast } from 'react-toastify'
import { Form,Button,Alert,Container,Row,Col } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";
import History  from  '../../history';
import './signin.css'
import img1 from './3350441.jpg';




    
    const Signin =(user)=> {
        
        
     const    [message, setMessage]=useState("");
     const    [username,setUsername]=useState("");
     const    [password,setPassword]=useState("");
     const    [show, setShow] = useState(false);
    
     

    
    
     const errorToast =()=>{
        toast("wrong username or password ",{
            className:"custom-toast",
            draggable: true,
            position : toast.POSITION.BUTTON_CENTER
        });
        };

     const changeUrl =()=>{
         History.push("/home"); 
     }
     

     const Join =()=>{
     Axios.post('http://192.168.4.133:4000/login',{
    username: username,
    password:password,
 
     }).then (result=>{
     
      if (result.data == "Login ou mot de passe incorrecte ." )
      {
        setMessage(result.data);
        setShow(true); 
      }
      else {
          
          localStorage.setItem('token',result.data.token);
          user=result.data.result[0];
          var avatar = user.avatar ;
          var salah ={id: user.id, nom: user.nom, prenom:user.prenom, etat:user.etat, status:user.status};
          localStorage.setItem('user',JSON.stringify(salah));
          localStorage.setItem('avatar',avatar);
          
          
           changeUrl();  
             }
    }
    )};
     const handleSubmit =(e)=>{
        e.preventDefault();
    
        setPassword(e.target.reset());
 }
    return ( 

        <Container fluid="xl">
        
        
        <Row className="mak">
        <Col className="mak">
                <h1 className="display-4">Se connecter<br></br><small className="text-muted">Bienvenue</small></h1>
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Identifiant</Form.Label>
                    <Form.Control type="Identifiant" placeholder="Identifiant"  onChange={(e)=>{setUsername(e.target.value)}} required />                    
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Mot de passe </Form.Label>
                
                    <Form.Control type="password" placeholder="Mot de passe"  onChange={(e)=>{setPassword(e.target.value)}}  required/>
                </Form.Group>
                <Alert show={show} variant="danger">
                    <Alert.Heading>{message}</Alert.Heading>
                </Alert>
                <Form.Group className="text-center">
                <Button variant="primary" type="submit" onClick={Join} className="btn-block" >
                    Se connecter
                </Button>
                </Form.Group>
                </Form>
          
        </Col>
        <Col>
            <img src={img1} width="100%"></img>
        </Col>
        </Row>
            

            </Container>
    )
}

export default Signin;