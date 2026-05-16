document.addEventListener('DOMContentLoaded', () => {
  initPID();
  initKalman();
  initIK();
  initArtificialHorizon();
  initAudioLab();
  initBoids();
  initGravitationalLens();
});

// Helper genérico para Intersection Observer
function observeCanvas(canvasId, callback) {
  const canvas = document.getElementById(canvasId);
  if(!canvas) return { isVisible: false };
  let state = { isVisible: false };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      state.isVisible = entry.isIntersecting;
      if(state.isVisible) callback(); // dispara loop se voltar a ver
    });
  }, { threshold: 0 });
  observer.observe(canvas);
  return state;
}

// =======================================================
// 1. PID CONTROLLER SIMULATOR
// =======================================================
function initPID() {
  const canvas = document.getElementById('pid-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let pInput = document.getElementById('pid-p');
  let iInput = document.getElementById('pid-i');
  let dInput = document.getElementById('pid-d');
  let btnReset = document.getElementById('pid-reset');

  let y = 130; 
  let setpoint = 50; 
  let velocity = 0;
  let integral = 0;
  let prevError = 0;

  function resetSystem() {
    y = 140 + Math.random() * 10;
    velocity = 0; integral = 0; prevError = 0;
  }
  if(btnReset) btnReset.addEventListener('click', resetSystem);

  let state = observeCanvas('pid-canvas', loop);
  let isLooping = false;

  function loop() {
    if(!state.isVisible) { isLooping = false; return; }
    isLooping = true;

    let Kp = parseFloat(pInput.value);
    let Ki = parseFloat(iInput.value);
    let Kd = parseFloat(dInput.value);

    let error = y - setpoint;
    integral += error;
    let derivative = error - prevError;
    
    // Antiwinding
    if(integral > 500) integral = 500;
    if(integral < -500) integral = -500;

    let controlSignal = (Kp * error) + (Ki * integral) + (Kd * derivative);
    prevError = error;

    // Física
    velocity -= controlSignal * 0.1; // Aceleração
    velocity += 0.5; // Gravidade
    velocity *= 0.95; // Arrasto
    y += velocity;

    // Render
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    // Desenha Setpoint
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.setLineDash([5,5]);
    ctx.beginPath(); ctx.moveTo(0, setpoint); ctx.lineTo(canvas.width, setpoint); ctx.stroke();
    ctx.setLineDash([]);

    // Desenha Bloco
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width/2 - 20, y, 40, 10);

    requestAnimationFrame(loop);
  }
}

