import React,{useState} from 'react'
import {Navbar,Nav,NavDropdown} from 'react-bootstrap';
import Axios from 'axios';
import History  from  '../../history';

import { faHome,faUsers,faSignOutAlt,faHistory,faUserFriends,faUsersCog,faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

 const Navbarr =()=> {
     const nom=JSON.parse(localStorage.getItem('user'));

     
    const changeUrl =()=>{
        History.push("/home"); 
      
    }
    
const deconnexion =()=>{
    Axios.get("http://192.168.4.133:4000/deconnexion",{
        
        params:{
            id:nom.id,
        }}).then(()=>{
        changeUrl();
        
    })
    window.localStorage.clear();
}


    return (
       
        <Navbar collapseOnSelect expand="lg" >
            <Navbar.Brand href={"/home"} className="logo">
            
            <FontAwesomeIcon icon={faCommentDots} />
        
            <h4 style={{marginLeft:"10px",color:"#8f9dae"}}>Tchat</h4>
        
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                <Nav>
                
               
                <Nav.Link href={"/home"} title="Tchat"><FontAwesomeIcon icon={faCommentDots} /></Nav.Link>
                {nom.id===26 ? 
                 <Nav>
                <Nav.Link href={"/gerer"} title="Gestion des utilisateurs" ><FontAwesomeIcon icon={faUsersCog} /></Nav.Link> 
                <Nav.Link href={"/historique"} title="Historique des utilisateurs"><FontAwesomeIcon icon={faUserFriends} /></Nav.Link>
                <Nav.Link href={"/historique2"} title="Historique des Groupes"><FontAwesomeIcon icon={faUsers} /></Nav.Link> 
                </Nav>
           : null
           }
                              
                <Nav.Link href={"/"} onClick={deconnexion} title="Se déconnecter"><FontAwesomeIcon icon={faSignOutAlt} /></Nav.Link> 
                
                </Nav>
               
            </Navbar.Collapse>
        </Navbar>
        
        
    )
}
export default Navbarr