import { addDoc, collection, limit, onSnapshot, orderBy, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db, rtdb } from '../firebase/config';
import { FeedSort, Project } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { onValue, ref, runTransaction } from 'firebase/database';

export const FeedPage = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [sort, setSort] = useState<FeedSort>('new');
  const [sendingId, setSendingId] = useState<string>('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'projects'), where('visibility', '==', 'public'), orderBy('createdAt', 'desc'), limit(50)),
      (qs) => setItems(qs.docs.map((d) => ({ id: d.id, ...d.data() } as Project)))
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsubs = items.map((item) => onValue(ref(rtdb, `votes/${item.id}`), (snap) => {
      const votes = snap.val() as Record<string, number> | null;
      const score = votes ? Object.values(votes).reduce((sum, v) => sum + (v === 1 || v === -1 ? v : 0), 0) : 0;
      setScores((prev) => ({ ...prev, [item.id]: score }));
    }));
    return () => unsubs.forEach((u) => u());
  }, [items]);

  const sorted = useMemo(() => [...items].sort((a, b) => {
    const sa = scores[a.id] ?? 0;
    const sb = scores[b.id] ?? 0;
    if (sort === 'new') return b.createdAt - a.createdAt;
    if (sort === 'top') return sb - sa;
    if (sort === 'rising') return (sb - sa) + ((b.createdAt - a.createdAt) / 1000000);
    return (sb * 2) - (sa * 2);
  }), [items, sort, scores]);

  const vote = async (projectId: string, value: 1 | -1) => {
    if (!user) return;
    await runTransaction(ref(rtdb, `votes/${projectId}/${user.uid}`), (current) => current ?? value);
  };

  const collaborate = async (p: Project) => {
    if (!user || sendingId === p.id) return;
    setSendingId(p.id);
    try {
      const existing = await getDocs(query(collection(db, 'collaborationRequests'), where('projectId', '==', p.id), where('requesterId', '==', user.uid), where('status', '==', 'pending'), limit(1)));
      if (!existing.empty) return;
      await addDoc(collection(db, 'collaborationRequests'), {
        projectId: p.id,
        projectOwnerId: p.ownerId,
        requesterId: user.uid,
        requesterUsername: user.displayName ?? 'User',
        message: 'Interested in collaborating',
        status: 'pending',
        createdAt: Date.now()
      });
    } finally {
      setSendingId('');
    }
  };

  return <div><div className="tabs">{(['hot', 'new', 'top', 'rising'] as FeedSort[]).map((t) => <button key={t} onClick={() => setSort(t)}>{t.toUpperCase()}</button>)} <Link to="/projects/new">Create</Link></div>{sorted.map((p) => <PostCard key={p.id} project={p} score={scores[p.id] ?? 0} onVote={vote} onCollaborate={collaborate} busy={sendingId === p.id} />)}</div>;
};