// =======================================================
// 2. KALMAN FILTER SIMULATOR
// =======================================================
function initKalman() {
  const canvas = document.getElementById('kalman-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let xTrue = 0;
  let historyNoisy = [];
  let historyKalman = [];

  let est = 0; 
  let errorEst = 1; 
  let R = 10; 
  let Q = 0.1; 

  let state = observeCanvas('kalman-canvas', loop);
  let isLooping = false;

  function loop() {
    if(!state.isVisible) { isLooping = false; return; }
    isLooping = true;

    xTrue += 1;
    if(xTrue > canvas.width) { xTrue=0; historyNoisy=[]; historyKalman=[]; }

    let trueY = 75;
    let measurement = trueY + (Math.random() - 0.5) * 60; 

    // Predição
    let predEst = est;
    let predError = errorEst + Q;

    // Atualização
    let K = predError / (predError + R);
    est = predEst + K * (measurement - predEst);
    errorEst = (1 - K) * predError;

    historyNoisy.push({x: xTrue, y: measurement});
    historyKalman.push({x: xTrue, y: est});

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
    historyNoisy.forEach(p => { ctx.fillRect(p.x, p.y, 2, 2); });

    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;
    ctx.beginPath();
    historyKalman.forEach((p, i) => {
      if(i===0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    requestAnimationFrame(loop);
  }
}

// =======================================================
// 3. INVERSE KINEMATICS (IK)
// =======================================================
function initIK() {
  const canvas = document.getElementById('ik-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let targetX = 150, targetY = 100;
  canvas.addEventListener('mousemove', e => {
    let rect = canvas.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  });

  let L1 = 70, L2 = 60;
  let originX = canvas.width/2, originY = canvas.height - 20;

  let state = observeCanvas('ik-canvas', loop);
  let isLooping = false;

  function loop() {
    if(!state.isVisible) { isLooping = false; return; }
    isLooping = true;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    let dx = targetX - originX;
    let dy = originY - targetY; 
    let dist = Math.sqrt(dx*dx + dy*dy);

    if(dist > L1+L2) {
      dx = dx * (L1+L2)/dist;
      dy = dy * (L1+L2)/dist;
      dist = L1+L2;
    }

    let cosAngle2 = ((dist*dist) - (L1*L1) - (L2*L2)) / (2*L1*L2);
    if(cosAngle2 < -1) cosAngle2 = -1; if(cosAngle2 > 1) cosAngle2 = 1;
    
    let angle2 = Math.acos(cosAngle2); 
    let angle1 = Math.atan2(dy, dx) - Math.atan2(L2*Math.sin(angle2), L1 + L2*Math.cos(angle2)); 

    let jointX = originX + L1 * Math.cos(angle1);
    let jointY = originY - L1 * Math.sin(angle1); 
    let endX = jointX + L2 * Math.cos(angle1 + angle2);
    let endY = jointY - L2 * Math.sin(angle1 + angle2);

    ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(targetX, targetY, 5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'whitesmoke'; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(jointX, jointY); ctx.stroke();
    ctx.strokeStyle = 'cyan'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(jointX, jointY); ctx.lineTo(endX, endY); ctx.stroke();
    
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(originX, originY, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(jointX, jointY, 4, 0, Math.PI*2); ctx.fill();

    requestAnimationFrame(loop);
  }
}

// =======================================================
// 4. ARTIFICIAL HORIZON
// =======================================================
function initArtificialHorizon() {
  const horizon = document.getElementById('artificial-horizon');
  if(!horizon) return;
  
  let pitch = 0; let roll = 0;
  
  window.addEventListener('mousemove', e => {
    // Apenas atualizar se estiver no lab
    if(!document.getElementById('artificial-horizon')) return;
    let x = (e.clientX / window.innerWidth) - 0.5;
    let y = (e.clientY / window.innerHeight) - 0.5;
    pitch = y * 100; 
    roll = x * 90; 
    horizon.style.transform = \`translateY(\${pitch}px) rotate(\${roll}deg)\`;
  });
}

// =======================================================
// 5. AUDIO LAB (OSCILLOSCOPE & FFT)
// =======================================================
function initAudioLab() {
  const btn = document.getElementById('start-audio-btn');
  const oscCanvas = document.getElementById('osc-canvas');
  const fftCanvas = document.getElementById('fft-canvas');
  if(!btn || !oscCanvas || !fftCanvas) return;

  const oscCtx = oscCanvas.getContext('2d');
  const fftCtx = fftCanvas.getContext('2d');
  let audioCtx, analyser, dataArrayOsc, dataArrayFFT;

  btn.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      analyser.fftSize = 512;
      dataArrayOsc = new Uint8Array(analyser.fftSize);
      dataArrayFFT = new Uint8Array(analyser.frequencyBinCount);
      
      btn.style.display = 'none';
      drawAudio();
    } catch(e) {
      alert("Permissão de microfone negada ou erro de hardware.");
    }
  });

  let state = observeCanvas('fft-canvas', drawAudio);
  let isLooping = false;

  function drawAudio() {
    if(!state.isVisible || !analyser) { isLooping = false; return; }
    isLooping = true;
    requestAnimationFrame(drawAudio);
    
    analyser.getByteTimeDomainData(dataArrayOsc);
    oscCtx.fillStyle = 'black'; oscCtx.fillRect(0,0,oscCanvas.width,oscCanvas.height);
    oscCtx.lineWidth = 2; oscCtx.strokeStyle = 'lime'; oscCtx.beginPath();
    
    let sliceWidth = oscCanvas.width * 1.0 / analyser.fftSize;
    let x = 0;
    for(let i=0; i<analyser.fftSize; i++) {
      let v = dataArrayOsc[i] / 128.0;
      let y = v * oscCanvas.height/2;
      if(i===0) oscCtx.moveTo(x,y); else oscCtx.lineTo(x,y);
      x += sliceWidth;
    }
    oscCtx.lineTo(oscCanvas.width, oscCanvas.height/2); oscCtx.stroke();

    analyser.getByteFrequencyData(dataArrayFFT);
    fftCtx.fillStyle = 'black'; fftCtx.fillRect(0,0,fftCanvas.width,fftCanvas.height);
    let barWidth = (fftCanvas.width / analyser.frequencyBinCount) * 2.5;
    let barHeight; x = 0;
    for(let i=0; i<analyser.frequencyBinCount; i++) {
      barHeight = dataArrayFFT[i] / 2;
      fftCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      fftCtx.fillRect(x, fftCanvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
}

// =======================================================
// 6. BOIDS (ENXAME)
// =======================================================
function initBoids() {
  const canvas = document.getElementById('boids-bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let boids = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  for(let i=0; i<50; i++) {
    boids.push({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      vx: Math.random()*2-1, vy: Math.random()*2-1
    });
  }

  let state = { isVisible: true };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { state.isVisible = entry.isIntersecting; });
  }, { threshold: 0 });
  observer.observe(document.body);

  function loop() {
    if(!state.isVisible) { requestAnimationFrame(loop); return; }
    
    if(!canvas.classList.contains('hidden')) {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = 'cyan';
      boids.forEach(b => {
        b.x += b.vx; b.y += b.vy;
        if(b.x<0) b.x=canvas.width; if(b.x>canvas.width) b.x=0;
        if(b.y<0) b.y=canvas.height; if(b.y>canvas.height) b.y=0;
        
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI*2);
        ctx.fill();
      });
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// =======================================================
// 7. GRAVITATIONAL LENS
// =======================================================
function initGravitationalLens() {
  const lens = document.getElementById('gravitational-lens');
  if(!lens) return;
  window.addEventListener('mousemove', e => {
    if(!lens.classList.contains('hidden')) {
      lens.style.left = e.clientX + 'px';
      lens.style.top = e.clientY + 'px';
    }
  });
}
