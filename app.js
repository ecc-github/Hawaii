/* Hawaiʻi trip map — Leaflet + Google basemap, Google Places photos and Google driving routes.
   1) Your Google Maps Platform API key goes below.
   2) In Google Cloud, enable: Maps JavaScript API, Places API (New), Routes API.
   Without a key the map falls back to OpenStreetMap / Esri tiles and sketched routes, with no photos. */
const GOOGLE_API_KEY = "AIzaSyCO2AAWn1XKeiKWj6ot0J_uYSz5t1ZT3P0";
const rev=a=>a.slice().reverse();

const LOC={
 hnl:[21.3245,-157.9251],bnb:[21.2810,-157.8300],lani:[21.3930,-157.7150],kai:[21.3965,-157.7405],hoom:[21.3870,-157.8090],kual:[21.5210,-157.8370],pcc:[21.6390,-157.9200],
 hana:[21.2690,-157.6940],kaim:[21.2790,-157.8000],surf:[21.2755,-157.8268],sset:[21.2738,-157.8245],dh:[21.2620,-157.8060],shops:[21.2782,-157.8285],ala:[21.2910,-157.8430],
 ogg:[20.8986,-156.4305],kaa:[20.9240,-156.6920],tday:[20.9200,-156.6930],paia:[20.9130,-156.3810],twin:[20.9120,-156.2430],kean:[20.8620,-156.1440],wai:[20.7870,-156.0020],hanat:[20.7570,-155.9900],
 maa:[20.7920,-156.5110],molo:[20.6330,-156.4960],ttown:[20.6230,-156.4450],lah:[20.8780,-156.6780],kap:[21.0010,-156.6680],olu:[20.8890,-156.6810],hook:[20.9340,-156.3570],maka:[20.8570,-156.3130],sum:[20.7100,-156.2530],kah:[20.8890,-156.4700],
 pearl:[21.3649,-157.9497],nahi:[20.8290,-156.1150]};
