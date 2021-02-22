import React, { useState,useEffect } from "react";
import "./Delet.css";
import Axios from "axios";
import { Form,Button,Alert,Container,Row,Col,Card,Modal } from 'react-bootstrap';

const UpdateUser = () => {
  const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (id) => {

      console.log(id);
      
      setShow(true);
  }
  


  const [user, setUser] = useState([]);
const nom= JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    Axios.get("http://192.168.4.133:4000/afficheruser", {
      params: {
        id: nom.id,
      },
    }).then((response) => {
      setUser(response.data);
    });
  }, []);
  const update = (id) => {
    Axios.put("http://192.168.4.133:4000/updateUser", {
     params:{ id: id,}
    }).then((response) => {});
  };
  

  return (
    <div className="d-user">
      <h2> Modifier un utilisateur</h2>
      {user.map((val) => {
        return (
          <li key={val.id} >
            {val.prenom} {val.nom} <button onClick={handleShow(val.id)} >modifier</button>
          </li>
        );
      })}
<Modal
        
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group as={Col} md="9" >                            
                            <Form.Control id="nom_groupe_edit" as="textarea" placeholder="Nom" className="form-control"   required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                                      
                        <Form.Group as={Col} md="9" >                            
                            <Form.Control id="nom_groupe_edit" as="textarea" placeholder="Prénom " className="form-control"   required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                        <Form.Group as={Col} md="9" >                            
                            <Form.Control id="nom_groupe_edit" as="textarea" placeholder="Mot de passe" className="form-control"   required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
        
              
        </Modal.Body>
            
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary">Confirmer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default UpdateUser;