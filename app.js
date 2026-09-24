
// Mobile navigation
const mobileMenuToggle=document.getElementById('mobile-menu-toggle');
const mobileMenu=document.getElementById('mobile-menu');
function closeMobileMenu(){
  if(!mobileMenu||!mobileMenuToggle)return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden','true');
  mobileMenuToggle.setAttribute('aria-expanded','false');
  mobileMenuToggle.setAttribute('aria-label','Open navigation');
}
if(mobileMenuToggle&&mobileMenu){
  mobileMenuToggle.addEventListener('click',()=>{
    const open=!mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open',open);
    mobileMenu.setAttribute('aria-hidden',String(!open));
    mobileMenuToggle.setAttribute('aria-expanded',String(open));
    mobileMenuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMobileMenu));
}


'use strict';
// ════════════════════════════════════════
// CURSOR & CLICK BURST
// ════════════════════════════════════════
const cursor=document.getElementById('cursor');
const trail=document.getElementById('cursor-trail');
const burstCanvas=document.getElementById('cursor-burst');
const bctx=burstCanvas.getContext('2d');
burstCanvas.width=window.innerWidth;burstCanvas.height=window.innerHeight;
let mx=window.innerWidth/2,my=window.innerHeight/2;
const bursts=[];
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx+'px';cursor.style.top=my+'px';
  setTimeout(()=>{trail.style.left=mx+'px';trail.style.top=my+'px';},80);
});
document.addEventListener('mousedown',()=>cursor.classList.add('clicking'));
document.addEventListener('mouseup',()=>cursor.classList.remove('clicking'));
document.addEventListener('click',e=>{
  for(let i=0;i<14;i++){
    bursts.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,r:Math.random()*3+1,life:1,color:Math.random()>.5?'hsl(0,92%,62%)':'hsl(0,72%,48%)'});
  }
});
(function burstLoop(){
  bctx.clearRect(0,0,burstCanvas.width,burstCanvas.height);
  for(let i=bursts.length-1;i>=0;i--){
    const b=bursts[i];
    b.x+=b.vx;b.y+=b.vy;b.life-=0.04;b.r*=0.96;
    if(b.life<=0){bursts.splice(i,1);continue;}
    bctx.save();bctx.globalAlpha=b.life;
    bctx.beginPath();bctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    bctx.fillStyle=b.color;bctx.shadowColor=b.color;bctx.shadowBlur=6;
    bctx.fill();bctx.restore();
  }
  requestAnimationFrame(burstLoop);
})();
window.addEventListener('resize',()=>{burstCanvas.width=window.innerWidth;burstCanvas.height=window.innerHeight;});

// ════════════════════════════════════════
// LOADER
// ════════════════════════════════════════
(function(){
  const lc=document.getElementById('loader-canvas');
  const ctx=lc.getContext('2d');
  lc.width=window.innerWidth;lc.height=window.innerHeight;
  const cols=Math.floor(lc.width/20);
  const drops=Array(cols).fill(1);
  const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
  function drawM(){ctx.fillStyle='rgba(2,4,10,.06)';ctx.fillRect(0,0,lc.width,lc.height);ctx.fillStyle='hsla(84,100%,46%,.9)';ctx.font='14px monospace';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*20,drops[i]*20);if(drops[i]*20>lc.height&&Math.random()>.975)drops[i]=0;drops[i]++;}}
  const mi=setInterval(drawM,35);
  const bar=document.getElementById('loader-bar');
  const pct=document.getElementById('loader-pct');
  let p=0;
  const t=setInterval(()=>{
    p+=Math.random()*4+1;
    if(p>=100){p=100;clearInterval(t);clearInterval(mi);setTimeout(()=>{document.getElementById('loader').classList.add('hidden');startSite();},400);}
    bar.style.width=p+'%';pct.textContent=Math.floor(p)+'%';
  },40);
})();
function startSite(){buildName();startTypewriter();}


// ════════════════════════════════════════
// MATRIX (HERO)
// ════════════════════════════════════════
(function(){
  const c=document.getElementById('matrix-canvas');
  const ctx=c.getContext('2d');
  const chars='01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}:/\\';
  let drops=[], last=0;
  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    c.width=Math.floor(window.innerWidth*dpr); c.height=Math.floor(window.innerHeight*dpr);
    c.style.width=window.innerWidth+'px'; c.style.height=window.innerHeight+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const cols=Math.ceil(window.innerWidth/24);
    drops=Array.from({length:cols},()=>({y:Math.random()*-window.innerHeight/24,speed:.35+Math.random()*.5,alpha:.08+Math.random()*.12}));
  }
  resize();
  function draw(ts){
    if(ts-last<55){requestAnimationFrame(draw);return;}
    last=ts;
    const w=window.innerWidth,h=window.innerHeight;
    ctx.fillStyle='rgba(5,5,7,.13)'; ctx.fillRect(0,0,w,h);
    ctx.font='13px monospace'; ctx.textAlign='center';
    for(let i=0;i<drops.length;i++){
      const d=drops[i], x=i*24+12, y=d.y*24;
      const fade=Math.max(0,1-Math.abs(x-w/2)/(w*.72));
      const a=d.alpha*fade;
      ctx.fillStyle=`rgba(225,29,72,${a})`;
      ctx.fillText(chars[(Math.random()*chars.length)|0],x,y);
      d.y+=d.speed;
      if(y>h+40 && Math.random()>.985){d.y=-Math.random()*18;d.speed=.35+Math.random()*.5;}
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  window.addEventListener('resize',resize);
})();

// ════════════════════════════════════════
// PARTICLES
// ════════════════════════════════════════
(function(){
  const c=document.getElementById('particle-canvas');
  const ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  const particles=Array.from({length:55},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*2+.5,o:Math.random()*.35+.1}));
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    for(const p of particles){
      const dx=mx-p.x,dy=my-p.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<160){p.vx+=dx*0.00007;p.vy+=dy*0.00007;}
      p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.vy*=.99;
      if(p.x<0||p.x>c.width)p.vx*=-1;if(p.y<0||p.y>c.height)p.vy*=-1;
      ctx.save();ctx.globalAlpha=p.o;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='hsl(0,84%,60%)';ctx.fill();ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize',()=>{c.width=window.innerWidth;c.height=window.innerHeight;});
})();

