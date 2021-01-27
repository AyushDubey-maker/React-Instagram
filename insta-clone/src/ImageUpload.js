import React,{useState} from 'react'
import {Input,Button, Modal} from '@material-ui/core'
import './ImageUpload.css'
import {db,storage} from './firebase'
import firebase from 'firebase'

function ImageUpload({username}) {
    const [image,setImage]=useState(null);
    const [progress,setProgress]=useState(0);
    const [caption,setCaption]=useState('');
    const [open,setOpen]=useState(false)

    const handleChange=(e)=>{
        e.preventDefault();
 if(e.target.files[0]){
    setImage(e.target.files[0]);
}
    };
    const handleUpload=()=>{
       //Adding Posts to the Firebase
       const uploadTask=storage.ref(`images/${image.name}`).put(image);
       uploadTask.on(
           "state_changed",
           (snapshot)=>{
               //Progress Function
               const progress=Math.round(
                   (snapshot.bytesTransferred/snapshot.totalBytes)*100
               );
               setProgress(progress);
           },
           (error)=>{
               console.log(error);
               alert(error.message);
           },
           ()=>{
               //complete function....
               storage
               .ref('images')
               .child(image.name)
               .getDownloadURL()
               .then(url=>{
                   db.collection('posts').add({
                       timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                       caption:caption,
                       imageUrl:url,
                       username:username

                   });
                   setProgress(0);
                  
                   setCaption('')
                   setOpen(false)
               })
           }
       )
    }
    return (
        <div>
        <Modal
        open={open}
   
        onClose={()=>setOpen(false)}>
        <div className="image_Upload">
            <progress className="image_upload_progress" value={progress} max="100"/>
           <Input type="text" value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Enter a caption"/>
           <Input type="file" onChange={handleChange}/>
           <Button disabled={!caption} color="primary" variant="contained" onClick={handleUpload} className="image_upload_button">Upload</Button> 
        </div>
        </Modal>
        <div className="button_add_post">
             <Button onClick={()=>setOpen(true)} color='primary' variant="contained">Add Post</Button>
        </div>
        </div>
    )
}

export default ImageUpload
