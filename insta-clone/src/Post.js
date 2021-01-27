import React,{useState,useEffect} from 'react'
// import Course from './course.jpg'
import './Post.css'
import {Avatar,Modal,Input,Button} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import firebase from 'firebase'
import {makeStyles} from '@material-ui/core/styles'
import { db } from './firebase'
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
function Post({postId,user,username,caption,imageUrl}) {
    const classes = useStyles();
   // const [modalStyle] = React.useState(getModalStyle);
    const [open,setOpen]=useState(false);
    const [comments,setComments]=useState([])
    const [comment,setComment]=useState('')
    const [input,setInput]=useState('');
    //
    

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe=db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()));
            //   SnapShot listener for comments of posts          
            })
            // .catch((error)=>alert(error.message))
        }
        return()=>{
            unsubscribe();
        };
      
    }, [postId])

    //Add comment Function
    const postComment=(e)=>{
         e.preventDefault()
        db.collection('posts').doc(postId).collection('comments').add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()

        })
        .catch((error)=>alert(error.message))
        setComment('')
    }
    const deletePost=()=>{
        if(user.displayName===username){
             
            db.collection('posts')
            .doc(postId).delete()
            
        }else{
          alert('You cannot delete other users post...Sorry')
        }
    }
    const handleOpen=()=>{
        setOpen(true)
    }
    const handleClose=()=>{
        setOpen(false)
    }
    const updateTodo=()=>{
        if(username){
            db.collection('comments').doc(postId).set({
                text:input
              },{merge:true})
                setOpen(false)
                setInput('')
        }else{
            alert('You cannot edit others comments..Sorry')
        }
    }
    return (
        <div className="post">
           
              <Modal open={open} onClose={handleClose} className="modal">
            <div className={classes.paper}>
            <CancelIcon onClick={handleClose} color="secondary"></CancelIcon>
            <h2>Update To-Do</h2>
            <Input  value={input} onChange={event=> setInput(event.target.value)}/>
           <Button onClick={updateTodo} color="primary" variant="contained">Update</Button>
            </div>
        </Modal>
            
            <div className="post_header">

            <Avatar 
            className="post__avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"
            />
            <h3>{username}</h3>
            {user  &&(
            <button className="delete_button" onClick={deletePost}>
             <DeleteIcon />
            </button>
            )}
            </div>
           {/* header-->avatar+username  */}
          <img src={imageUrl} className="post__image"></img> 
          <h4 className="post__Text"><strong>{username}</strong>:{caption}</h4>
          <div className="post_comments">
              <h3 className="comment_tag">Comments:</h3>
              {
                  comments.map((comment)=>(
                      <div className="updateComment">
                   <p>
                       <strong>{comment.username}</strong> :{comment.text}
                   </p>
                   {user &&(
                   <EditIcon onClick={handleOpen} color="primary" className="edit_button">Edit Me</EditIcon>
                   )}
                   </div>
                  ))
              }

          </div>
          {user && (
          <form className="comment_form">
           <input
           className="post_input"
           type="text"
           placeholder="Add a comment"
           value={comment}
           onChange={(e)=>setComment(e.target.value)}
           />
           <button type="submit" disabled={!comment}  onClick={postComment} color="primary" className="comment_btn" >POST</button>
           
          </form>
          )}
        </div>
    )
}

export default Post