// ════════════════════════════════════════
// NAME LETTERS
// ════════════════════════════════════════
function buildName(){
  const el=document.getElementById('hero-name');
  const parts=[{text:'LOUIS',style:'color:var(--fg)'},{text:' CIANO',style:'background:linear-gradient(135deg,hsl(0,84%,60%),hsl(0,72%,48%));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text'}];
  let delay=0;
  for(const part of parts){
    const wrap=document.createElement('span');wrap.style.cssText=part.style;
    for(const ch of part.text){
      const s=document.createElement('span');s.className='name-letter';s.textContent=ch===' '?'\u00a0':ch;s.style.animationDelay=delay+'s';s.style.display='inline-block';wrap.appendChild(s);delay+=0.065;
    }
    el.appendChild(wrap);
  }
}

// ════════════════════════════════════════
// TYPEWRITER
// ════════════════════════════════════════
function startTypewriter(){
  const el=document.getElementById('typewriter');
  const phrases=['>_ FULL-STACK SOFTWARE ENGINEER','>_ TYPESCRIPT + REACT','>_ NODE.JS + REAL-TIME SYSTEMS','>_ 3D / WEBGL BUILDER','>_ AVAILABLE FOR WORK'];
  let pi=0,ci=0,deleting=false;
  function tick(){
    const phrase=phrases[pi];
    if(!deleting){el.textContent=phrase.slice(0,ci+1);ci++;if(ci===phrase.length){deleting=true;setTimeout(tick,1800);return;}}
    else{el.textContent=phrase.slice(0,ci-1);ci--;if(ci===0){deleting=false;pi=(pi+1)%phrases.length;}}
    setTimeout(tick,deleting?45:80);
  }
  tick();
}

// ════════════════════════════════════════
// SCROLL PROGRESS + NAV ACTIVE LINKS
// ════════════════════════════════════════
const sections=['home','projects','engineering','timeline','skills','process','services','contact'];
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('scroll-bar').style.width=(window.scrollY/h*100)+'%';
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>50);
  // active nav link
  let current='home';
  for(const id of sections){const el=document.getElementById(id);if(el&&window.scrollY>=el.offsetTop-120)current=id;}
  document.querySelectorAll('.nav-links a').forEach(a=>{a.classList.toggle('active-link',a.getAttribute('href')==='#'+current);});
  // keynav hint
  const hint=document.getElementById('keynav-hint');
  hint.classList.toggle('show',window.scrollY>300&&window.scrollY<400);
});

// ════════════════════════════════════════
// KEYBOARD SECTION NAVIGATION
// ════════════════════════════════════════
let currentSectionIdx=0;
document.addEventListener('keydown',e=>{
  if(document.getElementById('terminal-overlay').classList.contains('open'))return;
  if(document.getElementById('hire-modal').classList.contains('open'))return;
  if(e.key==='ArrowDown'||e.key==='PageDown'){
    e.preventDefault();currentSectionIdx=Math.min(currentSectionIdx+1,sections.length-1);
    document.getElementById(sections[currentSectionIdx]).scrollIntoView({behavior:'smooth'});
  }
  if(e.key==='ArrowUp'||e.key==='PageUp'){
    e.preventDefault();currentSectionIdx=Math.max(currentSectionIdx-1,0);
    document.getElementById(sections[currentSectionIdx]).scrollIntoView({behavior:'smooth'});
  }
  if((e.ctrlKey||e.metaKey)&&e.key==='`'){e.preventDefault();const t=document.getElementById('terminal-overlay');t.classList.contains('open')?closeTerm():openTerm();}
  if(e.key==='Escape'){
    document.getElementById('terminal-overlay').classList.remove('open');
    document.getElementById('hire-modal').classList.remove('open');
    closeMobileMenu();
  }
});

// ════════════════════════════════════════
// STARFIELDS
// ════════════════════════════════════════
function initStars(id){
  const c=document.getElementById(id);if(!c)return;
  const ctx=c.getContext('2d');
  const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};resize();
  window.addEventListener('resize',resize);
  const stars=Array.from({length:160},()=>({x:Math.random(),y:Math.random(),r:Math.random()*.7+.5,o:Math.random()*.6+.3,d:(Math.random()-.5)*.02}));
  (function loop(){ctx.clearRect(0,0,c.width,c.height);for(const s of stars){s.o+=s.d;if(s.o>1){s.o=1;s.d*=-1;}if(s.o<.25){s.o=.25;s.d*=-1;}ctx.save();ctx.globalAlpha=s.o;ctx.beginPath();ctx.arc(s.x*c.width,s.y*c.height,s.r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.shadowColor='#fff';ctx.shadowBlur=5;ctx.fill();ctx.restore();}requestAnimationFrame(loop);})();
}
initStars('star-canvas');initStars('contact-canvas');

