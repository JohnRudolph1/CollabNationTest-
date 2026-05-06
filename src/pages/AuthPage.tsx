import { FormEvent, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

export const AuthPage = ({ mode }: { mode: 'login'|'signup' }) => {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [username, setUsername] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const submit = async (e: FormEvent) => { e.preventDefault(); if (submitting) return; setSubmitting(true); setError(''); try {
    if (mode === 'signup') { const c = await createUserWithEmailAndPassword(auth, email, password); await updateProfile(c.user,{displayName:username}); await setDoc(doc(db,'usersPublic',c.user.uid),{username,skills:[],interests:[],createdAt:Date.now(),updatedAt:Date.now()},{merge:true}); await setDoc(doc(db,'usersPrivate',c.user.uid),{email:c.user.email,updatedAt:Date.now()},{merge:true}); }
    else { await signInWithEmailAndPassword(auth, email, password); }
    navigate('/');
  } catch { setError('Authentication failed.'); } finally { setSubmitting(false); }};
  return <form className="card" onSubmit={submit}>{mode==='signup'&&<input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" required minLength={2} maxLength={32}/>}<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required minLength={8}/><button disabled={submitting}>{submitting?'Please wait...':mode==='signup'?'Sign up':'Login'}</button>{error&&<p>{error}</p>}</form>;
};
