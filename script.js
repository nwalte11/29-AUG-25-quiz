// Draw random plots on the hero background
function drawPlots() {
  const canvas = document.getElementById('plots-bg');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw several random sine/cosine plots
  for (let i = 0; i < 6; i++) {
    const color = i % 2 === 0 ? '#2ec4b6' : '#ff9f1c';
    ctx.strokeStyle = color + '99';
    ctx.lineWidth = 2 + Math.random() * 2;
    ctx.beginPath();
    let freq = 0.5 + Math.random() * 1.5;
    let amp = 40 + Math.random() * 60;
    let phase = Math.random() * Math.PI * 2;
    let yOffset = 100 + Math.random() * (canvas.height - 200);
    for (let x = 0; x < canvas.width; x += 2) {
      let y = yOffset + Math.sin((x / 100) * freq + phase) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

window.addEventListener('resize', drawPlots);
window.addEventListener('DOMContentLoaded', () => {
  drawPlots();

  // ...existing code...

  // Quiz logic
  const quizCoord = { x: 3, y: 7 };
  const quizCoordElem = document.getElementById('quiz-coord');
  quizCoordElem.textContent = `(${quizCoord.x}, ${quizCoord.y})`;

  let tallyCorrect = 0;
  let tallyIncorrect = 0;
  let tallyTotal = 0;

  function updateTally() {
    document.getElementById('tally-correct').textContent = tallyCorrect;
    document.getElementById('tally-incorrect').textContent = tallyIncorrect;
    document.getElementById('tally-total').textContent = tallyTotal;
  }

  function parseSlopeIntercept(str) {
    // Accepts forms like y=mx+b, y = mx + b, y=mx, y=mx-b, etc.
    str = str.replace(/\s+/g, '');
    const match = str.match(/^y=([+-]?\d*\.?\d*)x([+-]?\d*\.?\d*)?$/);
    if (!match) return null;
    let m = match[1];
    let b = match[2] || '0';
    if (m === '' || m === '+') m = '1';
    if (m === '-') m = '-1';
    return { m: parseFloat(m), b: parseFloat(b) };
  }

  function drawQuizPlot(userLine) {
    const canvas = document.getElementById('quiz-plot');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Plot settings
  const margin = 40;
  const width = canvas.width - margin * 2;
  const height = canvas.height - margin * 2;
  const xMin = -10, xMax = 10;
  const yMin = -10, yMax = 10;

  // Draw quadrant shading (optional, subtle)
  ctx.save();
  ctx.globalAlpha = 0.07;
  // Quadrant I (top right)
  ctx.fillStyle = '#2ec4b6';
  ctx.fillRect(margin + width/2, margin, width/2, height/2);
  // Quadrant II (top left)
  ctx.fillStyle = '#ff9f1c';
  ctx.fillRect(margin, margin, width/2, height/2);
  // Quadrant III (bottom left)
  ctx.fillStyle = '#e71d36';
  ctx.fillRect(margin, margin + height/2, width/2, height/2);
  // Quadrant IV (bottom right)
  ctx.fillStyle = '#011627';
  ctx.fillRect(margin + width/2, margin + height/2, width/2, height/2);
  ctx.restore();

    // Draw grid
    ctx.strokeStyle = '#fff2';
    ctx.lineWidth = 1;
    // Draw grid lines
    ctx.strokeStyle = '#fff2';
    ctx.lineWidth = 1;
    for (let i = xMin; i <= xMax; i++) {
      let x = margin + ((i - xMin) * width) / (xMax - xMin);
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, canvas.height - margin);
      ctx.stroke();
    }
    for (let i = yMin; i <= yMax; i++) {
      let y = canvas.height - margin - ((i - yMin) * height) / (yMax - yMin);
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(canvas.width - margin, y);
      ctx.stroke();
    }

  // Draw axes
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.5;
  // x-axis (y=0)
  let yZero = canvas.height - margin - ((0 - yMin) * height) / (yMax - yMin);
  ctx.beginPath();
  ctx.moveTo(margin, yZero);
  ctx.lineTo(canvas.width - margin, yZero);
  ctx.stroke();
  // y-axis (x=0)
  let xZero = margin + ((0 - xMin) * width) / (xMax - xMin);
  ctx.beginPath();
  ctx.moveTo(xZero, margin);
  ctx.lineTo(xZero, canvas.height - margin);
  ctx.stroke();

  // Draw origin highlight
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(xZero, yZero, 6, 0, 2 * Math.PI);
  ctx.fill();

    // Draw axis labels
    // Draw axis labels only on axes (cross bar)
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    // x-axis labels (y=0)
    for (let i = xMin; i <= xMax; i++) {
      if (i === 0) continue;
      let x = margin + ((i - xMin) * width) / (xMax - xMin);
      ctx.fillText(i, x - 8, yZero + 20);
    }
    // y-axis labels (x=0)
    for (let i = yMin; i <= yMax; i++) {
      if (i === 0) continue;
      let y = canvas.height - margin - ((i - yMin) * height) / (yMax - yMin);
      ctx.fillText(i, xZero - 32, y + 5);
    }
    // Draw zero at origin
    ctx.font = 'bold 14px Arial';
    ctx.fillText('0', xZero - 16, yZero + 18);
    // Label axes
    ctx.font = 'bold 16px Arial';
    ctx.fillText('x', canvas.width - margin + 18, yZero + 5);
    ctx.fillText('y', xZero - 10, margin - 18);

    // Draw point for the quiz coordinate
  const px = margin + ((quizCoord.x - xMin) * width) / (xMax - xMin);
  const py = canvas.height - margin - ((quizCoord.y - yMin) * height) / (yMax - yMin);
  ctx.fillStyle = '#ff9f1c';
  ctx.beginPath();
  ctx.arc(px, py, 7, 0, 2 * Math.PI);
  ctx.fill();

    // Draw user line
    if (userLine) {
      ctx.strokeStyle = '#2ec4b6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      let first = true;
      for (let x = xMin; x <= xMax; x += 0.05) {
        let y = userLine.m * x + userLine.b;
        let plotX = margin + ((x - xMin) * width) / (xMax - xMin);
        let plotY = canvas.height - margin - ((y - yMin) * height) / (yMax - yMin);
        if (plotY < margin || plotY > canvas.height - margin) continue;
        if (first) {
          ctx.moveTo(plotX, plotY);
          first = false;
        } else {
          ctx.lineTo(plotX, plotY);
        }
      }
      ctx.stroke();
    }
  }

  drawQuizPlot();

  // Feedback overlay
  const feedbackOverlay = document.getElementById('feedback-overlay');
  const feedbackMsg = document.getElementById('feedback-message');

  function showFeedback(correct) {
    feedbackOverlay.classList.remove('hidden', 'visible', 'red');
    feedbackOverlay.classList.add('visible');
    if (correct) {
      feedbackOverlay.classList.remove('red');
      feedbackOverlay.style.background = 'rgba(46,196,182,0.7)';
      feedbackMsg.innerHTML = '<span class="emoji">😊</span> <span class="emoji">😊</span>';
    } else {
      feedbackOverlay.classList.add('red');
      feedbackOverlay.style.background = 'rgba(255,50,50,0.7)';
      feedbackMsg.innerHTML = '<span>Incorrect</span> <span class="emoji">😞</span> <span class="emoji">😞</span>';
    }
    setTimeout(() => {
      feedbackOverlay.classList.remove('visible');
      feedbackOverlay.classList.add('hidden');
    }, 1200);
  }

  // Quiz form logic
  document.getElementById('quiz-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const answer = document.getElementById('quiz-answer').value.trim();
    const parsed = parseSlopeIntercept(answer);
    tallyTotal++;
    let correct = false;
    if (parsed) {
      // Check if line passes through the point
      const yAtX = parsed.m * quizCoord.x + parsed.b;
      if (Math.abs(yAtX - quizCoord.y) < 0.01) {
        tallyCorrect++;
        correct = true;
      } else {
        tallyIncorrect++;
      }
      drawQuizPlot(parsed);
    } else {
      tallyIncorrect++;
      drawQuizPlot();
    }
    updateTally();
    showFeedback(correct);
    document.getElementById('quiz-answer').value = '';
  });
});