// ════════════════════════════════════════
// SCROLL REVEAL
// ════════════════════════════════════════
const revealObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.12});
document.querySelectorAll('.project-card,.skill-card,.contact-card,.contact-form-wrap,.timeline-item,.testi-card,.pricing-card,.process-card').forEach(el=>revealObs.observe(el));

// 3D TILT on project cards
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*14;
    const y=((e.clientY-r.top)/r.height-.5)*-14;
    card.style.transform=`translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='translateY(0) rotateX(0) rotateY(0)';});
});


// ════════════════════════════════════════
// PROJECT CASE STUDIES
// ════════════════════════════════════════
const caseModal=document.getElementById('case-modal');
const caseData={
  blastech:{kicker:'CASE STUDY · PRODUCT UI',title:'Blastech',summary:'A solar and energy solutions platform focused on presenting complex energy products through a clear, conversion-oriented interface.',focus:'Product interface, responsive UX, service discovery',stack:'React · TypeScript · Node.js · Tailwind CSS · Vite',notes:'The project combines a polished marketing experience with structured product/service presentation. The engineering emphasis is on reusable UI, responsive layouts, and keeping a visually rich interface maintainable.',live:'https://blastech.netlify.app',source:'https://github.com/bossciano/blastech'},
  liquid:{kicker:'CASE STUDY · REAL-TIME',title:'Liquid',summary:'A real-time crypto trading dashboard designed around live market information, charting, watchlists and portfolio-oriented workflows.',focus:'Real-time state, dashboards, trading UX',stack:'React · TypeScript · WebSocket · Node.js · TradingView',notes:'The core challenge is presenting frequently changing market information without making the interface feel noisy. The project explores real-time communication, dashboard composition and fast interaction patterns.',live:'https://marketmakerz.netlify.app',source:'https://github.com/bossciano/Tz'},
  dawa:{kicker:'CASE STUDY · WEB PLATFORM',title:'Dawa Charity Foundation',summary:'A charity foundation website bringing together causes, project information, a gallery, founders content and donation-focused flows.',focus:'Content architecture, public-facing UX, donation flow',stack:'React · PHP · Laravel · MySQL · Tailwind CSS',notes:'The project focuses on turning organisational information into a structured public experience. The implementation spans the interface and a PHP/Laravel backend with MySQL.',live:'https://dawacharityfoundation.netlify.app',source:'https://github.com/bossciano/dawa'},
  nftslice:{kicker:'CASE STUDY · MULTIPLAYER',title:'NFTSlice',summary:'A real-time PVP card battle game built around deck building, NFT avatars and a simple colour-based battle system.',focus:'Game state, multiplayer interaction, real-time events',stack:'TypeScript · Node.js · WebSocket · React · HTML5',notes:'The project explores the engineering behind multiplayer browser interactions: synchronising state, handling player actions and keeping the game loop responsive through real-time communication.',live:'',source:'https://github.com/Bossciano/NFTSLICE'}
};
function openCaseStudy(key){
  const d=caseData[key]; if(!d||!caseModal)return;
  document.getElementById('case-modal-kicker').textContent=d.kicker;
  document.getElementById('case-modal-title').textContent=d.title;
  document.getElementById('case-modal-summary').textContent=d.summary;
  document.getElementById('case-modal-focus').textContent=d.focus;
  document.getElementById('case-modal-stack').textContent=d.stack;
  document.getElementById('case-modal-notes').textContent=d.notes;
  const live=document.getElementById('case-modal-live'); live.href=d.live||'#'; live.style.display=d.live?'inline-flex':'none';
  document.getElementById('case-modal-source').href=d.source;
  caseModal.classList.add('open'); caseModal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
  document.querySelector('.case-modal-close').focus();
}
function closeCaseStudy(){if(!caseModal)return;caseModal.classList.remove('open');caseModal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');}
document.querySelectorAll('.case-study-open').forEach(btn=>btn.addEventListener('click',()=>openCaseStudy(btn.dataset.case)));
document.querySelectorAll('[data-case-close]').forEach(el=>el.addEventListener('click',closeCaseStudy));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&caseModal?.classList.contains('open'))closeCaseStudy();});

// ════════════════════════════════════════
// STATS COUNTER
// ════════════════════════════════════════
const statsObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;if(!el.dataset.target){statsObs.unobserve(el);return;}const target=+el.dataset.target;let c=0;const step=target/60;const t=setInterval(()=>{c+=step;if(c>=target){c=target;clearInterval(t);}el.textContent=Math.floor(c)+(target===100?'%':'+');},20);statsObs.unobserve(el);});},{threshold:.5});
document.querySelectorAll('.stat-num[data-target]').forEach(el=>statsObs.observe(el));

// ════════════════════════════════════════
// PROJECT FILTER
// ════════════════════════════════════════
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{
      const show=f==='all'||card.dataset.techs.includes(f);
      card.classList.toggle('hidden-card',!show);
      if(show)setTimeout(()=>card.classList.add('visible'),50);
      else card.classList.remove('visible');
    });
  });
});

// ════════════════════════════════════════
// COPY TO CLIPBOARD
// ════════════════════════════════════════
function copyToClipboard(e,text,card){
  if(e.target.closest('a')&&!e.target.closest('.contact-card'))return;
  e.preventDefault();
  navigator.clipboard.writeText(text).then(()=>{
    card.classList.add('copied');
    setTimeout(()=>card.classList.remove('copied'),1800);
  }).catch(()=>{});
}

// ════════════════════════════════════════
// SEND MOCK
// ════════════════════════════════════════
function handleSend(btn){
  const name=document.getElementById('contact-name')?.value.trim()||'';
  const email=document.getElementById('contact-email')?.value.trim()||'';
  const subject=document.getElementById('contact-subject')?.value.trim()||'Project collaboration';
  const type=document.getElementById('project-type')?.value||'Not specified';
  const message=document.getElementById('contact-message')?.value.trim()||'';
  if(!name||!email||!message){
    [document.getElementById('contact-name'),document.getElementById('contact-email'),document.getElementById('contact-message')].find(el=>el&&!el.value.trim())?.focus();
    return;
  }
  const body=[`Name: ${name}`,`Email: ${email}`,`Project type: ${type}`,'',message].join('\n');
  window.location.href='mailto:louiscolix@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  const success=document.getElementById('success-msg');
  if(success){success.style.display='block';setTimeout(()=>success.style.display='none',5000);}
  btn.blur();
}

// ════════════════════════════════════════
// TERMINAL EASTER EGG
// ════════════════════════════════════════
const termOverlay=document.getElementById('terminal-overlay');
const termBody=document.getElementById('terminal-body');
const termInput=document.getElementById('terminal-input');
function openTerm(){termOverlay.classList.add('open');setTimeout(()=>termInput.focus(),100);}
function closeTerm(){termOverlay.classList.remove('open');}
const cmds={
  help:()=>[{t:'out',v:'Commands: help, about, skills, projects, contact, services, hire, joke, theme, clear, exit'}],
  about:()=>[{t:'out',v:'Bossciano — Full Stack Developer'},{t:'info',v:'Lagos, Nigeria | Available for work ✅'},{t:'info',v:'Stack: React · Node.js · Three.js · WebGL'},{t:'info',v:'GitHub: github.com/Bossciano'}],
  skills:()=>[{t:'out',v:'Frontend : React, TypeScript, Three.js, WebGL, Tailwind'},{t:'out',v:'Backend  : Node.js, Express, PHP, Laravel, WebSocket'},{t:'out',v:'Cloud    : AWS, Vercel, Netlify, CI/CD'}],
  projects:()=>[{t:'out',v:'1. Blastech          — Solar & energy platform'},{t:'out',v:'2. Liquid            — Crypto trading dashboard'},{t:'out',v:'3. Dawa Foundation   — Charity NGO website'},{t:'out',v:'4. NFTSlice          — PVP card battle game'}],
  contact:()=>[{t:'out',v:'Email  : louiscolix@gmail.com'},{t:'out',v:'Phone  : 09054101290'},{t:'out',v:'GitHub : github.com/Bossciano'}],
  pricing:()=>[{t:'out',v:'Web Platforms   — React / Next.js applications'},{t:'out',v:'Real-Time       — WebSockets / live systems'},{t:'out',v:'Interactive     — Three.js / WebGL experiences'},{t:'out',v:'Engineering     — Debugging / refactoring / deployment'}],
  hire:()=>[{t:'out',v:'Why hire Louis?'},{t:'out',v:'✓ Ships fast and clean'},{t:'out',v:'✓ Full-stack frontend to cloud'},{t:'out',v:'✓ 3D & real-time specialist'},{t:'warn',v:'→ Email louiscolix@gmail.com'}],
  joke:()=>{const j=['Why do programmers prefer dark mode? Light attracts bugs.','A SQL query walks into a bar and asks: "Can I JOIN you?"','Why do Java devs wear glasses? They don\'t C#.','I would tell a UDP joke, but you might not get it.'];return[{t:'out',v:j[Math.floor(Math.random()*j.length)]}];},
  clear:()=>{termBody.innerHTML='';return[];},
  exit:()=>{closeTerm();return[];},
};
termInput.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  const cmd=termInput.value.trim().toLowerCase();termInput.value='';if(!cmd)return;
  const pl=document.createElement('div');pl.className='term-prompt-line';pl.textContent='visitor@ciano:~$ '+cmd;termBody.appendChild(pl);
  const fn=cmds[cmd];
  const res=fn?fn():[{t:'err',v:`not found: ${cmd}. Type 'help'`}];
  for(const r of res){const d=document.createElement('div');d.className=r.t==='out'?'term-out-line':r.t==='err'?'term-err-line':'term-info-line';d.textContent=r.v;termBody.appendChild(d);}
  termBody.scrollTop=termBody.scrollHeight;
});
const _tov=document.getElementById('terminal-overlay');if(_tov)_tov.addEventListener('click',e=>{if(e.target===_tov)closeTerm();});
const _hm=document.getElementById('hire-modal');if(_hm)_hm.addEventListener('click',e=>{if(e.target===_hm)_hm.classList.remove('open');});

// ════════════════════════════════════════
// MOUSE TRAIL
// ════════════════════════════════════════
(function(){
  const c=document.getElementById('trail-canvas');
  const ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  const pts=[];
  document.addEventListener('mousemove',e=>{
    pts.push({x:e.clientX,y:e.clientY,life:1,size:4});
    if(pts.length>40)pts.shift();
  });
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    for(let i=0;i<pts.length;i++){
      const p=pts[i];p.life-=0.035;p.size*=0.96;
      if(p.life<=0){pts.splice(i,1);i--;continue;}
      const alpha=p.life*0.6;
      const progress=i/pts.length;
      ctx.save();ctx.globalAlpha=alpha;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*progress,0,Math.PI*2);
      ctx.fillStyle=progress>0.5?'hsl(0,92%,62%)':'hsl(0,72%,48%)';
      ctx.shadowColor='hsl(0,92%,62%)';ctx.shadowBlur=8;
      ctx.fill();ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize',()=>{c.width=window.innerWidth;c.height=window.innerHeight;});
})();



// ════════════════════════════════════════
// GITHUB STATS
// ════════════════════════════════════════
(async function(){
  const username='Bossciano';
  const status=document.getElementById('gh-status');
  try{
    const res=await fetch(`https://api.github.com/users/${username}`);
    if(!res.ok)throw new Error('API error');
    const data=await res.json();
    animateGhNum('gh-repos',data.public_repos||0);
    animateGhNum('gh-followers',data.followers||0);
    animateGhNum('gh-following',data.following||0);
    // fetch repos for stars
    const rRes=await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos=await rRes.json();
    const stars=Array.isArray(repos)?repos.reduce((s,r)=>s+(r.stargazers_count||0),0):0;
    animateGhNum('gh-stars',stars);
    // language breakdown
    const langs={};
    if(Array.isArray(repos)){repos.forEach(r=>{if(r.language)langs[r.language]=(langs[r.language]||0)+1;});}
    renderLangs(langs);
    if(status)status.textContent='✓ live data';
  }catch(e){
    if(status)status.textContent='live data unavailable';
  }
})();

