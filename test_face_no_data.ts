import fetch from 'node-fetch';

async function testFaceNoData() {
  const url = 'http://127.0.0.1:5010/api/mood';
  // Case 1: data key is missing
  const payload1 = { method: 'face' };
  // Case 2: data key is explicit null
  const payload2 = { method: 'face', data: null };
  // Case 3: data key is explicit undefined (JSON.stringify removes it, same as 1)
  const payload3 = { method: 'face', data: undefined };

  const testCases = [payload1, payload2, payload3];

  for (const testCase of testCases) {
    try {
      console.log(`Sending: ${JSON.stringify(testCase)}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase)
      });

      console.log(`Status: ${response.status}`);
      if (response.ok) {
        const result = await response.json();
        console.log(`Result: ${result.mood} (${result.confidence})`);
      } else {
        console.log('Error text:', await response.text());
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  }
}

testFaceNoData();
