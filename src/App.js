import Signin from './component/auth/Signin.js'
import Gerer from './component/cruduser/gerer'
import Historique from './component/hisotrique';
import Historique2 from './component/hisotrique2';
import Home from './component/home/Home'
import React from 'react';
import {Switch,Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from "./component/privateRoute";





function App() { 


  return (
    <div className="Container">
    <Switch>
      <PrivateRoute path="/historique"  component={Historique} /> 
      <PrivateRoute path="/historique2" component={Historique2} /> 
       <PrivateRoute path="/home" component={Home} />  
         <Route exact path="/"  component={Signin} />
        <PrivateRoute path="/gerer" component={Gerer} />
        
        
    </Switch>
    </div>

  );
}

export default App;