const BK={hanauma:['Book Hanauma Bay','https://pros6.hnl.info/hanaumabay'],dh:['Book Diamond Head','https://gostateparks.hawaii.gov/diamondhead'],wai:['Book Waiʻānapanapa','https://gostateparks.hawaii.gov/waianapanapa'],pcc:['Polynesian Cultural Center','https://www.polynesia.com'],kual:['Kualoa Ranch','https://www.kualoa.com'],olu:['Book Old Lahaina Luau','https://www.oldlahainaluau.com'],hale:['Haleakalā park info','https://www.nps.gov/hale']};
const H1=[[21.318,-157.900],[21.308,-157.872],[21.299,-157.850],[21.289,-157.838]];
const PALI=[[21.300,-157.848],[21.330,-157.832],[21.367,-157.793],[21.385,-157.757],[21.396,-157.740],[21.397,-157.727]];
const KAL=[[21.276,-157.812],[21.281,-157.795],[21.280,-157.770],[21.284,-157.740],[21.279,-157.712],[21.272,-157.700]];
const W30=[[20.905,-156.690],[20.870,-156.675],[20.835,-156.650],[20.810,-156.625],[20.795,-156.590],[20.786,-156.560],[20.795,-156.520]];
const MAA_KAH=[[20.830,-156.505],[20.860,-156.492],[20.884,-156.470]];
const HANA_HWY=[[20.912,-156.340],[20.919,-156.300],[20.915,-156.270]];
const CRATER=[[20.837,-156.337],[20.818,-156.322],[20.795,-156.312],[20.780,-156.290],[20.765,-156.276],[20.750,-156.262],[20.737,-156.248],[20.724,-156.240],[20.714,-156.246]];
const DAYS=[
{d:'Mon',dt:'Nov 23',t:'Aloha, Oʻahu',img:'plane',x:'Nupur lands mid-afternoon and Evita arrives at night. Keep today easy: settle in, eat, sleep.',li:['<b>Nupur:</b> RDU 7:10 AM → JFK (1 h layover) → HNL 4:06 PM.','<b>Evita:</b> PSC 1:47 PM → SFO (44 min layover) → HNL 8:30 PM.','<b>12:00 PM ET / 7:00 AM HST:</b> Evita books Hanauma Bay for Wednesday, right on the dot.'],bk:['hanauma'],s:[
 {t:'4:06 PM',n:'Land at HNL',p:LOC.hnl,img:'plane',x:'Nupur lands from JFK. Grab bags and pick up the car.'},
 {t:'4:45 PM',n:'Check into the Waikiki Airbnb',p:LOC.bnb,img:'home',via:H1,x:'Check-in opens at 4 PM. Drop bags, change into something light.'},
 {t:'6:30 PM',n:'Easy dinner in Waikiki',p:LOC.surf,img:'food',x:'Walk to dinner nearby. Pick up water, snacks and reef-safe sunscreen on the way back.'},
 {t:'8:30 PM',n:'Pick up Evita at HNL',p:LOC.hnl,img:'plane',via:rev(H1),x:'Evita lands from SFO at 8:30 PM. About 20 minutes each way.'}]},
{d:'Tue',dt:'Nov 24',t:'Windward side to the North Shore',img:'atv',x:'One big loop, south to north so you never backtrack: beach, garden, ranch, luau.',bk:['kual','pcc'],s:[
 {t:'9:00 AM',n:'Leave Waikiki',p:LOC.bnb,img:'drive',x:'Over the Pali Highway to Kailua, about 35 minutes.'},
 {t:'9:45 AM',n:'Lanikai Beach',p:LOC.lani,img:'beach',via:PALI,x:'Swim and relax on soft white sand facing the Mokulua islets.',tip:'Street parking is very limited: park at Kailua Beach Park and walk over.'},
 {t:'11:45 AM',n:'Lunch in Kailua town',p:LOC.kai,img:'food',via:[[21.397,-157.727]],x:'Plenty of casual spots for poke, plate lunch and shave ice.'},
 {t:'1:00 PM',n:'Hoʻomaluhia Botanical Garden',p:LOC.hoom,img:'garden',via:[[21.395,-157.762],[21.400,-157.790],[21.392,-157.805]],x:'Free. Drive the loop road under the green Koʻolau cliffs and stop at the lake.',tip:'Keep it short: Kualoa check-in is at 2:15, about 20 minutes away.'},
 {t:'2:15 PM',n:'Kualoa Ranch UTV',p:LOC.kual,img:'atv',via:[[21.410,-157.800],[21.432,-157.818],[21.462,-157.840],[21.492,-157.845]],bk:'kual',x:'Check in at 2:15 for the Jurassic Valley adventure. It is done around 5 PM.'},
 {t:'5:30 PM',n:'Aliʻi Luau at PCC',p:LOC.pcc,img:'luau',via:[[21.548,-157.857],[21.575,-157.876],[21.605,-157.895],[21.626,-157.912]],bk:'pcc',x:'Luau dinner at the Polynesian Cultural Center, about 25 minutes up the coast from Kualoa.',tip:'You will likely walk in around 5:30. If your package has a set start time, call ahead to let them know.'},
 {t:'9:00 PM',n:'Drive back to Waikiki',p:LOC.bnb,img:'home',via:[[21.600,-157.890],[21.520,-157.840],[21.450,-157.836],[21.408,-157.812],[21.396,-157.858],[21.378,-157.902],[21.368,-157.926],[21.338,-157.895],[21.310,-157.866],[21.290,-157.840]],x:'Home through the H-3 tunnels, about an hour.'}]},
{d:'Wed',dt:'Nov 25',t:'Hanauma Bay and Diamond Head',img:'snorkel',x:'Snorkel while the water is calm, hike Diamond Head after lunch, then the beach.',bk:['hanauma','dh'],s:[
 {t:'8:00 AM',n:'Leave Waikiki',p:LOC.bnb,img:'drive',x:'About 25 minutes along the south shore.'},
 {t:'8:30 AM',n:'Hanauma Bay snorkel',p:LOC.hana,img:'snorkel',via:KAL,bk:'hanauma',x:'Snorkel until about 11. $25 per person, a little cash for parking, and a short required video before you walk down.'},
 {t:'11:00 AM',n:'Lunch in Kaimukī',p:LOC.kaim,img:'food',via:rev(KAL).slice(1),x:'Kaimukī has great casual lunch spots on the way to Diamond Head.'},
 {t:'12:30 PM',n:'Diamond Head summit',p:LOC.dh,img:'hike',via:[[21.270,-157.803]],bk:'dh',x:'About 1.5 hours round trip to the crater rim and back.',tip:'Book a 12:30 entry slot with parking. There is little shade at midday: bring water and a hat.'},
 {t:'2:30 PM',n:'Surf lesson or beach time',p:LOC.surf,img:'surf',via:[[21.265,-157.812],[21.272,-157.818]],x:'Waikiki has gentle, rolling waves that are perfect for a first lesson. Book with a beach surf school a day or two ahead.'},
 {t:'5:50 PM',n:'Sunset and dinner',p:LOC.sset,img:'sunset',x:'Watch the sun go down from the beach, then dinner in Waikiki.'}]},
{d:'Thu',dt:'Nov 26',t:'Thanksgiving: shop, fly to Maui',img:'shop',x:'Check out by 11, shop through the afternoon, then the 6:27 PM flight to Maui.',li:['Maui Airbnb check-in opens at 3 PM, so it is ready when you land.','Beaches near the Maui Airbnb for free time later: Kāʻanapali, Nāpili and Kapalua Bay.'],s:[
 {t:'9:30 AM',n:'Pack and check out by 11',p:LOC.bnb,img:'home',x:'Load the bags in the car and keep them out of sight all day.'},
 {t:'11:00 AM',n:'Royal Hawaiian Center and International Market Place',p:LOC.shops,img:'shop',x:'Both are a short walk apart in Waikiki.',tip:'Check Thanksgiving hours first: many stores change them.'},
 {t:'1:00 PM',n:'Lunch and shopping at Ala Moana',p:LOC.ala,img:'shop',via:[[21.284,-157.836]],x:'The big open-air mall, on the way toward the airport.'},
 {t:'3:00 PM',n:'Pearl Harbor (optional)',p:LOC.pearl,img:'memorial',via:[[21.300,-157.862],[21.310,-157.882],[21.330,-157.920],[21.355,-157.940]],x:'Only if there is time and energy left. It is about ten minutes from the airport.',tip:'The memorial usually closes on Thanksgiving Day. Check before you drive over.'},
 {t:'4:30 PM',n:'Drop the car at HNL',p:LOC.hnl,img:'plane',via:[[21.350,-157.935],[21.330,-157.925]],x:'Your flight to Maui leaves at 6:27 PM.'},
 {t:'7:08 PM',n:'Land in Kahului (OGG)',p:LOC.ogg,img:'plane',m:'fly',x:'Pick up the car.'},
 {t:'8:00 PM',n:'Drive to the west Maui Airbnb',p:LOC.kaa,img:'home',via:[[20.886,-156.465],...rev(MAA_KAH).slice(1),...rev(W30)],x:'About 45 to 60 minutes.'},
 {t:'8:45 PM',n:'Thanksgiving dinner',p:LOC.tday,img:'food',x:'Reserve a table this week: it is late on a holiday and many places will be closed or full.'}]},
{d:'Fri',dt:'Nov 27',t:'Road to Hāna, then the luau',img:'waterfall',x:'Waterfalls, sea cliffs and a black sand beach, then back west for the luau. Turn around after Waiʻānapanapa to make it on time.',bk:['wai','olu'],s:[
 {t:'8:00 AM',n:'Leave west Maui',p:LOC.kaa,img:'drive',x:'About an hour to Pāʻia.'},
 {t:'9:00 AM',n:'Breakfast in Pāʻia',p:LOC.paia,img:'town',via:[...W30,...MAA_KAH,[20.893,-156.440],[20.905,-156.410]],x:'Breakfast and a wander around town.',tip:'Fill the gas tank here: there is almost none further on.'},
 {t:'10:00 AM',n:'Twin Falls',p:LOC.twin,img:'waterfall',via:HANA_HWY,x:'Short walk to the falls. Small parking fee.'},
 {t:'11:30 AM',n:'Keʻanae Peninsula',p:LOC.kean,img:'coast',via:[[20.903,-156.220],[20.890,-156.200],[20.885,-156.176],[20.870,-156.163]],x:'Black lava rock and huge waves crashing next to bright green taro fields.'},
 {t:'12:30 PM',n:'Lunch at the Nāhiku stands',p:LOC.nahi,img:'food',via:[[20.850,-156.130]],x:'Roadside stands with banana bread, smoked fish and fresh fruit. Bring cash.'},
 {t:'1:30 PM',n:'Waiʻānapanapa State Park',p:LOC.wai,img:'blacksand',via:[[20.818,-156.090],[20.800,-156.060],[20.792,-156.025]],bk:'wai',x:'Black sand beach, sea caves and a coastal trail.',tip:'Head back by about 2:30 to make the luau. Go back the way you came: rental and most Turo agreements forbid the back road past Kīpahulu.'},
 {t:'5:15 PM',n:'Old Lahaina Luau',p:LOC.olu,img:'luau',via:[[20.792,-156.025],[20.800,-156.060],[20.818,-156.090],[20.845,-156.130],[20.870,-156.163],[20.885,-156.176],[20.890,-156.200],[20.903,-156.220],...rev(HANA_HWY),[20.905,-156.410],[20.893,-156.440],...rev(MAA_KAH),...rev(W30).slice(0,5)],bk:'olu',x:'Check in at 5:15 (1251 Front St). Lei greeting, a 4-course dinner, and hula as the sun sets. It ends around 8:15, ten minutes from the Airbnb.'}]},
{d:'Sat',dt:'Nov 28',t:'Molokini and Haleakalā sunset',img:'volcano',x:'Snorkel in the morning, then up the volcano for sunset above the clouds. Sunset needs no reservation.',bk:['hale'],s:[
 {t:'5:50 AM',n:'Leave for Māʻalaea Harbor',p:LOC.kaa,img:'drive',x:'About 35 to 40 minutes. Check in between 6:30 and 7.'},
 {t:'6:30 AM',n:'Check in at the harbor',p:LOC.maa,img:'boat',via:W30,x:'Confirm which harbor your tour leaves from.'},
 {t:'7:30 AM',n:'Molokini Crater',p:LOC.molo,img:'snorkel',m:'boat',x:'Snorkel inside a sunken volcanic crater with very clear water.'},
 {t:'9:30 AM',n:'Turtle Town',p:LOC.ttown,img:'turtle',m:'boat',x:'Green sea turtles feed along the reef here. Look, but keep your distance.'},
 {t:'12:00 PM',n:'Back at the harbor',p:LOC.maa,img:'boat',m:'boat',x:'Rinse off and head inland.'},
 {t:'12:30 PM',n:'Lunch in Kahului',p:LOC.kah,img:'food',via:MAA_KAH,x:'Eat well and pick up snacks and water for the summit.'},
 {t:'3:00 PM',n:'Haleakalā summit and sunset',p:LOC.sum,img:'volcano',via:[[20.870,-156.420],[20.850,-156.370],...CRATER],bk:'hale',x:'About 1.5 hours up; pay the car entrance fee at the gate. Explore the crater viewpoints, then watch sunset above the clouds around 5:45.',tip:'It is near freezing at 10,000 ft. Wear the warmest layers you brought.'},
 {t:'6:00 PM',n:'Drive back to the Airbnb',p:LOC.kaa,img:'home',via:[...rev(CRATER),[20.850,-156.370],[20.870,-156.420],...rev(MAA_KAH),...rev(W30)],x:'Drive down slowly in the dark. Grab dinner in Kahului on the way.'}]},
{d:'Sun',dt:'Nov 29',t:'Pāʻia, then fly home',img:'town',x:'A slow last day. Check out at 10 and spend the afternoon in Pāʻia. Kāʻanapali, Nāpili and Kapalua Bay are next to the Airbnb if you want one more beach first.',s:[
 {t:'10:00 AM',n:'Check out',p:LOC.kaa,img:'home',x:'Keep luggage out of sight in the car all day.'},
 {t:'11:00 AM',n:'Pāʻia town',p:LOC.paia,img:'town',via:[...W30,...MAA_KAH,[20.893,-156.440],[20.905,-156.410]],x:'Surf shops, boutiques and good coffee. Hoʻokipa Lookout, five minutes east, often has turtles on the beach in the afternoon.'},
 {t:'6:30 PM',n:'Dinner in Kahului, return the car',p:LOC.kah,img:'food',via:[[20.905,-156.410],[20.893,-156.440]],x:'Last dinner on the island, then drop the car at the airport.'},
 {t:'8:00 PM',n:'Fly home from OGG',p:LOC.ogg,img:'plane',x:'<b>Evita:</b> 10:10 PM to Seattle, landing Mon 6:02 AM. <b>Nupur:</b> 11:30 PM to Phoenix (1 h 17 min layover), landing in Charlotte Mon 3:37 PM, then the 7:45 PM train to Raleigh, arriving 10:52 PM. Mahalo, Hawaiʻi!'}]}];


