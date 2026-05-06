import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { Project, UserProfile } from '../types';
import { Link } from 'react-router-dom';
import { calculateMatchScore } from '../utils/matching';

export const DiscoverPage = () => {
  const [users,setUsers]=useState<UserProfile[]>([]); const [projects,setProjects]=useState<Project[]>([]); const [skill,setSkill]=useState('');
  useEffect(()=>{const load=async()=>{ const u=await getDocs(collection(db,'usersPublic')); setUsers(u.docs.map(d=>({id:d.id,...d.data()} as UserProfile))); const p=await getDocs(collection(db,'projects')); setProjects(p.docs.map(d=>({id:d.id,...d.data()} as Project)));}; void load();},[]);
  return <div>{users.filter(u=>!skill||u.skills.includes(skill)).map(u=>{ const best = projects.map(p=>calculateMatchScore(u,p)).sort((a,b)=>b-a)[0] ?? 0; return <div key={u.id} className="card"><Link to={`/profile/${u.id}`}><h3>{u.username}</h3></Link><p>{u.bio}</p><p>{u.skills.join(', ')}</p><small>Match score: {best}</small></div>;})}<input placeholder="filter skill" value={skill} onChange={(e)=>setSkill(e.target.value)}/></div>;
};
