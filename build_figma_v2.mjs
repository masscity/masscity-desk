// build_figma_v2.mjs — MassCityDesk full Figma build (faithful to source)
import http from 'http';

async function inject(code, label = '') {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ code });
    const opts = {
      hostname: '127.0.0.1', port: 3845, path: '/api/inject',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = http.request(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.error) console.error(`✗ ${label}:`, j.error);
          else console.log(`✓ ${label}`);
          resolve(j);
        } catch (e) {
          console.log(`✓ ${label} raw:`, data.slice(0, 120));
          resolve({ raw: data });
        }
      });
    });
    req.on('error', e => { console.error(`✗ ${label}:`, e.message); reject(e); });
    req.write(body); req.end();
  });
}

// ─── Helper code prepended to every inject ───────────────────────────────────
const H = `
const C={
  bg0:{r:0.965,g:0.941,b:0.886},bg1:{r:0.937,g:0.890,b:0.812},
  ink:{r:0.263,g:0.173,b:0.129},ink2:{r:0.408,g:0.313,b:0.263},ink3:{r:0.584,g:0.502,b:0.459},
  acc:{r:0.831,g:0.443,b:0.278},acd:{r:0.545,g:0.259,b:0.153},
  yel:{r:0.910,g:0.812,b:0.545},grn:{r:0.690,g:0.808,b:0.675},pnk:{r:0.835,g:0.655,b:0.592},
  gf:{r:1.000,g:0.980,b:0.933},gb:{r:0.431,g:0.294,b:0.176},
  cr:{r:0.980,g:0.958,b:0.918},wh:{r:1,g:1,b:1},dk:{r:0.078,g:0.059,b:0.031},
  sage:{r:0.647,g:0.773,b:0.647},vlux:{r:0.557,g:0.682,b:0.816},
  edu:{r:0.855,g:0.659,b:0.573},pat:{r:0.894,g:0.843,b:0.604},
  meta:{r:0.882,g:0.573,b:0.373},
};
const S=(c,a=1)=>[{type:'SOLID',color:c,opacity:a}];
function fr(w,h,nm=''){const n=figma.createFrame();n.resize(w||1,h||1);n.name=nm;n.clipsContent=true;return n;}
function rc(w,h,nm=''){const n=figma.createRectangle();n.resize(w||1,h||1);n.name=nm;return n;}
function el(w,h,nm=''){const n=figma.createEllipse();n.resize(w||1,h||1);n.name=nm;return n;}
function at(n,p,x,y){if(x!==undefined)n.x=x;if(y!==undefined)n.y=y;p.appendChild(n);return n;}
function glass(n,blur){
  blur=blur||22;
  n.fills=S(C.gf,0.55);
  n.strokes=[{type:'SOLID',color:C.gb,opacity:0.28}];
  n.strokeWeight=1;n.strokeAlign='INSIDE';
  n.effects=[
    {type:'BACKGROUND_BLUR',radius:blur,visible:true},
    {type:'DROP_SHADOW',color:{r:C.dk.r,g:C.dk.g,b:C.dk.b,a:0.32},offset:{x:0,y:18},radius:36,spread:-16,visible:true,blendMode:'NORMAL'}
  ];
  return n;
}
function GF(w,h,r){const n=fr(w,h,'glass');if(r)n.cornerRadius=r;glass(n);return n;}
async function T(txt,o){
  o=o||{};
  const n=figma.createText();
  const fam=o.font||'Plus Jakarta Sans',sty=o.style||'Regular';
  await figma.loadFontAsync({family:fam,style:sty});
  n.fontName={family:fam,style:sty};
  n.characters=String(txt);
  n.fontSize=o.size||14;
  if(o.color)n.fills=S(o.color);
  if(o.fill)n.fills=o.fill;
  if(o.align)n.textAlignHorizontal=o.align;
  if(o.lh)n.lineHeight={value:o.lh,unit:'PIXELS'};
  if(o.ls)n.letterSpacing={value:o.ls,unit:'PERCENT'};
  if(o.w){n.textAutoResize='HEIGHT';n.resize(o.w,100);}
  else n.textAutoResize='WIDTH_AND_HEIGHT';
  if(o.opacity!==undefined)n.opacity=o.opacity;
  return n;
}
async function WC(title,ac,w,h,hdr){
  hdr=hdr||44;
  const card=fr(w,h,'WC:'+title);glass(card);card.cornerRadius=14;
  const hb=fr(w,hdr,'hdr');
  hb.fills=S(C.gb,0.10);
  hb.strokes=[{type:'SOLID',color:C.gb,opacity:0.18}];
  hb.strokeWeight=1;hb.strokeAlign='INSIDE';
  card.appendChild(hb);
  const dcols=[ac||C.acc,C.yel,C.grn];
  for(let i=0;i<3;i++){const d=el(10,10,'dot');d.fills=S(dcols[i]);d.x=14+i*16;d.y=(hdr-10)/2;hb.appendChild(d);}
  const tt=await T(title,{style:'Medium',size:11,color:C.ink2});
  tt.x=Math.round(w/2-tt.width/2);tt.y=Math.round((hdr-tt.height)/2);
  hb.appendChild(tt);
  const body=fr(w,h-hdr,'body');body.y=hdr;body.fills=S(C.gf,0.6);body.clipsContent=false;
  card.appendChild(body);
  return{card,body};
}
async function Pill(lbl,bg,fg,sz,px,r){
  sz=sz||11;px=px||10;r=r||999;
  const f=fr(1,1,'pill');f.layoutMode='HORIZONTAL';
  f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';
  f.paddingLeft=px;f.paddingRight=px;f.paddingTop=5;f.paddingBottom=5;
  f.cornerRadius=r;f.fills=S(bg);
  const t=await T(lbl,{size:sz,color:fg,style:'SemiBold'});
  f.appendChild(t);f.name='pill:'+lbl;return f;
}
async function navBar(root,W){
  const bar=fr(W,64,'nav');bar.fills=S(C.bg0,0.96);
  bar.effects=[{type:'DROP_SHADOW',color:{r:C.dk.r,g:C.dk.g,b:C.dk.b,a:0.07},offset:{x:0,y:1},radius:8,spread:0,visible:true,blendMode:'NORMAL'}];
  at(bar,root,0,0);
  const logo=await T('muhamad andri.',{style:'SemiBold',size:15,color:C.ink});
  at(logo,bar,48,22);
  const links=[['Work',true],['Resume',false],['Contact',false]];
  let nx=W-280;
  for(const [lbl,active] of links){
    const lt=await T(lbl,{size:14,color:active?C.acc:C.ink2,style:active?'SemiBold':'Medium'});
    at(lt,bar,nx,24);nx+=lt.width+32;
  }
  return bar;
}
`;

