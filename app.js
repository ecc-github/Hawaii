/* Hawaiʻi trip map — Leaflet + Google basemap, Google Places photos and Google driving routes.
   1) Paste your Google Maps Platform API key below.
   2) In Google Cloud, enable: Maps JavaScript API, Places API (New), Routes API.
   Without a key the map falls back to OpenStreetMap / Esri tiles and sketched routes, with no photos. */
const GOOGLE_API_KEY = "PASTE_YOUR_KEY_HERE";
const rev=a=>a.slice().reverse();

const LOC={
 hnl:[21.3245,-157.9251],bnb:[21.2810,-157.8300],lani:[21.3930,-157.7150],kai:[21.3965,-157.7405],hoom:[21.3870,-157.8090],kual:[21.5210,-157.8370],pcc:[21.6390,-157.9200],
 hana:[21.2690,-157.6940],kaim:[21.2790,-157.8000],surf:[21.2755,-157.8268],sset:[21.2738,-157.8245],dh:[21.2620,-157.8060],shops:[21.2782,-157.8285],ala:[21.2910,-157.8430],
 ogg:[20.8986,-156.4305],kaa:[20.9240,-156.6920],tday:[20.9200,-156.6930],paia:[20.9130,-156.3810],twin:[20.9120,-156.2430],kean:[20.8620,-156.1440],wai:[20.7870,-156.0020],hanat:[20.7570,-155.9900],
 maa:[20.7920,-156.5110],molo:[20.6330,-156.4960],ttown:[20.6230,-156.4450],lah:[20.8780,-156.6780],kap:[21.0010,-156.6680],olu:[20.8890,-156.6810],hook:[20.9340,-156.3570],maka:[20.8570,-156.3130],sum:[20.7100,-156.2530],kah:[20.8890,-156.4700]};
