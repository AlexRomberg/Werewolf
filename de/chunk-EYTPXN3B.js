import{a as se}from"./chunk-C2FAH6XM.js";import{h as ae}from"./chunk-NIRXDNRY.js";import{a as ce}from"./chunk-RQU36OCT.js";import{a as le}from"./chunk-BUA5GIRK.js";import{e as oe,i as k,j as re}from"./chunk-MBABEOSW.js";import{R as G,S as $,c as ie,i as ne}from"./chunk-WBJZ5L5T.js";import{Aa as n,Bb as R,Cb as N,Ja as z,Oa as p,V as y,Ya as C,_a as h,aa as u,ab as _,ba as m,bb as E,cb as x,db as v,e as w,eb as o,fb as r,gb as s,hb as S,ib as I,ja as Z,jb as F,kb as b,ma as O,nb as d,oa as q,ob as c,pb as Q,qb as J,ub as g,vb as A,wb as Y,xb as ee,ya as M,yb as te}from"./chunk-S6VIYWOS.js";var ue=["*"];function me(t,l){if(t&1){let e=S();o(0,"button",7),d("click",function(i){return u(e),c().secondIconPressedEvent.emit(),m(i.stopPropagation());}),s(1,"lucide-angular",5),r();}if(t&2){let e=c();n(),C("name",e.secondIcon());}}var _e=(()=>{class t{constructor(){this.collapsedOnStart=O(!1),this.isClosed=q(this.collapsedOnStart()),this.flipIcon=O(!1),this.secondIcon=O(void 0),this.title=O.required(),this.summary=O(),this.secondIconPressedEvent=new Z();}ngOnInit(){this.isClosed.set(this.collapsedOnStart());}static{this.ɵfac=function(a){return new(a||t)();};}static{this.ɵcmp=z({type:t,selectors:[["app-sidebar-group"]],inputs:{collapsedOnStart:[1,"collapsedOnStart"],flipIcon:[1,"flipIcon"],secondIcon:[1,"secondIcon"],title:[1,"title"],summary:[1,"summary"]},outputs:{secondIconPressedEvent:"secondIconPressedEvent"},ngContentSelectors:ue,decls:11,vars:6,consts:[[1,"w-full","grid","grid_rows-[auto_1fr]","gap-4"],[1,"grid","grid-cols-[auto_auto_1fr]","gap-4","items-center","w-full",3,"click"],[1,"text-zinc-200","text-2xl"],[1,"text-zinc-400","text-sm","whitespace-nowrap","overflow-hidden","text-ellipsis"],[1,"flex","gap-2","ml-auto"],[1,"text-zinc-200",3,"name"],[1,"hidden"],[3,"click"]],template:function(a,i){a&1&&(Q(),o(0,"div",0)(1,"button",1),d("click",function(){return i.isClosed.set(!i.isClosed());}),o(2,"h1",2),g(3),r(),o(4,"i",3),g(5),r(),o(6,"span",4),p(7,me,2,1,"button"),s(8,"lucide-angular",5),r()(),o(9,"div",6),J(10),r()()),a&2&&(n(3),A(i.title()),n(2),A(i.isClosed()?i.summary():""),n(2),_(i.secondIcon()&&!i.isClosed()?7:-1),n(),C("name",(i.flipIcon()?!i.isClosed():i.isClosed())?"chevron-down":"chevron-up"),n(),h("hidden",i.isClosed()));},dependencies:[$,G],styles:[`[_nghost-%COMP%]{display:block}

`]});}}return t;})();function ge(t,l){if(t&1){let e=S();o(0,"div",26)(1,"button",29),d("click",function(){u(e);let i=c(2);return m(i.goBack());}),s(2,"lucide-angular",30),r()();}}function Ae(t,l){if(t&1){let e=S();p(0,ge,3,0,"div",26),o(1,"div",27)(2,"button",28),d("click",function(){u(e);let i=c();return m(i.MobileShowSidebar=!1);}),b(3,0),r(),o(4,"button",28),d("click",function(){u(e);let i=c();return m(i.MobileShowSidebar=!0);}),b(5,1),r()();}if(t&2){let e=c();_(e.MobileShowSidebar?0:-1),n(2),h("bg-zinc-600",!e.MobileShowSidebar),n(2),h("bg-zinc-600",e.MobileShowSidebar);}}function Ce(t,l){if(t&1){let e=S();o(0,"button",31),d("click",function(){u(e);let i=c();return m(i.goBack());}),s(1,"lucide-angular",30),r();}}function fe(t,l){t&1&&(o(0,"span",33),s(1,"div",34),o(2,"p"),b(3,3),r()());}function Se(t,l){t&1&&(o(0,"span",33),s(1,"div",35),o(2,"p"),b(3,4),r()());}function Te(t,l){t&1&&(o(0,"span",33),s(1,"div",36),o(2,"p"),b(3,5),r()());}function Re(t,l){if(t&1&&(o(0,"button",18)(1,"span",32)(2,"p"),b(3,2),r()(),p(4,fe,4,0,"span",33)(5,Se,4,0,"span",33)(6,Te,4,0,"span",33),r()),t&2){let e=c();n(4),_(e.isRoleInGame("cupid")?4:-1),n(),_(e.isRoleInGame("wild_child")?5:-1),n(),_(e.isRoleInGame("hoodrat")?6:-1);}}function Ne(t,l){if(t&1&&(o(0,"p",47),b(1,6),r(),o(2,"span",48),s(3,"lucide-angular",43),o(4,"p",49),g(5),r()()),t&2){let e=c(2);n(3),C("name",e.spotify.getIconOfDevice(e.spotify.CurrentDevice)),n(2),A(e.spotify.CurrentDevice.name);}}function Ee(t,l){t&1&&(o(0,"p",39),b(1,7),r());}function xe(t,l){if(t&1){let e=S();o(0,"app-sidebar-group",37)(1,"span",38),p(2,Ne,6,2)(3,Ee,2,0,"p",39),r(),o(4,"div",40)(5,"p",41),g(6),r(),o(7,"button",42),d("click",function(){u(e);let i=c();return m(i.togglePlaybackState());}),s(8,"lucide-angular",43),r(),o(9,"button",44),d("click",function(){u(e);let i=c();return m(i.skipSong());}),s(10,"lucide-angular",45),r()()(),s(11,"hr",46);}if(t&2){let e=c();C("collapsedOnStart",!0)("summary",e.spotifySummary),n(2),_(e.spotify.CurrentDevice?2:3),n(4),A(e.songTitle),n(2),C("name",e.spotify.PlaybackState!=null&&e.spotify.PlaybackState.is_playing?"pause":"play");}}function ve(t,l){t&1&&s(0,"div",54)(1,"div",55);}function he(t,l){if(t&1){let e=S();o(0,"button",50),d("click",function(){let i=u(e).$implicit,T=c();return m(T.openCharacterDetails(i));}),p(1,ve,2,0),o(2,"div",51),s(3,"img",52),R(4,"i18nSelect"),r(),o(5,"p",53),g(6),R(7,"i18nSelect"),r()();}if(t&2){let e=l.$implicit,a=c();n(),_(e.IsSingle?-1:1),n(2),C("src","img/"+e.Id+".png",M)("alt",N(4,4,e.Id,a.NAME_TRANSLATIONS)),n(3),A(N(7,7,e.Id,a.NAME_TRANSLATIONS));}}function be(t,l){t&1&&s(0,"div",62);}function Pe(t,l){t&1&&s(0,"div",63);}function we(t,l){if(t&1&&(o(0,"li",67),g(1),r()),t&2){let e=l.$implicit;n(),A(e);}}function Oe(t,l){if(t&1){let e=S();o(0,"button",71),d("click",function(){let i=u(e).$implicit,T=c(4);return m(T.HandleAction(i.Action));}),g(1),r();}if(t&2){let e=l.$implicit;n(),A(e.Title);}}function Me(t,l){if(t&1&&(o(0,"div",69),x(1,Oe,2,1,"button",70,E),r()),t&2){let e=c(3);n(),v(e.GetFilteredButtons(e.state.Actions[0]));}}function ye(t,l){if(t&1&&(o(0,"div",57),p(1,be,1,0,"div",62)(2,Pe,1,0,"div",63),o(3,"div",64)(4,"div",65)(5,"div")(6,"h1",66),g(7),R(8,"i18nSelect"),r(),o(9,"ul"),x(10,we,2,1,"li",67,E),r()(),s(12,"img",68),R(13,"i18nSelect"),r(),p(14,Me,3,0,"div",69),r()()),t&2){let e=c(2);n(),_(e.state.Actions.length>2?1:-1),n(),_(e.state.Actions.length>1?2:-1),n(5),A(N(8,6,e.state.Actions[0].Id,e.NAME_TRANSLATIONS)),n(3),v(e.GetFilteredPoints(e.state.Actions[0])),n(2),C("src","img/"+e.state.Actions[0].Id+".png",M)("alt",N(13,9,e.state.Actions[0].Id,e.NAME_TRANSLATIONS)),n(2),_(e.GetFilteredButtons(e.state.Actions[0]).length>0?14:-1);}}function Ie(t,l){if(t&1){let e=S();o(0,"button",72),d("click",function(){u(e);let i=c(2);return m(i.state.previousAction());}),I(1,9),s(2,"lucide-angular",73),F(),r();}}function Fe(t,l){if(t&1){let e=S();o(0,"div",24)(1,"app-sidebar-group",56),R(2,"i18nSelect"),d("secondIconPressedEvent",function(){u(e);let i=c();return m(i.setEventMaximized(!i.AreEventsMaximized));}),p(3,ye,15,12,"div",57),o(4,"span",58),p(5,Ie,3,0,"button",59),o(6,"button",60),d("click",function(){u(e);let i=c();return m(i.OnNext());}),I(7,8),s(8,"lucide-angular",61),F(),r()()()();}if(t&2){let e=c();n(),C("collapsedOnStart",!1)("secondIcon",e.AreEventsMaximized?"minimize-2":"maximize-2")("summary",e.state.Actions[0].Id?N(2,8,e.state.Actions[0].Id,e.NAME_TRANSLATIONS):void 0)("flipIcon",!0),n(2),_(e.state.Actions[0].Id?3:-1),n(2),_(e.state.ActionHistory.length>0?5:-1),n(),h("col-span-3",e.state.ActionHistory.length===0);}}function ze(t,l){if(t&1&&(o(0,"li",84),g(1),r()),t&2){let e=l.$implicit;n(),A(e);}}function Ge(t,l){if(t&1&&(o(0,"div",79)(1,"div",65)(2,"div")(3,"h1",83),g(4),R(5,"i18nSelect"),r(),o(6,"ul"),x(7,ze,2,1,"li",84,E),r()(),s(9,"img",68),R(10,"i18nSelect"),r()()),t&2){let e=l.$implicit,a=c(2);n(4),A(N(5,3,e.Id,a.NAME_TRANSLATIONS)),n(3),v(a.GetFilteredPoints(e)),n(2),C("src","img/"+e.Id+".png",M)("alt",N(10,6,e.Id,a.NAME_TRANSLATIONS));}}function $e(t,l){if(t&1&&(o(0,"li",87),g(1),r()),t&2){let e=l.$implicit;n(),A(e);}}function ke(t,l){if(t&1){let e=S();o(0,"button",71),d("click",function(){let i=u(e).$implicit,T=c(4);return m(T.HandleAction(i.Action));}),g(1),r();}if(t&2){let e=l.$implicit;n(),A(e.Title);}}function Le(t,l){if(t&1&&(o(0,"div",69),x(1,ke,2,1,"button",70,E),r()),t&2){let e=c(3);n(),v(e.GetFilteredButtons(e.state.Actions[0]));}}function De(t,l){if(t&1&&(o(0,"div",80)(1,"div",85)(2,"div",65)(3,"div")(4,"h1",86),g(5),R(6,"i18nSelect"),r(),o(7,"ul"),x(8,$e,2,1,"li",87,E),r()(),s(10,"img",68),R(11,"i18nSelect"),r(),p(12,Le,3,0,"div",69),r()()),t&2){let e=c(2);n(5),A(N(6,4,e.state.Actions[0].Id,e.NAME_TRANSLATIONS)),n(3),v(e.GetFilteredPoints(e.state.Actions[0])),n(2),C("src","img/"+e.state.Actions[0].Id+".png",M)("alt",N(11,7,e.state.Actions[0].Id,e.NAME_TRANSLATIONS)),n(2),_(e.GetFilteredButtons(e.state.Actions[0]).length>0?12:-1);}}function Ve(t,l){if(t&1&&(o(0,"li",84),g(1),r()),t&2){let e=l.$implicit;n(),A(e);}}function Be(t,l){if(t&1&&(o(0,"div",79)(1,"div",65)(2,"div")(3,"h1",83),g(4),R(5,"i18nSelect"),r(),o(6,"ul"),x(7,Ve,2,1,"li",84,E),r()(),s(9,"img",68),R(10,"i18nSelect"),r()()),t&2){let e=l.$implicit,a=c(2);n(4),A(N(5,3,e.Id,a.NAME_TRANSLATIONS)),n(3),v(a.GetFilteredPoints(e)),n(2),C("src","img/"+e.Id+".png",M)("alt",N(10,6,e.Id,a.NAME_TRANSLATIONS));}}function Xe(t,l){if(t&1){let e=S();o(0,"button",72),d("click",function(){u(e);let i=c(2);return m(i.state.previousAction());}),I(1,11),s(2,"lucide-angular",73),F(),r();}}function Ue(t,l){if(t&1){let e=S();o(0,"div",25)(1,"button",74),d("click",function(){u(e);let i=c();return m(i.setEventMaximized(!1));}),s(2,"lucide-icon",75),r(),o(3,"div",76)(4,"div",77)(5,"div",78),x(6,Ge,11,9,"div",79,E),r()(),p(8,De,13,10,"div",80),o(9,"div",81),x(10,Be,11,9,"div",79,E),r(),o(12,"span",82),p(13,Xe,3,0,"button",59),o(14,"button",60),d("click",function(){u(e);let i=c();return m(i.OnNext());}),I(15,10),s(16,"lucide-angular",61),F(),r()()()();}if(t&2){let e=c();n(6),v(e.state.ActionHistory),n(2),_(e.state.Actions[0].Id?8:-1),n(2),v(e.getNextActions()),n(3),_(e.state.ActionHistory.length>0?13:-1),n(),h("col-span-3",e.state.ActionHistory.length===0);}}var st=(()=>{class t{constructor(){this.state=y(re),this.dialog=y(ce),this.spotify=y(le),this.NAME_TRANSLATIONS=oe,this.FallbackNotPlayingText="Nichts am abspielen",this.IsEditingPlayers=!1,this.AreEventsMaximized=!1,this.RedactCircle=!1,this.MobileShowSidebar=!0,this.router=y(ne),this.firstNightfall=!0;}HandleAction(e){e({GameState:this.state,Dialog:this.dialog});}OnNext(){return w(this,null,function*(){this.firstNightfall&&this.spotify.IsAuthenticated&&this.state.MusicStarted&&this.spotify.Pause().then(()=>{this.spotify.QueueSongRandom(k.spotify.playlists.special).then(()=>{this.spotify.PlayPlaylist(k.spotify.playlists.general,!0).then(()=>w(this,null,function*(){yield this.spotify.SkipSong();}));});}),this.firstNightfall=!1,!(this.state.Actions.length<=1&&this.state.Changes.filter(e=>!e.isApplied).length>0&&!(yield this.dialog.ShowConfirmDialog("Es sind noch nicht alle \xC4nderungen angewendet. M\xF6chtest du trotzdem fortfahren?")))&&this.state.nextAction();});}HandlePersonClicked(e){return w(this,null,function*(){this.dialog.ShowPersonDetailsDialog(e);});}GetFilteredPoints(e){return e.GetActions?.().filter(Boolean)??[];}GetFilteredButtons(e){return e.GetButtons?.()??[];}togglePlaybackState(){return w(this,null,function*(){this.spotify.PlaybackState?.is_playing?yield this.spotify.Pause():yield this.spotify.Resume(),yield this.spotify.UpdatePlaybackState();});}skipSong(){return w(this,null,function*(){yield this.spotify.SkipSong();});}get songTitle(){return this.spotify.PlaybackState?.item?.name??this.FallbackNotPlayingText;}get spotifySummary(){return this.spotify.CurrentDevice?.name+": "+this.songTitle;}goBack(){this.dialog.ShowConfirmDialog("Willst du wirklich das Spiel verlassen?").then(e=>{e&&this.router.navigate(["/setup"]);});}isRoleInGame(e){return this.state.SelectedCharacters.some(a=>a.Id===e);}getNextActions(){return this.state.Actions.slice(1);}openCharacterDetails(e){this.RedactCircle=!0,this.dialog.ShowCharacterDetailsDialog(e).finally(()=>{this.RedactCircle=!1;});}setEventMaximized(e){this.MobileShowSidebar=!e,this.AreEventsMaximized=e;}static{this.ɵfac=function(a){return new(a||t)();};}static{this.ɵcmp=z({type:t,selectors:[["app-narrator"]],decls:17,vars:17,consts:()=>{let e;e="Sitzreihenfolge \xE4ndern";let a;a="Charaktere";let i;i="Kreis";let T;T="\xDCbersicht";let P;P="Verbindungen:";let L;L="Liebe (Ehepaar)";let D;D="Vertrauen (Wildes Kind)";let V;V="Beischlaf (Dorfmatratze)";let B;B="Verbundenes Ger\xE4t:";let X;X="Kein Ger\xE4t ausgew\xE4hlt";let U;U="Ereignisse";let j;j="Weiter "+"\uFFFD#8\uFFFD"+""+"\uFFFD/#8\uFFFD"+"";let H;H=""+"\uFFFD#2\uFFFD"+""+"\uFFFD/#2\uFFFD"+" Zur\xFCck";let W;W="Weiter "+"\uFFFD#16\uFFFD"+""+"\uFFFD/#16\uFFFD"+"";let K;return K=""+"\uFFFD#2\uFFFD"+""+"\uFFFD/#2\uFFFD"+" Zur\xFCck",[i,T,P,L,D,V,B,X,j,H,W,K,[1,"grid","lg:grid-cols-[1fr_auto]","grid-rows-2","w-full","h-dvh"],[1,"w-full","h-dvh","px-20","max-lg:fixed","relative","content-center"],[3,"PeopleChange","PersonClick","People","Connections","IsEditMode"],[1,"absolute","top-6","left-6","z-0","bg-zinc-800","btn","flex","gap-4","items-center","!px-3"],[1,"absolute","top-6","right-6","z-0","bg-zinc-800","btn","flex","gap-4","items-center","!px-3",3,"click"],["size","20px","title",e,1,"text-zinc-200",3,"name"],[1,"absolute","bottom-6","left-6","z-0","bg-zinc-800","rounded-md","p-4","text-left","text-zinc-200"],[1,"lg:w-[30rem]","w-full","bg-zinc-800","h-dvh","grid","justify-between","max-h-dvh","z-20","overflow-y-auto","p-6","pb-0","max-lg:pt-27","gap-4"],[1,"block","max-lg:w-svw-no-m"],["title",a,3,"collapsedOnStart"],[1,"grid","grid-cols-2","gap-2","overflow-y-auto","max-h-auto"],[1,"bg-zinc-700","p-2","rounded-md","grid","grid-cols-[4rem_1fr]","gap-2","items-center","text-zinc-200"],[1,"pb-6","inline-flex"],[1,"fixed","top-0","left-0","w-dvw","h-dvh","bg-zinc-950/60","backdrop-blur-xs","z-50","flex","justify-center","items-center"],[1,"lg:hidden","w-full","h-23","fixed","z-30","top-0","left-0","flex","items-center","backdrop-blur-md","bg-zinc-900/50"],[1,"lg:hidden","w-60","h-11","fixed","z-30","top-6","left-1/2","bg-zinc-700","grid","grid-cols-2","p-1","-translate-x-1/2","rounded-full"],[1,"text-zinc-200","rounded-full",3,"click"],[1,"bg-zinc-700","btn","flex","gap-4","items-center","!px-3","ml-6",3,"click"],["name","arrow-left","size","20px",1,"text-zinc-200"],[1,"absolute","top-6","left-6","z-0","bg-zinc-800","btn","flex","gap-4","items-center","!px-3",3,"click"],[1,"flex","justify-between","items-center","pb-2"],[1,"flex","gap-2","items-center"],[1,"w-4","h-2","rounded-full",2,"background-color","red"],[1,"w-4","h-2","rounded-full",2,"background-color","orange"],[1,"w-4","h-2","rounded-full",2,"background-color","blue"],["title","Spotify",3,"collapsedOnStart","summary"],[1,"flex","justify-start","items-center","overflow-hidden"],[1,"text-zinc-300","whitespace-nowrap","overflow-hidden","text-ellipsis"],[1,"bg-zinc-700","grid","grid-cols-[1fr_auto_auto]","items-center","gap-2","p-2","pr-0","pl-4","rounded-xl","mt-2"],[1,"text-zinc-200","whitespace-nowrap","overflow-hidden","text-ellipsis"],[1,"bg-zinc-600","rounded-md","text-zinc-200","p-3","flex","justify-center","items-center",3,"click"],[3,"name"],[1,"bg-zinc-600","rounded-md","text-zinc-200","p-3","flex","justify-center","items-center","mr-2",3,"click"],["name","skip-forward"],[1,"border-zinc-700","my-4"],[1,"text-zinc-300","whitespace-nowrap","overflow-hidden","text-ellipsis","mr-4"],[1,"flex","items-center","py-2","px-4","rounded-full","bg-zinc-700","text-zinc-200"],[1,"ml-2"],[1,"bg-zinc-700","p-2","rounded-md","grid","grid-cols-[4rem_1fr]","gap-2","items-center","text-zinc-200",3,"click"],[1,"border-4","border-black","rounded","md-shadow-md","w-16","col-start-1","row-start-1","z-10"],[1,"w-16",3,"src","alt"],[1,"text-center"],[1,"border-4","border-zinc-800","rounded","md-shadow-md","w-16","h-16","col-start-1","row-start-1","rotate-3"],[1,"border-4","border-zinc-900","rounded","md-shadow-md","w-16","h-16","col-start-1","row-start-1","-rotate-6"],["title",U,1,"mt-auto","overflow-hidden","row-start-6",3,"secondIconPressedEvent","collapsedOnStart","secondIcon","summary","flipIcon"],[1,"grid","grid-cols-1","grid-rows-1","min-h-44","lg:w-[27rem]","max-lg:w-svw-no-m"],[1,"grid","grid-cols-3","gap-2","mt-4"],[1,"btn","bg-zinc-500","flex","gap-2","justify-center"],[1,"btn","bg-zinc-500","flex","gap-2","justify-center","col-span-2",3,"click"],["name","arrow-right"],[1,"rounded-2xl","col-start-1","row-start-1","bg-zinc-700","transform","rotate-2","-translate-y-1","max-lg:rotate-[0.7deg]","z-0"],[1,"rounded-2xl","col-start-1","row-start-1","bg-zinc-600","transform","-rotate-2","max-lg:-rotate-[0.8deg]","z-0"],[1,"p-4","rounded-2xl","col-start-1","row-start-1","bg-zinc-500","z-10"],[1,"grid","grid-cols-[1fr_auto]","gap-2"],[1,"text-xl","text-zinc-100"],[1,"list-disc","ml-4","text-zinc-200"],[1,"w-16","h-16","rounded-md","md-shadow-md",3,"src","alt"],[1,"flex","flex-col","gap-2","mt-4"],[1,"btn","bg-zinc-600","w-full"],[1,"btn","bg-zinc-600","w-full",3,"click"],[1,"btn","bg-zinc-500","flex","gap-2","justify-center",3,"click"],["name","arrow-left"],[1,"btn","text-zinc-700","fixed","top-8","right-8","bg-zinc-700","!px-3",3,"click"],["name","x","size","24px"],[1,"w-full","grid","grid-cols-[1fr_34rem_1fr]","gap-x-4","gap-y-2"],[1,"col-start-1","row-start-1","overflow-hidden","flex","flex-row-reverse"],[1,"flex","gap-2"],[1,"p-4","rounded-2xl","bg-zinc-700","min-w-120","h-40","self-center"],[1,"col-start-2","row-start-1","h-120","items-center","grid"],[1,"col-start-3","row-start-1","overflow-hidden","flex","gap-2"],[1,"grid","grid-cols-3","gap-2","mt-4","row-start-2","col-start-2"],[1,"text-xl","text-zinc-300"],[1,"list-disc","ml-4","text-zinc-400"],[1,"p-4","rounded-2xl","bg-zinc-500","min-h-40"],[1,"text-2xl","text-zinc-100"],[1,"list-disc","ml-4","text-lg","text-zinc-200"]];},template:function(a,i){a&1&&(o(0,"div",12),p(1,Ae,6,5),o(2,"div",13)(3,"app-circle",14),te("PeopleChange",function(P){return ee(i.state.People,P)||(i.state.People=P),P;}),d("PersonClick",function(P){return i.HandlePersonClicked(P);}),r(),p(4,Ce,2,0,"button",15),o(5,"button",16),d("click",function(){return i.IsEditingPlayers=!i.IsEditingPlayers;}),s(6,"lucide-angular",17),r(),p(7,Re,7,3,"button",18),r(),o(8,"div",19)(9,"div",20),p(10,xe,12,5),o(11,"app-sidebar-group",21)(12,"div",22),x(13,he,8,10,"button",23,E),r()()(),p(15,Fe,9,11,"div",24),r(),p(16,Ue,17,4,"div",25),r()),a&2&&(n(),_(i.IsEditingPlayers?-1:1),n(),h("blur-2xl",i.RedactCircle)("saturate-0",i.RedactCircle),n(),Y("People",i.state.People),C("Connections",i.state.Connections)("IsEditMode",i.IsEditingPlayers),n(),_(i.IsEditingPlayers?-1:4),n(2),C("name",i.IsEditingPlayers?"check":"user-pen"),n(),_(!i.IsEditingPlayers&&(i.isRoleInGame("cupid")||i.isRoleInGame("wild_child")||i.isRoleInGame("hoodrat"))?7:-1),n(),h("max-lg:hidden",!i.MobileShowSidebar),n(2),_(i.spotify.IsAuthenticated&&i.spotify.CurrentDevice?10:-1),n(),C("collapsedOnStart",!0),n(2),v(i.state.SelectedCharacters),n(2),_(i.AreEventsMaximized?-1:15),n(),_(i.AreEventsMaximized?16:-1));},dependencies:[se,ae,ie,$,G,_e],styles:["@media (width < 64rem){.max-lg\\:w-svw-no-m[_ngcontent-%COMP%]{width:calc(100svw - 3rem)}}"]});}}return t;})();export{st as NarratorComponent};/**i18n:4d237bd4a7924989e9147be91c316aeb32cdd902c29b123d66e18fd31eb96ec1*/