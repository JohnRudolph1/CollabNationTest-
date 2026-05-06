import { FormEvent, useState } from 'react';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { requireLength, sanitizeText } from '../utils/validation';

export const ProjectFormPage = () => {
  const { user } = useAuth(); const nav = useNavigate(); const [title,setTitle]=useState(''); const [body,setBody]=useState(''); const [skills,setSkills]=useState(''); const [submitting,setSubmitting]=useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !user || !requireLength(title,5,120) || !requireLength(body,10,3000)) return;
    setSubmitting(true);
    try {
      const u = await getDoc(doc(db,'usersPublic',user.uid));
      const ownerUsername = (u.data()?.username as string|undefined) ?? 'user';
      await addDoc(collection(db,'projects'), { ownerId:user.uid, ownerUsername, title:sanitizeText(title), body:sanitizeText(body), skills:skills.split(',').map((s)=>s.trim()).filter(Boolean), visibility:'public', createdAt:Date.now() });
      nav('/');
    } finally { setSubmitting(false); }
  };
  return <form className="card" onSubmit={onSubmit}><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Project title" required/><textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="What are you building?" required/><input value={skills} onChange={(e)=>setSkills(e.target.value)} placeholder="skills comma separated" required/><button disabled={submitting}>{submitting?'Creating...':'Create Project'}</button></form>;
};
