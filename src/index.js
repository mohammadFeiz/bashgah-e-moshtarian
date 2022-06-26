import React,{Component} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReactKeycloakProvider,useKeycloak } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
class BuruxAuth extends Component {
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
  let {preferred_username:username,email,groups,name} = tokenParsed;
  console.log(obj.keycloak)
  return (
    <InternalLogin
      data={{username,email,groups,logout,groups,name,token:obj.keycloak.token}}
    />
  )
}
class InternalLogin extends Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  logout(){
    let {data} = this.props;
    data.logout()
  }
  render(){
    let {app,urls,setting} = this.state;
    let {data} = this.props;
    let props = {
      user:{
        username:data.username,
        name:data.name
      },
      logout:()=>this.logout(),
      groups:data.groups,
    };
    return <App {...data} logout={()=>this.logout()}/>
  }
}











const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BuruxAuth />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