const BK={hanauma:['Book Hanauma Bay','https://pros6.hnl.info/hanaumabay'],dh:['Book Diamond Head','https://gostateparks.hawaii.gov/diamondhead'],wai:['Book Waiʻānapanapa','https://gostateparks.hawaii.gov/waianapanapa'],pcc:['Polynesian Cultural Center','https://www.polynesia.com'],kual:['Kualoa Ranch','https://www.kualoa.com'],olu:['Book Old Lahaina Luau','https://www.oldlahainaluau.com'],hale:['Haleakalā park info','https://www.nps.gov/hale']};
const H1=[[21.318,-157.900],[21.308,-157.872],[21.299,-157.850],[21.289,-157.838]];
const PALI=[[21.300,-157.848],[21.330,-157.832],[21.367,-157.793],[21.385,-157.757],[21.396,-157.740],[21.397,-157.727]];
const KAL=[[21.276,-157.812],[21.281,-157.795],[21.280,-157.770],[21.284,-157.740],[21.279,-157.712],[21.272,-157.700]];
const W30=[[20.905,-156.690],[20.870,-156.675],[20.835,-156.650],[20.810,-156.625],[20.795,-156.590],[20.786,-156.560],[20.795,-156.520]];
const MAA_KAH=[[20.830,-156.505],[20.860,-156.492],[20.884,-156.470]];
const HANA_HWY=[[20.912,-156.340],[20.919,-156.300],[20.915,-156.270]];
const CRATER=[[20.837,-156.337],[20.818,-156.322],[20.795,-156.312],[20.780,-156.290],[20.765,-156.276],[20.750,-156.262],[20.737,-156.248],[20.724,-156.240],[20.714,-156.246]];
const DAYS=[
{d:'Mon',dt:'Nov 23',t:'Aloha, Oʻahu',img:'plane',x:'Nupur lands mid-afternoon and Evita arrives at night. Keep today easy: settle in, eat, sleep.',li:['<b>12:00 PM ET / 7:00 AM HST:</b> Evita books Hanauma Bay for Wednesday, right on the dot.'],bk:['hanauma'],s:[
 {t:'4:06 PM',n:'Land at HNL',p:LOC.hnl,img:'plane',x:'Nupur lands from JFK. Grab bags and pick up the car.'},
 {t:'4:45 PM',n:'Check into the Waikiki Airbnb',p:LOC.bnb,img:'home',via:H1,x:'Check-in opens at 4 PM. Drop bags, change into something light.'},
 {t:'6:30 PM',n:'Easy dinner in Waikiki',p:LOC.surf,img:'food',x:'Walk to dinner nearby. Pick up water, snacks and reef-safe sunscreen on the way back.'},
 {t:'8:30 PM',n:'Pick up Evita at HNL',p:LOC.hnl,img:'plane',via:rev(H1),x:'Evita lands from SFO. About 20 minutes each way.'}]},
{d:'Tue',dt:'Nov 24',t:'Windward side to the North Shore',img:'atv',x:'One big loop, south to north so you never backtrack: beach, garden, ranch, luau.',bk:['kual','pcc'],s:[
 {t:'8:30 AM',n:'Leave Waikiki',p:LOC.bnb,img:'drive',x:'Over the Pali Highway to Kailua, about 35 minutes.'},
 {t:'9:00 AM',n:'Lanikai Beach',p:LOC.lani,img:'beach',via:PALI,x:'Swim and relax on soft white sand facing the Mokulua islets. Street parking is very limited: park at Kailua Beach Park and walk over.'},
 {t:'11:30 AM',n:'Lunch in Kailua town',p:LOC.kai,img:'food',via:[[21.397,-157.727]],x:'Plenty of casual spots for poke, plate lunch and shave ice.'},
 {t:'12:45 PM',n:'Hoʻomaluhia Botanical Garden',p:LOC.hoom,img:'garden',via:[[21.395,-157.762],[21.400,-157.790],[21.392,-157.805]],x:'Free. Drive the loop road under the green Koʻolau cliffs and stop at the lake.'},
 {t:'2:15 PM',n:'Kualoa Ranch UTV',p:LOC.kual,img:'atv',via:[[21.410,-157.800],[21.432,-157.818],[21.462,-157.840],[21.492,-157.845]],bk:'kual',x:'Check in at 2:15 for the Jurassic Valley adventure. Ask at check-in what time the tour actually ends.'},
 {t:'5:00 PM',n:'Aliʻi Luau at PCC',p:LOC.pcc,img:'luau',via:[[21.548,-157.857],[21.575,-157.876],[21.605,-157.895],[21.626,-157.912]],bk:'pcc',x:'About 25 minutes up the coast. The buffet starts at 5:00, so you will likely walk in around 5:25: call ahead to let them know.',tip:'The Hā night show runs about 7:30 to 9:00 if your package includes it. Skip it if everyone is tired: the drive home is about an hour.'},
 {t:'9:00 PM',n:'Drive back to Waikiki',p:LOC.bnb,img:'home',via:[[21.600,-157.890],[21.520,-157.840],[21.450,-157.836],[21.408,-157.812],[21.396,-157.858],[21.378,-157.902],[21.368,-157.926],[21.338,-157.895],[21.310,-157.866],[21.290,-157.840]],x:'Home through the H-3 tunnels.'}]},
{d:'Wed',dt:'Nov 25',t:'Snorkel, rest, surf',img:'snorkel',x:'Busy morning, lazy midday, beach afternoon.',bk:['hanauma'],s:[
 {t:'6:45 AM',n:'Leave Waikiki',p:LOC.bnb,img:'drive',x:'About 25 minutes along the south shore.'},
 {t:'7:30 AM',n:'Hanauma Bay snorkel',p:LOC.hana,img:'snorkel',via:KAL,bk:'hanauma',x:'Take the earliest entry you can get: the water is calmest in the morning. $25 per person, a little cash for parking, and a short required video before you walk down.'},
 {t:'11:00 AM',n:'Lunch in Kaimukī',p:LOC.kaim,img:'food',via:rev(KAL).slice(1),x:'Kaimukī has great casual lunch spots on the way back.'},
 {t:'12:00 PM',n:'Rest at the Airbnb',p:LOC.bnb,img:'home',via:[[21.279,-157.815]],x:'Shower, nap, recharge.'},
 {t:'2:30 PM',n:'Surf lesson or beach time',p:LOC.surf,img:'surf',x:'Waikiki has gentle, rolling waves that are perfect for a first lesson. Book with a beach surf school a day or two ahead.'},
 {t:'5:50 PM',n:'Sunset and dinner',p:LOC.sset,img:'sunset',x:'Watch the sun go down from the beach, then dinner in Waikiki.'}]},
{d:'Thu',dt:'Nov 26',t:'Thanksgiving: hike, shop, fly to Maui',img:'hike',x:'Pearl Harbor is closed on Thanksgiving, so the morning is Diamond Head instead. That also makes Wednesday easier.',bk:['dh'],s:[
 {t:'7:00 AM',n:'Diamond Head summit',p:LOC.dh,img:'hike',via:[[21.272,-157.818],[21.265,-157.812]],bk:'dh',x:'Book the 7:00 slot with parking and arrive within its first 30 minutes. About 1.5 to 2 hours round trip; the morning is cooler.'},
 {t:'9:30 AM',n:'Pack and check out by 11',p:LOC.bnb,img:'home',via:[[21.265,-157.812],[21.272,-157.818]],x:'Load the bags in the car and keep them out of sight.'},
 {t:'11:00 AM',n:'Royal Hawaiian Center and International Market Place',p:LOC.shops,img:'shop',x:'Both are a short walk apart in Waikiki. Check Thanksgiving hours first: many stores change them.'},
 {t:'1:00 PM',n:'Lunch and shopping at Ala Moana',p:LOC.ala,img:'shop',via:[[21.284,-157.836]],x:'The big open-air mall sits right on the way to the airport.'},
 {t:'4:30 PM',n:'Drop the car at HNL',p:LOC.hnl,img:'plane',via:[[21.300,-157.862],[21.310,-157.882],[21.320,-157.905]],x:'Your flight to Maui leaves at 6:27 PM.'},
 {t:'7:08 PM',n:'Land in Kahului (OGG)',p:LOC.ogg,img:'plane',m:'fly',x:'Pick up the car.'},
 {t:'8:00 PM',n:'Drive to the west Maui Airbnb',p:LOC.kaa,img:'home',via:[[20.886,-156.465],...rev(MAA_KAH).slice(1),...rev(W30)],x:'About 45 to 60 minutes.'},
 {t:'8:30 PM',n:'Thanksgiving dinner',p:LOC.tday,img:'food',x:'Reserve a table this week: it is late on a holiday and many places will be closed or full.'}]},
{d:'Fri',dt:'Nov 27',t:'Road to Hāna',img:'waterfall',x:'Waterfalls, sea cliffs and a black sand beach. No evening plans, so nobody is racing the clock.',bk:['wai'],s:[
 {t:'7:30 AM',n:'Leave west Maui',p:LOC.kaa,img:'drive',x:'About an hour to Pāʻia.'},
 {t:'8:30 AM',n:'Breakfast in Pāʻia',p:LOC.paia,img:'town',via:[...W30,...MAA_KAH,[20.893,-156.440],[20.905,-156.410]],x:'Fill the gas tank here: there is almost none further on.'},
 {t:'9:45 AM',n:'Twin Falls',p:LOC.twin,img:'waterfall',via:HANA_HWY,x:'Short walk to the falls. Small parking fee.'},
 {t:'11:30 AM',n:'Keʻanae Peninsula',p:LOC.kean,img:'coast',via:[[20.903,-156.220],[20.890,-156.200],[20.885,-156.176],[20.870,-156.163]],x:'Black lava rock and huge waves crashing next to bright green taro fields.'},
 {t:'12:30 PM',n:'Waiʻānapanapa State Park',p:LOC.wai,img:'blacksand',via:[[20.845,-156.130],[20.818,-156.090],[20.800,-156.060],[20.792,-156.025]],bk:'wai',x:'Black sand beach, sea caves and a coastal trail. Bring a packed lunch or buy food at the roadside stands on the way.',tip:'Your reservation slot sets when you must leave the park.'},
 {t:'3:00 PM',n:'Hāna town, then turn back',p:LOC.hanat,img:'town',via:[[20.775,-155.996]],x:'A quick look around, then head back by about 3:30 to clear the twisty one-lane bridges before dark (around 5:45).',tip:'Go back the way you came. Rental and most Turo agreements forbid the back road past Kīpahulu.'},
 {t:'6:30 PM',n:'Back on the west side',p:LOC.kaa,img:'home',back:1,x:'Easy dinner near the Airbnb.'}]},
{d:'Sat',dt:'Nov 28',t:'Molokini, beach, luau',img:'boat',x:'Everything today is on the west and south side: snorkel early, rest, then the luau.',bk:['olu'],s:[
 {t:'5:50 AM',n:'Leave for Māʻalaea Harbor',p:LOC.kaa,img:'drive',x:'About 35 to 40 minutes. Check in at 6:30.'},
 {t:'6:30 AM',n:'Check in at the harbor',p:LOC.maa,img:'boat',via:W30,x:'Confirm which harbor your tour leaves from.'},
 {t:'7:30 AM',n:'Molokini Crater',p:LOC.molo,img:'snorkel',m:'boat',x:'Snorkel inside a sunken volcanic crater with very clear water.'},
 {t:'9:30 AM',n:'Turtle Town',p:LOC.ttown,img:'turtle',m:'boat',x:'Green sea turtles feed along the reef here. Look, but keep your distance.'},
 {t:'12:00 PM',n:'Back at the harbor',p:LOC.maa,img:'boat',m:'boat',x:'Rinse off and head west.'},
 {t:'12:30 PM',n:'Lunch in Lahaina',p:LOC.lah,img:'food',via:[[20.786,-156.560],[20.795,-156.590],[20.810,-156.625],[20.835,-156.650]],x:'Lahaina is still rebuilding after the 2023 fire. Eating here supports local businesses.'},
 {t:'2:00 PM',n:'Nāpili or Kapalua Bay',p:LOC.kap,img:'beach',via:[[20.905,-156.690],[20.950,-156.690],[20.975,-156.682]],x:'Calm, sheltered bays near the Airbnb, good for swimming. Kāʻanapali\'s Black Rock is another option. Or take a nap.'},
 {t:'5:15 PM',n:'Old Lahaina Luau',p:LOC.olu,img:'luau',via:[[20.975,-156.682],[20.950,-156.690],[20.910,-156.690]],bk:'olu',x:'Check in at 5:15 (1251 Front St). Lei greeting, a 4-course dinner, and hula as the sun sets. It ends around 8:15.'}]},
{d:'Sun',dt:'Nov 29',t:'Pāʻia, Upcountry, Haleakalā sunset, fly home',img:'volcano',x:'Everything today is on the way to the airport. Sunset at Haleakalā needs no reservation.',bk:['hale'],s:[
 {t:'10:00 AM',n:'Check out',p:LOC.kaa,img:'home',x:'Keep luggage out of sight in the car all day.'},
 {t:'11:00 AM',n:'Pāʻia brunch and shops',p:LOC.paia,img:'town',via:[...W30,...MAA_KAH,[20.893,-156.440],[20.905,-156.410]],x:'Surf shops, boutiques and good coffee.'},
 {t:'12:15 PM',n:'Hoʻokipa Lookout',p:LOC.hook,img:'turtle',via:[[20.920,-156.366]],x:'Big-wave surfers and windsurfers, and turtles often come up on the beach in the afternoon.'},
 {t:'1:30 PM',n:'Snacks in Makawao',p:LOC.maka,img:'town',via:[[20.918,-156.360],[20.905,-156.345],[20.888,-156.330],[20.870,-156.318]],x:'A small cowboy town. Try the famous cream puffs at the bakery.'},
 {t:'4:00 PM',n:'Haleakalā summit and sunset',p:LOC.sum,img:'volcano',via:CRATER,bk:'hale',x:'About 1.5 hours up; pay the car entrance fee at the gate. Explore the crater viewpoints, then watch sunset above the clouds around 5:45.',tip:'It is near freezing at 10,000 ft. Wear the warmest layers you brought.'},
 {t:'7:45 PM',n:'Dinner in Kahului, return the car',p:LOC.kah,img:'food',via:[...rev(CRATER),[20.860,-156.400],[20.880,-156.440]],x:'Drive down slowly in the dark, about 1.5 hours.'},
 {t:'8:30 PM',n:'Fly home from OGG',p:LOC.ogg,img:'plane',x:'Evita: 10:10 PM to Seattle. Nupur: 11:30 PM to Phoenix and Charlotte, then the Monday 7:45 PM train to Raleigh. Mahalo, Hawaiʻi!'}]}];