/* Google Places search text for each stop's photo (stops not listed use the day's photo) */
const Q={
 'Land at HNL':'Daniel K. Inouye International Airport','Pick up Evita at HNL':'Daniel K. Inouye International Airport','Drop the car at HNL':'Daniel K. Inouye International Airport',
 'Easy dinner in Waikiki':'Waikiki Beach Walk Honolulu','Leave Waikiki':'Waikiki Beach Honolulu','Check into the Waikiki Airbnb':'Waikiki Honolulu',
 'Lanikai Beach':'Lanikai Beach Kailua','Lunch in Kailua town':'Kailua Town Oahu','Hoʻomaluhia Botanical Garden':'Hoomaluhia Botanical Garden',
 'Kualoa Ranch UTV':'Kualoa Ranch','Aliʻi Luau at PCC':'Polynesian Cultural Center Laie','Drive back to Waikiki':'Waikiki Honolulu',
 'Hanauma Bay snorkel':'Hanauma Bay Nature Preserve','Lunch in Kaimukī':'Kaimuki Honolulu','Rest at the Airbnb':'Waikiki Honolulu',
 'Surf lesson or beach time':'Kuhio Beach Park Waikiki','Sunset and dinner':'Waikiki Beach sunset','Diamond Head summit':'Diamond Head State Monument',
 'Pack and check out by 11':'Waikiki Honolulu','Royal Hawaiian Center and International Market Place':'International Market Place Honolulu',
 'Lunch and shopping at Ala Moana':'Ala Moana Center','Pearl Harbor (optional)':'Pearl Harbor National Memorial','Lunch at the Nāhiku stands':'Nahiku Marketplace','Lunch in Kahului':'Kahului Maui','Pāʻia town':'Paia Maui','Drive back to the Airbnb':'Kaanapali Beach','Land in Kahului (OGG)':'Kahului Airport','Drive to the west Maui Airbnb':'Kaanapali Beach',
 'Thanksgiving dinner':'Kaanapali Beach Resort','Leave west Maui':'Kaanapali Beach','Breakfast in Pāʻia':'Paia Maui','Twin Falls':'Twin Falls Maui Haiku',
 'Keʻanae Peninsula':'Keanae Peninsula Maui','Waiʻānapanapa State Park':'Waianapanapa State Park','Hāna town, then turn back':'Hana Bay Beach Park',
 'Back on the west side':'Kaanapali Beach','Leave for Māʻalaea Harbor':'Kaanapali Beach','Check in at the harbor':'Maalaea Harbor','Molokini Crater':'Molokini Crater',
 'Turtle Town':'Turtle Town Maui Makena','Back at the harbor':'Maalaea Harbor','Lunch in Lahaina':'Lahaina Maui','Nāpili or Kapalua Bay':'Kapalua Bay Beach',
 'Old Lahaina Luau':'Old Lahaina Luau','Check out':'Kaanapali Beach','Pāʻia brunch and shops':'Paia Maui','Hoʻokipa Lookout':'Hookipa Beach Park',
 'Snacks in Makawao':'Makawao Maui','Haleakalā summit and sunset':'Haleakala Visitor Center','Dinner in Kahului, return the car':'Kahului Maui','Fly home from OGG':'Kahului Airport'};
const DAYQ=['Waikiki Beach Honolulu','Kualoa Ranch','Hanauma Bay Nature Preserve','International Market Place Honolulu','Road to Hana Maui','Molokini Crater','Paia Maui'];

