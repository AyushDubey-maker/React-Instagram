import React,{useState,useEffect} from 'react'
import './App.css';
import Post from './Post'

import {db,auth} from './firebase'
import {Modal,Button,Input} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [openLogIn,setOpenLogin]=useState(false);
  const [open,setOpen]=useState(false);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [username,setUsername]=useState('');
  const [user,setUser]=useState(null);
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=> ({id:doc.id,
        post:doc.data()})))
    })

  }, [])

  useEffect(()=>{
   const unsubscribe=  auth.onAuthStateChanged((authUser)=>{
      if(authUser){
         setUser(authUser)
         if(authUser.displayName){
           //dont update username
         }
      }else{
          setUser(null);
      }
    })
    return()=>{
      //Perform some Cleanup actions.
      unsubscribe();
    }
  },[user,username])
 
  //SignUp Function
  const signUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
     return authUser.user.updateProfile({
        displayName:username

      })
    })
    .catch((error)=>alert(error.message));
    setEmail('');
    setUsername('');
    setPassword('');
       setOpen(false)
  }
  
  //Login Function
  const logIn=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))
    setOpenLogin(false);
    setEmail('');
    setUsername('');
    setPassword('');

  }
  return (
    <div className="App">
     <Modal
   open={open}
   
   onClose={()=>setOpen(false)}
   
>
  <div style={modalStyle} className={classes.paper}>
    <form className="app__signUp">
    <center>
    <img className="app_headerImg" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png">
    </img>
    </center>

    <Input
    placeholder="Username"
    type="text"
    value={username}
    onChange={(e)=>setUsername(e.target.value)}
    />
    <Input
    placeholder="Email"
    type="email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    />
     <Input
    placeholder="Password"
    type="password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />
    <Button type="submit" disabled={!email} color="primary" variant="contained" onClick={signUp}>Sign-Up</Button>
    </form>
  </div>

</Modal>
<Modal
   open={openLogIn}
   
   onClose={()=>setOpenLogin(false)}
   
>
  <div style={modalStyle} className={classes.paper}>
    <form className="app__signUp">
    <center>
    <img className="app_headerImg" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png">
    </img>
    </center>
   
    <Input
    placeholder="Email"
    type="email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    />
     <Input
    placeholder="Password"
    type="password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />
    <Button type="submit" disabled={!email} color="primary" variant="contained" onClick={logIn}>Login</Button>
    </form>
  </div>

</Modal>
 
     {/* Header */}
     <div className="app_header">
       <img className="app_headerImg" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"></img>
     {user?(<div>
       <h2 className="user_name">{user.displayName}</h2>
       <Button color="secondary" variant="contained" onClick={()=>auth.signOut()}>LOGOUT</Button>
       </div>
       ):(
         <div className="app_login">
          
      <Button  onClick={()=>setOpenLogin(true)} color='primary' >Login</Button>
     
     <Button onClick={()=>setOpen(true)} color='primary' >SignUp</Button>
     </div>
     )}
     </div>
     {user?.displayName ?(
  <ImageUpload username={user.displayName}/>

  ):(
    <center>
   <h3 className="warning_text">Login to add Post and Caption</h3>
 </center>
)}
  {/* By giving key=id we will say the system to only re-render new posts */}
    
<div className="app_posts"> 
   {
       posts.map(({id,post})=>(
         <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}
       />
       ))
     }
     </div>
   
    
    
    </div>
  );
}

export default App;
 