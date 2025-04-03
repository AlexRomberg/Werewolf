import{b as Ee,c as Ce,d as Te,h as Pe}from"./chunk-NIRXDNRY.js";import{a as fe}from"./chunk-BUA5GIRK.js";import{b as ce,c as U,e as de,f as ue,g as pe,i as L,j as me}from"./chunk-MBABEOSW.js";import{R as Se,S as ge,c as _e,i as le,j as se}from"./chunk-WBJZ5L5T.js";import{$a as ie,Aa as a,Ab as ae,Bb as F,Cb as G,Ja as te,Oa as C,V as $,Ya as E,_a as N,aa as m,ab as T,ba as S,bb as f,cb as A,db as M,e as h,eb as t,fb as n,gb as _,hb as g,ib as b,jb as O,kb as d,lb as R,mb as v,nb as p,oa as P,ob as c,ub as x,vb as y,wb as ne,xb as oe,ya as w,yb as re}from"./chunk-S6VIYWOS.js";var Ae=(i,l)=>({transform:i,"z-index":l});function Me(i,l){if(i&1){let e=g();t(0,"button",49),p("click",function(){m(e);let o=c();return S(o.spotify.Authenticate());}),b(1,11),_(2,"lucide-angular",50),O(),n();}}function he(i,l){if(i&1){let e=g();t(0,"button",57),p("click",function(){let o=m(e).$implicit,u=c(3);return S(u.setDevice(o));}),_(1,"lucide-angular",39),t(2,"p",58),x(3),n()();}if(i&2){let e=l.$implicit,r=c(3);E("disabled",r.isSelectingDevice()),a(),E("name",r.spotify.getIconOfDevice(e)),a(2),y(e.name);}}function Ne(i,l){if(i&1){let e=g();t(0,"span",51)(1,"p",52),d(2,12),n(),t(3,"button",53),p("click",function(){m(e);let o=c(2);return S(o.updateDeviceList());}),t(4,"div"),_(5,"lucide-angular",54),n()()(),t(6,"div",55),A(7,he,4,3,"button",56,f),n();}if(i&2){let e=c(2);a(3),E("disabled",e.isLoadingDevices()),a(),N("spin-animation",e.isLoadingDevices()),a(3),M(e.spotify.AvailableDevices);}}function xe(i,l){if(i&1){let e=g();t(0,"button",67),p("click",function(){m(e);let o=c(3);return S(o.startBackgroundMusic());}),t(1,"p"),d(2,14),n(),_(3,"lucide-angular",68),n();}}function ye(i,l){i&1&&(t(0,"i",66),d(1,15),n());}function $e(i,l){if(i&1){let e=g();t(0,"span",59)(1,"p",60),d(2,13),n(),t(3,"span",61),_(4,"lucide-angular",39),t(5,"p",62),x(6),n(),t(7,"button",63),p("click",function(){m(e);let o=c(2);return S(o.setDevice(void 0));}),_(8,"lucide-angular",64),n()()(),C(9,xe,4,0,"button",65)(10,ye,2,0,"i",66);}if(i&2){let e=c(2);a(4),E("name",e.spotify.getIconOfDevice(e.spotify.CurrentDevice)),a(2),y(e.spotify.CurrentDevice.name),a(3),T(e.state.MusicStarted?10:9);}}function be(i,l){if(i&1&&(t(0,"div",33),C(1,Ne,9,3)(2,$e,11,3),n()),i&2){let e=c();a(),T(e.spotify.CurrentDevice?2:1);}}function Oe(i,l){if(i&1){let e=g();t(0,"button",72),p("click",function(){m(e);let o=c(2);return S(o.state.addPerson());}),_(1,"lucide-angular",73),t(2,"p",74),d(3,16),n()();}}function Fe(i,l){if(i&1){let e=g();t(0,"div",71),_(1,"lucide-angular",75),t(2,"input",76),re("ngModelChange",function(o){let u=m(e).$implicit;return oe(u.Name,o)||(u.Name=o),S(o);}),n(),t(3,"button",77),p("click",function(){let o=m(e).$implicit,u=c(2);return S(u.state.removePerson(o));}),_(4,"lucide-angular",78),n()();}if(i&2){let e=l.$implicit;a(2),ne("ngModel",e.Name);}}function Ge(i,l){if(i&1&&(_(0,"hr",69),C(1,Oe,4,0,"button",70),A(2,Fe,5,1,"div",71,f)),i&2){let e=c();a(),T(e.state.People.length<20?1:-1),a(),M(e.state.People);}}function we(i,l){if(i&1&&(t(0,"div",79),_(1,"img",80),F(2,"i18nSelect"),n()),i&2){let e=l.$implicit,r=l.$index,o=c();ie(ae(7,Ae,"translateX("+r*1.5+"rem)",100-r)),a(),E("src","img/"+e.Id+".png",w)("alt",G(2,4,e.Id,o.NAME_TRANSLATIONS));}}function Re(i,l){i&1&&_(0,"div",92)(1,"div",93);}function ve(i,l){if(i&1){let e=g();t(0,"div",88),p("click",function(){let o=m(e).$implicit,u=c(3);return S(u.toggleCharacterSelection(o));}),C(1,Re,2,0),t(2,"div",89),_(3,"img",90),F(4,"i18nSelect"),n(),t(5,"p",91),x(6),F(7,"i18nSelect"),n()();}if(i&2){let e=l.$implicit,r=c(3);N("ring-2",r.state.SelectedCharacters.includes(e)),a(),T(e.IsSingle?-1:1),a(2),E("src","img/"+e.Id+".png",w)("alt",G(4,6,e.Id,r.NAME_TRANSLATIONS)),a(3),y(G(7,9,e.Id,r.NAME_TRANSLATIONS));}}function Ue(i,l){if(i&1&&(t(0,"h3",85),x(1),n(),t(2,"div",86),A(3,ve,8,12,"div",87,f),n()),i&2){let e=l.$implicit;a(),y(e.Name),a(2),M(e.Cards);}}function Le(i,l){if(i&1){let e=g();_(0,"hr",81),t(1,"span",82)(2,"p"),d(3,17),n(),t(4,"button",83),p("click",function(){m(e);let o=c();return S(o.grouping.set("group"));}),d(5,18),n(),t(6,"button",83),p("click",function(){m(e);let o=c();return S(o.grouping.set("game"));}),d(7,19),n()(),t(8,"div",84),A(9,Ue,5,1,null,null,f),n();}if(i&2){let e=c();a(4),N("ring-2",e.grouping()==="group"),a(2),N("ring-2",e.grouping()==="game"),a(3),M(e.getCharacterGroup());}}var Ye=(()=>{class i{constructor(){this.router=$(le),this.state=$(me),this.spotify=$(fe),this.isLoadingDevices=P(!1),this.isSelectingDevice=P(!1),this.isPeopleEditorOpen=P(!1),this.isCharacterEditorOpen=P(!1),this.grouping=P("group"),this.NAME_TRANSLATIONS=de;}ngOnInit(){if(this.state.People.length<=0)for(let e=0;e<8;e++)this.state.addPerson();this.state.SelectedCharacters.length<=0&&(this.state.SelectedCharacters=this.state.AllCharacters.filter(e=>e.Game===U.BaseGame)),this.state.InGame=!1;}updateDeviceList(){return h(this,null,function*(){this.isLoadingDevices.set(!0),yield this.spotify.UpdateDeviceList().then(()=>{setTimeout(()=>{this.isLoadingDevices.set(!1);},1e3);});});}setDevice(e){return h(this,null,function*(){this.isSelectingDevice.set(!0),yield this.spotify.SetDevice(e?.id??void 0,!1).then(()=>{this.isSelectingDevice.set(!1);});});}startBackgroundMusic(){return h(this,null,function*(){yield this.spotify.PlayPlaylist(L.spotify.playlists.start,!1),this.state.MusicStarted=!0,yield this.spotify.UpdatePlaybackState();});}getCharacterGroup(){return this.grouping()==="group"?Object.values(ce).filter(e=>typeof e=="number").map(e=>({Name:ue[e],Cards:this.state.AllCharacters.filter(r=>r.Group===e)})):Object.values(U).filter(e=>typeof e=="number").map(e=>({Name:pe[e],Cards:this.state.AllCharacters.filter(r=>r.Game===e)}));}toggleCharacterSelection(e){this.state.SelectedCharacters.includes(e)?this.state.SelectedCharacters=this.state.SelectedCharacters.filter(r=>r!==e):this.state.SelectedCharacters=[...this.state.SelectedCharacters,e];}startGame(){return h(this,null,function*(){this.state.SelectedCharacters=this.state.SelectedCharacters,this.state.startGame(),this.spotify.IsAuthenticated&&this.spotify.CurrentDevice&&!this.state.MusicStarted&&(yield this.spotify.PlayPlaylist(L.spotify.playlists.start,!1),this.state.MusicStarted=!0),this.router.navigateByUrl("/narrator");});}static{this.ɵfac=function(r){return new(r||i)();};}static{this.ɵcmp=te({type:i,selectors:[["app-setup"]],decls:51,vars:7,consts:()=>{let e;e="Setup";let r;r="Werwolf Companion App";let o;o="Spotify (BETA)";let u;u="Connect Spotify for some ambient music.";let I;I="Players";let k;k="Add players"+"\uFFFD#24\uFFFD\uFFFD/#24\uFFFD"+" (Names and seating can be changed later)";let z;z=""+"\uFFFD0\uFFFD"+" People";let D;D="Characters";let X;X="Select the caracters you are playing with";let V;V=""+"\uFFFD0\uFFFD"+" characters selected";let B;B="Start game "+"\uFFFD#50\uFFFD"+""+"\uFFFD/#50\uFFFD"+"";let j;j="Connect with Spotify"+"\uFFFD#2\uFFFD"+""+"\uFFFD/#2\uFFFD"+"";let W;W="Select a device:";let H;H="Connected Device:";let K;K="start background music";let q;q="Plays music in the background";let J;J="Add";let Q;Q="Unnamed";let Y;Y="Group by:";let Z;Z="Group";let ee;return ee="Game",[e,r,o,u,I,k,z,D,X,V,B,j,W,H,K,q,J,Y,Z,ee,[1,"bg-zinc-800","text-zinc-200","shadow-lg","fixed","top-0","w-full","z-50"],[1,"lg:max-w-(--breakpoint-lg)","max-w-(--breakpoint-md)","flex","mx-auto","items-center"],["routerLink","/",1,"p-8"],["name","arrow-left"],[1,"text-2xl"],[1,"max-sm:hidden","ml-auto","mr-4"],["src","img/night.png","alt","Logo",1,"max-sm:ml-auto","rounded-lg","md-shadow-md","w-12","mr-6"],[1,"flex","flex-col","mx-auto","lg:max-w-(--breakpoint-lg)","max-w-(--breakpoint-md)","pt-28","px-6","text-zinc-200"],[1,"grid","grid-cols-1","sm:grid-cols-[auto_1fr]","md:grid-cols-3","grid-rows-[auto_auto_1fr]","gap-y-1","gap-x-4","items-center","sm:items-end","md:items-start","w-full"],[1,"text-xl"],[1,"md:row-start-2","text-zinc-500","text-sm"],[1,"sm:col-span-2","md:row-span-3","max-md:mt-4"],[1,"btn","bg-zinc-700","text-zinc-100","w-full","flex","justify-center","gap-2"],[1,"bg-zinc-800","p-4","rounded-md"],[1,"w-full","my-6","border-zinc-700"],[1,"max-md:hidden"],[1,"sm:col-span-2","md:row-span-3","max-md:mt-4","grid","grid-cols-1","gap-4","p-4","bg-zinc-800","rounded-md"],[1,"py-2","flex","justify-between","pr-2",3,"click"],[1,"text-lg"],[3,"name"],[1,"sm:col-span-2","md:row-span-3","max-md:mt-4","grid","grid-cols-1","p-4","bg-zinc-800","rounded-md"],[1,"grid","grid-cols-[1fr_auto]","grid-rows-[auto_auto]","items-center","pr-2","gap-y-2",3,"click"],[1,"text-left","text-lg"],[1,"col-start-1","row-start-2","grid","overflow-hidden","w-full","fade-out"],[1,"col-start-1","row-start-1","bg-neutral-900","p-1","w-14","h-14","rounded-md","shadow-md",3,"style"],[1,"row-span-2",3,"name"],[1,"flex","mb-6"],[1,"btn","bg-zinc-700","text-zinc-200","w-full","flex","gap-2","justify-center",3,"click"],["name","arrow-right"],[1,"btn","bg-zinc-700","text-zinc-100","w-full","flex","justify-center","gap-2",3,"click"],["name","log-in"],[1,"flex","justify-between","items-center"],[1,"text-zinc-300","whitespace-nowrap","overflow-hidden","text-ellipsis"],[1,"text-zinc-200",3,"click","disabled"],["name","refresh-cw"],[1,"flex","flex-col","gap-4","pt-4"],[1,"w-full","flex","justify-start","p-2",3,"disabled"],[1,"w-full","flex","justify-start","p-2",3,"click","disabled"],[1,"ml-4"],[1,"flex","justify-start","items-center"],[1,"text-zinc-300","whitespace-nowrap","overflow-hidden","text-ellipsis","mr-4"],[1,"flex","items-center","py-2","px-4","rounded-full","bg-zinc-700"],[1,"ml-2"],[1,"text-zinc-200","ml-2",3,"click"],["name","x"],[1,"btn","bg-zinc-700","text-zinc-200","flex","w-full","justify-center","gap-4","mt-4"],[1,"mt-4","block","text-zinc-400","text-center"],[1,"btn","bg-zinc-700","text-zinc-200","flex","w-full","justify-center","gap-4","mt-4",3,"click"],["name","play"],[1,"w-full","border-zinc-500"],[1,"flex","items-center","gap-4","border-dashed","border-zinc-500","border-2","p-1.5","rounded-md"],[1,"flex","items-center","gap-4","p-2"],[1,"flex","items-center","gap-4","border-dashed","border-zinc-500","border-2","p-1.5","rounded-md",3,"click"],["name","plus","size","32px"],[1,"whitespace-nowrap","text-ellipsis"],["name","circle-user-round","size","32px"],["type","text","placeholder",Q,1,"w-full",3,"ngModelChange","ngModel"],[1,"text-red-400",3,"click"],["name","trash-2"],[1,"col-start-1","row-start-1","bg-neutral-900","p-1","w-14","h-14","rounded-md","shadow-md"],["width","48px","height","48px",3,"src","alt"],[1,"w-full","border-zinc-500","my-4"],[1,"flex","items-center","gap-2"],[1,"px-4","py-1","bg-zinc-700","rounded-full","ring-amber-500",3,"click"],[1,"flex","flex-col"],[1,"text-lg","mt-4"],[1,"grid","grid-cols-2","gap-2"],[1,"bg-zinc-700","p-2","rounded-md","grid","grid-cols-[4rem_1fr]","gap-2","items-center","ring-amber-500",3,"ring-2"],[1,"bg-zinc-700","p-2","rounded-md","grid","grid-cols-[4rem_1fr]","gap-2","items-center","ring-amber-500",3,"click"],[1,"border-4","border-black","rounded","md-shadow-md","w-16","col-start-1","row-start-1","z-10"],[1,"w-16",3,"src","alt"],[1,"text-center"],[1,"border-4","border-zinc-800","rounded","md-shadow-md","w-16","h-16","col-start-1","row-start-1","rotate-3"],[1,"border-4","border-zinc-900","rounded","md-shadow-md","w-16","h-16","col-start-1","row-start-1","-rotate-6"]];},template:function(r,o){r&1&&(t(0,"div",20)(1,"div",21)(2,"a",22),_(3,"lucide-angular",23),n(),t(4,"h1",24),d(5,0),n(),t(6,"p",25),d(7,1),n(),_(8,"img",26),n()(),t(9,"div",27)(10,"div",28)(11,"h2",29),d(12,2),n(),t(13,"i",30),d(14,3),n(),t(15,"div",31),C(16,Me,3,0,"button",32)(17,be,3,1,"div",33),n()(),_(18,"hr",34),t(19,"div",28)(20,"h2",29),d(21,4),n(),t(22,"i",30),b(23,5),_(24,"br",35),O(),n(),t(25,"div",36)(26,"button",37),p("click",function(){return o.isPeopleEditorOpen.set(!o.isPeopleEditorOpen());}),t(27,"p",38),d(28,6),n(),_(29,"lucide-angular",39),n(),C(30,Ge,4,1),n()(),_(31,"hr",34),t(32,"div",28)(33,"h2",29),d(34,7),n(),t(35,"i",30),d(36,8),n(),t(37,"div",40)(38,"button",41),p("click",function(){return o.isCharacterEditorOpen.set(!o.isCharacterEditorOpen());}),t(39,"p",42),d(40,9),n(),t(41,"span",43),A(42,we,3,10,"div",44,f),n(),_(44,"lucide-angular",45),n(),C(45,Le,11,4),n()(),_(46,"hr",34),t(47,"div",46)(48,"button",47),p("click",function(){return o.startGame();}),b(49,10),_(50,"lucide-angular",48),O(),n()()()),r&2&&(a(16),T(o.spotify.IsAuthenticated?17:16),a(12),R(o.state.People.length),v(28),a(),E("name",o.isPeopleEditorOpen()?"chevron-up":"chevron-down"),a(),T(o.isPeopleEditorOpen()?30:-1),a(10),R(o.state.SelectedCharacters.length),v(40),a(2),M(o.state.SelectedCharacters),a(2),E("name",o.isCharacterEditorOpen()?"chevron-up":"chevron-down"),a(),T(o.isCharacterEditorOpen()?45:-1));},dependencies:[Pe,Ee,Ce,Te,se,ge,Se,_e],styles:[`.fade-out[_ngcontent-%COMP%]{mask-image:linear-gradient(to right,#000,#000 calc(100% - 80px),transparent calc(100% - 20px))}.spin-animation[_ngcontent-%COMP%]{animation:var(--animate-spin, _ngcontent-%COMP%_spin 1s linear infinite);--tw-duration: 2s;transition-duration:2s}@keyframes _ngcontent-%COMP%_spin{to{transform:rotate(360deg)}}

`]});}}return i;})();export{Ye as SetupComponent};/**i18n:4d237bd4a7924989e9147be91c316aeb32cdd902c29b123d66e18fd31eb96ec1*/