/* ---------- build legs and slides ---------- */
DAYS.forEach(D=>{D.legs=[null];D.s.forEach((s,i)=>{if(!i)return;let pts;
 if(s.back){pts=[];for(let j=D.legs.length-1;j>0;j--)pts.push(...rev(D.legs[j].pts));}
 else pts=[D.s[i-1].p,...(s.via||[]),s.p];
 D.legs.push({m:s.m||'drive',pts,from:D.s[i-1].p,to:s.p});});});
const SL=[];DAYS.forEach((D,di)=>{SL.push({di,i:-1});D.s.forEach((s,i)=>SL.push({di,i}));});

/* ---------- map ---------- */
const $=id=>document.getElementById(id);
/* no zoom or layer buttons: pinch, scroll and double-tap still zoom */
const map=L.map('map',{zoomControl:false,attributionControl:true}).setView([21.0,-157.0],8);
const routeLayer=L.layerGroup().addTo(map),markLayer=L.layerGroup().addTo(map);
let gReady=false,cur=0;
const hasKey=GOOGLE_API_KEY&&!/PASTE/.test(GOOGLE_API_KEY);

let baseFallen=false;
function fallbackBase(note){
 if(baseFallen)return;baseFallen=true;
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
 if(note)$('keynote').textContent=note;
 $('keynote').hidden=false;}

