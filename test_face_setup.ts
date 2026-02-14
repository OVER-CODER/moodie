
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // Or false to see it
  const page = await browser.newPage();
  
  // Navigate to localhost:5010
  try {
    await page.goto('http://localhost:5010');
    console.log('Navigated to app');

    // Click "How are you feeling?" button
    await page.waitForSelector('button ::-p-text(How are you feeling?)');
    await page.click('button ::-p-text(How are you feeling?)');
    console.log('Clicked main button');

    // Click "Face Scan" button
    await page.waitForSelector('span ::-p-text(Face Scan)');
    await page.click('span ::-p-text(Face Scan)');
    console.log('Clicked Face Scan');

    // Wait for response - hook sets result
    // We can intercept the network request
    const response = await page.waitForResponse(response => 
      response.url() === 'http://localhost:5010/api/mood' && response.status() === 200
    );
    
    console.log('Received API response');
    const json = await response.json();
    console.log('Response JSON:', json);

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    await browser.close();
  }
})();