function syncProjectCards(repos){
  // Map known project names to repo names
  const projectMap = {
    'Blastech': ['blastech','BLASTECH','blastech'],
    'Liquid': ['Tz','tz','liquid','TZ'],
    'Dawa Charity Foundation': ['dawa','DAWA'],
    'PuzzleRush': ['PUZZLERUSH','puzzlerush','puzzle-rush'],
  };
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const titleEl = card.querySelector('.project-title');
    if(!titleEl) return;
    const title = titleEl.textContent.trim();
    const aliases = projectMap[title] || [title.toUpperCase(), title.toLowerCase()];
    const repo = repos.find(r => aliases.includes(r.name.toUpperCase()) || aliases.some(a => r.name.toUpperCase().includes(a.toUpperCase())));
    if(repo){
      // Update source code link
      const srcBtn = card.querySelector('.project-btn:not(.filled)');
      if(srcBtn) srcBtn.href = repo.html_url;
      // Update live demo if homepage set
      const liveBtn = card.querySelector('.project-btn.filled');
      if(liveBtn && repo.homepage) liveBtn.href = repo.homepage;
      // Add star count badge if stars > 0
      if(repo.stargazers_count > 0){
        const badge = card.querySelector('.project-tech-badge');
        if(badge) badge.textContent = '⭐ ' + repo.stargazers_count + ' stars';
      }
      // Update description if repo has one
      if(repo.description){
        const desc = card.querySelector('.project-desc');
        if(desc) desc.textContent = repo.description;
      }
    }
  });
}

