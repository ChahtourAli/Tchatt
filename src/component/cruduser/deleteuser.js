import React, { useEffect, useState } from "react";
import "./Delet.css";
import Axios from "axios";
import Nav from '../home/Navbar'
const DeleteUser = () => {

const nom=JSON.parse(localStorage.getItem('user'));
const [userr, setUserr] = useState([]);
  
  useEffect(() => {
      
    Axios.get("http://192.168.4.133:4000/afficheruser", {
      params: {
        id: nom.id,
      },
    }).then((response) => {
        
      setUserr(response.data);
      
    });
  }, [userr]);


  const supprimer = (props) => {


    Axios.put("http://192.168.4.133:4000/delet", {
     params:{ id: props,}
    }).then((response) => {
        
   
    });
 
};

  return (

    <div className="d-user">
      <Nav />
      <h2> Supprimer un utilisateur</h2>
      <ul>
        {userr.map((val,index) => {


            
          return (
            <li key={index} >
              {val.nom} {val.prenom} <button onClick={()=>supprimer(val.id)}> Supprimer</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
    }
export default DeleteUser;