function loadGoogle(){return new Promise((res,rej)=>{
 window.__gInit=()=>res();const s=document.createElement('script');
 s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_API_KEY)}&v=weekly&libraries=places,routes&loading=async&callback=__gInit`;
 s.async=true;s.onerror=rej;document.head.appendChild(s);});}


/* ---------- calendar helpers ---------- */
const TRAVEL=new Set(['plane','drive','home']); /* stops that are just getting somewhere */
const ISL=['Oʻahu','Oʻahu','Oʻahu','Oʻahu → Maui','Maui','Maui','Maui'];
const YEAR=2026,TRIP0=new Date(YEAR,10,23);
const mins=t=>{const m=/(\d+):(\d+)\s*(AM|PM)/.exec(t);return (m[1]%12+(m[3]==='PM'?12:0))*60+ +m[2];};
const durOf=(D,k)=>k<D.s.length-1?Math.max(15,mins(D.s[k+1].t)-mins(D.s[k].t)):60;
const fmtDur=m=>m<60?m+' min':Math.floor(m/60)+' h'+(m%60?' '+m%60+' min':'');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* today, in Hawaiʻi time */
const hstNow=new Date(new Date().toLocaleString('en-US',{timeZone:'Pacific/Honolulu'}));
const dayDiff=Math.round((new Date(hstNow.getFullYear(),hstNow.getMonth(),hstNow.getDate())-TRIP0)/864e5);
const TODAY=dayDiff>=0&&dayDiff<7?dayDiff:-1,NOW=hstNow.getHours()*60+hstNow.getMinutes();

/* ---------- Google: place photos ---------- */
const placeCache=new Map();
async function placeFor(q){
 if(!gReady||!q)return null;if(placeCache.has(q))return placeCache.get(q);
 const p=(async()=>{try{
  const {Place}=await google.maps.importLibrary('places');
  const {places}=await Place.searchByText({textQuery:q+', Hawaii',fields:['displayName','photos'],maxResultCount:1});
  const pl=places&&places[0];if(!pl)return null;
  const photos=(pl.photos||[]).slice(0,10).map(ph=>({big:ph.getURI({maxWidth:1100,maxHeight:800}),small:ph.getURI({maxWidth:180,maxHeight:180}),full:ph.getURI({maxWidth:2000,maxHeight:1500})}));
  return {name:pl.displayName,photos};
 }catch(e){console.warn('Place lookup failed for',q,e);return null;}})();
 placeCache.set(q,p);return p;}

/* ---------- Google: driving routes and drive times ---------- */
const BUF=10; /* minutes to park and walk, added to every drive when working out when to leave */
const routeCache=(()=>{try{return JSON.parse(localStorage.getItem('hi-routes2')||'{}')}catch(e){return{}}})();
const saveRoutes=()=>{try{localStorage.setItem('hi-routes2',JSON.stringify(routeCache))}catch(e){}};
const hav=(a,b)=>{const r=Math.PI/180,dl=(b[0]-a[0])*r,dn=(b[1]-a[1])*r,x=Math.sin(dl/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)**2;return 12742*Math.asin(Math.sqrt(x));};
/* rough drive time from the sketched route, used until Google answers */
const estMin=L=>{let km=0;for(let j=1;j<L.pts.length;j++)km+=hav(L.pts[j-1],L.pts[j]);return Math.max(5,Math.round(km*1.15/45*60));};
/* each drive leg gets a departure time (Hawaiʻi time) so Google can use typical traffic for that hour */
DAYS.forEach((D,di)=>D.legs.forEach((L,k)=>{if(!L)return;
 const setOff=/^Drive /.test(D.s[k].n)?mins(D.s[k].t):mins(D.s[k].t)-estMin(L);
 L.dep=Date.UTC(YEAR,10,23+di)+(setOff+600)*6e4;L.key=L.from.join()+'>'+L.to.join()+'@'+L.dep;L.res=routeCache[L.key]||null;}));
function saveLeg(L,path,min){L.res={path,min:isFinite(min)?Math.round(min):null};routeCache[L.key]=L.res;saveRoutes();return L.res;}
async function drivePath(L){
 if(L.res)return L.res;if(!gReady)return null;if(L.req)return L.req;
 L.req=(async()=>{
  const o={lat:L.from[0],lng:L.from[1]},d={lat:L.to[0],lng:L.to[1]},future=L.dep>Date.now()+6e4;
  try{ /* Routes API */
   const {Route}=await google.maps.importLibrary('routes');
   if(Route&&Route.computeRoutes){
    const req={origin:o,destination:d,travelMode:'DRIVING',fields:['path','durationMillis']};
    if(future){req.routingPreference='TRAFFIC_AWARE';req.departureTime=new Date(L.dep);}
    const {routes}=await Route.computeRoutes(req);const R=routes&&routes[0];
    if(R&&R.path&&R.path.length)return saveLeg(L,R.path.map(p=>[+p.lat.toFixed(5),+p.lng.toFixed(5)]),R.durationMillis/6e4);}
  }catch(e){console.warn('Routes API failed, trying Directions',e);}
  try{ /* legacy Directions service */
   const req={origin:o,destination:d,travelMode:google.maps.TravelMode.DRIVING};if(future)req.drivingOptions={departureTime:new Date(L.dep)};
   const r=await new google.maps.DirectionsService().route(req);const lg=r.routes[0].legs[0];
   return saveLeg(L,r.routes[0].overview_path.map(p=>[+p.lat().toFixed(5),+p.lng().toFixed(5)]),(lg.duration_in_traffic||lg.duration).value/60);
  }catch(e){console.warn('Directions failed; using sketched route',e);return null;}})();
 return L.req;}

const arc=(a,b)=>{const pts=[];const mx=(a[0]+b[0])/2+0.35,my=(a[1]+b[1])/2;for(let t=0;t<=1.0001;t+=.05){pts.push([(1-t)*(1-t)*a[0]+2*(1-t)*t*mx+t*t*b[0],(1-t)*(1-t)*a[1]+2*(1-t)*t*my+t*t*b[1]]);}return pts;};
const STY={drive:{color:'#d0106f',weight:5,opacity:.9,lineCap:'round',lineJoin:'round'},boat:{color:'#111111',weight:4,dashArray:'1 9',lineCap:'round',opacity:.85},fly:{color:'#111111',weight:2.5,dashArray:'8 8',opacity:.6}};

/* ---------- calendar: week strip ---------- */
function renderDays(di){
 $('days').innerHTML=DAYS.map((d,k)=>`<button class="day${k===di?' on':''}${k===TODAY?' today':''}" data-d="${k}" aria-pressed="${k===di}" title="${esc(d.t)}">`+
  `<span class="dow">${d.d}</span><span class="dnum">${new Date(YEAR,10,23+k).getDate()}</span><span class="disl">${ISL[k]}</span></button>`).join('');
 $('countdown').textContent=dayDiff<0?`${-dayDiff} day${dayDiff===-1?'':'s'} to go`:dayDiff<7?`Day ${dayDiff+1} of 7`:'Mahalo, Hawaiʻi!';
 const on=$('days').querySelector('.on'),st=$('days');
 if(on&&st.scrollWidth>st.clientWidth)st.scrollLeft=on.offsetLeft-st.clientWidth/2+on.clientWidth/2;}

/* ---------- calendar: week view (takes the map's place; the plan panel stays) ---------- */
const WK0=5*60,WK1=23*60,PH=44;
let weekMode=false;
function renderWeek(){
 if(!weekMode)return;
 const {di,i}=SL[cur];
 let h=`<div class="wk-corner"></div>`+DAYS.map((d,k)=>`<button class="wk-h${k===di?' on':''}${k===TODAY?' today':''}" data-d="${k}"><b>${d.d} ${new Date(YEAR,10,23+k).getDate()}</b><small>${ISL[k]}</small></button>`).join('');
 let hrs='';for(let m=WK0;m<WK1;m+=60){const hh=m/60;hrs+=`<div class="wk-hr">${(hh%12||12)+(hh<12?' AM':' PM')}</div>`;}
 h+=`<div class="wk-hours">${hrs}</div>`;
 DAYS.forEach((D,k)=>{
  h+=`<div class="wk-col${k===di?' on':''}">`+D.s.map((s,j)=>{const st=mins(s.t),du=durOf(D,j);
   const c=k===di?(j===i?' cur':i>=0&&j<i?' past':''):'';
   return `<button class="wk-ev${TRAVEL.has(s.img)?' minor':''}${c}" data-d="${k}" data-k="${j}" style="top:${(st-WK0)/60*PH}px;height:${Math.max(20,du/60*PH-2)}px" title="${esc(s.t+' · '+s.n)}"${k===di&&j===i?' aria-current="true"':''}><b>${s.t}</b> ${esc(s.n)}</button>`;}).join('')+
   (k===TODAY&&NOW>WK0&&NOW<WK1?`<div class="nowline" style="top:${(NOW-WK0)/60*PH}px"></div>`:'')+`</div>`;});
 const g=$('wkgrid');g.style.setProperty('--ph',PH+'px');g.style.setProperty('--rows',(WK1-WK0)/60);g.innerHTML=h;
 /* follow the plan like the map does: bring the current stop (or the day's first stop) into view */
 const ev=g.querySelector('.wk-ev.cur')||g.querySelector('.wk-col.on .wk-ev');
 if(ev){const head=g.querySelector('.wk-h').offsetHeight,top=ev.offsetTop+head,vis=g.clientHeight,to={};
  if(top-head<g.scrollTop+8||top+ev.offsetHeight>g.scrollTop+vis-8)to.top=Math.max(0,top-head-PH);
  /* phones scroll the days sideways: keep the selected day in view, next to the hours column */
  const col=ev.parentElement,hrs=g.querySelector('.wk-hours').offsetWidth;
  if(g.scrollWidth>g.clientWidth&&(col.offsetLeft-hrs<g.scrollLeft||col.offsetLeft+col.offsetWidth>g.scrollLeft+g.clientWidth))
   to.left=Math.max(0,col.offsetLeft-hrs-col.offsetWidth*.35);
  if('top' in to||'left' in to)g.scrollTo({...to,behavior:REDUCED||!g.dataset.ready?'auto':'smooth'});}
 g.dataset.ready=1;}
function setWeek(on){
 weekMode=on;document.body.classList.toggle('is-week',on);
 $('weekview').hidden=!on;
 const b=$('weekBtn');b.setAttribute('aria-pressed',on);b.querySelector('span').textContent=on?'Map':'Week';
 if(on){delete $('wkgrid').dataset.ready;renderWeek();}
 else setTimeout(()=>map.invalidateSize(),0);}
$('weekBtn').onclick=()=>setWeek(!weekMode);
$('wkgrid').addEventListener('click',e=>{
 const b=e.target.closest('[data-d]');if(!b)return;
 go(+b.dataset.d,b.dataset.k!==undefined?+b.dataset.k:-1);});

/* ---------- timing: how long you can stay, and when to leave ---------- */
const fmtT=m=>{m=((Math.round(m)%1440)+1440)%1440;const h=Math.floor(m/60);return `${h%12||12}:${String(m%60).padStart(2,'0')} ${h<12?'AM':'PM'}`;};
const isDriveStop=(D,k)=>k>0&&/^Drive /.test(D.s[k].n); /* its time is when you set off, not when you arrive */
const legMin=L=>L.res&&L.res.min!=null?L.res.min:estMin(L);
function timing(D,k){
 const s=D.s[k],st=mins(s.t),T={st,arr:st,start:k===0&&s.img==='drive'};
 if(isDriveStop(D,k)){T.go=true;T.inDrive=legMin(D.legs[k]);T.arr=st+T.inDrive;}
 if(k===D.s.length-1){T.last=true;return T;}
 const nx=D.s[k+1],L=D.legs[k+1];Object.assign(T,{nx,nst:mins(nx.t),mode:L.m});
 if(L.m!=='drive'){T.stay=T.nst-T.arr;return T;}
 T.drive=legMin(L);
 if(isDriveStop(D,k+1)){T.leave=T.nst;T.fixed=true;}
 else T.leave=Math.floor((T.nst-T.drive-BUF)/5)*5;
 T.stay=T.leave-T.arr;T.late=T.stay<0?-T.stay:0;return T;}
const warn=t=>`<span class="warn">${t}</span>`;
function statusLine(T){
 if(T.last)return T.go?`Arrive about ${fmtT(T.arr)}`:'Last stop of the day';
 if(T.start)return `Leave by ${fmtT(T.leave)}`+(T.leave<T.st?' · '+warn(`${T.st-T.leave} min earlier than planned`):'');
 if(T.mode==='fly')return `Flight lands ${T.nx.t}`;
 if(T.mode==='boat')return `${fmtDur(T.stay)} here, then the boat continues`;
 if(T.go&&T.late)return `Arrive about ${fmtT(T.arr)} · `+warn(`too late for ${T.nx.n} at ${T.nx.t}`);
 return (T.go?`Arrive about ${fmtT(T.arr)} · `:'')+(T.stay>0?`${fmtDur(T.stay)} here · `:'')+`Leave ${T.fixed?'at':'by'} ${fmtT(T.leave)}`+(T.late?' · '+warn(`about ${T.late} min short`):'');}
function timingHTML(D,k){
 const T=timing(D,k),s=D.s[k],cell=(l,v)=>`<div><small>${l}</small><b>${v}</b></div>`;let cells,next='';
 if(T.go)cells=cell('Set off',s.t)+cell('Drive',fmtDur(T.inDrive))+cell('Arrive about',fmtT(T.arr));
 else if(T.start)cells=cell('Leave by',fmtT(T.leave))+cell('Drive',fmtDur(T.drive))+cell(esc(T.nx.n)+' starts',T.nx.t);
 else if(T.last)cells=cell('Arrive',s.t)+cell('After this','Done for the day');
 else if(T.mode==='fly')cells=cell('Arrive',s.t)+cell('Flight lands',T.nx.t);
 else cells=cell('Arrive',s.t)+cell('Time here',T.stay>0?fmtDur(T.stay):'None')+(T.mode==='boat'?cell('Next stop',T.nx.t):cell(T.fixed?'Leave at':'Leave by',fmtT(T.leave)));
 if(!T.last&&T.mode==='drive'){
  next=T.fixed?`Then set off at ${T.nx.t}: about ${fmtDur(T.drive)} to ${esc(T.nx.n.replace(/^Drive (back )?to /,''))}.`
   :`Then about ${fmtDur(T.drive)} drive to ${esc(T.nx.n)}, which starts at ${T.nx.t}. The leave-by time includes ${BUF} min to park and walk.`;
  if(T.start&&T.leave<T.st)next+=' '+warn(`Leave ${T.st-T.leave} min earlier than the planned ${s.t} to make it on time.`);
  else if(T.late)next+=' '+warn(T.go?`You'll arrive around ${fmtT(T.arr)}, about ${T.late} min too late for ${T.nx.t}.`:`There isn't enough time here: you're about ${T.late} min behind for ${T.nx.t}.`);}
 else if(T.mode==='boat')next=`The boat takes you on to ${esc(T.nx.n)}.`;
 return `<div class="timing">${cells}</div>${next?`<p class="next">${next}</p>`:''}`;}

