import { describe, it, expect } from 'vitest';
import { analyzeMood, getRecommendations } from './mood-mapping';

describe('Mood Mapping Logic', () => {
  it('maps "tired" text to correct mood and recommendations', () => {
    const { mood, confidence } = analyzeMood('self', 'I feel so tired today');
    expect(mood).toBe('tired');
    expect(confidence).toBeGreaterThan(0.8);

    const recs = getRecommendations(mood);
    expect(recs.workout).toBe('Restorative Yoga');
    expect(recs.food).toBe('Warm Tea & Soup');
  });

  it('maps "happy" text to correct mood and recommendations', () => {
    const { mood } = analyzeMood('self', 'I am feeling happy and good');
    expect(mood).toBe('happy');

    const recs = getRecommendations(mood);
    expect(recs.playlist).toBe('37i9dQZF1DXdPec7aLTmlC');
    expect(recs.affirmation).toBe('Spread your joy.');
  });

  it('defaults to "calm" for unknown input', () => {
    const { mood } = analyzeMood('self', 'just chilling');
    expect(mood).toBe('calm');
    
    const recs = getRecommendations(mood);
    expect(recs.productivity).toBe('Steady workflow');
  });

  it('handles face method mock', () => {
    const { mood, confidence } = analyzeMood('face', 'base64data');
    expect(mood).toBe('energized');
    expect(confidence).toBe(0.92);
  });
});