/* Google Places search text for each stop's photo (stops not listed use the day's photo) */
const Q={
 'Land at HNL':'Daniel K. Inouye International Airport','Pick up Evita at HNL':'Daniel K. Inouye International Airport','Drop the car at HNL':'Daniel K. Inouye International Airport',
 'Easy dinner in Waikiki':'Waikiki Beach Walk Honolulu','Leave Waikiki':'Waikiki Beach Honolulu','Check into the Waikiki Airbnb':'Waikiki Honolulu',
 'Lanikai Beach':'Lanikai Beach Kailua','Lunch in Kailua town':'Kailua Town Oahu','Hoʻomaluhia Botanical Garden':'Hoomaluhia Botanical Garden',
 'Kualoa Ranch UTV':'Kualoa Ranch','Aliʻi Luau at PCC':'Polynesian Cultural Center Laie','Drive back to Waikiki':'Waikiki Honolulu',
 'Hanauma Bay snorkel':'Hanauma Bay Nature Preserve','Lunch in Kaimukī':'Kaimuki Honolulu','Rest at the Airbnb':'Waikiki Honolulu',
 'Surf lesson or beach time':'Kuhio Beach Park Waikiki','Sunset and dinner':'Waikiki Beach sunset','Diamond Head summit':'Diamond Head State Monument',
 'Pack and check out by 11':'Waikiki Honolulu','Royal Hawaiian Center and International Market Place':'International Market Place Honolulu',
 'Lunch and shopping at Ala Moana':'Ala Moana Center','Land in Kahului (OGG)':'Kahului Airport','Drive to the west Maui Airbnb':'Kaanapali Beach',
 'Thanksgiving dinner':'Kaanapali Beach Resort','Leave west Maui':'Kaanapali Beach','Breakfast in Pāʻia':'Paia Maui','Twin Falls':'Twin Falls Maui Haiku',
 'Keʻanae Peninsula':'Keanae Peninsula Maui','Waiʻānapanapa State Park':'Waianapanapa State Park','Hāna town, then turn back':'Hana Bay Beach Park',
 'Back on the west side':'Kaanapali Beach','Leave for Māʻalaea Harbor':'Kaanapali Beach','Check in at the harbor':'Maalaea Harbor','Molokini Crater':'Molokini Crater',
 'Turtle Town':'Turtle Town Maui Makena','Back at the harbor':'Maalaea Harbor','Lunch in Lahaina':'Lahaina Maui','Nāpili or Kapalua Bay':'Kapalua Bay Beach',
 'Old Lahaina Luau':'Old Lahaina Luau','Check out':'Kaanapali Beach','Pāʻia brunch and shops':'Paia Maui','Hoʻokipa Lookout':'Hookipa Beach Park',
 'Snacks in Makawao':'Makawao Maui','Haleakalā summit and sunset':'Haleakala Visitor Center','Dinner in Kahului, return the car':'Kahului Maui','Fly home from OGG':'Kahului Airport'};