// ─── Step 0: Setup ────────────────────────────────────────────────────────────
async function setup() {
  await inject(H + `
(async()=>{
  const webPage=figma.root.children.find(p=>p.name==='Web')||figma.currentPage;
  figma.currentPage=webPage;
  ['Portfolio — Work','Resume','Case Study — VR Parachute'].forEach(nm=>{
    const old=webPage.children.find(n=>n.name===nm);if(old)old.remove();
  });
  const fonts=[
    {family:'DM Serif Display',style:'Regular'},
    {family:'DM Serif Display',style:'Italic'},
    {family:'Plus Jakarta Sans',style:'Regular'},
    {family:'Plus Jakarta Sans',style:'Medium'},
    {family:'Plus Jakarta Sans',style:'SemiBold'},
    {family:'Plus Jakarta Sans',style:'Bold'},
    {family:'JetBrains Mono',style:'Regular'},
  ];
  await Promise.all(fonts.map(f=>figma.loadFontAsync(f)));
  return 'setup done';
})();
  `, 'setup');
}

// ─── Step 1: Portfolio — Work ─────────────────────────────────────────────────
async function buildPortfolio() {
  const PROJECTS = [
    { num:'01', title:'VR Parachute Simulator', role:'Lead Designer', coverKey:'sage', active:true },
    { num:'02', title:'Vlux Smart Lighting App', role:'Product Designer', coverKey:'vlux', active:false },
    { num:'03', title:'EduTech Platform', role:'UI/UX Designer', coverKey:'edu', active:false },
    { num:'04', title:'Pataland Web Game', role:'Game UI Designer', coverKey:'pat', active:false },
    { num:'05', title:'Metaverse Experiences', role:'3D UI Designer', coverKey:'meta', active:false },
  ];

  const PROJ_JSON = JSON.stringify(PROJECTS);

  await inject(H + `
(async()=>{
  const W=1440, H=5200;
  const root=fr(W,H,'Portfolio — Work');
  root.fills=S(C.bg0);
  figma.currentPage.appendChild(root);
  root.x=0;root.y=0;

  await navBar(root,W);

  // divider under nav
  const sep=rc(W,1,'sep');sep.fills=S(C.gb,0.18);at(sep,root,0,64);

  // Room atmosphere — subtle warm gradient overlay
  const atm=rc(W,H,'atm');
  atm.fills=[{type:'GRADIENT_LINEAR',
    gradientTransform:[[0,1,0],[-1,0,1]],
    gradientStops:[{position:0,color:{r:C.bg1.r,g:C.bg1.g,b:C.bg1.b,a:0.5}},{position:1,color:{r:C.bg0.r,g:C.bg0.g,b:C.bg0.b,a:0}}]
  }];
  at(atm,root,0,0);

  // ─── LEFT RAIL ───
  const RAIL_X=32, RAIL_TOP=80, RAIL_W=280;
  const RAIL_H=H-RAIL_TOP-32;
  const {card:listCard,body:listBody}=await WC('projects.list',C.acc,RAIL_W,RAIL_H);
  at(listCard,root,RAIL_X,RAIL_TOP);

  // filter chips
  const filters=['All','Lead','Product','UI','UX','3D','Game'];
  const chipRow=fr(RAIL_W-32,28,'chips');
  chipRow.layoutMode='HORIZONTAL';chipRow.itemSpacing=6;
  chipRow.primaryAxisSizingMode='AUTO';chipRow.counterAxisSizingMode='AUTO';
  chipRow.fills=[];
  for(const f of filters){
    const chip=await Pill(f,f==='All'?C.acc:C.cr,f==='All'?C.wh:C.ink2,10,8,999);
    chipRow.appendChild(chip);
  }
  at(chipRow,listBody,16,16);

  // project list items
  const PROJECTS=${PROJ_JSON};
  let fy=chipRow.height+32;
  for(const p of PROJECTS){
    const iH=84;
    const item=fr(RAIL_W-32,iH,'item:'+p.num);
    item.cornerRadius=10;
    item.fills=p.active?S(C.acc,0.10):[];
    if(p.active){
      item.strokes=[{type:'SOLID',color:C.acc,opacity:0.35}];
      item.strokeWeight=1;item.strokeAlign='INSIDE';
    }
    at(item,listBody,16,fy);

    const numT=await T(p.num,{font:'JetBrains Mono',size:10,color:p.active?C.acc:C.ink3,ls:5});
    at(numT,item,12,10);

    // color swatch
    const sw=rc(32,32,'sw');sw.cornerRadius=6;
    sw.fills=S(C[p.coverKey]||C.sage);
    at(sw,item,RAIL_W-32-12-32,10);

    const titleT=await T(p.title,{style:'SemiBold',size:13,color:p.active?C.ink:C.ink2,w:RAIL_W-32-64,lh:19});
    at(titleT,item,12,26);

    const roleT=await T(p.role,{size:11,color:C.ink3,style:'Medium'});
    at(roleT,item,12,iH-18);

    fy+=iH+8;
  }

  // ─── RIGHT PANE — VR Parachute ───
  const RX=RAIL_X+RAIL_W+24, RW=W-RX-32;
  let cy=RAIL_TOP;

  // Kicker
  const kick=await T('CASE STUDY',{style:'Bold',size:10,color:C.acc,ls:18});
  at(kick,root,RX,cy);cy+=kick.height+10;

  // Title
  const title=await T('VR Parachute Simulator',{font:'DM Serif Display',size:52,color:C.ink,w:RW,lh:64});
  at(title,root,RX,cy);cy+=title.height+14;

  // Italic summary
  const summary=await T('Designing the training interface for a military-grade VR parachute system — from jump controls to emergency protocols.',{font:'DM Serif Display',style:'Italic',size:18,color:C.ink2,w:RW,lh:28});
  at(summary,root,RX,cy);cy+=summary.height+28;

  // Meta strip
  const META=[['Role','Lead Designer'],['Year','2024'],['Client','Confidential'],['Tools','Figma · Unity']];
  const metaY=cy;
  let mx=0;
  for(const [lbl,val] of META){
    const mw=Math.round(RW/4);
    const lT=await T(lbl,{style:'Bold',size:10,color:C.ink3,ls:10});at(lT,root,RX+mx,metaY);
    const vT=await T(val,{style:'Medium',size:14,color:C.ink});at(vT,root,RX+mx,metaY+18);
    mx+=mw;
  }
  cy=metaY+50;

  // Hero 21:9
  const heroH=Math.round(RW*9/21);
  const hero=fr(RW,heroH,'hero');
  hero.cornerRadius=12;
  hero.fills=[{type:'GRADIENT_LINEAR',
    gradientTransform:[[1,0,0],[0,1,0]],
    gradientStops:[
      {position:0,color:{r:C.sage.r,g:C.sage.g+0.04,b:C.sage.b,a:1}},
      {position:1,color:{r:C.sage.r-0.12,g:C.sage.g-0.08,b:C.sage.b-0.12,a:1}}
    ]
  }];
  at(hero,root,RX,cy);

  // Initials text on hero
  const ini=await T('AS',{font:'DM Serif Display',size:72,color:C.wh,align:'CENTER'});
  ini.opacity=0.22;
  at(ini,hero,Math.round(RW/2-ini.width/2),Math.round(heroH/2-ini.height/2));
  cy+=heroH+36;

  // Challenge
  const chalH=await T('Challenge',{font:'DM Serif Display',size:30,color:C.ink});
  at(chalH,root,RX,cy);cy+=chalH.height+12;
  const chalB=await T('The VR Parachute Simulator required an interface operable through a helmet visor and with gloves — high contrast, large targets, and split-second legibility at altitude.',{size:15,color:C.ink2,w:RW,lh:24});
  at(chalB,root,RX,cy);cy+=chalB.height+40;

  // Approach
  const appH=await T('Approach',{font:'DM Serif Display',size:30,color:C.ink});
  at(appH,root,RX,cy);cy+=appH.height+12;
  const appB=await T('Glassmorphic panels adapt to ambient light; oversized touch targets scale for gloved interaction; progressive disclosure hides non-critical data during high-stress jump phases.',{size:15,color:C.ink2,w:RW,lh:24});
  at(appB,root,RX,cy);cy+=appB.height+32;

  // 2-up highlight cards
  const hlW=Math.round(RW/2)-8;
  const hlTitles=['Clear Visual Hierarchy','Glove-Friendly Controls'];
  const hlBodies=['High-contrast labels and color-coded alerts ensure readability at altitude under any lighting condition.','Large, well-spaced controls designed for operation with military-grade flight gloves.'];
  for(let i=0;i<2;i++){
    const hl=GF(hlW,148,12);
    at(hl,root,RX+i*(hlW+16),cy);
    const ht=await T(hlTitles[i],{style:'SemiBold',size:14,color:C.ink,w:hlW-32});
    at(ht,hl,16,16);
    const hb=await T(hlBodies[i],{size:13,color:C.ink2,w:hlW-32,lh:20});
    at(hb,hl,16,40);
  }
  cy+=156+32;

  // Outcome metrics 3-up
  const METRICS=[['90%','Training completion rate'],['2.1s','Avg emergency response'],['4.8★','Trainee satisfaction']];
  const mW=Math.round(RW/3)-8;
  for(let i=0;i<3;i++){
    const mc=GF(mW,120,12);
    at(mc,root,RX+i*(mW+12),cy);
    const mv=await T(METRICS[i][0],{font:'DM Serif Display',size:38,color:C.acc});
    at(mv,mc,16,18);
    const ml=await T(METRICS[i][1],{size:12,color:C.ink2,w:mW-32,lh:18});
    at(ml,mc,16,64);
  }
  cy+=128+28;

  // Action row
  const prevT=await T('← Previous',{size:13,color:C.ink3,style:'Medium'});
  at(prevT,root,RX,cy);
  const nextPill=await Pill('Next Project →',C.acc,C.wh,13,16,8);
  at(nextPill,root,RX+RW-nextPill.width,cy-6);

  figma.viewport.scrollAndZoomIntoView([root]);
  return root.id;
})();
  `, 'portfolio');
}

