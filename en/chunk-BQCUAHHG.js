import{a as A}from"./chunk-BUA5GIRK.js";import"./chunk-MBABEOSW.js";import{R as O,S as P,g as E,i as S,j as p}from"./chunk-WBJZ5L5T.js";import{Ja as g,Oa as C,Pa as N,V as r,Va as d,Wa as f,e as u,eb as t,fb as i,gb as c,ib as T,jb as m,kb as _}from"./chunk-S6VIYWOS.js";var I=()=>[p,O];function F(e,G){e&1&&(t(0,"div",6),c(1,"lucide-angular",7),i(),t(2,"h1",8),_(3,0),i(),t(4,"p",9),_(5,1),i(),t(6,"a",10),T(7,2),c(8,"lucide-angular",11),m(),i());}function M(e,G){e&1&&(t(0,"h1",8),_(1,3),i());}var D=(()=>{class e{constructor(){this.Spotify=r(A),this.Route=r(E),this.Router=r(S);}ngOnInit(){this.routeParamsSubscription=this.Route.queryParamMap.subscribe(o=>u(this,null,function*(){o.get("code")&&(yield this.Spotify.UpdateAuthenticationState())&&this.Router.navigate(["/spotify/success"]);}));}ngOnDestroy(){this.routeParamsSubscription?.unsubscribe();}static{this.ɵfac=function(n){return new(n||e)();};}static{this.ɵcmp=g({type:e,selectors:[["app-connecting"]],decls:6,vars:0,consts:()=>{let o;o="Something went wrong.";let n;n="Try again";let l;l=""+"\uFFFD#8\uFFFD"+""+"\uFFFD/#8\uFFFD"+" Back to overview";let s;return s="Connecting to Spotify ...",[o,n,l,s,[3e3],[1,"w-full","h-dvh","flex","justify-center","items-center"],[1,"w-full","flex","justify-center","items-center","mb-4"],["name","circle-x","size","32",1,"mx-auto","text-zinc-200"],[1,"text-center","text-zinc-200","text-2xl"],[1,"text-center","text-zinc-400"],["routerLink","/setup",1,"btn","bg-zinc-500","mt-8","text-center","flex"],["name","arrow-left",1,"mr-2"]];},template:function(n,l){n&1&&(t(0,"div",5)(1,"div"),C(2,F,9,0)(3,M,2,0),d(4,2,I,null,3,null,null,4,N),f(),i()());},dependencies:[P],encapsulation:2});}}return e;})();export{D as ConnectingComponent};/**i18n:4d237bd4a7924989e9147be91c316aeb32cdd902c29b123d66e18fd31eb96ec1*/