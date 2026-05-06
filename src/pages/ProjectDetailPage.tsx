import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';

export const ProjectDetailPage = () => {
  const { id } = useParams(); const { user } = useAuth(); const [project,setProject]=useState<Project|null>(null); const [comment,setComment]=useState(''); const [comments,setComments]=useState<Array<{id:string;body:string}>>([]);
  useEffect(()=>{const load=async()=>{ if(!id)return; const p=await getDoc(doc(db,'projects',id)); if(p.exists()) setProject({id:p.id,...p.data()} as Project); const c=await getDocs(query(collection(db,'comments'),where('projectId','==',id))); setComments(c.docs.map(d=>({id:d.id, body:(d.data().body as string)??''})));}; void load();},[id]);
  const submit=async(e:FormEvent)=>{e.preventDefault(); if(!user||!id||!comment.trim())return; await addDoc(collection(db,'comments'),{projectId:id,authorId:user.uid,body:comment.trim(),createdAt:Date.now()}); setComment('');};
  if(!project) return <p>Loading...</p>;
  return <article className="card"><h2>{project.title}</h2><p>{project.body}</p><form onSubmit={submit}><input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="comment"/><button>Post</button></form>{comments.map(c=><p key={c.id}>{c.body}</p>)}</article>;
};
