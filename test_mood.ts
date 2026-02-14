import fetch from 'node-fetch';

async function testMoodAnalysis() {
  const url = 'http://127.0.0.1:5010/api/mood';
  const testCases = [
    { method: 'face', data: 'scan_1' },
    { method: 'face', data: 'scan_2' },
    { method: 'face', data: 'scan_3' },
    { method: 'face', data: 'scan_4' },
    { method: 'face', data: 'scan_5' }
  ];

  for (const testCase of testCases) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase)
      });

      const result = await response.json();
      console.log(`Test: "${testCase.data}" -> Mood: ${result.mood} (Confidence: ${result.confidence})`);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

testMoodAnalysis();