const DAYQ=['Waikiki Beach Honolulu','Kualoa Ranch','Hanauma Bay Nature Preserve','Diamond Head State Monument','Road to Hana Maui','Molokini Crater','Haleakala National Park summit'];

/* ---------- build legs and slides ---------- */
DAYS.forEach(D=>{D.legs=[null];D.s.forEach((s,i)=>{if(!i)return;let pts;
 if(s.back){pts=[];for(let j=D.legs.length-1;j>0;j--)pts.push(...rev(D.legs[j].pts));}
 else pts=[D.s[i-1].p,...(s.via||[]),s.p];
 D.legs.push({m:s.m||'drive',pts,from:D.s[i-1].p,to:s.p});});});
const SL=[];DAYS.forEach((D,di)=>{SL.push({di,i:-1});D.s.forEach((s,i)=>SL.push({di,i}));});

/* ---------- map ---------- */
const $=id=>document.getElementById(id);
const map=L.map('map',{zoomControl:true,attributionControl:true}).setView([21.0,-157.0],8);
const routeLayer=L.layerGroup().addTo(map),markLayer=L.layerGroup().addTo(map);
let gReady=false,cur=0;
const hasKey=GOOGLE_API_KEY&&!/PASTE/.test(GOOGLE_API_KEY);

function fallbackBase(){
 const osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'});
 const sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Tiles &copy; Esri'});
 osm.addTo(map);L.control.layers({'Streets':osm,'Satellite':sat}).addTo(map);
 $('keynote').hidden=false;}

