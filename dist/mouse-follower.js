!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MouseFollower=e():t.MouseFollower=e()}(this,(function(){return function(){"use strict";var t={d:function(e,i){for(var s in i)t.o(i,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:i[s]})},o:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}},e={};t.d(e,{default:function(){return i}});
/*!
 * Cuberto Mouse Follower
 *
 * @version 1.0.1
 * @author Cuberto | Artem Dordzhiev (Draft)
 */
var i=function(){function t(e){this.gsap=t.gsap,this.options=Object.assign({},{el:null,container:document.body,className:"mf-cursor",innerClassName:"mf-cursor-inner",textClassName:"mf-cursor-text",mediaClassName:"mf-cursor-media",mediaBoxClassName:"mf-cursor-media-box",iconSvgClassName:"mf-svgsprite",iconSvgNamePrefix:"-",iconSvgSrc:"",dataAttr:"cursor",hiddenState:"-hidden",textState:"-text",iconState:"-icon",activeState:"-active",mediaState:"-media",stateDetection:{"-pointer":"a,button","-hidden":"iframe"},visible:!0,speed:.55,ease:"expo.out",overwrite:!0,skewing:0,skewingText:2,skewingIcon:2,skewingMedia:2,skewingDelta:.001,skewingDeltaMax:.15,stickDelta:.15,showTimeout:20,hideOnLeave:!0,hideTimeout:300,hideMediaTimeout:300,initialPos:[-window.innerWidth,-window.innerHeight]},e),this.el="string"==typeof this.options.el?document.querySelector(this.options.el):this.options.el,this.container="string"==typeof this.options.container?document.querySelector(this.options.container):this.options.container,this.skewing=this.options.skewing,this.pos={x:this.options.initialPos[0],y:this.options.initialPos[1]},this.vel={x:0,y:0},this.event={},this.init()}t.registerGSAP=function(e){t.gsap=e};var e=t.prototype;return e.init=function(){this.el||this.create(),this.createSetter(),this.bind(),this.render(!0),this.ticker=this.render.bind(this,!1),this.gsap.ticker.add(this.ticker)},e.create=function(){this.el=document.createElement("div"),this.el.className=this.options.className,this.el.classList.add(this.options.hiddenState),this.inner=document.createElement("div"),this.inner.className=this.options.innerClassName,this.text=document.createElement("div"),this.text.className=this.options.textClassName,this.media=document.createElement("div"),this.media.className=this.options.mediaClassName,this.mediaBox=document.createElement("div"),this.mediaBox.className=this.options.mediaBoxClassName,this.media.appendChild(this.mediaBox),this.inner.appendChild(this.media),this.inner.appendChild(this.text),this.el.appendChild(this.inner),this.container.appendChild(this.el)},e.createSetter=function(){this.setter={x:this.gsap.quickSetter(this.el,"x","px"),y:this.gsap.quickSetter(this.el,"y","px"),rotation:this.gsap.quickSetter(this.el,"rotation","deg"),scaleX:this.gsap.quickSetter(this.el,"scaleX"),scaleY:this.gsap.quickSetter(this.el,"scaleY"),wc:this.gsap.quickSetter(this.el,"willChange"),inner:{rotation:this.gsap.quickSetter(this.inner,"rotation","deg")}}},e.bind=function(){var t=this;this.event.mouseleave=function(){return t.hide()},this.event.mouseenter=function(){return t.show()},this.event.mousedown=function(){return t.addState(t.options.activeState)},this.event.mouseup=function(){return t.removeState(t.options.activeState)},this.event.mousemoveOnce=function(){return t.show()},this.event.mousemove=function(e){t.gsap.to(t.pos,{x:t.stick?t.stick.x-(t.stick.x-e.clientX)*t.options.stickDelta:e.clientX,y:t.stick?t.stick.y-(t.stick.y-e.clientY)*t.options.stickDelta:e.clientY,overwrite:t.options.overwrite,ease:t.options.ease,duration:t.visible?t.options.speed:0,onUpdate:function(){return t.vel={x:e.clientX-t.pos.x,y:e.clientY-t.pos.y}}})},this.event.mouseover=function(e){for(var i=e.target;i&&i!==t.container&&(!e.relatedTarget||!i.contains(e.relatedTarget));i=i.parentNode){for(var s in t.options.stateDetection)i.matches(t.options.stateDetection[s])&&t.addState(s);if(t.options.dataAttr){var o=t.getFromDataset(i);o.state&&t.addState(o.state),o.text&&t.setText(o.text),o.icon&&t.setIcon(o.icon),o.img&&t.setImg(o.img),o.video&&t.setVideo(o.video),void 0!==o.show&&t.show(),void 0!==o.stick&&t.setStick(o.stick||i)}}},this.event.mouseout=function(e){for(var i=e.target;i&&i!==t.container&&(!e.relatedTarget||!i.contains(e.relatedTarget));i=i.parentNode){for(var s in t.options.stateDetection)i.matches(t.options.stateDetection[s])&&t.removeState(s);if(t.options.dataAttr){var o=t.getFromDataset(i);o.state&&t.removeState(o.state),o.text&&t.removeText(),o.icon&&t.removeIcon(),o.img&&t.removeImg(),o.video&&t.removeVideo(),void 0!==o.show&&t.hide(),void 0!==o.stick&&t.removeStick()}}},this.options.hideOnLeave&&this.container.addEventListener("mouseleave",this.event.mouseleave,{passive:!0}),this.options.visible&&this.container.addEventListener("mouseenter",this.event.mouseenter,{passive:!0}),this.container.addEventListener("mousedown",this.event.mousedown,{passive:!0}),this.container.addEventListener("mouseup",this.event.mouseup,{passive:!0}),this.container.addEventListener("mousemove",this.event.mousemove,{passive:!0}),this.options.visible&&this.container.addEventListener("mousemove",this.event.mousemoveOnce,{passive:!0,once:!0}),(this.options.stateDetection||this.options.dataAttr)&&(this.container.addEventListener("mouseover",this.event.mouseover,{passive:!0}),this.container.addEventListener("mouseout",this.event.mouseout,{passive:!0}))},e.render=function(t){if(!0===t||0!==this.vel.y&&0!==this.vel.x){if(this.setter.wc("transform"),this.setter.x(this.pos.x),this.setter.y(this.pos.y),this.skewing){var e=Math.sqrt(Math.pow(this.vel.x,2)+Math.pow(this.vel.y,2)),i=Math.min(e*this.options.skewingDelta,this.options.skewingDeltaMax)*this.skewing,s=180*Math.atan2(this.vel.y,this.vel.x)/Math.PI;this.setter.rotation(s),this.setter.scaleX(1+i),this.setter.scaleY(1-i),this.setter.inner.rotation(-s)}}else this.setter.wc("auto")},e.show=function(){var t=this;clearInterval(this.visibleInt),this.el.classList.remove(this.options.hiddenState),this.visibleInt=setTimeout((function(){return t.visible=!0}),this.options.showTimeout)},e.hide=function(){var t=this;clearInterval(this.visibleInt),this.el.classList.add(this.options.hiddenState),this.visibleInt=setTimeout((function(){return t.visible=!1}),this.options.hideTimeout)},e.toggle=function(t){void 0===t&&(t=!1),!this.visible||t?this.show():this.hide()},e.addState=function(t){var e;if(t===this.options.hiddenState)return this.hide();(e=this.el.classList).add.apply(e,t.split(" "))},e.removeState=function(t){var e;if(t===this.options.hiddenState)return this.show();(e=this.el.classList).remove.apply(e,t.split(" "))},e.toggleState=function(t,e){this.el.classList.toggle(""+t,e)},e.setSkewing=function(t){this.gsap.to(this,{skewing:t})},e.removeSkewing=function(){this.gsap.to(this,{skewing:this.options.skewing})},e.setStick=function(t){var e=("string"==typeof t?document.querySelector(t):t).getBoundingClientRect();this.stick={y:e.top+e.height/2,x:e.left+e.height/2}},e.removeStick=function(){this.stick=!1},e.setText=function(t){this.text.innerHTML=t,this.addState(this.options.textState),this.setSkewing(this.options.skewingText)},e.removeText=function(){this.removeState(this.options.textState),this.removeSkewing()},e.setIcon=function(t,e){void 0===e&&(e=""),this.text.innerHTML='<svg class="'+this.options.iconSvgClassName+" "+this.options.iconSvgNamePrefix+t+'" style="'+e+'"><use xlink:href="'+this.options.iconSvgSrc+"#"+t+'"></use></svg>',this.addState(this.options.iconState),this.setSkewing(this.options.skewingIcon)},e.removeIcon=function(){this.removeState(this.options.iconState),this.removeSkewing()},e.setMedia=function(t){var e=this;clearTimeout(this.mediaInt),t&&(this.mediaBox.innerHTML="",this.mediaBox.appendChild(t)),this.mediaInt=setTimeout((function(){return e.addState(e.options.mediaState)}),20),this.setSkewing(this.options.skewingMedia)},e.removeMedia=function(){var t=this;clearTimeout(this.mediaInt),this.removeState(this.options.mediaState),this.mediaInt=setTimeout((function(){return t.mediaBox.innerHTML=""}),this.options.hideMediaTimeout),this.removeSkewing()},e.setImg=function(t){this.mediaImg||(this.mediaImg=new Image),this.mediaImg.src!==t&&(this.mediaImg.src=t),this.setMedia(this.mediaImg)},e.removeImg=function(){this.removeMedia()},e.setVideo=function(t){this.mediaVideo||(this.mediaVideo=document.createElement("video"),this.mediaVideo.muted=!0,this.mediaVideo.loop=!0,this.mediaVideo.autoplay=!0),this.mediaVideo.src!==t&&(this.mediaVideo.src=t,this.mediaVideo.load()),this.mediaVideo.play(),this.setMedia(this.mediaVideo)},e.removeVideo=function(){this.mediaVideo&&this.mediaVideo.readyState>2&&this.mediaVideo.pause(),this.removeMedia()},e.getFromDataset=function(t){var e=t.dataset;return{state:e[this.options.dataAttr],show:e[this.options.dataAttr+"Show"],text:e[this.options.dataAttr+"Text"],icon:e[this.options.dataAttr+"Icon"],img:e[this.options.dataAttr+"Img"],video:e[this.options.dataAttr+"Video"],stick:e[this.options.dataAttr+"Stick"]}},e.destroy=function(){this.gsap.ticker.remove(this.ticker),this.container.removeEventListener("mouseleave",this.event.mouseleave),this.container.removeEventListener("mouseenter",this.event.mouseenter),this.container.removeEventListener("mousedown",this.event.mousedown),this.container.removeEventListener("mouseup",this.event.mouseup),this.container.removeEventListener("mousemove",this.event.mousemove),this.container.removeEventListener("mousemove",this.event.mousemoveOnce),this.container.removeEventListener("mouseover",this.event.mouseover),this.container.removeEventListener("mouseout",this.event.mouseout),this.el&&(this.container.removeChild(this.el),this.el=null,this.mediaImg=null,this.mediaVideo=null)},t}();return e=e.default}()}));
//# sourceMappingURL=mouse-follower.js.map