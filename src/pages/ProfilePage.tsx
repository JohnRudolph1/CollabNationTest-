import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { profileCompleteness } from '../utils/trustScore';

export const ProfilePage = () => {
  const { id } = useParams(); const { user } = useAuth(); const [profile,setProfile]=useState<UserProfile|null>(null);
  useEffect(()=>{ const load=async()=>{ if (!id) return; const d=await getDoc(doc(db,'usersPublic',id)); if (d.exists()) setProfile({id:d.id,...d.data()} as UserProfile);}; void load();},[id]);
  if (!profile) return <p>Loading...</p>;
  const save = async (e: FormEvent) => { e.preventDefault(); if (user?.uid!==profile.id) return; await updateDoc(doc(db,'usersPublic',profile.id), { bio:profile.bio ?? '', skills:profile.skills, interests:profile.interests, availability:profile.availability ?? '', updatedAt:Date.now() }); };
  return <div className="card"><div className="banner"/><h2>{profile.username}</h2><p>Profile completeness: {profileCompleteness(profile)}%</p><form onSubmit={(e)=>void save(e)}><textarea value={profile.bio ?? ''} onChange={(e)=>setProfile({...profile,bio:e.target.value})}/><input value={profile.skills.join(',')} onChange={(e)=>setProfile({...profile,skills:e.target.value.split(',').map((x)=>x.trim()).filter(Boolean)})}/><input value={profile.interests.join(',')} onChange={(e)=>setProfile({...profile,interests:e.target.value.split(',').map((x)=>x.trim()).filter(Boolean)})}/>{user?.uid===profile.id&&<button>Save</button>}</form></div>;
};