/* ---------- calendar: day plan (inside the day overview card) ---------- */
function agenda(D,di){
 return `<h3 class="sub">Day plan</h3><ol class="agenda">`+D.s.map((s,k)=>{const T=timing(D,k),du=durOf(D,k),st=mins(s.t);
  const now=di===TODAY&&NOW>=st&&NOW<st+du,minor=TRAVEL.has(s.img);
  const leg=T.last||isDriveStop(D,k+1)?'':`<li class="leg">${T.mode==='drive'?`${fmtDur(T.drive)} drive`:T.mode==='boat'?'By boat':'Flight'}</li>`;
  return `<li${now?' class="now"':''}><button class="ev${minor?' minor':''}" data-k="${k}">`+
   `<span class="ev-time">${s.t}</span>`+
   `<span class="ev-txt"><b>${esc(s.n)}${now?' <em>Now</em>':''}</b><small>${esc(s.x)}</small><span class="ev-when">${statusLine(T)}</span></span>`+
   (!minor&&gReady&&Q[s.n]?`<span class="ev-thumb" data-q="${esc(Q[s.n])}"></span>`:'')+`</button></li>${leg}`;}).join('')+`</ol>`;}
function fillThumbs(my){
 document.querySelectorAll('.ev-thumb[data-q]').forEach(el=>placeFor(el.dataset.q).then(pl=>{if(my!==token)return;
  const ph=pl&&pl.photos[0];if(ph)el.style.backgroundImage=`url("${ph.small}")`;else el.remove();}));}

/* ---------- photo gallery ---------- */
const media={photos:[],idx:0,place:null};
const CHEV={l:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
 r:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'};
/* withThumbs: the strip of small photos under the big one (stops only; the day overview keeps just the arrows) */
function setGallery(pl,withThumbs){
 const fig=$('photo');if(!fig)return;
 if(!pl||!pl.photos.length){media.photos=[];fig.remove();$('thumbs')&&$('thumbs').remove();return;}
 media.photos=pl.photos;media.place=pl;media.idx=0;fig.classList.remove('empty');
 if(withThumbs&&$('thumbs'))$('thumbs').innerHTML=pl.photos.map((ph,k)=>`<button class="th" data-i="${k}" aria-label="Photo ${k+1}"><img src="${ph.small}" alt="" loading="lazy"></button>`).join('');
 setPhoto(0);}
function setPhoto(k){
 const P=media.photos,n=P.length;if(!n||!$('photo'))return;k=(k+n)%n;media.idx=k;const ph=P[k],pl=media.place||{};
 $('photo').innerHTML=`<button class="ph-open" aria-label="View photo full screen"><img src="${ph.big}" alt="${esc(pl.name||'')}"></button>`+
  (n>1?`<button class="ph-nav prev" data-step="-1" aria-label="Previous photo">${CHEV.l}</button><button class="ph-nav next" data-step="1" aria-label="Next photo">${CHEV.r}</button>`:'')+
  `<span class="ph-count">${k+1} / ${n}</span>`;
 document.querySelectorAll('#thumbs .th').forEach((b,j)=>b.classList.toggle('on',j===k));}

/* ---------- lightbox ---------- */
function openLB(k){media.idx=k;$('lb').hidden=false;stepLB(0);$('lbx').focus();}
function stepLB(d){const P=media.photos,n=P.length;if(!n)return;media.idx=(media.idx+d+n)%n;const ph=P[media.idx],pl=media.place||{};
 $('lbimg').src=ph.full;$('lbimg').alt=pl.name||'';
 $('lbcap').textContent=`${media.idx+1} / ${n}`;
 $('lbp').hidden=$('lbn').hidden=n<2;}
const closeLB=()=>{$('lb').hidden=true;setPhoto(media.idx);};
$('lbx').onclick=closeLB;$('lbp').onclick=()=>stepLB(-1);$('lbn').onclick=()=>stepLB(1);
$('lb').addEventListener('click',e=>{if(e.target===$('lb'))closeLB();});

/* ---------- render ---------- */
let token=0,shown=-1;
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function icon(n,c){return L.divIcon({className:'',html:`<div class="pin ${c}">${n}</div>`,iconSize:c==='cur'?[34,34]:[26,26],iconAnchor:c==='cur'?[17,17]:[13,13]});}
const legPath=l=>l.m==='fly'?arc(l.from,l.to):(l.res?l.res.path:l.pts);
/* the leg into this stop is bold; legs already travelled today turn a lighter solid shade */
const DONE={drive:'#f2a3c7',boat:'#a3a3a0',fly:'#a3a3a0'};
const legStyle=(l,now)=>now?{...STY[l.m],...(l.m==='drive'?{weight:6}:{})}:{...STY[l.m],color:DONE[l.m],opacity:1,weight:l.m==='drive'?4:STY[l.m].weight};
/* drive time label, pinned halfway along the leg */
function midOf(path){const d=[0];for(let j=1;j<path.length;j++)d.push(d[j-1]+hav(path[j-1],path[j]));
 const h=d[d.length-1]/2;let j=1;while(j<path.length-1&&d[j]<h)j++;
 const a=path[j-1],b=path[j],f=d[j]>d[j-1]?(h-d[j-1])/(d[j]-d[j-1]):0;return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];}
