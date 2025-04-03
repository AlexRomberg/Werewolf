import{a as ft}from"./chunk-C2FAH6XM.js";import{a as dt,b as pt,c as _t,d as gt,e as mt,f as ut,g as Ct,h as le}from"./chunk-NIRXDNRY.js";import{a as O}from"./chunk-RQU36OCT.js";import{d as S,e as X,h as we,j as x}from"./chunk-MBABEOSW.js";import{A as He,B as Ke,C as Ze,D as Ye,E as Je,F as qe,G as Qe,H as et,I as tt,J as nt,K as it,L as ot,M as rt,N as at,O as lt,P as st,Q as ct,R as I,S as w,a as Oe,c as ae,d as Pe,e as Me,f as ye,h as Ae,i as xe,k as Ie,l as ve,m as be,n as Le,o as Re,p as ke,q as Ge,r as ze,s as $e,t as Ve,u as Fe,v as We,w as je,x as Xe,y as Ue,z as Be}from"./chunk-WBJZ5L5T.js";import{Aa as c,Bb as ie,Ca as De,Cb as oe,D as $,Eb as re,Fa as Ee,Ja as D,K as H,N as Ce,Oa as C,P as K,S as Q,Sa as Te,U as de,Ua as pe,V as _,X as ee,Ya as P,_a as Ne,a as ue,aa as g,ab as f,ba as m,bb as F,cb as W,db as j,eb as l,fa as te,fb as a,gb as p,h as J,ha as fe,hb as M,k as q,ka as ne,kb as u,nb as h,ob as s,s as B,ta as he,ub as E,vb as T,wa as Se,wb as b,xb as L,y as z,ya as V,yb as R,z as ce}from"./chunk-S6VIYWOS.js";var ht=()=>{let i=_(x),o=_(xe);return i.People.length>0&&i.SelectedCharacters.length>0&&i.InGame||re()?!0:(o.navigateByUrl("/setup"),!1);};var St=[{path:"",loadComponent:()=>import("./chunk-JPPPAUSL.js").then(i=>i.HomeComponent)},{path:"setup",loadComponent:()=>import("./chunk-ICKMDJGT.js").then(i=>i.SetupComponent)},{path:"cards",loadComponent:()=>import("./chunk-JJ2FBDVU.js").then(i=>i.CardsComponent)},{path:"narrator",loadComponent:()=>import("./chunk-EYTPXN3B.js").then(i=>i.NarratorComponent),canActivate:[ht]},{path:"spotify",loadComponent:()=>import("./chunk-BQCUAHHG.js").then(i=>i.ConnectingComponent)},{path:"spotify/success",loadComponent:()=>import("./chunk-CAN53H2J.js").then(i=>i.SuccessComponent)},{path:"**",pathMatch:"full",redirectTo:"/"}];var bt="@",Lt=(()=>{class i{doc;delegate;zone;animationType;moduleImpl;_rendererFactoryPromise=null;scheduler=null;injector=_(te);loadingSchedulerFn=_(Rt,{optional:!0});_engine;constructor(e,n,t,r,d){this.doc=e,this.delegate=n,this.zone=t,this.animationType=r,this.moduleImpl=d;}ngOnDestroy(){this._engine?.flush();}loadImpl(){let e=()=>this.moduleImpl??import("./chunk-ZQHVANQV.js").then(t=>t),n;return this.loadingSchedulerFn?n=this.loadingSchedulerFn(e):n=e(),n.catch(t=>{throw new Ce(5300,!1);}).then(({ɵcreateEngine:t,ɵAnimationRendererFactory:r})=>{this._engine=t(this.animationType,this.doc);let d=new r(this.delegate,this._engine,this.zone);return this.delegate=d,d;});}createRenderer(e,n){let t=this.delegate.createRenderer(e,n);if(t.ɵtype===0)return t;typeof t.throwOnSyntheticProps=="boolean"&&(t.throwOnSyntheticProps=!1);let r=new _e(t);return n?.data?.animation&&!this._rendererFactoryPromise&&(this._rendererFactoryPromise=this.loadImpl()),this._rendererFactoryPromise?.then(d=>{let N=d.createRenderer(e,n);r.use(N),this.scheduler??=this.injector.get(fe,null,{optional:!0}),this.scheduler?.notify(10);}).catch(d=>{r.use(t);}),r;}begin(){this.delegate.begin?.();}end(){this.delegate.end?.();}whenRenderingDone(){return this.delegate.whenRenderingDone?.()??Promise.resolve();}componentReplaced(e){this._engine?.flush(),this.delegate.componentReplaced?.(e);}static ɵfac=function(n){Ee();};static ɵprov=K({token:i,factory:i.ɵfac});}return i;})(),_e=class{delegate;replay=[];ɵtype=1;constructor(o){this.delegate=o;}use(o){if(this.delegate=o,this.replay!==null){for(let e of this.replay)e(o);this.replay=null;}}get data(){return this.delegate.data;}destroy(){this.replay=null,this.delegate.destroy();}createElement(o,e){return this.delegate.createElement(o,e);}createComment(o){return this.delegate.createComment(o);}createText(o){return this.delegate.createText(o);}get destroyNode(){return this.delegate.destroyNode;}appendChild(o,e){this.delegate.appendChild(o,e);}insertBefore(o,e,n,t){this.delegate.insertBefore(o,e,n,t);}removeChild(o,e,n){this.delegate.removeChild(o,e,n);}selectRootElement(o,e){return this.delegate.selectRootElement(o,e);}parentNode(o){return this.delegate.parentNode(o);}nextSibling(o){return this.delegate.nextSibling(o);}setAttribute(o,e,n,t){this.delegate.setAttribute(o,e,n,t);}removeAttribute(o,e,n){this.delegate.removeAttribute(o,e,n);}addClass(o,e){this.delegate.addClass(o,e);}removeClass(o,e){this.delegate.removeClass(o,e);}setStyle(o,e,n,t){this.delegate.setStyle(o,e,n,t);}removeStyle(o,e,n){this.delegate.removeStyle(o,e,n);}setProperty(o,e,n){this.shouldReplay(e)&&this.replay.push(t=>t.setProperty(o,e,n)),this.delegate.setProperty(o,e,n);}setValue(o,e){this.delegate.setValue(o,e);}listen(o,e,n,t){return this.shouldReplay(e)&&this.replay.push(r=>r.listen(o,e,n,t)),this.delegate.listen(o,e,n,t);}shouldReplay(o){return this.replay!==null&&o.startsWith(bt);}},Rt=new Q("");function Dt(i="animations"){return Se("NgAsyncAnimations"),ee([{provide:De,useFactory:(o,e,n)=>new Lt(o,e,n,i),deps:[Oe,Pe,ne]},{provide:he,useValue:i==="noop"?"NoopAnimations":"BrowserAnimations"}]);}var Et={ArrowLeft:ve,ArrowRight:be,CarFront:Le,Check:Re,ChevronDown:ke,ChevronUp:Ge,CircleUserRound:ze,CircleX:$e,Github:Ve,Globe:Fe,Heart:We,Laptop:je,LogIn:Xe,Maximize2:Ue,Minimize2:Be,Pause:He,Pen:Ke,Play:Ze,Plus:Ye,RefreshCw:Je,SkipForward:qe,Smartphone:Qe,Speaker:et,Tablet:tt,Trash2:nt,TriangleAlert:it,Tv:ot,UserPen:rt,UserRound:at,X:lt};var Z="Service workers are disabled or not supported by this browser",U=class{serviceWorker;worker;registration;events;constructor(o,e){if(this.serviceWorker=o,!o)this.worker=this.events=this.registration=new J(n=>n.error(new Error(Z)));else{let n=null,t=new q();this.worker=new J(y=>(n!==null&&y.next(n),t.subscribe(G=>y.next(G))));let r=()=>{let{controller:y}=o;y!==null&&(n=y,t.next(n));};o.addEventListener("controllerchange",r),r(),this.registration=this.worker.pipe(H(()=>o.getRegistration()));let d=new q();this.events=d.asObservable();let N=y=>{let{data:G}=y;G?.type&&d.next(G);};o.addEventListener("message",N),e?.get(pe,null,{optional:!0})?.onDestroy(()=>{o.removeEventListener("controllerchange",r),o.removeEventListener("message",N);});}}postMessage(o,e){return new Promise(n=>{this.worker.pipe($(1)).subscribe(t=>{t.postMessage(ue({action:o},e)),n();});});}postMessageWithOperation(o,e,n){let t=this.waitForOperationCompleted(n),r=this.postMessage(o,e);return Promise.all([r,t]).then(([,d])=>d);}generateNonce(){return Math.round(Math.random()*1e7);}eventsOfType(o){let e;return typeof o=="string"?e=n=>n.type===o:e=n=>o.includes(n.type),this.events.pipe(ce(e));}nextEventOfType(o){return this.eventsOfType(o).pipe($(1));}waitForOperationCompleted(o){return new Promise((e,n)=>{this.eventsOfType("OPERATION_COMPLETED").pipe(ce(t=>t.nonce===o),$(1),B(t=>{if(t.result!==void 0)return t.result;throw new Error(t.error);})).subscribe({next:e,error:n});});}get isEnabled(){return!!this.serviceWorker;}},kt=(()=>{class i{sw;messages;notificationClicks;subscription;get isEnabled(){return this.sw.isEnabled;}pushManager=null;subscriptionChanges=new q();constructor(e){if(this.sw=e,!e.isEnabled){this.messages=z,this.notificationClicks=z,this.subscription=z;return;}this.messages=this.sw.eventsOfType("PUSH").pipe(B(t=>t.data)),this.notificationClicks=this.sw.eventsOfType("NOTIFICATION_CLICK").pipe(B(t=>t.data)),this.pushManager=this.sw.registration.pipe(B(t=>t.pushManager));let n=this.pushManager.pipe(H(t=>t.getSubscription()));this.subscription=new J(t=>{let r=n.subscribe(t),d=this.subscriptionChanges.subscribe(t);return()=>{r.unsubscribe(),d.unsubscribe();};});}requestSubscription(e){if(!this.sw.isEnabled||this.pushManager===null)return Promise.reject(new Error(Z));let n={userVisibleOnly:!0},t=this.decodeBase64(e.serverPublicKey.replace(/_/g,"/").replace(/-/g,"+")),r=new Uint8Array(new ArrayBuffer(t.length));for(let d=0;d<t.length;d++)r[d]=t.charCodeAt(d);return n.applicationServerKey=r,new Promise((d,N)=>{this.pushManager.pipe(H(v=>v.subscribe(n)),$(1)).subscribe({next:v=>{this.subscriptionChanges.next(v),d(v);},error:N});});}unsubscribe(){if(!this.sw.isEnabled)return Promise.reject(new Error(Z));let e=n=>{if(n===null)throw new Error("Not subscribed to push notifications.");return n.unsubscribe().then(t=>{if(!t)throw new Error("Unsubscribe failed!");this.subscriptionChanges.next(null);});};return new Promise((n,t)=>{this.subscription.pipe($(1),H(e)).subscribe({next:n,error:t});});}decodeBase64(e){return atob(e);}static ɵfac=function(n){return new(n||i)(de(U));};static ɵprov=K({token:i,factory:i.ɵfac});}return i;})(),Gt=(()=>{class i{sw;versionUpdates;unrecoverable;get isEnabled(){return this.sw.isEnabled;}constructor(e){if(this.sw=e,!e.isEnabled){this.versionUpdates=z,this.unrecoverable=z;return;}this.versionUpdates=this.sw.eventsOfType(["VERSION_DETECTED","VERSION_INSTALLATION_FAILED","VERSION_READY","NO_NEW_VERSION_DETECTED"]),this.unrecoverable=this.sw.eventsOfType("UNRECOVERABLE_STATE");}checkForUpdate(){if(!this.sw.isEnabled)return Promise.reject(new Error(Z));let e=this.sw.generateNonce();return this.sw.postMessageWithOperation("CHECK_FOR_UPDATES",{nonce:e},e);}activateUpdate(){if(!this.sw.isEnabled)return Promise.reject(new Error(Z));let e=this.sw.generateNonce();return this.sw.postMessageWithOperation("ACTIVATE_UPDATE",{nonce:e},e);}static ɵfac=function(n){return new(n||i)(de(U));};static ɵprov=K({token:i,factory:i.ɵfac});}return i;})();var Nt=new Q("");function zt(){let i=_(Y);if(!("serviceWorker"in navigator&&i.enabled!==!1))return;let o=_(Nt),e=_(ne),n=_(pe);e.runOutsideAngular(()=>{let t=navigator.serviceWorker,r=()=>t.controller?.postMessage({action:"INITIALIZE"});t.addEventListener("controllerchange",r),n.onDestroy(()=>{t.removeEventListener("controllerchange",r);});}),e.runOutsideAngular(()=>{let t,{registrationStrategy:r}=i;if(typeof r=="function")t=new Promise(d=>r().subscribe(()=>d()));else{let[d,...N]=(r||"registerWhenStable:30000").split(":");switch(d){case"registerImmediately":t=Promise.resolve();break;case"registerWithDelay":t=Tt(+N[0]||0);break;case"registerWhenStable":t=Promise.race([n.whenStable(),Tt(+N[0])]);break;default:throw new Error(`Unknown ServiceWorker registration strategy: ${i.registrationStrategy}`);}}t.then(()=>navigator.serviceWorker.register(o,{scope:i.scope}).catch(d=>console.error("Service worker registration failed with:",d)));});}function Tt(i){return new Promise(o=>setTimeout(o,i));}function $t(i,o){return new U(i.enabled!==!1?navigator.serviceWorker:void 0,o);}var Y=class{enabled;scope;registrationStrategy;};function Ot(i,o={}){return ee([kt,Gt,{provide:Nt,useValue:i},{provide:Y,useValue:o},{provide:U,useFactory:$t,deps:[Y,te]},Te(zt)]);}var Pt={providers:[Ie(St),ye(),{provide:st,multi:!0,useValue:new ct(Et)},Dt(),Ot("ngsw-worker.js",{enabled:!re(),registrationStrategy:"registerWhenStable:30000"})]};function Vt(i,o){if(i&1){let e=M();l(0,"div",2)(1,"span",3)(2,"h1",4),E(3),a(),l(4,"button",5),h("click",function(){g(e);let t=s();return m(t.Dialog.RejectDialog());}),p(5,"lucide-angular",6),a()(),l(6,"div",7)(7,"app-circle",8),h("PersonClick",function(t){g(e);let r=s();return m(r.OnPersonSelected(t));}),a()(),l(8,"span",9)(9,"button",10),h("click",function(){g(e);let t=s();return m(t.Dialog.RejectDialog());}),u(10,0),a(),l(11,"button",11),h("click",function(){g(e);let t=s();return m(t.ConfirmDialog());}),u(12,1),a()()();}if(i&2){let e=s();c(3),T(e.Dialog.DialogData.data.title),c(4),P("People",e.Dialog.DialogData.data.people),c(4),Ne("bg-zinc-600",!e.PeopleDialogSelectionValid()),P("disabled",!e.PeopleDialogSelectionValid());}}var Mt=(()=>{class i{constructor(){this.Dialog=_(O),this.GameState=_(x),this.DialogTypes=S;}OnPersonSelected(e){this.Dialog.DialogData?.type===S.PeopleSelection&&this.Dialog.DialogData.data.numberOfPeople===1&&this.Dialog.DialogData.data.people.forEach(n=>n.IsProtected=!1),e.IsProtected=!e.IsProtected;}PeopleDialogSelectionValid(){if(this.Dialog.DialogData?.type!==S.PeopleSelection||!this.Dialog.DialogData.data.numberOfPeople)return!0;let e=this.Dialog.DialogData.data.people.filter(n=>n.IsProtected);return this.Dialog.DialogData.data.numberOfPeople===e.length;}ConfirmDialog(){this.Dialog.DialogData?.type===S.PeopleSelection&&this.Dialog.ConfirmDialog(this.Dialog.DialogData.data.people.filter(e=>e.IsProtected));}static{this.ɵfac=function(n){return new(n||i)();};}static{this.ɵcmp=D({type:i,selectors:[["app-people-selection"]],decls:1,vars:1,consts:()=>{let e;e="Abbrechen";let n;return n="Ok",[e,n,[1,"bg-zinc-800","p-4","rounded-2xl","grid","grid-rows-[auto_1fr_auto]","gap-2","max-h-[calc(100dvh_-_var(--spacing)_*_14)]"],[1,"grid","grid-cols-[1fr_auto]"],[1,"text-zinc-200","text-2xl"],[1,"btn","!px-3",3,"click"],["name","x"],[1,"self-center","bg-zinc-900","grid","h-full","rounded-lg","dialog-svg"],[3,"PersonClick","People"],[1,"grid","grid-cols-2","gap-2"],[1,"text-zinc-200","bg-zinc-500","w-full","btn",3,"click"],[1,"text-zinc-200","bg-zinc-500","w-full","btn",3,"click","disabled"]];},template:function(n,t){n&1&&C(0,Vt,13,5,"div",2),n&2&&f(t.Dialog.DialogData&&t.Dialog.DialogData.type===t.DialogTypes.PeopleSelection?0:-1);},dependencies:[ft,w,I],styles:[`[_nghost-%COMP%]{margin-inline:auto;display:block;height:100dvh;width:100dvw;max-width:calc(var(--spacing, .25rem) * 240);padding:calc(var(--spacing, .25rem) * 8)}

`]});}}return i;})();function Ft(i,o){if(i&1&&(l(0,"span",13),p(1,"img",40),a()),i&2){let e=s(2);c(),P("src","img/"+e.Dialog.DialogData.data.person.Character.Id+".png",V);}}function Wt(i,o){i&1&&(l(0,"span",13),p(1,"lucide-angular",41),a());}function jt(i,o){if(i&1&&(l(0,"option",26),E(1),ie(2,"i18nSelect"),a()),i&2){let e=o.$implicit,n=s(2);P("ngValue",e),c(),T(oe(2,2,e.Id,n.NAME_TRANSLATIONS));}}function Xt(i,o){if(i&1){let e=M();l(0,"div",10)(1,"span",11)(2,"div",12),C(3,Ft,2,1,"span",13)(4,Wt,2,0,"span",13),a()(),l(5,"span",14)(6,"button",15),h("click",function(){g(e);let t=s();return m(t.Dialog.ConfirmDialog());}),p(7,"lucide-angular",16),a()(),l(8,"div",17)(9,"span",18)(10,"h1",19),u(11,0),a(),p(12,"hr",20),a(),l(13,"div",21)(14,"label",22),u(15,1),a(),l(16,"input",23),R("ngModelChange",function(t){g(e);let r=s();return L(r.Dialog.DialogData.data.person.Name,t)||(r.Dialog.DialogData.data.person.Name=t),m(t);}),h("keydown.enter",function(){g(e);let t=s();return m(t.Dialog.ConfirmDialog());}),a(),l(17,"label",24),u(18,2),a(),l(19,"select",25),R("ngModelChange",function(t){g(e);let r=s();return L(r.Dialog.DialogData.data.person.Character,t)||(r.Dialog.DialogData.data.person.Character=t),m(t);}),l(20,"option",26),u(21,3),a(),W(22,jt,3,5,"option",26,F),a()(),l(24,"span",18)(25,"h1",19),u(26,4),a(),p(27,"hr",20),a(),l(28,"div",27)(29,"span",28)(30,"input",29),R("ngModelChange",function(t){g(e);let r=s();return L(r.Dialog.DialogData.data.person.IsProtected,t)||(r.Dialog.DialogData.data.person.IsProtected=t),m(t);}),a(),l(31,"label",30),u(32,5),a()(),l(33,"span",31)(34,"input",32),R("ngModelChange",function(t){g(e);let r=s();return L(r.Dialog.DialogData.data.person.IsVictim,t)||(r.Dialog.DialogData.data.person.IsVictim=t),m(t);}),a(),l(35,"label",33),u(36,6),a()(),l(37,"span",28)(38,"input",34),R("ngModelChange",function(t){g(e);let r=s();return L(r.Dialog.DialogData.data.person.IsEnchanted,t)||(r.Dialog.DialogData.data.person.IsEnchanted=t),m(t);}),a(),l(39,"label",35),u(40,7),a()(),l(41,"span",31)(42,"input",36),R("ngModelChange",function(t){g(e);let r=s();return L(r.Dialog.DialogData.data.person.IsWerewolf,t)||(r.Dialog.DialogData.data.person.IsWerewolf=t),m(t);}),a(),l(43,"label",37),u(44,8),a()(),l(45,"span",28)(46,"input",38),R("ngModelChange",function(t){g(e);let r=s();return L(r.Dialog.DialogData.data.person.IsDead,t)||(r.Dialog.DialogData.data.person.IsDead=t),m(t);}),a(),l(47,"label",39),u(48,9),a()()()()();}if(i&2){let e=s();c(3),f(e.Dialog.DialogData.data.person.Character?3:4),c(13),b("ngModel",e.Dialog.DialogData.data.person.Name),c(3),b("ngModel",e.Dialog.DialogData.data.person.Character),c(),P("ngValue",void 0),c(2),j(e.GameState.SelectedCharacters),c(8),b("ngModel",e.Dialog.DialogData.data.person.IsProtected),c(4),b("ngModel",e.Dialog.DialogData.data.person.IsVictim),c(4),b("ngModel",e.Dialog.DialogData.data.person.IsEnchanted),c(4),b("ngModel",e.Dialog.DialogData.data.person.IsWerewolf),c(4),b("ngModel",e.Dialog.DialogData.data.person.IsDead);}}var yt=(()=>{class i{constructor(){this.Dialog=_(O),this.GameState=_(x),this.NAME_TRANSLATIONS=X,this.DialogTypes=S;}static{this.ɵfac=function(n){return new(n||i)();};}static{this.ɵcmp=D({type:i,selectors:[["app-person-details"]],decls:1,vars:1,consts:()=>{let e;e="Unbenannt";let n;n="Informationen zum Spieler";let t;t="Name";let r;r="Funktion";let d;d="Unbekannt";let N;N="Zustand";let v;v="Gesch\xFCtzt";let y;y="Wolfs- / Hexenopfer";let G;G="Verzaubert";let ge;ge="Werwolf (Infiziert / Wildes Kind ohne Vorbild)";let me;return me="Tot",[n,t,r,d,N,v,y,G,ge,me,[1,"bg-zinc-800","py-4","rounded-2xl","grid","grid-rows-[auto_1fr_auto]","max-h-[calc(100dvh_-_var(--spacing)_*_14)]","mt-32"],[1,"flex","justify-center","relative"],[1,"absolute","w-40","h-40","-top-24","rounded-full","bg-zinc-700","grid","grid-cols-1","grid-rows-1","justify-center","items-center","overflow-hidden"],[1,"text-zinc-200","mx-auto"],[1,"flex","mb-10","px-4"],[1,"ml-auto","btn","!px-3",3,"click"],["name","x"],[1,"flex","flex-col","gap-2"],[1,"flex","items-center","gap-4","px-4"],[1,"text-zinc-200","text-xl"],[1,"flex-grow","border-zinc-600"],[1,"flex","flex-col","overflow-auto","px-4"],["for","name",1,"text-zinc-200"],["type","text","placeholder",e,"name","name","id","name","autocomplete","off",1,"rounded-md","py-3","px-6","text-zinc-100","bg-zinc-500","mb-2",3,"ngModelChange","keydown.enter","ngModel"],["for","function",1,"text-zinc-200"],["name","function","id","function",1,"rounded-md","py-3","px-6","text-zinc-100","bg-zinc-500",3,"ngModelChange","ngModel"],[1,"text-zinc-100","bg-zinc-500",3,"ngValue"],[1,"grid","grid-rows-5","px-4"],[1,"grid","grid-cols-[auto_1fr]","bg-zinc-700","rounded-md"],["type","checkbox","id","protected",1,"m-2","w-6","h-6",2,"accent-color","orange",3,"ngModelChange","ngModel"],["for","protected",1,"py-2","text-zinc-200"],[1,"grid","grid-cols-[auto_1fr]"],["type","checkbox","id","victim",1,"m-2","w-6","h-6",2,"accent-color","red",3,"ngModelChange","ngModel"],["for","victim",1,"py-2","text-zinc-200"],["type","checkbox","id","enchanted",1,"m-2","w-6","h-6",2,"accent-color","deepPink",3,"ngModelChange","ngModel"],["for","enchanted",1,"py-2","text-zinc-200"],["type","checkbox","id","werewolf",1,"m-2","w-6","h-6",2,"accent-color","black",3,"ngModelChange","ngModel"],["for","werewolf",1,"py-2","text-zinc-200"],["type","checkbox","id","dead",1,"m-2","w-6","h-6","accent-red-800",3,"ngModelChange","ngModel"],["for","dead",1,"py-2","text-zinc-200"],[1,"w-40","h-40",3,"src"],["name","user-round","size","80"]];},template:function(n,t){n&1&&C(0,Xt,49,9,"div",10),n&2&&f(t.Dialog.DialogData&&t.Dialog.DialogData.type===t.DialogTypes.PersonDetails?0:-1);},dependencies:[le,ut,Ct,pt,dt,mt,_t,gt,ae,w,I],styles:[`[_nghost-%COMP%]{margin-inline:auto;display:block;height:100dvh;width:100dvw;max-width:calc(var(--spacing, .25rem) * 240);padding:calc(var(--spacing, .25rem) * 8)}

`]});}}return i;})();function Ut(i,o){if(i&1){let e=M();l(0,"div",2)(1,"span",3),p(2,"lucide-angular",4),l(3,"h1",5),E(4),a()(),l(5,"span",6)(6,"button",7),h("click",function(){g(e);let t=s();return m(t.Dialog.ConfirmDialog(!1));}),u(7,0),a(),l(8,"button",8),h("click",function(){g(e);let t=s();return m(t.Dialog.ConfirmDialog(!0));}),u(9,1),a()()();}if(i&2){let e=s();c(4),T(e.Dialog.DialogData.data.title);}}var At=(()=>{class i{constructor(){this.Dialog=_(O),this.GameState=_(x),this.NAME_TRANSLATIONS=X,this.DialogTypes=S;}static{this.ɵfac=function(n){return new(n||i)();};}static{this.ɵcmp=D({type:i,selectors:[["app-confirm-dialog"]],decls:1,vars:1,consts:()=>{let e;e="Nein";let n;return n="Ja",[e,n,[1,"bg-zinc-800","p-4","rounded-2xl","grid","gap-2","max-h-[calc(100dvh_-_var(--spacing)_*_14)]","mt-[30dvh]","mx-auto","w-fit"],[1,"grid","grid-cols-[auto_1fr]","items-center","gap-4","mr-16"],["name","triangle-alert","size","30",1,"text-zinc-200"],[1,"text-zinc-200","text-lg"],[1,"flex","gap-2","mt-4"],[1,"w-24","bg-zinc-700","btn","ml-auto",3,"click"],[1,"w-24","bg-zinc-700","btn",3,"click"]];},template:function(n,t){n&1&&C(0,Ut,10,1,"div",2),n&2&&f(t.Dialog.DialogData&&t.Dialog.DialogData.type===t.DialogTypes.Confirm?0:-1);},dependencies:[w,I],styles:[`[_nghost-%COMP%]{margin-inline:auto;display:block;height:100dvh;width:100dvw;max-width:calc(var(--spacing, .25rem) * 240);align-items:center;padding:calc(var(--spacing, .25rem) * 8)}

`]});}}return i;})();function Bt(i,o){if(i&1&&(l(0,"div",11)(1,"p",12),E(2),a(),l(3,"p",13),E(4),a()()),i&2){let e=o.$implicit;c(2),T(e.title),c(2),T(e.description);}}function Ht(i,o){if(i&1){let e=M();l(0,"div",0)(1,"span",1)(2,"div",2),p(3,"img",3),a()(),l(4,"span",4)(5,"button",5),h("click",function(){g(e);let t=s();return m(t.Dialog.ConfirmDialog());}),p(6,"lucide-angular",6),a()(),l(7,"div",7)(8,"span",8)(9,"h1",9),E(10),ie(11,"i18nSelect"),a(),p(12,"hr",10),a(),W(13,Bt,5,2,"div",11,F),a()();}if(i&2){let e=s();c(3),P("src","img/"+e.Dialog.DialogData.data.character.Id+".png",V),c(7),T(oe(11,2,e.Dialog.DialogData.data.character.Id,e.NAME_TRANSLATIONS)),c(3),j(e.Dialog.DialogData.data.character.Description);}}var xt=(()=>{class i{constructor(){this.Dialog=_(O),this.GameState=_(x),this.NAME_TRANSLATIONS=X,this.DialogTypes=S;}static{this.ɵfac=function(n){return new(n||i)();};}static{this.ɵcmp=D({type:i,selectors:[["app-character-details"]],decls:1,vars:1,consts:[[1,"bg-zinc-800","py-4","rounded-2xl","grid","grid-rows-[auto_auto_1fr]","max-h-[calc(100dvh_-_var(--spacing)_*_46)]","mt-32"],[1,"flex","justify-center","relative"],[1,"absolute","w-42","h-42","-top-24","rounded-full","grid","grid-cols-1","grid-rows-1","justify-center","items-center","overflow-hidden","p-2","bg-black"],[1,"w-38","h-38","rounded-full",3,"src"],[1,"flex","mb-10","px-4"],[1,"ml-auto","btn","!px-3",3,"click"],["name","x"],[1,"flex","flex-col","gap-2","overflow-auto"],[1,"flex","items-center","gap-4","px-4"],[1,"text-zinc-200","text-xl"],[1,"flex-grow","border-zinc-600"],[1,"grid","sm:grid-cols-[12rem_1fr]","grid-cols-1","gap-x-4","px-4"],[1,"text-zinc-200","font-bold"],[1,"text-zinc-200"]],template:function(n,t){n&1&&C(0,Ht,15,5,"div",0),n&2&&f(t.Dialog.DialogData&&t.Dialog.DialogData.type===t.DialogTypes.CharacterDetails?0:-1);},dependencies:[le,ae,w,I],styles:[`[_nghost-%COMP%]{margin-inline:auto;display:block;height:100dvh;width:100dvw;max-width:calc(var(--spacing, .25rem) * 240);padding:calc(var(--spacing, .25rem) * 8)}

`]});}}return i;})();function Kt(i,o){if(i&1&&(l(0,"span",11),p(1,"img",14),a()),i&2){let e=s().$implicit;c(),P("src","img/"+e.person.Character.Id+".png",V);}}function Zt(i,o){i&1&&(l(0,"span",11),p(1,"lucide-angular",15),a());}function Yt(i,o){if(i&1){let e=M();l(0,"button",16),h("click",function(){g(e);let t=s().$implicit,r=s(2);return m(r.applyChange(t));}),p(1,"lucide-icon",17),l(2,"p"),u(3,1),a()();}}function Jt(i,o){i&1&&p(0,"div");}function qt(i,o){if(i&1&&(l(0,"div",8)(1,"div",9)(2,"div",10),C(3,Kt,2,1,"span",11)(4,Zt,2,0,"span",11),a(),l(5,"p"),E(6),a()(),p(7,"lucide-icon",12),l(8,"p"),E(9),a()(),C(10,Yt,4,0,"button",13)(11,Jt,1,0,"div")),i&2){let e=o.$implicit,n=s(2);c(3),f(e.person.Character?3:4),c(3),T(n.getChangeUser(e)),c(3),T(n.getChangeDescription(e)),c(),f(e.isApplied?11:10);}}function Qt(i,o){if(i&1){let e=M();l(0,"div",2)(1,"span",3)(2,"h1",4),u(3,0),a(),l(4,"button",5),h("click",function(){g(e);let t=s();return m(t.Dialog.RejectDialog());}),p(5,"lucide-angular",6),a()(),l(6,"div",7),W(7,qt,12,4,null,null,F),a()();}if(i&2){let e=s();c(7),j(e.Dialog.DialogData.data);}}var It=(()=>{class i{constructor(){this.Dialog=_(O),this.DialogTypes=S,this.getFilteredChanges=e=>e.filter(n=>!n.isApplied),this.getChangeUser=e=>e.person.Name||"Unbenannter Spieler",this.getChangeDescription=e=>we[e.reason],this.applyChange=e=>{e.apply(),e.isApplied=!0;};}static{this.ɵfac=function(n){return new(n||i)();};}static{this.ɵcmp=D({type:i,selectors:[["app-changes"]],decls:1,vars:1,consts:()=>{let e;e="\xC4nderungen";let n;return n="\xDCbernehmen",[e,n,[1,"bg-zinc-800","p-4","rounded-2xl","grid","grid-rows-[auto_1fr_auto]","gap-2","max-h-[calc(100dvh_-_var(--spacing)_*_14)]"],[1,"grid","grid-cols-[1fr_auto]"],[1,"text-zinc-200","text-2xl"],[1,"btn","!px-3",3,"click"],["name","x"],[1,"grid","max-md:grid-cols-[1fr]","grid-cols-[1fr_auto]","gap-2","items-center"],[1,"text-zinc-200","grid","grid-cols-[auto_auto_1fr]","gap-2","items-center"],[1,"flex","gap-4","p-2","pr-6","h-16","bg-zinc-700","rounded-full","items-center"],[1,"w-12","h-12","rounded-full","bg-zinc-600","grid","grid-cols-1","grid-rows-1","justify-center","items-center","overflow-hidden"],[1,"text-zinc-200","mx-auto"],["name","arrow-right","size","20",1,"text-zinc-200"],[1,"btn","flex","items-center","bg-green-600","gap-2","justify-center","max-md:mb-2"],[1,"w-12","h-12",3,"src"],["name","user-round","size","30"],[1,"btn","flex","items-center","bg-green-600","gap-2","justify-center","max-md:mb-2",3,"click"],["name","check","size","20",1,"text-zinc-200"]];},template:function(n,t){n&1&&C(0,Qt,9,0,"div",2),n&2&&f(t.Dialog.DialogData&&t.Dialog.DialogData.type===t.DialogTypes.Changes?0:-1);},dependencies:[w,I],styles:[`[_nghost-%COMP%]{margin-inline:auto;display:block;height:100dvh;width:100dvw;max-width:calc(var(--spacing, .25rem) * 240);align-items:center;padding:calc(var(--spacing, .25rem) * 8)}

`]});}}return i;})();function en(i,o){i&1&&p(0,"app-people-selection");}function tn(i,o){i&1&&p(0,"app-person-details");}function nn(i,o){i&1&&p(0,"app-character-details");}function on(i,o){i&1&&p(0,"app-confirm-dialog");}function rn(i,o){i&1&&p(0,"app-changes");}function an(i,o){if(i&1&&(l(0,"div",0),C(1,en,1,0,"app-people-selection")(2,tn,1,0,"app-person-details")(3,nn,1,0,"app-character-details")(4,on,1,0,"app-confirm-dialog")(5,rn,1,0,"app-changes"),a()),i&2){let e,n=s();c(),f((e=n.Dialog.DialogData.type)===n.DialogTypes.PeopleSelection?1:e===n.DialogTypes.PersonDetails?2:e===n.DialogTypes.CharacterDetails?3:e===n.DialogTypes.Confirm?4:e===n.DialogTypes.Changes?5:-1);}}var wt=(()=>{class i{constructor(){this.Dialog=_(O),this.DialogTypes=S;}static{this.ɵfac=function(n){return new(n||i)();};}static{this.ɵcmp=D({type:i,selectors:[["app-dialog"]],decls:1,vars:1,consts:[[1,"fixed","top-0","left-0","w-dvw","h-dvh","bg-zinc-950/60","backdrop-blur-xs","z-100"]],template:function(n,t){n&1&&C(0,an,6,1,"div",0),n&2&&f(t.Dialog.DialogData?0:-1);},dependencies:[Mt,yt,xt,At,It],encapsulation:2});}}return i;})();var vt=(()=>{class i{constructor(){this.Title="wolf";}static{this.ɵfac=function(n){return new(n||i)();};}static{this.ɵcmp=D({type:i,selectors:[["app-root"]],decls:2,vars:0,template:function(n,t){n&1&&p(0,"router-outlet")(1,"app-dialog");},dependencies:[Ae,wt],styles:[`[_nghost-%COMP%]{display:block}

`]});}}return i;})();Me(vt,Pt).catch(i=>console.error(i));/**i18n:4d237bd4a7924989e9147be91c316aeb32cdd902c29b123d66e18fd31eb96ec1*/