import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider,useKeycloak } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import App from './App';
import reportWebVitals from './reportWebVitals';
export class BuruxAuth extends Component {
  render(){
    let authClient = new Keycloak({
      "clientId":'Club',
      "realm": "burux",
      "url": "https://iam.burux.com/auth/",
      "ssl-required": "external",
      "resource": "Club",
      "public-client": true,
      "confidential-port": 0
    })
    return (<div><ReactKeycloakProvider authClient={authClient}><Login/></ReactKeycloakProvider></div>);
  }
}
function Login(){
  const obj = useKeycloak();
  let {authenticated} = obj.keycloak;
  if(!authenticated){
    let {login} = obj.keycloak; 
    try {login()} catch{let a = '';}
    return null
  }
  let {logout,tokenParsed} = obj.keycloak;
  return (
    <InternalLogin
      tokenParsed={tokenParsed} logout={logout}
    />
  )
}
class InternalLogin extends Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    return <App {...this.props}/>
  }
}

ReactDOM.render(
    <BuruxAuth />
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
