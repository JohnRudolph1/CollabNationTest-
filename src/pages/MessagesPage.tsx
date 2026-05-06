import { push, ref, set, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import { rtdb, db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { ConversationMeta } from '../types';

export const MessagesPage = () => {
  const { user } = useAuth(); const [threadId,setThreadId]=useState(''); const [messages,setMessages]=useState<Array<{id:string;text:string;senderId:string}>>([]); const [text,setText]=useState(''); const [sending,setSending]=useState(false);
  const [convos, setConvos] = useState<ConversationMeta[]>([]);
  const [inviteUid, setInviteUid] = useState('');

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(query(collection(db, 'conversations'), where('participantIds', 'array-contains', user.uid)), (snap) => {
      const c = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ConversationMeta));
      setConvos(c);
      if (!threadId && c.length) setThreadId(c[0].id);
    });
    return unsub;
  }, [user?.uid, threadId]);

  useEffect(()=>{ if (!threadId) return; const node = ref(rtdb,`messages/${threadId}`); return onValue(node,(snap)=>{ const data=snap.val() ?? {}; setMessages(Object.entries(data).map(([id,v])=>({id,...(v as {text:string;senderId:string})})));});},[threadId]);

  const createConversation = async () => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'conversations'), { participantIds: [user.uid], createdAt: Date.now(), lastMessageAt: Date.now() });
    await set(ref(rtdb, `threadParticipants/${docRef.id}/${user.uid}`), true);
    setThreadId(docRef.id);
  };

  const addParticipant = async () => {
    if (!threadId || !inviteUid.trim()) return;
    const conv = convos.find((c) => c.id === threadId);
    if (!conv) return;
    const next = Array.from(new Set([...(conv.participantIds ?? []), inviteUid.trim()]));
    await updateDoc(doc(db, 'conversations', threadId), { participantIds: next });
    await set(ref(rtdb, `threadParticipants/${threadId}/${inviteUid.trim()}`), true);
    setInviteUid('');
  };

  const send = async () => { if (!user || !text.trim() || sending || !threadId) return; setSending(true); try { const msgRef = push(ref(rtdb,`messages/${threadId}`)); await set(ref(rtdb,`threadParticipants/${threadId}/${user.uid}`), true); await set(msgRef,{senderId:user.uid,text:text.trim(),createdAt:Date.now()}); await updateDoc(doc(db,'conversations',threadId),{lastMessage:text.trim(),lastMessageAt:Date.now()}); setText(''); } finally { setSending(false); } };
  return <div className="chat"><aside><button onClick={()=>void createConversation()}>New chat</button>{convos.map(c=><button key={c.id} onClick={()=>setThreadId(c.id)}>{(c.lastMessage ?? c.id).slice(0,20)}</button>)}</aside><section><div className="actions"><input value={inviteUid} onChange={(e)=>setInviteUid(e.target.value)} placeholder="Invite user UID"/><button onClick={()=>void addParticipant()}>Add</button></div>{messages.map(m=><div key={m.id} className={m.senderId===user?.uid?'bubble own':'bubble'}>{m.text}</div>)}<div><input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Message" maxLength={1000}/><button disabled={sending} onClick={()=>void send()}>{sending?'Sending...':'Send'}</button></div></section></div>;
};