const legText=l=>l.m==='drive'?fmtDur(legMin(l)):l.m==='boat'?'By boat':'Flight';
const labelIcon=(l,now)=>L.divIcon({className:'rl-wrap',html:`<span class="rl${now?' now':''}">${legText(l)}</span>`,iconSize:[0,0]});
function legLabel(l,path,now){return L.marker(midOf(path),{icon:labelIcon(l,now),interactive:false,keyboard:false,zIndexOffset:now?900:-100}).addTo(routeLayer);}
/* draw a leg from its start to its end, with a dot travelling at its head */
function drawLeg(pl,path,my){return new Promise(done=>{
 const d=[0];for(let j=1;j<path.length;j++)d.push(d[j-1]+hav(path[j-1],path[j]));
 const tot=d[d.length-1]||1,dur=Math.max(800,Math.min(1800,tot*14)),t0=performance.now();
 const head=L.circleMarker(path[0],{radius:7,color:'#fff',weight:3,fillColor:'#d0106f',fillOpacity:1}).addTo(routeLayer);
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;let j=1;
 (function frame(now){
  if(my!==token){done();return;}
  const t=Math.min(1,(now-t0)/dur),at=ease(t)*tot;
  while(j<path.length-1&&d[j]<at)j++;
  const a=path[j-1],b=path[j],f=d[j]>d[j-1]?Math.min(1,Math.max(0,(at-d[j-1])/(d[j]-d[j-1]))):1;
  const p=[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
  pl.setLatLngs(path.slice(0,j).concat([p]));head.setLatLng(p);
  if(t<1)requestAnimationFrame(frame);else{pl.setLatLngs(path);routeLayer.removeLayer(head);done();}
 })(t0);});}
async function render(){
 const my=++token;const {di,i}=SL[cur];const D=DAYS[di];
 /* animate only when stepping forward one stop; jumping around just shows the result */
 const animate=!REDUCED&&shown===cur-1&&i>0;shown=cur;
 renderDays(di);renderWeek();
 routeLayer.clearLayers();markLayer.clearLayers();
 /* the trail so far: every leg already travelled today, solid; the leg into this stop drawn below */
 const lines=[],labels=[];
 if(i>0)for(let k=1;k<i;k++){const l=D.legs[k],path=legPath(l);lines[k]=L.polyline(path,legStyle(l,false)).addTo(routeLayer);labels[k]=legLabel(l,path,false);}
 /* fetch Google drive times for the whole day (the card's leave-by times use them) */
 const pending=[];
 D.legs.forEach((l,k)=>{if(l&&l.m==='drive'&&gReady&&!l.res)pending.push(drivePath(l).then(p=>{if(!p||my!==token||k===i||!lines[k])return;
  lines[k].setLatLngs(p.path);labels[k].setLatLng(midOf(p.path)).setIcon(labelIcon(l,false));}));});
 D.s.forEach((s,k)=>{const c=k===i?'cur':(i>=0&&k<i?'past':'');
  const m=L.marker(s.p,{icon:icon(k+1,c),zIndexOffset:k===i?1000:k}).addTo(markLayer);
  m.bindTooltip(`${s.t} · ${s.n}`,{direction:'top',offset:[0,-14],permanent:k===i,className:'tt'});
  m.on('click',()=>go(di,k));});
 const L0=i>0?D.legs[i]:null;
 let pts;if(i<0)pts=D.s.map(s=>s.p);else pts=L0?L0.pts.concat([D.s[i].p]):[D.s[i].p];
 if(i>=0&&pts.length===1)map.flyTo(pts[0],14,{duration:.9});else map.flyToBounds(L.latLngBounds(pts).pad(.25),{maxZoom:14,duration:.9});
 if(L0)(async()=>{
  const pl=L.polyline([],legStyle(L0,true)).addTo(routeLayer);lines[i]=pl;
  let path=L0.m==='drive'&&!L0.res&&gReady?((await Promise.race([drivePath(L0),wait(1500)]))||{}).path:null;
  path=path||legPath(L0);if(my!==token)return;
  if(animate){await wait(650); /* let the camera settle first */ if(my===token)await drawLeg(pl,path,my);}
  else pl.setLatLngs(path);
  if(my!==token)return;
  const lab=legLabel(L0,path,true); /* the drive time appears once the line has arrived */
  /* Google's road route arrived after the draw started: switch to it once the line is complete */
  if(L0.m==='drive'&&gReady){const r=await drivePath(L0);
   if(r&&my===token&&r.path!==path){pl.setLatLngs(r.path);lab.setLatLng(midOf(r.path)).setIcon(labelIcon(L0,true));}}})();
 /* card */
 /* booking links: the one filled button on a stop; quieter on the day overview, which can list several */
 const bk=(k,cls)=>`<a class="btn ${cls}" href="${BK[k][1]}" target="_blank" rel="noopener">${BK[k][0]} &#8599;</a>`;
 const s=i<0?null:D.s[i],minor=s&&TRAVEL.has(s.img);
 const title=i<0?D.t:s.n;
 const date=`${D.d}, ${D.dt}`;
 const meta=i<0?`<span>${date}</span><span>Day ${di+1} of 7 · ${ISL[di]} · ${D.s.length} stops</span>`
  :`<button class="crumb" data-k="-1" aria-label="Back to the ${esc(date)} day plan">${CHEV.l}${date}</button><span>Stop ${i+1} of ${D.s.length}</span>`;
 /* travel stops (airports, drives, the Airbnb) get no photo */
 const photo=minor?'':`<figure class="photo empty" id="photo"></figure>${i>=0?'<div class="thumbs" id="thumbs"></div>':''}`;
 let body;
 if(i<0)body=`${photo}<p>${D.x}</p>${D.li?`<ul>${D.li.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}`+
  (D.bk&&D.bk.length?`<div class="actions">${D.bk.map(k=>bk(k,'btn--secondary')).join('')}</div>`:'')+`<div id="agenda">${agenda(D,di)}</div>`;
 else{const dest=minor||!Q[s.n]?s.p.join(','):Q[s.n]+', Hawaii';
  body=`${photo}<div id="timing">${timingHTML(D,i)}</div><p>${s.x}</p>${s.tip?`<p class="tip">${s.tip}</p>`:''}`+
   `<div class="actions">${s.bk?bk(s.bk,'btn--primary'):''}<a class="btn btn--secondary" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving" target="_blank" rel="noopener">Navigate here &#8599;</a></div>`;}
 $('card').innerHTML=`<p class="meta">${meta}</p><h2>${esc(title)}</h2>${body}`;
 $('card').scrollTop=0;
 /* once Google's drive times arrive, redo the stay / leave-by times */
 if(pending.length)Promise.all(pending).then(()=>{if(my!==token)return;
  if(i<0){$('agenda').innerHTML=agenda(D,di);fillThumbs(my);}else $('timing').innerHTML=timingHTML(D,i);});
 renderStepper(di,i);
 try{localStorage.setItem('hi-slide',cur)}catch(e){}
 media.photos=[];
 if(i<0)fillThumbs(my);
 if(minor)return;
 const pl=await placeFor(i<0?DAYQ[di]:(Q[s.n]||DAYQ[di]));
 if(my!==token)return;
 setGallery(pl,i>=0);
}
/* warm the next slide's photos (skipping travel stops, which show none) */
function warmNext(){const n=SL[cur+1];if(!n)return;const ND=DAYS[n.di];
 if(n.i<0)placeFor(DAYQ[n.di]);else if(!TRAVEL.has(ND.s[n.i].img))placeFor(Q[ND.s[n.i].n]||DAYQ[n.di]);}
/* bottom bar: progress through the day, and a Next button that says where it goes */
function renderStepper(di,i){
 const D=DAYS[di];
 $('steps').innerHTML=[-1,...D.s.map((_,k)=>k)].map(k=>`<i class="${k===i?'on':k<i?'done':''}"></i>`).join('');
 const nx=SL[cur+1],pv=SL[cur-1];let label,name;
 if(!nx){label='End of the trip';name='Mahalo, Hawaiʻi';}
 else if(nx.di!==di){const ND=DAYS[nx.di];label=`Next day · ${ND.d}, ${ND.dt}`;name=ND.t;}
 else{const ns=D.s[nx.i];label=`Next · ${nx.i+1} of ${D.s.length} · ${ns.t}`;name=ns.n;}
 $('nextLabel').textContent=label;$('nextName').textContent=name;
 $('next').disabled=!nx;$('next').setAttribute('aria-label',nx?`${label}: ${name}`:label);
 $('prev').disabled=!pv;
 $('prev').setAttribute('aria-label',pv?`Previous: ${pv.i<0?DAYS[pv.di].d+' day plan':DAYS[pv.di].s[pv.i].n}`:'Previous stop');
 warmNext();}
const go=(d,k)=>{const n=SL.findIndex(x=>x.di===d&&x.i===k);if(n>=0){cur=n;render();}};
const move=d=>{const n=Math.max(0,Math.min(SL.length-1,cur+d));if(n!==cur){cur=n;render();}};
$('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);
$('days').onclick=e=>{const b=e.target.closest('button');if(b)go(+b.dataset.d,-1);};
$('card').addEventListener('click',e=>{
 const t=e.target;let b;
 if((b=t.closest('[data-k]'))){go(SL[cur].di,+b.dataset.k);return;}
 if((b=t.closest('[data-step]'))){setPhoto(media.idx+ +b.dataset.step);return;}
 if((b=t.closest('[data-i]'))){setPhoto(+b.dataset.i);return;}
 if(t.closest('.ph-open'))openLB(media.idx);});
addEventListener('keydown',e=>{
 if(!$('lb').hidden){if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')stepLB(1);if(e.key==='ArrowLeft')stepLB(-1);return;}
 if(e.target.closest('input,textarea'))return;
 if(e.key==='Escape'&&weekMode){setWeek(false);return;}
 if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);});
/* swipes: on the photo = next photo; in strips = scroll; elsewhere on the card = next stop */
let sx=null,sy=0,sEl=null;
$('card').addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;sEl=e.target;},{passive:true});
$('card').addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;
 if(Math.abs(dx)<60||Math.abs(dy)>Math.abs(dx))return;
 if(sEl.closest('.thumbs'))return;
 if(sEl.closest('.photo')){if(media.photos.length>1)setPhoto(media.idx+(dx<0?1:-1));return;}
 move(dx<0?1:-1);});
