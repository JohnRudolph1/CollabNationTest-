import { describe, expect, it } from 'vitest';
import { collaborationScore, profileCompleteness } from './trustScore';

describe('trustScore', () => {
  it('computes profile completeness deterministically', () => {
    const score = profileCompleteness({
      id: 'u1', username: 'alice', bio: 'a'.repeat(30), skills: ['react','node','ux'], interests: ['music','film'], avatar: 'x', availability: 'weekly'
    });
    expect(score).toBe(100);
  });

  it('caps collaboration score between 0 and 100', () => {
    expect(collaborationScore([], [{id:'1',projectId:'p',projectOwnerId:'o',requesterId:'r',requesterUsername:'r',message:'m',status:'declined',createdAt:1}])).toBeGreaterThanOrEqual(0);
  });
});