// ─── Step 2: Resume ───────────────────────────────────────────────────────────
async function buildResume() {
  await inject(H + `
(async()=>{
  const W=1440, H=5600;
  const root=fr(W,H,'Resume');
  root.fills=S(C.bg0);
  figma.currentPage.appendChild(root);
  root.x=1540;root.y=0;

  await navBar(root,W);
  const sep=rc(W,1,'sep');sep.fills=S(C.gb,0.18);at(sep,root,0,64);

  // ─── SIDEBAR (300px) ───
  const SX=32,ST=80,SW=300,SH=H-ST-32;
  const {card:sCard,body:sBody}=await WC('profile.card',C.grn,SW,SH);
  at(sCard,root,SX,ST);

  // Photo slot
  const photo=rc(SW-32,SW-32,'photo');photo.cornerRadius=12;
  photo.fills=[{type:'GRADIENT_LINEAR',
    gradientTransform:[[1,0,0],[0,1,0]],
    gradientStops:[{position:0,color:{r:C.bg1.r,g:C.bg1.g,b:C.bg1.b,a:1}},{position:1,color:{r:C.cr.r,g:C.cr.g,b:C.cr.b,a:1}}]
  }];
  at(photo,sBody,16,16);
  const photoLbl=await T('Photo',{size:12,color:C.ink3,align:'CENTER'});
  at(photoLbl,photo,Math.round((SW-32)/2-photoLbl.width/2),Math.round((SW-32)/2-photoLbl.height/2));

  let sy=SW-32+24;

  // Name
  const name=await T('Muhamad Andri Saputro',{font:'DM Serif Display',size:22,color:C.ink,w:SW-32,lh:28});
  at(name,sBody,16,sy);sy+=name.height+6;
  const role=await T('Product & UI/UX Designer',{style:'Medium',size:13,color:C.ink2,w:SW-32});
  at(role,sBody,16,sy);sy+=role.height+12;

  // Open to work badge
  const otw=await Pill('Open to work',C.grn,C.acd,11,10,999);
  at(otw,sBody,16,sy);sy+=otw.height+20;

  // divider
  const div=rc(SW-32,1,'div');div.fills=S(C.gb,0.20);at(div,sBody,16,sy);sy+=17;

  // Info rows
  const INFO=[['Location','Jakarta, Indonesia'],['Timezone','GMT+7'],['Experience','5+ years'],['Education','Binus University']];
  for(const [lbl,val] of INFO){
    const lt=await T(lbl,{style:'Bold',size:10,color:C.ink3,ls:10});at(lt,sBody,16,sy);
    const vt=await T(val,{style:'Medium',size:13,color:C.ink});at(vt,sBody,16,sy+14);
    sy+=38;
  }
  sy+=8;

  // Contact links
  const LINKS=['andri.saputro98@gmail.com','linkedin.com/in/andrisaputro','github.com/andrisaputro'];
  for(const lnk of LINKS){
    const lt=await T(lnk,{size:12,color:C.acc,style:'Medium'});
    at(lt,sBody,16,sy);sy+=lt.height+8;
  }
  sy+=12;

  // Download CV button
  const cvBtn=await Pill('↓  Download CV',C.acc,C.wh,13,16,8);
  at(cvBtn,sBody,16,sy);sy+=cvBtn.height+16;

  // ─── MAIN AREA ───
  const MX=SX+SW+24, MW=W-MX-32;
  let cy=ST;

  // Hero WindowCard "resume.txt"
  const {card:heroCard,body:heroBody}=await WC('resume.txt',C.acc,MW,240);
  at(heroCard,root,MX,cy);
  const heroTitle=await T('Muhamad Andri Saputro',{font:'DM Serif Display',size:40,color:C.ink,w:MW-48});
  at(heroTitle,heroBody,24,20);
  const heroSub=await T('I design products people love — clear, purposeful, and crafted with care.',{font:'DM Serif Display',style:'Italic',size:18,color:C.ink2,w:MW-48,lh:26});
  at(heroSub,heroBody,24,72);
  const heroPills=[['Available for freelance',C.grn,C.acd],['Remote-first',C.yel,C.acd],['Full-time open',C.pnk,C.acd]];
  let hpx=24;
  for(const [lbl,bg,fg] of heroPills){
    const p=await Pill(lbl,bg,fg,11,10,999);
    at(p,heroBody,hpx,134);hpx+=p.width+8;
  }
  cy+=240+24;

  // Case Study tiles (3-col)
  const csSection=await T('Case Studies',{font:'DM Serif Display',size:26,color:C.ink});
  at(csSection,root,MX,cy);cy+=csSection.height+16;
  const CS=[
    {title:'VR Parachute Simulator',tag:'Lead Designer',col:C.sage},
    {title:'Vlux Smart Lighting',tag:'Product',col:C.vlux},
    {title:'EduTech Platform',tag:'UI/UX',col:C.edu},
  ];
  const csW=Math.round(MW/3)-8;
  for(let i=0;i<3;i++){
    const tile=fr(csW,160,'cs:'+i);tile.cornerRadius=12;
    tile.fills=[{type:'GRADIENT_LINEAR',
      gradientTransform:[[1,0,0],[0,1,0]],
      gradientStops:[{position:0,color:{...CS[i].col,a:1}},{position:1,color:{r:CS[i].col.r-0.1,g:CS[i].col.g-0.07,b:CS[i].col.b-0.08,a:1}}]
    }];
    at(tile,root,MX+i*(csW+12),cy);
    const ct=await T(CS[i].title,{style:'SemiBold',size:14,color:C.ink,w:csW-24,lh:20});
    at(ct,tile,12,12);
    const cp=await Pill(CS[i].tag,{r:1,g:1,b:1},{r:C.ink.r,g:C.ink.g,b:C.ink.b},10,8,999);
    cp.fills=S(C.wh,0.55);
    at(cp,tile,12,160-36);
  }
  cy+=168+32;

  // Experience section
  const expH=await T('Experience',{font:'DM Serif Display',size:26,color:C.ink});
  at(expH,root,MX,cy);cy+=expH.height+16;

  const EXP=[
    {company:'Cube Studio',role:'Lead UI/UX Designer',period:'2023 – Present',badge:'Currently leading',badgeCol:C.grn,desc:'Leading product design for a game development studio. Spearheaded the design system, onboarded 3 junior designers, and shipped 4 major features.',color:C.grn},
    {company:'Paradimensi',role:'Product Designer',period:'2022 – 2023',badge:'Contract',badgeCol:C.yel,desc:'Designed end-to-end UX for a metaverse social platform. Shipped the avatar customisation flow and the social graph UI.',color:C.yel},
    {company:'Techpolitan',role:'UI Designer',period:'2021 – 2022',badge:'Full-time',badgeCol:C.pnk,desc:'Contributed to the consumer-facing dashboard and design language for an edtech startup serving 40,000+ students.',color:C.pnk},
  ];

  for(const e of EXP){
    const eH=180;
    const eCard=GF(MW,eH,14);
    at(eCard,root,MX,cy);

    const badge=await Pill(e.badge,e.badgeCol,C.acd,10,8,999);
    at(badge,eCard,MW-badge.width-16,14);

    const co=await T(e.company,{style:'Bold',size:16,color:C.ink});at(co,eCard,16,14);
    const ro=await T(e.role,{style:'Medium',size:13,color:C.ink2});at(ro,eCard,16,36);
    const pe=await T(e.period,{font:'JetBrains Mono',size:11,color:C.ink3});at(pe,eCard,16,56);
    const dv=rc(MW-32,1,'dv');dv.fills=S(C.gb,0.15);at(dv,eCard,16,76);
    const de=await T(e.desc,{size:13,color:C.ink2,w:MW-32,lh:20});at(de,eCard,16,90);

    cy+=eH+16;
  }

  // How I Work (3 principles)
  cy+=16;
  const hiwH=await T('How I Work',{font:'DM Serif Display',size:26,color:C.ink});
  at(hiwH,root,MX,cy);cy+=hiwH.height+16;

  const HIW=[
    {icon:'◎',title:'Research First','desc':'Every decision starts with real user pain, not assumptions.'},
    {icon:'◈',title:'Systems Thinking','desc':'I design components, not screens — always thinking about scale.'},
    {icon:'◉',title:'Craft Matters','desc':'Pixel precision and thoughtful micro-interactions are non-negotiable.'},
  ];
  const hiwW=Math.round(MW/3)-8;
  for(let i=0;i<3;i++){
    const hc=GF(hiwW,160,12);
    at(hc,root,MX+i*(hiwW+12),cy);
    const ico=await T(HIW[i].icon,{font:'DM Serif Display',size:28,color:C.acc});at(ico,hc,16,16);
    const ht=await T(HIW[i].title,{style:'SemiBold',size:14,color:C.ink});at(ht,hc,16,54);
    const hd=await T(HIW[i].desc,{size:13,color:C.ink2,w:hiwW-32,lh:19});at(hd,hc,16,76);
  }
  cy+=168+32;

  // Proof / Awards
  const proofH=await T('Recognition',{font:'DM Serif Display',size:26,color:C.ink});
  at(proofH,root,MX,cy);cy+=proofH.height+16;
  const AWARDS=['Awwwards Honorable Mention — Pataland (2023)','CSS Design Awards WOTD — Vlux (2023)','Google UX Cert — Distinction (2022)'];
  for(const aw of AWARDS){
    const at2=await T('★  '+aw,{style:'Medium',size:13,color:C.ink2,lh:20});
    at(at2,root,MX,cy);cy+=at2.height+10;
  }
  cy+=24;

  // Contact strip (2-col)
  const ctH=await T('Get in Touch',{font:'DM Serif Display',size:26,color:C.ink});
  at(ctH,root,MX,cy);cy+=ctH.height+16;
  const ctCard=GF(MW,120,14);
  at(ctCard,root,MX,cy);
  const emailT=await T('andri.saputro98@gmail.com',{style:'SemiBold',size:15,color:C.acc});
  at(emailT,ctCard,24,24);
  const emailSub=await T('Best for project inquiries and full-time roles.',{size:13,color:C.ink2});
  at(emailSub,ctCard,24,46);
  const ctBtn=await Pill('Say Hello →',C.acc,C.wh,13,16,8);
  at(ctBtn,ctCard,MW-ctBtn.width-24,cy+40-cy);
  cy+=128+24;

  // Footer
  const foot=await T('Muhamad Andri Saputro · Jakarta · 2025',{size:12,color:C.ink3,align:'CENTER'});
  at(foot,root,Math.round(W/2-foot.width/2),H-40);

  figma.viewport.scrollAndZoomIntoView([root]);
  return root.id;
})();
  `, 'resume');
}