let lx=null;
$('lb').addEventListener('touchstart',e=>{lx=e.touches[0].clientX},{passive:true});
$('lb').addEventListener('touchend',e=>{if(lx===null)return;const dx=e.changedTouches[0].clientX-lx;lx=null;if(Math.abs(dx)>50)stepLB(dx<0?1:-1);});
try{const v=+localStorage.getItem('hi-slide');if(v>0&&v<SL.length)cur=v;}catch(e){}
if(TODAY>=0&&SL[cur].di!==TODAY)cur=SL.findIndex(x=>x.di===TODAY&&x.i<0);

/* ---------- start ---------- */
let gLayer=null;
/* Google calls this when it refuses the key (e.g. this site's address is not on the key's allowed list):
   drop the blank Google layer and show OpenStreetMap instead of an empty blue map */
window.gm_authFailure=()=>{
 console.warn('Google Maps refused the API key for',location.href,'- falling back to OpenStreetMap');
 gReady=false;if(gLayer){map.removeLayer(gLayer);gLayer=null;}
 fallbackBase('Google key not allowed on this site: showing OpenStreetMap');};
(async()=>{
 if(hasKey){try{await loadGoogle();gReady=true;
   /* a calmer basemap: no shop, restaurant or transit pins competing with the route */
   gLayer=L.gridLayer.googleMutant({type:'roadmap',styles:[
    {featureType:'poi.business',stylers:[{visibility:'off'}]},
    {featureType:'poi.medical',stylers:[{visibility:'off'}]},
    {featureType:'poi.school',stylers:[{visibility:'off'}]},
    {featureType:'poi.place_of_worship',stylers:[{visibility:'off'}]},
    {featureType:'transit',stylers:[{visibility:'off'}]}]}).addTo(map);
   if(baseFallen){map.removeLayer(gLayer);gLayer=null;gReady=false;} /* the key was already refused */
  }catch(e){console.warn('Google Maps failed to load',e);fallbackBase();}}
 else fallbackBase();
 render();
})();
