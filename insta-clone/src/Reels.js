import React,{useState,useEffect} from "react";
import Header from "./Header";
import "./Reels.css";
import VideoCard from './VideoCard.js'
import Ayush from './ayush_pic.jpg'
import {db} from './firebase.js'
function Reels() {
  const [reels,setReels]=useState([]);
  useEffect(()=>{
  db.collection('reels').onSnapshot(snapshot=>(
    setReels(snapshot.docs.map(doc=>doc.data()))
  ))
  },[])
  return (
    <div>
      <div className="reels_header">
        <Header backButton="/" />
      </div>
      <div className="reels">
        <div className="reels_videos">
        {reels.map(reel=>(
          <VideoCard
          channel={reel.channel}
          avatarSrc={Ayush}
          song={reel.song}
          url='https://www.instagram.com/ayush.dubey.19/'
          likes={reel.likes}
          shares={reel.shares}
          />
        ))}
        </div>
      </div>
    </div>
  );
}

export default Reels;