// ─── Step 3: Case Study — VR Parachute ───────────────────────────────────────
async function buildCaseStudy() {
  const CASE_SECTIONS = [
    {
      step: '01',
      title: 'Discovery & Research',
      body: 'Embedded with military training instructors to shadow 12 live jump briefings. Synthesised 40+ hours of observations into 6 key interaction moments: pre-jump checklist, altitude monitoring, canopy deployment, emergency cutaway, landing approach, and post-jump debrief.'
    },
    {
      step: '02',
      title: 'Defining Constraints',
      body: 'The interface must work at −20 °C with gloves on. Buttons must be ≥ 44 px. No more than 3 pieces of information visible at once. Color alone cannot convey meaning — every alert needs both color and iconography. Low-light mode mandatory.'
    },
    {
      step: '03',
      title: 'Ideation & Concept',
      body: 'Explored 5 concept directions across 3 design sprints. Selected the glassmorphic HUD approach: transparent panels that blend with the VR environment, with a persistent status bar and context-sensitive detail cards surfacing on demand.'
    },
    {
      step: '04',
      title: 'Prototyping & Testing',
      body: 'Built 3 high-fidelity Unity prototypes. Ran 8 usability sessions with trained paratroopers. Key findings: the altitude dial needed 40% larger, emergency cutaway confirmation needed 2-step confirmation, and the landing zone indicator needed persistent visibility.'
    },
    {
      step: '05',
      title: 'Handoff & Delivery',
      body: 'Delivered a 340-component design system, 6 annotated user flows, and 2 interactive Unity prototypes. Worked directly with the 3D engineering team through a 6-week integration sprint, resolving 22 dev queries and maintaining visual fidelity across all VR headsets.'
    },
  ];

  const SECTS_JSON = JSON.stringify(CASE_SECTIONS);

  await inject(H + `
(async()=>{
  const W=1440, H=7200;
  const root=fr(W,H,'Case Study — VR Parachute');
  root.fills=S(C.bg0);
  figma.currentPage.appendChild(root);
  root.x=3080;root.y=0;

  await navBar(root,W);
  const sep=rc(W,1,'sep');sep.fills=S(C.gb,0.18);at(sep,root,0,64);

  let cy=96;

  // ─── HERO ───
  // Back link
  const back=await T('← All Case Studies',{size:13,color:C.acc,style:'Medium'});
  at(back,root,72,cy);cy+=back.height+18;

  // Kicker
  const kick=await T('CASE STUDY · VR TRAINING',{style:'Bold',size:10,color:C.acc,ls:16});
  at(kick,root,72,cy);cy+=kick.height+12;

  // Big title
  const bigTitle=await T('VR Parachute Simulator',{font:'DM Serif Display',size:72,color:C.ink,w:900,lh:84});
  at(bigTitle,root,72,cy);cy+=bigTitle.height+16;

  // Italic tagline
  const tagline=await T('An interface built for altitude, adrenaline, and accuracy.',{font:'DM Serif Display',style:'Italic',size:24,color:C.acc,w:860,lh:34});
  at(tagline,root,72,cy);cy+=tagline.height+40;

  // ─── COVER ART (21:9) ───
  const coverH=Math.round((W-144)*9/21);
  const cover=fr(W-144,coverH,'cover');
  cover.cornerRadius=16;
  cover.fills=[{type:'GRADIENT_LINEAR',
    gradientTransform:[[1,0,0],[0,1,0]],
    gradientStops:[
      {position:0,color:{r:0.690,g:0.808,b:0.675,a:1}},
      {position:0.5,color:{r:0.580,g:0.710,b:0.565,a:1}},
      {position:1,color:{r:0.435,g:0.588,b:0.435,a:1}}
    ]
  }];
  at(cover,root,72,cy);

  // Parachute illustration
  // Canopy shape
  const canopy=figma.createVector();
  canopy.vectorPaths=[{windingRule:'NONZERO',data:'M 212.5 75 Q 212.5 37.5 258.3 33.3 Q 304.2 37.5 304.2 75 L 283.3 75 Q 279.2 54.2 258.3 52.1 Q 237.5 54.2 233.3 75 Z'}];
  canopy.fills=S(C.wh,0.85);canopy.strokes=[];
  canopy.x=Math.round((W-144)/2-258);canopy.y=Math.round(coverH*0.15);
  cover.appendChild(canopy);

  // Lines from canopy to cadet
  const lines=figma.createVector();
  lines.vectorPaths=[{windingRule:'NONE',data:'M 212.5 75 L 258.3 125 M 235.4 75 L 258.3 125 M 258.3 75 L 258.3 125 M 281.25 75 L 258.3 125 M 304.2 75 L 258.3 125'}];
  lines.strokes=[{type:'SOLID',color:C.wh,opacity:0.7}];
  lines.strokeWeight=1.5;lines.fills=[];
  lines.x=canopy.x;lines.y=canopy.y;
  cover.appendChild(lines);

  // Cadet figure (simple ellipse + rectangle)
  const cadet=el(22,22,'cadet');cadet.fills=S(C.wh,0.85);
  cadet.x=Math.round((W-144)/2-258+258.3-11);
  cadet.y=canopy.y+150;
  cover.appendChild(cadet);

  // Cloud shapes
  for(let i=0;i<3;i++){
    const cl=el(80+i*20,28,'cloud');
    cl.fills=S(C.wh,0.25+i*0.05);
    cl.x=60+i*220;cl.y=coverH*0.6+i*20;
    cover.appendChild(cl);
  }

  // HUD glass overlay
  const hud=fr(280,160,'hud');glass(hud,14);hud.cornerRadius=12;
  at(hud,cover,W-144-320,coverH-180);
  const hudTitle=await T('ALTITUDE',{font:'JetBrains Mono',size:9,color:C.ink3,ls:14});
  at(hudTitle,hud,16,16);
  const hudVal=await T('3,200 m',{font:'JetBrains Mono',size:32,color:C.ink});
  at(hudVal,hud,16,32);
  const hudSub=await T('TERMINAL VELOCITY  ·  58 m/s',{font:'JetBrains Mono',size:9,color:C.acc});
  at(hudSub,hud,16,76);
  const hudBar=rc(248,6,'bar');hudBar.cornerRadius=3;hudBar.fills=S(C.gb,0.18);at(hudBar,hud,16,96);
  const hudFill=rc(Math.round(248*0.42),6,'fill');hudFill.cornerRadius=3;hudFill.fills=S(C.acc);at(hudFill,hud,16,96);
  const hudStatus=await Pill('JUMP PHASE 3',C.grn,C.acd,9,8,999);
  at(hudStatus,hud,16,116);

  cy+=coverH+40;

  // ─── META STRIP ───
  const META5=[['Client','Confidential DoD'],['Role','Lead Designer'],['Team','4 Designers, 3 Dev'],['Timeline','6 Months'],['Platform','Oculus Quest 2']];
  const metaCard=fr(W-144,88,'meta');
  glass(metaCard,12);metaCard.cornerRadius=12;
  at(metaCard,root,72,cy);
  const mw=Math.round((W-144)/5);
  for(let i=0;i<5;i++){
    const ml=await T(META5[i][0],{style:'Bold',size:10,color:C.ink3,ls:10});
    at(ml,metaCard,mw*i+24,16);
    const mv=await T(META5[i][1],{style:'Medium',size:14,color:C.ink});
    at(mv,metaCard,mw*i+24,34);
    if(i<4){const dv=rc(1,48,'dv');dv.fills=S(C.gb,0.20);at(dv,metaCard,mw*(i+1),20);}
  }
  cy+=96+40;

  // ─── READING LAYOUT: 1fr content + 240px sidebar ───
  const SIDEBAR_W=240, SIDEBAR_X=W-72-SIDEBAR_W;
  const CONTENT_W=W-144-SIDEBAR_W-32;

  // Sidebar — sticky nav + share
  const sideCard=GF(SIDEBAR_W,520,12);
  at(sideCard,root,SIDEBAR_X,cy);
  const onTitle=await T('On This Page',{style:'SemiBold',size:12,color:C.ink2,ls:5});
  at(onTitle,sideCard,16,16);
  const SECTS=${SECTS_JSON};
  let ssy=40;
  for(const s of SECTS){
    const sl=await T(s.step+' '+s.title,{size:12,color:C.ink3,w:SIDEBAR_W-32,lh:17});
    at(sl,sideCard,16,ssy);ssy+=sl.height+8;
  }
  ssy+=8;
  const shareTitle=await T('Share',{style:'SemiBold',size:12,color:C.ink2,ls:5});
  at(shareTitle,sideCard,16,ssy);ssy+=22;
  const SHARE=['Twitter / X','LinkedIn','Copy Link'];
  for(const sh of SHARE){
    const st=await T(sh,{size:12,color:C.acc});at(st,sideCard,16,ssy);ssy+=st.height+6;
  }

  // Problem section
  const probH=await T('The Problem',{font:'DM Serif Display',size:36,color:C.ink});
  at(probH,root,72,cy);cy+=probH.height+16;
  const probBody=await T('Military parachute training relies on physical simulators that are expensive, immovable, and can only train one person at a time. A VR alternative needed to match — and eventually surpass — the fidelity and safety of the real thing. That meant designing an interface that performed flawlessly under maximum cognitive load.',{size:15,color:C.ink2,w:CONTENT_W,lh:24});
  at(probBody,root,72,cy);cy+=probBody.height+24;

  // Constraints card
  const constCard=GF(CONTENT_W,200,12);
  at(constCard,root,72,cy);
  const constTitle=await T('Key Constraints',{style:'Bold',size:13,color:C.ink,ls:5});
  at(constTitle,constCard,16,16);
  const CONS=['Must operate at −20 °C with gloves on','All controls ≥ 44 px touch target','Max 3 data points visible at any time','No color-only communication — icons required','Works across Oculus Quest 2, Valve Index, HTC Vive'];
  let ccy=40;
  for(const c of CONS){
    const ct=await T('· '+c,{size:13,color:C.ink2,lh:20});at(ct,constCard,16,ccy);ccy+=24;
  }
  cy+=208+40;

  // Process steps (5 numbered cards)
  const procH=await T('The Process',{font:'DM Serif Display',size:36,color:C.ink});
  at(procH,root,72,cy);cy+=procH.height+20;

  for(const s of SECTS){
    const stepCard=GF(CONTENT_W,160,14);
    at(stepCard,root,72,cy);

    const stepNum=await T(s.step,{font:'JetBrains Mono',size:11,color:C.acc,ls:5});
    at(stepNum,stepCard,16,14);

    const stepTitle=await T(s.title,{font:'DM Serif Display',size:22,color:C.ink,w:CONTENT_W-32});
    at(stepTitle,stepCard,16,30);

    const stepBody=await T(s.body,{size:13,color:C.ink2,w:CONTENT_W-32,lh:20});
    at(stepBody,stepCard,16,60);

    cy+=168+12;
  }
  cy+=28;

  // Solution (3 screen mocks + 3 feature cards)
  const solH=await T('The Solution',{font:'DM Serif Display',size:36,color:C.ink});
  at(solH,root,72,cy);cy+=solH.height+20;

  const MOCKS=[
    {label:'Jump HUD',col:C.sage},
    {label:'Emergency Protocol',col:C.pnk},
    {label:'Landing Approach',col:C.yel},
  ];
  const mockW=Math.round(CONTENT_W/3)-8;
  const mockH=Math.round(mockW*9/16);
  for(let i=0;i<3;i++){
    const mock=fr(mockW,mockH,'mock:'+i);mock.cornerRadius=10;
    mock.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[1,0,0],[0,1,0]],
      gradientStops:[{position:0,color:{...MOCKS[i].col,a:1}},{position:1,color:{r:MOCKS[i].col.r-0.1,g:MOCKS[i].col.g-0.07,b:MOCKS[i].col.b-0.08,a:1}}]
    }];
    at(mock,root,72+i*(mockW+12),cy);
    const ml=await T(MOCKS[i].label,{style:'SemiBold',size:12,color:C.ink,w:mockW-24});
    at(ml,mock,12,mockH-36);
  }
  cy+=mockH+20;

  const FEATURES=[
    {title:'Adaptive HUD Density','body':'Panels collapse to a minimal status ring during freefall, expanding automatically on canopy deployment.'},
    {title:'Emergency Workflow','body':'2-step confirmation with haptic feedback for irreversible actions. Color + icon + vibration redundancy.'},
    {title:'Phase-Aware UI',body:'The interface knows which jump phase the user is in and surfaces only the controls relevant to that moment.'},
  ];
  const featW=Math.round(CONTENT_W/3)-8;
  for(let i=0;i<3;i++){
    const fc=GF(featW,148,12);
    at(fc,root,72+i*(featW+12),cy);
    const ft=await T(FEATURES[i].title,{style:'SemiBold',size:14,color:C.ink,w:featW-32});
    at(ft,fc,16,16);
    const fb=await T(FEATURES[i].body,{size:13,color:C.ink2,w:featW-32,lh:19});
    at(fb,fc,16,42);
  }
  cy+=156+40;

  // Outcome
  const outH=await T('Outcome',{font:'DM Serif Display',size:36,color:C.ink});
  at(outH,root,72,cy);cy+=outH.height+20;

  const OUTCOMES=[['90%','Training completion rate'],['2.1s','Emergency response avg'],['4.8★','Trainee satisfaction']];
  const outW=Math.round(CONTENT_W/3)-8;
  for(let i=0;i<3;i++){
    const oc=GF(outW,128,12);
    at(oc,root,72+i*(outW+12),cy);
    const ov=await T(OUTCOMES[i][0],{font:'DM Serif Display',size:40,color:C.acc});at(ov,oc,16,18);
    const ol=await T(OUTCOMES[i][1],{size:13,color:C.ink2,w:outW-32,lh:18});at(ol,oc,16,66);
  }
  cy+=136+32;

  // Quote blockquote
  const qCard=GF(CONTENT_W,160,14);
  at(qCard,root,72,cy);
  const quote=await T('"The interface disappeared — I forgot I was using software. I was just jumping."',{font:'DM Serif Display',style:'Italic',size:20,color:C.ink,w:CONTENT_W-64,lh:30});
  at(quote,qCard,32,24);
  const attribution=await T('— Sergeant Major, 17th Airborne',{style:'Medium',size:13,color:C.ink3});
  at(attribution,qCard,32,qCard.height-32);
  cy+=168+40;

  // Reflection
  const refH=await T('Reflection',{font:'DM Serif Display',size:36,color:C.ink});
  at(refH,root,72,cy);cy+=refH.height+16;
  const refBody=await T('This project taught me that great UX sometimes means designing yourself out of the picture. The best interface is the one the user never has to think about — especially when their life depends on it. I would add more time for cross-platform hardware testing and involve trainees from day one of concept development.',{size:15,color:C.ink2,w:CONTENT_W,lh:24});
  at(refBody,root,72,cy);cy+=refBody.height+48;

  // Prev / Next navigation cards
  const navCardW=Math.round(CONTENT_W/2)-8;
  for(let i=0;i<2;i++){
    const nc=GF(navCardW,96,12);
    at(nc,root,72+i*(navCardW+16),cy);
    const nl=await T(i===0?'← Previous':'Next →',{style:'Medium',size:12,color:C.ink3});at(nl,nc,16,12);
    const nt=await T(i===0?'Vlux Smart Lighting':'EduTech Platform',{style:'SemiBold',size:15,color:C.ink});at(nt,nc,16,32);
    const ns=await T(i===0?'Product Designer':'UI/UX Designer',{size:12,color:C.ink2});at(ns,nc,16,54);
  }
  cy+=104+40;

  // Footer
  const foot=await T('Muhamad Andri Saputro · Jakarta · 2025',{size:12,color:C.ink3,align:'CENTER'});
  at(foot,root,Math.round(W/2-foot.width/2),H-40);

  figma.viewport.scrollAndZoomIntoView([root]);
  return root.id;
})();
  `, 'case-study');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n🚀 MassCityDesk Figma Build v2\n');
  await setup();
  await buildPortfolio();
  await buildResume();
  await buildCaseStudy();
  console.log('\n✅ All 3 pages built.');
})();
