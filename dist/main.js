(()=>{"use strict";var t={d:(i,e)=>{for(var o in e)t.o(e,o)&&!t.o(i,o)&&Object.defineProperty(i,o,{enumerable:!0,get:e[o]})},o:(t,i)=>Object.prototype.hasOwnProperty.call(t,i)};function i(t,i){return Math.floor(Math.random()*(i-t+1))+t}function e(t,i){return Math.random()*(i-t+1)+t}t.d({},{J:()=>r});var o={x:0,y:.2},h=function(){function t(t,e,o,h){this.update=function(){this.rocket||(this.vy*=.95,this.vx*=.95,this.lifespan-=2),this.lifespan<0&&(this.lifespan=0),this.vx+=this.ax,this.vy+=this.ay,this.x+=this.vx,this.y+=this.vy,this.ax=0,this.ay=0},this.draw=function(t){t.globalAlpha=this.lifespan/255,t.beginPath(),t.fillStyle=this.color,t.arc(this.x,this.y,this.size,0,2*Math.PI),t.fill(),t.closePath(),t.globalAlpha=1},this.x=t,this.y=e,this.vx=0,this.rocket=h,this.lifespan=255,h?(this.vy=i(-15,-7),this.size=5):(this.vy=0,this.size=i(1,3)),this.ax=0,this.ay=0,this.color=o}return t.prototype.applyForce=function(t){this.ax+=t.x,this.ay+=t.y},t}();const n=h;const a=function(t,h,a){this.update=function(){this.exploded||(this.rocket.applyForce(o),this.rocket.update(),this.rocket.vy>0&&(this.exploded=!0,this.explode()));for(var t=this.particles.length-1;t>=0;t--){var i=this.particles[t];i.applyForce(o),i.update(),i.lifespan<0&&this.particles.splice(t,1)}},this.done=function(){return 0===this.particles.length&&this.exploded},this.explode=function(){for(var t=0;t<i(500,1e3);t++){var o=new n(this.rocket.x,this.rocket.y,this.rocket.color),h=(void 0,a=e(0,2*Math.PI),{x:Math.cos(a),y:Math.sin(a)});h.x*=e(-10,10),h.y*=e(-10,10),o.applyForce(h),this.particles.push(o)}var a},this.draw=function(t){this.exploded||this.rocket.draw(t);for(var i=0,e=this.particles;i<e.length;i++)e[i].draw(t)},this.rocket=void 0===h?new n(i(0,r.width),r.height,t,!0):new n(h,a,t,!0),this.exploded=!1,this.particles=[]};var r=document.getElementById("canvas"),s=r.getContext("2d"),l=document.createElement("p");document.body.appendChild(l);var c,d=Date.now(),p=1e3/60,f=0,u=[];function y(){Math.random()<.01&&u.push(new a("rgb(\n        ".concat(Math.floor(255*Math.random()),",\n        ").concat(Math.floor(255*Math.random()),",\n        0)")));for(var t=u.length-1;t>=0;t--)u[t].update(),u[t].done()&&u.splice(t,1)}r.width=window.innerWidth-100,r.height=window.innerHeight-100,s.fillStyle="white",s.fillRect(0,0,r.width,r.height),function t(){requestAnimationFrame(t);var i=Date.now(),e=i-d;for(d=i,f+=e;f>=p;)y(),f-=p;!function(){s.fillStyle="white",s.strokeStyle="black",s.fillRect(0,0,r.width,r.height);for(var t=u.length-1;t>=0;t--)u[t].draw(s)}(),c=Math.floor(1e3/e),l.innerHTML="ms: "+e+" fps: "+c,l.innerHTML+=" lag: "+Math.floor(f)}(),r.addEventListener("mousedown",(function(t){var i=function(t,i){var e=t.getBoundingClientRect();return{x:i.clientX-e.left,y:i.clientY-e.top}}(r,t);u.push(new a("rgb(".concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),",").concat(Math.floor(255*Math.random()),")"),i.x,i.y))}))})();