function animateGhNum(id,target){
  const el=document.getElementById(id);if(!el)return;
  let c=0;const step=Math.max(1,target/50);
  const t=setInterval(()=>{c+=step;if(c>=target){c=target;clearInterval(t);}el.textContent=Math.floor(c);},20);
}
function renderLangs(langs){
  const colors={'TypeScript':'#3178c6','JavaScript':'#f1e05a','PHP':'#4F5D95','HTML':'#e34c26','CSS':'#563d7c','Vue':'#41b883','Python':'#3572A5','Other':'#8e8e8e'};
  const total=Object.values(langs).reduce((a,b)=>a+b,0);
  if(!total)return;
  const bar=document.getElementById('gh-lang-bar');
  const legend=document.getElementById('gh-lang-legend');
  if(!bar||!legend)return;
  bar.innerHTML='';legend.innerHTML='';
  Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,6).forEach(([lang,count])=>{
    const pct=(count/total*100).toFixed(1);
    const color=colors[lang]||colors.Other;
    const seg=document.createElement('div');seg.className='gh-lang-seg';seg.style.cssText=`background:${color};flex:${pct}`;
    bar.appendChild(seg);
    const dot=document.createElement('div');dot.className='gh-lang-dot';dot.style.setProperty('--dot-color',color);dot.textContent=`${lang} ${pct}%`;
    legend.appendChild(dot);
  });
}

// ════════════════════════════════════════
// SKILL PROGRESS BARS (scroll-triggered)
// ════════════════════════════════════════
const skillBarObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.querySelectorAll('.skill-prog-fill').forEach(fill=>{
      const target=fill.dataset.target;
      fill.style.width=target+'%';
      const label=fill.closest('.skill-prog-item').querySelector('[data-pct]');
      if(label){let c=0;const t=setInterval(()=>{c++;if(c>=+target)clearInterval(t);label.textContent=c+'%';},12);}
    });
    skillBarObs.unobserve(e.target);
  });
},{threshold:0.3});
const sb=document.getElementById('skill-bars');if(sb)skillBarObs.observe(sb.closest('.skill-card')||sb);

// ════════════════════════════════════════
// BACK TO TOP
// ════════════════════════════════════════
window.addEventListener('scroll',()=>{
  document.getElementById('back-top').classList.toggle('show',window.scrollY>600);
},{ passive: true });

// ════════════════════════════════════════
// KONAMI CODE
// ════════════════════════════════════════
const konamiSeq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx=0;
document.addEventListener('keydown',e=>{
  if(document.getElementById('terminal-overlay').classList.contains('open'))return;
  if(document.getElementById('snake-modal').classList.contains('open'))return;
  if(e.key===konamiSeq[konamiIdx]){
    konamiIdx++;
    if(konamiIdx===konamiSeq.length){
      konamiIdx=0;triggerKonami();
    }
  }else{konamiIdx=0;}
});
function triggerKonami(){
  const flash=document.getElementById('konami-flash');
  flash.classList.add('active');
  setTimeout(()=>flash.classList.remove('active'),800);
  // launch snake after flash
  setTimeout(()=>openSnake(),900);
}