function loadGoogle(){return new Promise((res,rej)=>{
 window.__gInit=()=>res();const s=document.createElement('script');
 s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_API_KEY)}&v=weekly&libraries=places,routes&loading=async&callback=__gInit`;
 s.async=true;s.onerror=rej;document.head.appendChild(s);});}

/* ---------- Google: photos ---------- */
const photoCache=new Map();
async function photoFor(q){
 if(!gReady||!q)return null;if(photoCache.has(q))return photoCache.get(q);
 const p=(async()=>{try{
  const {Place}=await google.maps.importLibrary('places');
  const {places}=await Place.searchByText({textQuery:q+', Hawaii',fields:['displayName','photos','googleMapsURI'],maxResultCount:1});
  const pl=places&&places[0];if(!pl||!pl.photos||!pl.photos.length)return null;
  const ph=pl.photos[0];const a=(ph.authorAttributions||[])[0];
  return {url:ph.getURI({maxWidth:900,maxHeight:600}),name:pl.displayName,maps:pl.googleMapsURI,by:a?a.displayName:'',byUrl:a?a.uri:''};
 }catch(e){console.warn('Photo lookup failed for',q,e);return null;}})();
 photoCache.set(q,p);return p;}

/* ---------- Google: driving routes ---------- */
const routeCache=(()=>{try{return JSON.parse(localStorage.getItem('hi-routes')||'{}')}catch(e){return{}}})();
const saveRoutes=()=>{try{localStorage.setItem('hi-routes',JSON.stringify(routeCache))}catch(e){}};
async function drivePath(leg){
 const k=leg.from.join()+'>'+leg.to.join();if(routeCache[k])return routeCache[k];
 if(!gReady)return null;
 try{ /* new Routes API */
  const {Route}=await google.maps.importLibrary('routes');
  if(Route&&Route.computeRoutes){
   const {routes}=await Route.computeRoutes({origin:{lat:leg.from[0],lng:leg.from[1]},destination:{lat:leg.to[0],lng:leg.to[1]},travelMode:'DRIVING',fields:['path']});
   const path=routes&&routes[0]&&routes[0].path;
   if(path&&path.length){routeCache[k]=path.map(p=>[+p.lat.toFixed(5),+p.lng.toFixed(5)]);saveRoutes();return routeCache[k];}}
 }catch(e){console.warn('Routes API failed, trying Directions',e);}
 try{ /* legacy Directions service */
  const ds=new google.maps.DirectionsService();
  const r=await ds.route({origin:{lat:leg.from[0],lng:leg.from[1]},destination:{lat:leg.to[0],lng:leg.to[1]},travelMode:google.maps.TravelMode.DRIVING});
  const path=r.routes[0].overview_path;routeCache[k]=path.map(p=>[+p.lat().toFixed(5),+p.lng().toFixed(5)]);saveRoutes();return routeCache[k];
 }catch(e){console.warn('Directions failed; using sketched route',e);return null;}}

const arc=(a,b)=>{const pts=[];const mx=(a[0]+b[0])/2+0.35,my=(a[1]+b[1])/2;for(let t=0;t<=1.0001;t+=.05){pts.push([(1-t)*(1-t)*a[0]+2*(1-t)*t*mx+t*t*b[0],(1-t)*(1-t)*a[1]+2*(1-t)*t*my+t*t*b[1]]);}return pts;};
const STY={drive:{color:'#ff4f6d',weight:5,opacity:.95},boat:{color:'#1167a8',weight:4,dashArray:'2 10',opacity:.95},fly:{color:'#10232b',weight:3,dashArray:'8 8',opacity:.7}};

/* ---------- render ---------- */
let token=0;
function icon(n,c){return L.divIcon({className:'',html:`<div class="pin ${c}">${n}</div>`,iconSize:c==='cur'?[34,34]:[26,26],iconAnchor:c==='cur'?[17,17]:[13,13]});}
async function render(){
 const my=++token;const {di,i}=SL[cur];const D=DAYS[di];
 $('days').innerHTML=DAYS.map((d,k)=>`<button class="${k===di?'on':''}" data-d="${k}" aria-pressed="${k===di}">${d.d}<small>${d.dt}</small></button>`).join('');
 const on=$('days').querySelector('.on');on&&on.scrollIntoView({block:'nearest',inline:'nearest'});
 routeLayer.clearLayers();markLayer.clearLayers();
 const legLines=[];
 D.legs.forEach((l,k)=>{if(!l)return;const st={...STY[l.m]};if(i>=0&&k>i)st.opacity=.3;if(k===i&&l.m==='drive')st.weight=8;
  const pts=l.m==='fly'?arc(l.from,l.to):l.pts;const pl=L.polyline(pts,st).addTo(routeLayer);legLines[k]=pl;
  if(l.m==='drive'&&gReady)drivePath(l).then(p=>{if(p&&my===token)pl.setLatLngs(p);});});
 D.s.forEach((s,k)=>{const c=k===i?'cur':(i>=0&&k>i?'todo':'');
  const m=L.marker(s.p,{icon:icon(k+1,c),zIndexOffset:k===i?1000:k}).addTo(markLayer);
  m.bindTooltip(`${s.t} · ${s.n}`,{direction:'top',offset:[0,-14],permanent:k===i,className:'tt'});
  m.on('click',()=>{cur=SL.findIndex(x=>x.di===di&&x.i===k);render();});});
 let pts;if(i<0)pts=D.legs.flatMap(l=>l?l.pts:[]).concat(D.s.map(s=>s.p));else pts=D.legs[i]?D.legs[i].pts.concat([D.s[i].p]):[D.s[i].p];
 const b=L.latLngBounds(pts);
 if(i>=0&&pts.length===1)map.flyTo(pts[0],14,{duration:.9});else map.flyToBounds(b.pad(.25),{maxZoom:14,duration:.9});
 /* card */
 const bk=k=>`<a class="book" href="${BK[k][1]}" target="_blank" rel="noopener">${BK[k][0]} &#8599;</a>`;
 const s=i<0?null:D.s[i];
 const title=i<0?D.t:s.n,meta=i<0?`<span class="time">${D.d} ${D.dt}</span><span>Day ${di+1} of 7 · ${D.s.length} stops</span>`:`<span class="time">${s.t}</span><span>${D.d} ${D.dt} · stop ${i+1} of ${D.s.length}</span>`;
 const body=i<0?`<p>${D.x}</p>${D.li?`<ul>${D.li.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}<ol class="stops">${D.s.map(x=>`<li><b>${x.t}</b> ${x.n}</li>`).join('')}</ol>${(D.bk||[]).map(bk).join('')}`
  :`<p>${s.x}</p>${s.tip?`<p class="tip">${s.tip}</p>`:''}${s.bk?bk(s.bk):''}`;
 $('card').innerHTML=`<figure class="photo" id="photo"><div class="ph-empty">${title}</div></figure><div class="meta">${meta}</div><h2>${title}</h2>${body}`;
 $('card').scrollTop=0;
 $('count').innerHTML=`${i<0?'Day overview':'Stop '+(i+1)+' of '+D.s.length}<div class="dots">${[-1,...D.s.map((_,k)=>k)].map(k=>`<i class="${k===i?'on':''}"></i>`).join('')}</div>`;
 $('prev').disabled=cur===0;$('next').disabled=cur===SL.length-1;
 try{localStorage.setItem('hi-slide',cur)}catch(e){}
 const ph=await photoFor(i<0?DAYQ[di]:(Q[s.n]||DAYQ[di]));
 if(ph&&my===token){$('photo').innerHTML=`<img src="${ph.url}" alt="${ph.name||title}"><figcaption>${ph.by?`Photo: <a href="${ph.byUrl}" target="_blank" rel="noopener">${ph.by}</a> · `:''}<a href="${ph.maps}" target="_blank" rel="noopener">${ph.name||'Google Maps'}</a></figcaption>`;}
 /* warm the next slide's photo */
 const n=SL[cur+1];if(n){const ND=DAYS[n.di];photoFor(n.i<0?DAYQ[n.di]:(Q[ND.s[n.i].n]||DAYQ[n.di]));}
}
const move=d=>{const n=Math.max(0,Math.min(SL.length-1,cur+d));if(n!==cur){cur=n;render();}};
$('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);
$('days').onclick=e=>{const b=e.target.closest('button');if(!b)return;cur=SL.findIndex(x=>x.di==b.dataset.d&&x.i<0);render();};
addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);});
let sx=null;$('card').addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
$('card').addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60)move(dx<0?1:-1);sx=null;});
try{const v=+localStorage.getItem('hi-slide');if(v>0&&v<SL.length)cur=v;}catch(e){}

/* ---------- start ---------- */
(async()=>{
 if(hasKey){try{await loadGoogle();gReady=true;
   const road=L.gridLayer.googleMutant({type:'roadmap'}),sat=L.gridLayer.googleMutant({type:'hybrid'}),ter=L.gridLayer.googleMutant({type:'terrain'});
   road.addTo(map);L.control.layers({'Google Map':road,'Google Satellite':sat,'Google Terrain':ter}).addTo(map);
  }catch(e){console.warn('Google Maps failed to load',e);fallbackBase();}}
 else fallbackBase();
 render();
})();
