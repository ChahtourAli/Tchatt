import React,{useState,useEffect,} from 'react';
import Axios from 'axios';
import './sidebar.css';
import Socket from 'socket.io-client';
import { Form,Button,Col,Modal } from 'react-bootstrap';
import img1 from './aucunmsg.png';
import Moment from 'moment';
import { Buffer } from 'buffer';



const ENDPOINT="http://192.168.4.133:4000";

const  socket= Socket(ENDPOINT);


const Sidebar=()=> {
    const [user,setUser]=useState([]) ; 
    const [checked,setChecked]=useState(false);
    const [agent,setAgent]=useState([]);
    const [message, setMessage]=useState([]);
    const [msg,setMsg]=useState("");
    
    const [selectedFile,setSelectedFile]=useState(null);
    
    const [msgH,setMsgH]=useState([]);
    const [groupe,setGroupe]=useState([]);
    const [newg, setNewg]=useState("");
    const [affect, setAffect]=useState([]);
    const [nomG,setNomG]=useState("");
    const [currentUser,setCurrentUser]=useState("");
   
    
    const [show, setShow] = useState(false);

    const handleClose = () => { 
        setAffect([]);
        setShow(false)};
    const handleShow = () => {
        setAffect([]);
        setShow(true)};
    
    
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => 
    {   setAffect([]);
        setShow2(false);}
    const handleShow2 = () => {
        mod();
        setShow2(true);
    }
    
   



   const nom=JSON.parse(localStorage.getItem('user'));
    const desti=localStorage.getItem('desti');
    const gro =localStorage.getItem('groupe');



     
   
     const handleChange = (e) => {
       
        const id= e.target.value;
       
            if(e.target.checked){   
                if(affect.includes(id,1)){
               return null;
            }else{
                affect.push(id);
                
            }
            }
            else{
                setAffect(affect.filter(function(item) {
                    return item !== id
                    
                  }))
            }
        console.log(affect);
        
           }   
        
  
  const fetchData =()=>{
   Axios.all([
    Axios.get('http://192.168.4.133:4000/groupe',{params:{id:nom.id}}),
    Axios.get('http://192.168.4.133:4000/afficher',{params:{id:nom.id}})]).then((response)=>{
    
    setUser(response[1].data);
    setGroupe(response[0].data);
    
    })}
    
    
    useEffect( ()=>{
        fetchData();
        const interval = setInterval(()=>{
            fetchData();
        },1000);
        return ()=>clearInterval (interval);
             
    },[]);

  useEffect(()=>{
 

socket.emit('user_connected', nom.id)

        
socket.on('message-send',function(data){


    const destin_id = nom.id ;
    const expe_id = localStorage.getItem('desti') ;


    
    
    if(data.id_dest == destin_id){
    UpdateLu(destin_id , expe_id);
    }
    
    
     setMessage(prev=>[...prev,data]);

    
});
Axios.get("http://192.168.4.133:4000/derniermessage",{
    params:{
        id:nom.id,
    }}).then((response)=>{  

        if(typeof(response.data.result3) !== 'undefined' ){
            
            if(response.data.groupe!=null ){

            contact_groupe(response.data.result3[0].id) ;
                
            }
            else{
            Contact(response.data.result3[0].id) ;
            
            }


        }
        else{           
        }    
    })

    },[]);
        


    


const AjouterGroupe=()=>{
   
Axios.post("http://192.168.4.133:4000/new_groupe",{
nom:newg,
affectation:affect,
id_connected:nom.id,

}).then((response)=>{
    
    setAffect([]);
    handleClose(true);
  
   
})
}


      function Contact  (props) { 
          Axios.get('http://192.168.4.133:4000/message',{ 
           params:{ props:props,id:nom.id,}}).then((response)=>{


            setCurrentUser(response.data.result[0].id);
         
            
        //    document.querySelector('.envoyer').setAttribute('data-groupe','0') ;
              //alert();
              //document.querySelector('.users').addClass("aaaa");

            if(typeof(response.data.result) !== 'undefined' ){
                setMsgH([]);
              setMessage([]);
             setAgent([response.data.result[0]]);
            const l=response.data.result[0].id;
            localStorage.setItem('groupe',null);
            localStorage.setItem('desti',l);
                    setMessage([]);
             if(response.data.result2.length>0){
            for (var i=0;i<response.data.result2.length;i++){
          setMsgH(prev=>[...prev,response.data.result2[i]]);
          
          
    }
        }
        else{
            setMsgH(["aucunmsg"]);
        }     
            }    
        }
        )}


const UpdateLu = (destin , exped)=> {

    Axios.get('http://192.168.4.133:4000/update_lu',{
        params:{dest_id:destin , exp_id : exped}  
    }).then((response)=>{


    })


}



const contact_groupe =(props)=>{
    Axios.get('http://192.168.4.133:4000/message_groupe',{
        params:{props:props}  
    }).then((response)=>{
        setMsgH([]);
      //  document.querySelector('.envoyer').setAttribute('data-groupe','1') ;
        var group=[response.data.result[0].id];
     localStorage.setItem('groupe',group);
     localStorage.setItem('desti',null);
        setAgent([response.data.result[0]]);
        
        console.log(response.data.result2);
        if(response.data.result2.length>0){
            setMessage([]);
           
            for(var i=0;i<response.data.result2.length;i++){
                setMsgH(prev=>[...prev,response.data.result2[i]])
            }
           
        }
else 
{
    setMsgH(["aucune"]);
}
    })
}



const handleFileChange = (e) => {
  
    
  setSelectedFile(e.target.files[0]); 

  
    
} 

const Envoyer =(e)=>{
    
if(gro==null){
    
  if(selectedFile){
    e.preventDefault();
    socket.emit('chat', {
        message:msg,
        id_dest: agent[0].id,
        id_expe: nom.id,
        date:Moment(new Date()).format( 'DD-MM-yyyy HH:mm'),
        filename: selectedFile.name,
        filetype:selectedFile.type
        });

        
    }
    else{
        socket.emit('chat', {
            message:msg,
            id_dest: agent[0].id,
            id_expe: nom.id,
            date:Moment(new Date()).format( 'DD-MM-yyyy HH:mm'),
        
    }
    
    
    
    
        )};
}
else{
    if(selectedFile){
    
        socket.emit('chat_groupe', {
            message:msg,
            groupe: gro ,
            id_expe: nom.id,
            nom_expediteur:nom.nom +' '+ nom.prenom,
            date:Moment(new Date()).format( 'DD-MM-yyyy HH:mm'),
            filename: selectedFile.name,
        filetype:selectedFile.type
            });
        }
        else{
            socket.emit('chat_groupe', {
                message:msg,
                groupe: gro ,
                id_expe: nom.id,
                nom_expediteur:nom.nom +' '+ nom.prenom,
                date:Moment(new Date()).format( 'DD-MM-yyyy HH:mm'),
                
                });
            
        }
   
}
    setMsg("");
    
    handleUpload();
    
       
}
 const handleUpload = (e) => {

    
    const d= Moment(new Date()).format( 'DD-MM-yyyy HH:mm');
    const data = new FormData();
    data.append('file', selectedFile); 
    data.append( 'id_dest' , agent[0].id);
    data.append('id_expe' , nom.id);
    data.append('date' ,d); 
    Axios.post("http://192.168.4.133:4000/upload" ,
    data )
      .then((res) => {

        e.preventDefault();
        console.log(res.statusText);
      });
      return false ;
  };
const mod =()=>{
Axios.get('http://192.168.4.133:4000/modifiergroupe',{
    
    params:{id:gro,
}}).then((response)=>{
    setNomG(response.data[0].nom_groupe);
     for(var i=0 ; i<response.data.length ;i++){

        affect.push(response.data[i].utilisateur); 
     
    }
console.log(affect);

    

})}



const update =()=>{
Axios.post('http://192.168.4.133:4000/updategroupe',{
    nom:nomG,
    id:gro,
    affectation:affect,
    id_connected:nom.id,
}).then((response)=>{
    if(response.data=="groupe modifié"){
        alert('modification réussite');
        handleClose2 ();
    }
})
setAffect([]);
}


    return (
        <div className="wrapper"> 
            <nav id="sidebar">

            <div className="sidebar-header">
                <Button variant="light" style={{marginRight:"10px"}} onClick={handleShow}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></Button>
                <h3 style={{marginBottom: 0,lineHeight: 1.5}}><div style={{fontSize: 11}}>Bienvenu,</div><div style={{fontSize: 15}}>{nom.prenom} {nom.nom}</div></h3>                
            </div>

            <ul className="list-unstyled components">
           
              {user.map((val,index)=>{      
                  

                  if (val.etat==1){
                        if(val.derniere_date==null)
                        {
                            return (
                            <li className='users' data-us={val.id} key={val.id} id={val.id} onClick={()=>Contact(val.id)}><a> <figure className="avatar avatar-state-success"><span className={"avatar-title  rounded-circle letter"+ (val.prenom.substring(0,1)).toUpperCase()} >{val.prenom.substring(0,1)}</span></figure>   
                            <div className="users-list-body">
                                <div><h5 className="">{val.prenom} {val.nom} </h5>                                
                                <p>{(val.derniermsg==null) ? "..." : val.derniermsg}</p>
                            </div>
                            <div className="users-list-action">
                                <small className="text-muted"></small>
                                 { ( (val.nbr == 0)|| ( (val.nbr > 0) && (desti == val.id ) ) ) ?  <span className="notfication_msg_null" >{val.nbr}</span> :   <span className="notfication_msg" >{val.nbr}</span> }
                            </div>
                            </div>
                            </a></li> )



                        }else{
                            
                 return (<li className='users' data-us={val.id} key={val.id} id={val.id} onClick={()=>Contact(val.id)}><a> <figure className="avatar avatar-state-success"><span className={"avatar-title  rounded-circle letter"+ (val.prenom.substring(0,1)).toUpperCase()}>{val.prenom.substring(0,1)}</span></figure>    
                                      <div className="users-list-body">
                                          <div><h5 className="">{val.prenom} {val.nom} </h5>
                                          <p>{(val.derniermsg==null) ? "..." : val.derniermsg}</p>
                                      </div>
                                      <div className="users-list-action">
                                          <small className="text-muted">{val.derniere_date.substring(11)}</small>
                                            { ( (val.nbr == 0)|| ( (val.nbr > 0) && (desti == val.id ) ) ) ?  <span className="notfication_msg_null" >{val.nbr}</span> :   <span className="notfication_msg">{val.nbr}</span> }
                                      </div>
                                      </div>
                                      </a></li> );}
              }else{
                  if(val.derniere_date==null){
                   
                    return (<li className='users' data-us={val.id} key={val.id} id={val.id} onClick={()=>Contact(val.id)}><a> <figure className="avatar avatar-state-secondary"><span className={"avatar-title  rounded-circle letter"+ (val.prenom.substring(0,1)).toUpperCase()}>{val.prenom.substring(0,1)}</span></figure>  
                    <div className="users-list-body">
                        <div><h5 className="">{val.prenom} {val.nom} </h5>
                    <p>{(val.derniermsg==null) ? "..." : val.derniermsg}</p>
                    </div>
                    <div className="users-list-action">
                        <small className="text-muted"></small>
                         { ( (val.nbr == 0)|| ( (val.nbr > 0) && (desti == val.id ) ) ) ?  <span className="  notfication_msg_null" >{val.nbr}</span> :   <span className="notfication_msg">{val.nbr}</span> }
                    </div>
                    </div>
                    </a></li>);

                  }else{
                return (<li className='users' data-us={val.id} key={val.id} id={val.id} onClick={()=>Contact(val.id)}><a> <figure className="avatar avatar-state-secondary"><span className={"avatar-title  rounded-circle letter"+ (val.prenom.substring(0,1)).toUpperCase()}>{val.prenom.substring(0,1)}</span></figure>  
                                      <div className="users-list-body">
                                          <div><h5 className="">{val.prenom} {val.nom} </h5>
                                      <p>{(val.derniermsg==null) ? "..." : val.derniermsg}</p>
                                      </div>
                                      <div className="users-list-action">
                                          <small className="text-muted">{val.derniere_date.substring(11)}</small>
                                        { ( (val.nbr == 0)|| ( (val.nbr > 0) && (desti == val.id ) ) ) ?  <span className="notfication_msg_null" >{val.nbr}</span> :   <span className="notfication_msg">{val.nbr}</span> } 
                                      </div>
                                      </div>
                                      </a></li>);
                                      }
              
                }
                     }
                )}
                                 <hr/>
              {groupe.map((val)=>{
                 
                  return(
                         
                         <li className='users' key={val.id} id= {val.id} onClick={()=>{contact_groupe(val.groupe)}}><a> <figure className="avatar avatar-state-secondary"><span className={"avatar-title  rounded-circle letter"+ (val.nom_groupe.substring(0,1)).toUpperCase()}>{val.nom_groupe.substring(0,1)}</span></figure>   
                                      <div className="users-list-body">
                                          <div><h5 className="">{val.nom_groupe}</h5>
                                      <p>{(val.derniermsg==null) ? "..." : val.derniermsg}</p>
                                      </div>
                                      <div className="users-list-action">
                                          <small className="text-muted">{ val.derniere_date!=null ? val.derniere_date.substring(11) : "" }</small>
                                         {val.nbr == 0 ?  <span className= "notfication_msg_null" >{val.nbr}</span> :   <span className="notfication_msg">{val.nbr}</span> } 
                                      </div>
                                      </div>
                                      </a></li>
                         
                         
                         )
              })}

                
            </ul>
            </nav>

            <div className="content">

                <div className="chat">
                
                {agent.map((valeur)=>{
                  
                    
                    if((valeur.destinataire).includes('Groupe de discussion :') == true){
                        return (
                            <div key={valeur.id} className="chat_header">
                                <h5>{valeur.destinataire} {(nom.id==valeur.createdby) ? <a href="#" onClick={handleShow2}>modifier</a> : null}</h5>
                         </div>
                        )

                    }
                    else{

                        return (
                            <div key={valeur.id} className="chat_header">
                                <h5>{valeur.destinataire}</h5>
                        </div>
                        )

                    }

                })}
           
                    
                {agent.map((valeur)=>{
                    
                    return (
                    <div key={valeur.id} className="scrollbar-container">
                    <div  className="chat_body">
                        <div  className="messages">
                        {msgH.map((val,index)=>{
                        
                            if(msgH[0]=="aucunmsg"){
                                return (<div id="divempty" key={index} style={{textAlign:"center"}}>
                                        <img src={img1} width="50%" className="image"></img>                                        
                                        <div style={{textAlign:"center",color:"#2d353e",fontSize:"14px"}}>Vous n'avez aucune discussion pour le moment.</div></div>)
                            }else{
                                    if (val.expe===nom.id){
                                            return( 

                                                <div key={val.id} className="message-item2">                                                    
                                                {val.message ? <div  className="dest"> {val.message}  </div> : null}
                                                <div  className="message-avatar2">

                                                {val.type_file ? (val.type_file.split("/")[0] == "image" ? <img src={`uploads/${val.filepath}`}/> : (val.type_file.split("/")[0] == "audio" ? <audio controls><source src={`uploads/${val.filepath}`} type={val.type_file}/></audio> : (val.type_file.split("/")[0] == "video" ? <video width="320" height="240" controls src={`uploads/${val.filepath}`} type={val.type_file}></video> : (val.type_file.split("/")[0] == "application" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :(val.type_file.split("/")[0] == "text" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :null ) ))) )  : null}

                                                <div ><div  className="time">{val.date}</div>
                                                </div>
                                                </div>
                                                </div> 
                                            )
                                        }
                                        else{
                                            return(
                                                <div key={val.id} className="message-item">                                                    
                                                {val.message ? <div  className="dest"> {val.message}  </div> : null}
                                                <div  className="message-avatar">
                                                {val.type_file ? (val.type_file.split("/")[0] == "image" ? <img src={`uploads/${val.filepath}`}/> : (val.type_file.split("/")[0] == "audio" ? <audio controls><source src={`uploads/${val.filepath}`} type={val.type_file}/></audio> : (val.type_file.split("/")[0] == "video" ? <video width="320" height="240" controls src={`uploads/${val.filepath}`} type={val.type_file}></video> : (val.type_file.split("/")[0] == "application" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :(val.type_file.split("/")[0] == "text" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :null ) ))) )  : null}
                                                <div ><div className="time">{val.date}</div>
                                                </div>
                                                </div>
                                                </div>  ) 
                                            
                                    }




                                }
                       
                                        
                                    
                      })}
                       
                       
        
              {message.map((val)=>{


        

                
                if(val.groupe==null){
                    if((desti == val.id_expe)&&(val.id_dest==nom.id)||((val.id_expe==nom.id)&&(desti == val.id_dest))){

                    var classli = ((desti==val.id_expe)) ? "exp" : "dest";

                    var classit = ((desti==val.id_expe)) ? "li_new message-item" : "li_new message-item2";


                    var selection = document.querySelector('#divempty') !== null;

                    if (selection) {
                        document.querySelector('#divempty').remove();
                    }
                    

                                return( <div key={val.id}  className={classit}>                                                    
                                {val.message ? <div  className="dest"> {val.message}  </div> : null}
                                <div  className="message-avatar2">
                                {val.type_file ? (val.type_file.split("/")[0] == "image" ? <img src={`uploads/${val.filepath}`}/> : (val.type_file.split("/")[0] == "audio" ? <audio controls><source src={`uploads/${val.filepath}`} type={val.type_file}/></audio> : (val.type_file.split("/")[0] == "video" ? <video width="320" height="240" controls src={`uploads/${val.filepath}`} type={val.type_file}></video> : (val.type_file.split("/")[0] == "application" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :(val.type_file.split("/")[0] == "text" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :null ) ))) )  : null}
                                <div ><div  className="  time">{val.date}</div>
                                </div>
                                </div>
                                </div> )
                                
                    }
                            
                            
                            
                }
                else if(gro == val.groupe){
                 
                    var selection = document.querySelector('#divempty') !== null;

                    if (selection) {
                        document.querySelector('#divempty').remove();
                    }
                    
                                        if(nom.id==val.id_expe){
                                return(<div key={val.id} className="message-item2">                                                    
                                <div  className="dest">{val.nom_expediteur} {val.message} </div>
                                <div  className="message-avatar2">
                                {val.type_file ? (val.type_file.split("/")[0] == "image" ? <img src={`uploads/${val.filepath}`}/> : (val.type_file.split("/")[0] == "audio" ? <audio controls><source src={`uploads/${val.filepath}`} type={val.type_file}/></audio> : (val.type_file.split("/")[0] == "video" ? <video width="320" height="240" controls src={`uploads/${val.filepath}`} type={val.type_file}></video> : (val.type_file.split("/")[0] == "application" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :(val.type_file.split("/")[0] == "text" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :null ) ))) )  : null}
                                <div ><div  className="time">{val.date}</div>
                                </div>
                                </div>
                                </div>)}
                                else{
                                return(<div key={val.id} className="message-item">                                                    
                                <div  className="exp">{val.nom_expediteur} {val.message} </div>
                                <div  className="message-avatar">
                                {val.type_file ? (val.type_file.split("/")[0] == "image" ? <img src={`uploads/${val.filepath}`}/> : (val.type_file.split("/")[0] == "audio" ? <audio controls><source src={`uploads/${val.filepath}`} type={val.type_file}/></audio> : (val.type_file.split("/")[0] == "video" ? <video width="320" height="240" controls src={`uploads/${val.filepath}`} type={val.type_file}></video> : (val.type_file.split("/")[0] == "application" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :(val.type_file.split("/")[0] == "text" ? <a  href={`uploads/${val.filepath}`}  target="_blank">{val.filepath}</a> :null ) ))) )  : null}
                                <div ><div className="time">{val.date}</div>
                                </div>
                                </div>
                                </div> )}

                }
                    
                
                            
                })}
 


                    </div></div></div>)
                })}
              
                
                        <div className="chat_footer">
                        
                        <Form>
                        <Form.Row>
                        <Form.Group as={Col} md="1" style={{display:"none"}}>
                            <Button variant="light">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg></Button>    
                        </Form.Group>
                            
                        <Form.Group as={Col} md="10">                            
                            <Form.Control as="textarea" placeholder="Tapez un message..." className="form-control" value={msg}  onChange={(e)=>{setMsg(e.target.value)}}  required rows={1} style={{width:"100%" }} />
                        </Form.Group>                       
                        
                        <Form.Group as={Col} md="2">
                        <input name="file" variant="light" type="file" onChange={handleFileChange} />
                            
                        <Button variant="primary" type="button" className="envoyer" data-groupe="" onClick={Envoyer} style={{marginLeft:"10px"}} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </Button>
                        </Form.Group>
                        </Form.Row>

                        
                        </Form>

                        </div>
                           
                           
                           <>
      

      <Modal
        id="new_groupe"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary2 text-white">
          <Modal.Title>Nouveau Groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
              <Form.Group as={Col} md="12" >                            
                            <Form.Control as="input" placeholder="Nom de groupe" className="form-control"  onChange={(e)=>{setNewg(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                                      
              
        
        <Form.Group as={Col} md="12"  >
            <Form.Label>Affecter les agents dans votre groupe</Form.Label>
           
            {user.map((val)=>{
        
                return(
                    <ul key={val.id} id={val.id}>
                    <label>
      <input type="checkbox"
        defaultChecked={checked}
        value={val.id}
        onChange={handleChange}
       />
     {val.prenom} {val.nom}
    </label> 
    </ul> 
       )            
    })}
           
            
           
        </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={AjouterGroupe}>Confirmer</Button>
        </Modal.Footer>
      </Modal>




      <Modal
        id="update_groupe"
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-primary2 text-white">
          <Modal.Title>Modifier Groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group as={Col} md="12">                            
                            <Form.Control id="nom_groupe_edit" value={nomG} as="input" placeholder="Nom de groupe" className="form-control"  onChange={(e)=>{setNomG(e.target.value)}}  required rows={1} style={{width:"100%" }}/>
                        </Form.Group>
                                      
              
        
        <Form.Group  as={Col} md="12" >
            <Form.Label>Affecter les agents dans votre groupe</Form.Label>
           
            {user.map((val)=>{

                var chk = ''
                if(affect.includes(val.id) == true){
                
                return(
  <ul key={val.id} id={val.id}>
         <label>           
     <input type="checkbox"
        value={val.id}
        onChange={handleChange}
         checked />   
     {val.prenom} {val.nom} 
    </label> 
    </ul> 
                )

            }
            else{
                return(
                    <ul key={val.id} id={val.id}>
                           <label>           
                       <input type="checkbox"
                          value={val.id}
                          onChange={handleChange}
                            />   
                       {val.prenom} {val.nom} 
                      </label> 
                      </ul> 
                                  )


            }


                 })}
           
            
            
        </Form.Group>
              
        </Modal.Body>
            
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Fermer
          </Button>
          <Button variant="primary" onClick={update}>Confirmer</Button>
        </Modal.Footer>
      </Modal>


    </>

                  
                </div>
            </div>

        </div>

    )
}
export default Sidebar