// ════════════════════════════════════════
// SNAKE GAME
// ════════════════════════════════════════
let snakeGame=null;
function openSnake(){
  document.getElementById('snake-modal').classList.add('open');
  if(!snakeGame)snakeGame=new SnakeGame();
  else snakeGame.reset();
}
function closeSnake(){
  document.getElementById('snake-modal').classList.remove('open');
  if(snakeGame)snakeGame.stop();
}
const _sm=document.getElementById('snake-modal');if(_sm)_sm.addEventListener('click',e=>{if(e.target===_sm)closeSnake();});

class SnakeGame{
  constructor(){
    this.canvas=document.getElementById('snake-canvas');
    this.ctx=this.canvas.getContext('2d');
    this.cell=20;this.cols=this.canvas.width/this.cell;this.rows=this.canvas.height/this.cell;
    this.reset();
    this.bindKeys();
  }
  reset(){
    this.snake=[{x:10,y:10}];this.dir={x:1,y:0};this.nextDir={x:1,y:0};
    this.food=this.randomFood();this.score=0;this.running=false;this.gameOver=false;
    this.interval=null;
    document.getElementById('snake-score').textContent=0;
    document.getElementById('snake-msg').textContent='Press Space or Enter to start';
    this.draw();
  }
  start(){
    if(this.running)return;
    this.running=true;this.gameOver=false;
    document.getElementById('snake-msg').textContent='';
    this.interval=setInterval(()=>this.tick(),120);
  }
  stop(){clearInterval(this.interval);this.running=false;}
  tick(){
    this.dir=this.nextDir;
    const head={x:this.snake[0].x+this.dir.x,y:this.snake[0].y+this.dir.y};
    if(head.x<0||head.x>=this.cols||head.y<0||head.y>=this.rows||this.snake.some(s=>s.x===head.x&&s.y===head.y)){
      this.stop();this.gameOver=true;
      document.getElementById('snake-msg').textContent='💀 Game Over! Space to restart';
      const best=Math.max(this.score,parseInt(document.getElementById('snake-best').textContent||0));
      document.getElementById('snake-best').textContent=best;
      this.draw();return;
    }
    this.snake.unshift(head);
    if(head.x===this.food.x&&head.y===this.food.y){
      this.score++;document.getElementById('snake-score').textContent=this.score;
      this.food=this.randomFood();
    }else this.snake.pop();
    this.draw();
  }
  draw(){
    const ctx=this.ctx;const c=this.cell;
    ctx.fillStyle='hsl(0,0%,5%)';ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    // grid
    ctx.strokeStyle='hsl(0,0%,8%)';ctx.lineWidth=.5;
    for(let i=0;i<this.cols;i++){ctx.beginPath();ctx.moveTo(i*c,0);ctx.lineTo(i*c,this.canvas.height);ctx.stroke();}
    for(let i=0;i<this.rows;i++){ctx.beginPath();ctx.moveTo(0,i*c);ctx.lineTo(this.canvas.width,i*c);ctx.stroke();}
    // food
    ctx.fillStyle='hsl(0,72%,48%)';ctx.shadowColor='hsl(0,72%,48%)';ctx.shadowBlur=12;
    ctx.fillRect(this.food.x*c+2,this.food.y*c+2,c-4,c-4);
    ctx.shadowBlur=0;
    // snake
    this.snake.forEach((s,i)=>{
      const ratio=i/this.snake.length;
      ctx.fillStyle=`hsl(${75+ratio*20},100%,${55-ratio*15}%)`;
      ctx.shadowColor='hsl(0,84%,60%)';ctx.shadowBlur=i===0?10:3;
      ctx.fillRect(s.x*c+1,s.y*c+1,c-2,c-2);
    });
    ctx.shadowBlur=0;
    if(this.gameOver){
      ctx.fillStyle='rgba(2,4,10,.7)';ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      ctx.font='bold 18px Orbitron,monospace';ctx.fillStyle='hsl(0,84%,60%)';ctx.textAlign='center';
      ctx.fillText('GAME OVER',this.canvas.width/2,this.canvas.height/2-10);
      ctx.font='13px Share Tech Mono,monospace';ctx.fillStyle='hsl(0,0%,70%)';
      ctx.fillText('Score: '+this.score,this.canvas.width/2,this.canvas.height/2+15);
    }
    if(!this.running&&!this.gameOver&&this.score===0){
      ctx.font='12px Share Tech Mono,monospace';ctx.fillStyle='hsl(0,84%,60%,0.6)';ctx.textAlign='center';
      ctx.fillText('PRESS SPACE TO START',this.canvas.width/2,this.canvas.height/2);
    }
  }
  randomFood(){
    let f;do{f={x:Math.floor(Math.random()*this.cols),y:Math.floor(Math.random()*this.rows)};}
    while(this.snake.some(s=>s.x===f.x&&s.y===f.y));return f;
  }
  bindKeys(){
    document.addEventListener('keydown',e=>{
      if(!document.getElementById('snake-modal').classList.contains('open'))return;
      const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}};
      if((e.key===' '||e.key==='Enter')&&!this.running){e.preventDefault();if(this.gameOver)this.reset();this.start();return;}
      const nd=map[e.key];
      if(nd&&!(nd.x===-this.dir.x&&nd.y===0)&&!(nd.y===-this.dir.y&&nd.x===0)){e.preventDefault();this.nextDir=nd;}
    });
  }
}

// Update terminal help to include snake command
cmds.snake=()=>{openSnake();return[{t:'out',v:'🐍 Launching Snake game...'}];};
cmds.help=()=>[{t:'out',v:'Commands: help, about, skills, projects, contact, services, hire, joke, snake, clear, exit'}];

// ════════════════════════════════════════
// RESUME MODAL
// ════════════════════════════════════════
function openResume(){
  document.getElementById('resume-modal').classList.add('open');
  setTimeout(()=>{
    document.querySelectorAll('.resume-skill-fill').forEach(el=>{
      el.style.width=el.dataset.w+'%';
    });
  },200);
}
function closeResume(){
  document.getElementById('resume-modal').classList.remove('open');
  document.querySelectorAll('.resume-skill-fill').forEach(el=>el.style.width='0%');
}
const _rm=document.getElementById('resume-modal');if(_rm)_rm.addEventListener('click',e=>{if(e.target===_rm)closeResume();});
function downloadResume(){
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Louis Ciano — Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
  <style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#080808;color:#f9f9f9;font-family:'Share Tech Mono',monospace;padding:2.5rem;max-width:900px;margin:0 auto;}h1{font-family:'Orbitron',sans-serif;font-size:2rem;color:#ff5a5f;margin-bottom:.25rem;}.role{font-family:'Share Tech Mono',monospace;color:#ff5a5f;font-size:.88rem;margin-bottom:.5rem;}.contacts{display:flex;flex-wrap:wrap;gap:.5rem 1.2rem;font-size:.75rem;color:#999;font-family:'Share Tech Mono',monospace;margin-bottom:2rem;}.grid{display:grid;grid-template-columns:1fr 1.6fr;gap:2rem;}.section-title{font-family:'Share Tech Mono',monospace;font-size:.72rem;color:#ff5a5f;text-transform:uppercase;margin-bottom:.75rem;padding-bottom:.35rem;border-bottom:1px solid rgba(190,246,100,.25);letter-spacing:.1em;}.section{margin-bottom:1.75rem;}.item-title{font-weight:700;font-size:.88rem;margin-bottom:.1rem;}.item-sub{font-size:.75rem;color:#ff5a5f;font-family:'Share Tech Mono',monospace;margin-bottom:.3rem;}.item-desc{font-size:.78rem;color:#999;line-height:1.6;}.tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.5rem;}.tag{font-size:.67rem;padding:.18rem .5rem;background:rgba(190,246,100,.1);border:1px solid rgba(190,246,100,.25);color:#ff5a5f;border-radius:.3rem;}.skill-row{display:flex;align-items:center;gap:.75rem;margin-bottom:.55rem;}.skill-name{font-size:.78rem;width:110px;flex-shrink:0;}.skill-bar{flex:1;height:4px;background:#1e2a3a;border-radius:9999px;overflow:hidden;}.skill-fill{height:100%;background:linear-gradient(90deg,#ff5a5f,#facc15);border-radius:9999px;}.skill-pct{font-size:.7rem;color:#ff5a5f;font-family:'Share Tech Mono',monospace;width:28px;text-align:right;}a{color:#ff5a5f;text-decoration:none;}@media print{body{background:#fff;color:#111;}h1,.role,.section-title,.skill-pct,.item-sub,.tag,a{color:#1a1a1a!important;}.skill-fill{background:#1a1a1a!important;}.skill-bar{background:#ddd!important;}.tag{border-color:#999!important;background:#f0f0f0!important;}}
.project-screenshot{width:100%;height:100%;object-fit:cover;object-position:top;transition:transform .5s ease;}
.project-card:hover .project-screenshot{transform:scale(1.04);}
</style><meta name="description" content="Louis Ciano — Full-Stack Software Engineer building web applications, real-time systems, and interactive experiences.">
<meta name="theme-color" content="#080808">
<meta property="og:title" content="Louis Ciano — Full-Stack Software Engineer">
<meta property="og:description" content="Web applications, real-time systems, and interactive experiences built with modern software engineering.">
<meta property="og:type" content="website">
<link rel="canonical" href="https://bossciano.netlify.app/">
<style>
/* CIANO V2 engineering system */
.engineering-section{position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(225,29,72,.025),transparent)}
.engineering-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;position:relative;z-index:2}
.engineering-card{position:relative;padding:1.6rem;border:1px solid var(--border);background:rgba(10,10,12,.72);min-height:300px;transition:transform .3s,border-color .3s,box-shadow .3s}
.engineering-card:hover{transform:translateY(-6px);border-color:var(--primary-border);box-shadow:0 18px 50px rgba(225,29,72,.12)}
.eng-num{position:absolute;right:1rem;top:1rem;color:var(--primary);font:700 .7rem 'Share Tech Mono',monospace;opacity:.8}
.eng-icon{font-size:2rem;color:var(--primary);margin-bottom:2rem}
.engineering-card h3{font:700 1.05rem 'Orbitron',sans-serif;margin-bottom:.8rem}
.engineering-card p{color:var(--muted-fg);font-size:.86rem;line-height:1.75}
.eng-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1.4rem}.eng-tags span{font:.68rem 'Share Tech Mono',monospace;border:1px solid var(--border);padding:.3rem .5rem;color:var(--muted-fg)}
.architecture-strip{max-width:1200px;margin:2rem auto 0;padding:1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;border:1px solid var(--border);background:rgba(255,255,255,.015);position:relative;z-index:2}
.architecture-strip div{display:flex;flex-direction:column;gap:.25rem}.arch-label{font:.6rem 'Share Tech Mono',monospace;color:var(--primary)}.architecture-strip b{font-size:.8rem}.architecture-strip i{color:var(--primary);font-style:normal}
@media(max-width:900px){.engineering-grid{grid-template-columns:repeat(2,1fr)}.architecture-strip{flex-wrap:wrap;justify-content:center}.architecture-strip i{display:none}}
@media(max-width:600px){.engineering-grid{grid-template-columns:1fr}.engineering-card{min-height:auto}.architecture-strip{display:grid;grid-template-columns:1fr 1fr;text-align:center}.architecture-strip div{align-items:center}}
@media(prefers-reduced-motion:reduce){.engineering-card{transition:none}.engineering-card:hover{transform:none}}
</style>
</head>
  <body><h1>Louis Ciano</h1><div class="role">&gt; Full Stack Developer</div>
  <div class="contacts"><span>📍 Lagos, Nigeria</span><span>louiscolix@gmail.com</span><span>09054101290</span><span>github.com/Bossciano</span><span>bossciano.netlify.app</span></div>
  <div class="grid"><div>
    <div class="section"><div class="section-title">Skills</div>
      <div class="skill-row"><span class="skill-name">React</span><div class="skill-bar"><div class="skill-fill" style="width:92%"></div></div><span class="skill-pct">92%</span></div>
      <div class="skill-row"><span class="skill-name">TypeScript</span><div class="skill-bar"><div class="skill-fill" style="width:88%"></div></div><span class="skill-pct">88%</span></div>
      <div class="skill-row"><span class="skill-name">Node.js</span><div class="skill-bar"><div class="skill-fill" style="width:85%"></div></div><span class="skill-pct">85%</span></div>
      <div class="skill-row"><span class="skill-name">Three.js/WebGL</span><div class="skill-bar"><div class="skill-fill" style="width:78%"></div></div><span class="skill-pct">78%</span></div>
      <div class="skill-row"><span class="skill-name">PHP/Laravel</span><div class="skill-bar"><div class="skill-fill" style="width:72%"></div></div><span class="skill-pct">72%</span></div>
      <div class="skill-row"><span class="skill-name">AWS/DevOps</span><div class="skill-bar"><div class="skill-fill" style="width:60%"></div></div><span class="skill-pct">60%</span></div>
    </div>
    <div class="section"><div class="section-title">Tech Stack</div><div class="tags"><span class="tag">React</span><span class="tag">TypeScript</span><span class="tag">Node.js</span><span class="tag">Express</span><span class="tag">Three.js</span><span class="tag">WebGL</span><span class="tag">WebSocket</span><span class="tag">PHP</span><span class="tag">Laravel</span><span class="tag">Tailwind</span><span class="tag">Vite</span><span class="tag">AWS</span><span class="tag">CI/CD</span><span class="tag">Git</span></div></div>
    <div class="section"><div class="section-title">Education</div><div class="item-title">Computer Science</div><div class="item-sub">Self-taught · 2022 – Present</div><div class="item-desc">Continuous learning through projects, open source, and hands-on development.</div></div>
    <div class="section"><div class="section-title">Links</div><div style="display:flex;flex-direction:column;gap:.4rem;font-family:'Share Tech Mono',monospace;font-size:.78rem;"><a href="https://github.com/Bossciano">github.com/Bossciano</a><a href="https://bossciano.netlify.app">bossciano.netlify.app</a></div></div>
  </div><div>
    <div class="section"><div class="section-title">Profile</div><p style="font-size:.82rem;color:#999;line-height:1.7;">I build high-performance web applications, real-time systems, and interactive experiences. Passionate about building high-performance web applications, real-time systems, and immersive 3D experiences.</p></div>
    <div class="section"><div class="section-title">Projects</div>
      <div style="margin-bottom:1rem;"><div class="item-title">Blastech — Solar & Energy Platform</div><div class="item-sub">React · TypeScript · Node.js · Tailwind CSS</div><div class="item-desc">Solar and energy solutions platform for homeowners — solar quotes, EV charging, Powerwall installs.</div></div>
      <div style="margin-bottom:1rem;"><div class="item-title">Liquid — Crypto Trading Dashboard</div><div class="item-sub">React · TypeScript · WebSocket · TradingView</div><div class="item-desc">Real-time crypto trading dashboard with live charts, watchlists and quick-trade execution.</div></div>
      <div style="margin-bottom:1rem;"><div class="item-title">Dawa Charity Foundation — NGO Website</div><div class="item-sub">React · PHP · Laravel · MySQL · Tailwind CSS</div><div class="item-desc">Full charity website for The Dawa Charity Foundation with causes, gallery and donation system.</div></div>
      <div><div class="item-title">NFTSlice — PVP Card Battle Game</div><div class="item-sub">TypeScript · Node.js · WebSocket · React · HTML5</div><div class="item-desc">Real-time PVP card battle game with NFT avatars, deck building and Rock-Paper-Scissors color combat system.</div></div>
    </div>
    <div class="section"><div class="section-title">Services</div>
      <div style="margin-bottom:.75rem;"><div class="item-title">Full Stack Web Development</div><div class="item-desc">End-to-end applications from DB to polished frontend, REST APIs, auth and cloud deployment.</div></div>
      <div><div class="item-title">3D & Real-time Experiences</div><div class="item-desc">Interactive 3D web experiences, multiplayer systems, GPU-accelerated visualizations.</div></div>
    </div>
  </div></div></body></html>`;
  const blob=new Blob([html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='Louis_Ciano_Resume.html';a.click();
  URL.revokeObjectURL(url);
}
