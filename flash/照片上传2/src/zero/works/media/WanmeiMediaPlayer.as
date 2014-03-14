﻿/***
WanmeiMediaPlayer
创建人：ZЁЯ¤　身高：168cm+；体重：57kg+；已婚（单身美女们没机会了~~）；最爱的运动：睡觉；格言：路见不平，拔腿就跑。QQ：358315553。
创建时间：2013年11月22日 09:12:38
简要说明：这家伙很懒什么都没写。
用法举例：这家伙还是很懒什么都没写。
*/

package zero.works.media{
	import akdcl.manager.ExternalInterfaceManager;
	import akdcl.net.gotoURL;
	
	import com.greensock.TweenMax;
	
	import flash.display.*;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import flash.geom.*;
	import flash.net.*;
	import flash.system.*;
	import flash.text.*;
	import flash.utils.*;
	
	import ui.Btn;
	
	import zero.lcs.LC;
	
	[Event(name="load", type="flash.events.Event")]
	[Event(name="click", type="flash.events.Event")]
	[Event(name="play", type="flash.events.Event")]
	[Event(name="paused", type="flash.events.Event")]
	[Event(name="stopped", type="flash.events.Event")]
	[Event(name="loadComplete", type="flash.events.Event")]
	[Event(name="playComplete", type="flash.events.Event")]
	[Event(name="loadError", type="flash.events.Event")]
	[Event(name="stateChange", type="flash.events.Event")]
	
	/**
	 * 
	 * load(_source) autoPlay为true，false或null时，都只加载，不播放；<br/>
	 * set source autoPlay为true时加载并播放，autoPlay为false时只加载不播放，autoPlay为null时不加载不播放。<br/>
	 * <br/>
	 * 
	 * 如果正在加载一个视频，切换为加载一个MP3，则不会停止加载此视频；<br/>
	 * 如果正在加载一个MP3，切换为加载一个视频，则不会停止加载此MP3；<br/>
	 * 如果正在加载一个视频，切换为加载另一个视频，则会停止加载第一个视频；<br/>
	 * 如果正在加载一个MP3，切换为加载另一个MP3，则会停止加载第一个MP3。<br/>
	 * <br/>
	 * 
	 */	
	public class WanmeiMediaPlayer extends Sprite{
		
		private var layoutMode:String;
		public var skinMode:String;
		public var middleBtnAlign:String;
		
		private var __state:String;
		public function get state():String{
			return __state;
		}
		
		private var intervalId:int;
		
		private var mouseIsIn:Boolean;
		private var mouseJustMove:Boolean;
		
		private var wid0:int;
		private var hei0:int;
		
		private var wid:int;
		private var hei:int;
		
		private var timeoutId:int;
		
		private var hideSkinDelayTime:int;
		
		private var lc:LC;//20131114
		private var group:String;
		
		public var bottom:Sprite;
		
		private static var configXML:XML;
		public var configPath:String;
		private var configXMLLoader:URLLoader;
		private var onLoadConfigXMLFinished:Function;
		private var currContentXML:XML;
		
		public var backImageLoader:ImageLoader;
		public function set backImage(_src:String):void{
			if(backImageLoader){
				backImageLoader.load(_src,null,wid,hei);
			}
		}
		
		public var playerContainer:Sprite;
		public var videoPlayer:VideoPlayer;
		public var videoListPlayer:VideoListPlayer;
		public var mp3Player:MP3Player;
		private var currPlayer:IPlayer;
		private var __source:String;
		public function get source():String{
			return __source;
		}
		public function set source(_source:String):void{
			initPlayerBySource(_source);
			switch(autoPlay){
				case true:
					loadAndPlay();
				break;
				case false:
					_load();
				break;
				default:
					//
				break;
			}
		}
		private function initPlayerBySource(_source:String):void{
			if(_source){
				if(__source==_source){
					//同一个源，不作任何处理
				}else{
					resetStates();
					resetStartAni();
					if(currPlayer){
						currPlayer.stop();
						switch(currPlayer){
							case videoPlayer:
								videoPlayer.visible=false;
							break;
							case videoListPlayer:
								videoListPlayer.visible=false;
							break;
							case mp3Player:
								//
							break;
						}
					}
					__source=_source;
					
					if(VideoListPlayer.sourceReg.test(__source)){
						if(videoListPlayer){
							videoListPlayer.visible=true;
						}else{
							videoListPlayer=new VideoListPlayer();
							if(playerContainer){
								playerContainer.addChild(videoListPlayer);
							}
							videoListPlayer.addEventListener(PlayerEvent.STATE_CHANGE,playerEvent);
						}
						videoListPlayer.scaleMode=scaleMode;
						currPlayer=videoListPlayer;
						setVideoListPlayerSize(wid,hei);
					}else if(MP3Player.sourceReg.test(__source)){
						if(mp3Player){
						}else{
							mp3Player=new MP3Player();
							mp3Player.addEventListener(PlayerEvent.STATE_CHANGE,playerEvent);
						}
						currPlayer=mp3Player;
					}else{
						if(videoPlayer){
							videoPlayer.visible=true;
						}else{
							videoPlayer=new VideoPlayer();
							if(playerContainer){
								playerContainer.addChild(videoPlayer);
							}
							videoPlayer.addEventListener(PlayerEvent.STATE_CHANGE,playerEvent);
						}
						videoPlayer.scaleMode=scaleMode;
						currPlayer=videoPlayer;
						setVideoPlayerSize(wid,hei);
					}
				}
			}else{
				resetStates();
				resetStartAni();
				if(currPlayer){
					currPlayer.stop();
					switch(currPlayer){
						case videoPlayer:
							videoPlayer.visible=false;
						break;
						case videoListPlayer:
							videoListPlayer.visible=false;
						break;
						case mp3Player:
							//
						break;
					}
				}
			}
		}
		
		public var layer:Sprite;
		private var __layerAlpha:Number;
		public function set layerAlpha(_layerAlpha:Number):void{
			__layerAlpha=_layerAlpha;
			if(layer){
				if(_layerAlpha>0){
					layer.alpha=_layerAlpha;
					layer.visible=true;
				}else{
					layer.visible=false;
				}
			}
		}
		
		public var grid:Grid;
		public function set gridAlpha(_gridAlpha:Number):void{
			if(grid){
				if(_gridAlpha>0){
					grid.alpha=_gridAlpha;
					grid.visible=true;
				}else{
					grid.visible=false;
				}
			}
		}
		
		public var startImageLoader:ImageLoader;
		public function set startImage(_src:String):void{
			if(startImageLoader){
				startImageLoader.load(_src,null,wid,hei);
			}
		}
		public var frontImageLoader:ImageLoader;
		public function set frontImage(_src:String):void{
			if(frontImageLoader){
				frontImageLoader.load(_src,null,wid,hei);
			}
		}
		
		public var middleBtn:Btn;
		
		//public var startAni:MovieClip;//20131121
		public var ad:Ad;
		
		public var skin:Skin;
		private var skinStateFlag:Boolean;
		private var skinStateDelayTime:int;
		
		private var __volume:Number;
		public function get volume():Number{
			return __volume;
		}
		public function set volume(_volume:Number):void{
			__volume=_volume;
			//trace("__volume="+__volume);
			/*
			if(__volume==0){
				if(Object["xxx"]>0){
					Object["xxx"]++;
				}else{
					Object["xxx"]=1;
				}
				if(Object["xxx"]>2){
					throw "xxx";
				}
			}
			//*/
			if(skin){
				if(skin.volCtrl){
					skin.volCtrl._ctrlVol(__volume);
				}
			}
			if(currPlayer){
				currPlayer.volume=__volume;
			}
		}
		private var oldVolume:Number;
		public function get mute():Boolean{
			if(volume>0){
				return false;
			}
			return true;
		}
		public function set mute(_mute:Boolean):void{
			if(_mute){
				oldVolume=volume;
				volume=0;
				if(skin){
					if(skin.volCtrl){
						skin.volCtrl._ctrlVol(__volume);
						skin.volCtrl.on=false;
					}
				}
			}else{
				//trace("oldVolume="+oldVolume);
				volume=oldVolume||0.8;
				if(skin.volCtrl){
					skin.volCtrl._ctrlVol(__volume);
					skin.volCtrl.on=true;
				}
			}
		}
		private function updateVol(_volume:Number):void{
			volume=_volume;
		}
		
		public function get playheadTime():Number{
			if(currPlayer){
				return currPlayer.getPlayheadTime();
			}
			return NaN;
		}
		public function set playheadTime(_playheadTime:Number):void{
			if(currPlayer){
				currPlayer.setPlayheadTime(_playheadTime,__playheadIsMovingOrIsGoingToMove);
			}
		}
		
		public function get totalTime():Number{
			if(currPlayer){
				return currPlayer.totalTime;
			}
			return NaN;
		}
		
		public function get bufferProgress():Number{
			if(currPlayer){
				return currPlayer.bufferProgress;
			}
			return NaN;
		}
		public function get loadProgress():Number{
			if(currPlayer){
				if(currPlayer.bytesTotal>0){
					return currPlayer.bytesLoaded/currPlayer.bytesTotal;
				}
				return 0;
			}
			return NaN;
		}
		
		public var bufferTime:Number;
		public var autoPlay:*;
		public var autoRewind:Boolean;
		public var repeat:Boolean;
		
		private var currPlayheadTime:Number;
		
		public var scaleMode:String;
		
		//20131124
		
		private var __isLoading:Boolean;
		/**
		 * 是否正在加载
		 */		
		public function get isLoading():Boolean{
			return __isLoading;
		}
		
		private var __isBuffering:Boolean;
		/**
		 * 是否正在缓冲 
		 */		
		public function get isBuffering():Boolean{
			return __isBuffering;
		}
		
		private var __isPlay:Boolean;
		/**
		 * 是否正在播放（和停止按钮有重要关系，点击停止按钮几乎一定会设置此值为false）
		 */		
		public function get isPlay():Boolean{
			return __isPlay;
		}
		
		private var __playheadIsMovingOrIsGoingToMove:Boolean;
		/**
		 * 播放头是否正在自动前进或有自动前进的趋势（跟是否正在加载或正在缓冲没有任何关系）（和暂停按钮有重要关系，点击暂停按钮几乎一定会设置此值为false）
		 */		
		public function get playheadIsMovingOrIsGoingToMove():Boolean{
			return __playheadIsMovingOrIsGoingToMove;
		}
		
		private var __isPlaying:Boolean;
		/**
		 * 播放头是否正在自动前进
		 */		
		public function get isPlaying():Boolean{
			return __isPlaying;
		}
		
		/*
		以上状态包含关系：
		__isLoading==true 包含 __isBuffering==true 或 false
		__isPlay==true 包含 __playheadIsMovingOrIsGoingToMove==true 或 false
		__playheadIsMovingOrIsGoingToMove==true 包含 __isPlaying==true 或 false
		*/
		
		private function resetStates():void{
			__isLoading=false;
			__isBuffering=false;
			__isPlay=false;
			__playheadIsMovingOrIsGoingToMove=false;
			__isPlaying=false;
		}
		
		public var showLoading:Boolean;//20131220
		private var __startAniIsShowing:Boolean;//正在显示startAni
		private var __startAniIsHide:Boolean;//startAni已隐藏
		private var checkStartAniDelayTime:int;
		private function resetStartAni():void{
			__startAniIsShowing=false;
			__startAniIsHide=false;
			if(ad){
				ad.startAni.stop();
				ad.visible=false;
				TweenMax.killTweensOf(ad);
				ad.alpha=1;
				if(middleBtn){
					middleBtn.visible=true;
				}
			}
			this.removeEventListener(Event.ENTER_FRAME,checkStartAni);
		}
		
		private function loadConfigXMLComplete(...args):void{
			configXMLLoader.removeEventListener(Event.COMPLETE,loadConfigXMLComplete);
			configXMLLoader.removeEventListener(IOErrorEvent.IO_ERROR,loadConfigXMLError);
			configXMLLoader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR,loadConfigXMLError);
			configXML=new XML(configXMLLoader.data);
			configXMLLoader=null;
			if(onLoadConfigXMLFinished==null){
			}else{
				onLoadConfigXMLFinished();
				onLoadConfigXMLFinished=null;
			}
		}
		private function loadConfigXMLError(...args):void{
			configXMLLoader.removeEventListener(Event.COMPLETE,loadConfigXMLComplete);
			configXMLLoader.removeEventListener(IOErrorEvent.IO_ERROR,loadConfigXMLError);
			configXMLLoader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR,loadConfigXMLError);
			configXMLLoader=null;
			configXML=<loadConfigXMLError/>;
			if(onLoadConfigXMLFinished==null){
			}else{
				onLoadConfigXMLFinished();
				onLoadConfigXMLFinished=null;
			}
		}
		
		public function WanmeiMediaPlayer(){
			
			this.visible=false;
			
			skinMode=SkinMode.AUTOHIDE;
			middleBtnAlign=MiddleBtnAlign.BOTTOM_LEFT;
			layerAlpha=0.8;
			gridAlpha=0;
			showLoading=true;
			configPath=null;//"http://10.8.1.44/sae/pwrddemos/1/API/swfs/player_config.xml";
			if(ad){
				ad.mouseEnabled=ad.mouseChildren=false;
				ad.startAni.stop();
				ad.visible=false;
				TweenMax.killTweensOf(ad);
				ad.alpha=1;
				if(middleBtn){
					middleBtn.visible=true;
				}
			}
			volume=0.8;
			bufferTime=5;
			autoPlay=null;
			autoRewind=true;
			repeat=false;
			scaleMode=ScaleMode.PROPORTIONAL_INSIDE;
		}
		
		/**
		 * 
		 * @param _layoutMode 布局模式，可能值为：LayoutMode.FIXED，LayoutMode.EMBEDDED 或 LayoutMode.STAND_ALONE
		 * 
		 */		
		public function init(
			_layoutMode:String=LayoutMode.FIXED,
			_group:String="main"
		):void{
			
			if(this.visible){
				throw new Error("不允许重复初始化");
			}
			
			layoutMode=_layoutMode;
			group=_group;
			
			__state=null;
			
			mouseIsIn=false;
			mouseJustMove=false;
			
			if(bottom){
				wid0=bottom.width;
				hei0=bottom.height;
			}
			if(wid0>0&&hei0>0){
			}else{
				wid0=465;
				hei0=287;
			}
			
			if(bottom){
				setSize(wid0,hei0);
			}else{
				wid=wid0;
				hei=hei0;
			}
			
			if(middleBtn){
				middleBtn.release=clickMiddleBtn;
				middleBtn.doubleClickEnabled=true;
				middleBtn.addEventListener(MouseEvent.DOUBLE_CLICK,doubleClickMiddleBtn);
				if(bottom){
					middleBtn.hitArea=bottom;
				}
				stage.addEventListener(FullScreenEvent.FULL_SCREEN,changeFullScreen);
			}
			
			if(skin){
				if(skin.bottom){
					skin.y=hei+skin.bottom.height;
				}
				if(skin.btnPlay){
					skin.btnPlay.release=play;
				}
				if(skin.btnPause){
					skin.btnPause.release=pause;
				}
				if(skin.btnStop){
					skin.btnStop.release=stop;
				}
				if(skin.slider){
					skin.slider.onUpdate=update;
				}
				if(skin.volCtrl){
					skin.volCtrl.init(volume,updateVol);
				}
				if(skin.btnFullScreen){
					skin.btnFullScreen.release=switchFullScreen;
				}
			}
			
			switch(layoutMode){
				case LayoutMode.FIXED:
					//
				break;
				case LayoutMode.EMBEDDED:
					//
				break;
				case LayoutMode.STAND_ALONE:
					resize();
					stage.addEventListener(Event.RESIZE,resize);
				break;
			}
			
			stage.addEventListener(MouseEvent.MOUSE_MOVE,mouseMove);
			stage.addEventListener(Event.MOUSE_LEAVE,mouseLeave);
			
			if(ExternalInterface.available){
				var eiM:ExternalInterfaceManager=ExternalInterfaceManager.getInstance();
				eiM.addEventListener(ExternalInterfaceManager.CALL,jsCallThis);
			}
			
			//参数的顺序比较重要
			for each(var paramName:String in [
				"showLoading","configPath",
				"skinMode","scaleMode","middleBtnAlign",
				"backImage","startImage","frontImage",
				"gridAlpha","layerAlpha",
				"bufferTime","autoPlay","autoRewind","repeat",
				"volume","bufferTime",
				"group",
				"source"
			]){
				if(this.loaderInfo.parameters.hasOwnProperty(paramName)){
					var value:*=this.loaderInfo.parameters[paramName];
					switch(value){
						case true:
						case "true":
							this[paramName]=true;
						break;
						case false:
						case "false":
							this[paramName]=false;
						break;
						case null:
						case "null":
							this[paramName]=null;
						break;
						case undefined:
						case "undefined":
							this[paramName]=undefined;
						break;
						case NaN:
						case "NaN":
							this[paramName]=NaN;
						break;
						default:
							if(/^[\d\.]+$/.test(String(value))){
								this[paramName]=Number(value);
							}else{
								this[paramName]=value;
							}
						break;
					}
				}
			}
			
			if(showLoading){
				if(configXML){
				}else{
					if(configPath){
						configXMLLoader=new URLLoader();
						configXMLLoader.addEventListener(Event.COMPLETE,loadConfigXMLComplete);
						configXMLLoader.addEventListener(IOErrorEvent.IO_ERROR,loadConfigXMLError);
						configXMLLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR,loadConfigXMLError);
						configXMLLoader.load(new URLRequest(configPath));
					}else{
						configXML=<noConfigPath/>;
					}
				}
			}
			
			//clearInterval(intervalId);
			//intervalId=setInterval(interval,100);
			this.addEventListener(Event.ENTER_FRAME,interval);
			interval();
			
			this.visible=true;
			
		}
		
		public function clear():void{
			
			clearTimeout(timeoutId);
			
			//clearInterval(intervalId);
			this.removeEventListener(Event.ENTER_FRAME,interval);
			
			if(middleBtn){
				middleBtn.removeEventListener(MouseEvent.DOUBLE_CLICK,doubleClickMiddleBtn);
			}
			stage.removeEventListener(FullScreenEvent.FULL_SCREEN,changeFullScreen);
			stage.removeEventListener(Event.RESIZE,resize);
			
			stage.removeEventListener(MouseEvent.MOUSE_MOVE,mouseMove);
			stage.removeEventListener(Event.MOUSE_LEAVE,mouseLeave);
			
			if(backImageLoader){
				backImageLoader.clear();
			}
			
			if(frontImageLoader){
				frontImageLoader.clear();
			}
			
			if(startImageLoader){
				startImageLoader.clear();
			}
			
			if(skin){
				skin.clear();
			}
			
			if(videoPlayer){
				videoPlayer.clear();
				videoPlayer=null;
			}
			if(videoListPlayer){
				videoListPlayer.clear();
				videoListPlayer=null;
			}
			if(mp3Player){
				mp3Player.clear();
				mp3Player=null;
			}
			currPlayer=null;
			
			if(ExternalInterface.available){
				var eiM:ExternalInterfaceManager=ExternalInterfaceManager.getInstance();
				eiM.removeEventListener(ExternalInterfaceManager.CALL,jsCallThis);
			}
			
			if(lc){
				lc.clear();
				lc=null;
			}
			
			if(ad){
				ad.removeEventListener(MouseEvent.CLICK,clickAd);
			}
			
			if(configXMLLoader){
				configXMLLoader.removeEventListener(Event.COMPLETE,loadConfigXMLComplete);
				configXMLLoader.removeEventListener(IOErrorEvent.IO_ERROR,loadConfigXMLError);
				configXMLLoader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR,loadConfigXMLError);
				configXMLLoader=null;
			}
			
			onLoadConfigXMLFinished=null;
			currContentXML=null;
			
			this.removeEventListener(Event.ENTER_FRAME,checkStartAni);
			
		}
		
		private function mouseMove(...args):void{
			mouseIsIn=true;
			mouseJustMove=true;
		}
		private function mouseLeave(...args):void{
			mouseIsIn=false;
		}
		
		private function interval(...args):void{
			
			if(__isLoading){
				if(bufferProgress>-1){
					if(bufferProgress<1){
						if(__isBuffering){
						}else{
							__isBuffering=true;
							__isPlaying=false;
							changeState(PlayerState.BUFFERING);
						}
					}else{
						if(__isBuffering){
							__isBuffering=false;
							if(__isPlay){
								if(__playheadIsMovingOrIsGoingToMove){
									__isPlaying=true;
									changeState(PlayerState.PLAYING);
								}else{
									__isPlaying=false;
								}
							}else{
								__isPlaying=false;
							}
						}
					}
				}
			}else{
				__isBuffering=false;
				if(__isPlay){
					if(__playheadIsMovingOrIsGoingToMove){
						__isPlaying=true;
						changeState(PlayerState.PLAYING);
					}else{
						__isPlaying=false;
					}
				}else{
					__isPlaying=false;
				}
			}
			
			if(skin){
				
				switch(skinMode){
					case SkinMode.AUTOHIDE:
						if(mouseIsIn){
							if(
								mouseJustMove
								||
								skin.hitTestPoint(stage.mouseX,stage.mouseY,false)
							){
								hideSkinDelayTime=3000;
							}else{
								if(hideSkinDelayTime>0){
									hideSkinDelayTime-=30;
								}
							}
						}else{
							hideSkinDelayTime=0;
						}
						if(hideSkinDelayTime>0){
							skin.mouseChildren=true;
						}else{
							hideSkinDelayTime=0;
							if(
								__playheadIsMovingOrIsGoingToMove//20131128
								&&
								__isBuffering//20131124
							){
								skin.mouseChildren=true;
							}else{
								skin.mouseChildren=false;
							}
						}
					break;
					case SkinMode.SHOW:
						skin.mouseChildren=true;
					break;
					case SkinMode.HIDE:
						skin.mouseChildren=false;
					break;
					case SkinMode.BUTTON:
						skin.mouseChildren=false;
						if(skin.bottom){
							skin.y=hei;
						}
						skin.alpha=0;
					break;
				}
				
				if(skin.bottom){
					if(skinStateFlag){
						//皮肤正在渐显
						if((skin.alpha+=0.1)>0.95){
							skin.alpha=1;
						}
						var dy:Number=hei-skin.y;
						if(dy*dy<4){
							skin.y=hei;
							if(--skinStateDelayTime<0){
								if(skin.mouseChildren){
								}else{
									skinStateFlag=false;
								}
							}
						}else{
							if(__isBuffering){
								skinStateDelayTime=30;
							}else{
								skinStateDelayTime=0;
							}
							skin.y+=dy*0.3;
						}
					}else{
						//皮肤正在渐隐
						if((skin.alpha-=0.1)<0.05){
							skin.alpha=0;
						}
						dy=hei+skin.bottom.height-skin.y;
						if(dy*dy<4){
							skin.y=hei+skin.bottom.height;
							if(--skinStateDelayTime<0){
								if(skin.mouseChildren){
									skinStateFlag=true;
								}
							}
						}else{
							if(__isBuffering){
								skinStateDelayTime=30;
							}else{
								skinStateDelayTime=0;
							}
							skin.y+=dy*0.3;
						}
					}
				}
				
				if(skin.buffClip){
					if(__isBuffering){
						if(skin.buffClip.visible){
						}else{
							skin.buffClip.visible=true;
							skin.buffClip.play();
						}
						if(skin.btnPause){
							skin.btnPause.alpha=0;
							skin.btnPause.mouseEnabled=false;
						}
						if(skin.btnPlay){
							skin.btnPlay.alpha=0;
							skin.btnPlay.mouseEnabled=false;
						}
					}else{
						if(skin.buffClip.visible){
							skin.buffClip.visible=false;
							skin.buffClip.stop();
						}
						if(skin.btnPause){
							skin.btnPause.alpha=1;
							skin.btnPause.mouseEnabled=true;
						}
						if(skin.btnPlay){
							skin.btnPlay.alpha=1;
							skin.btnPlay.mouseEnabled=true;
						}
					}
				}
				
				if(__playheadIsMovingOrIsGoingToMove){
					if(skin.btnPlay){
						if(skin.btnPlay.visible){
							skin.btnPlay.visible=false;
						}
					}
					if(skin.btnPause){
						if(skin.btnPause.visible){
						}else{
							skin.btnPause.visible=true;
						}
					}
				}else{
					if(skin.btnPlay){
						if(skin.btnPlay.visible){
						}else{
							skin.btnPlay.visible=true;
						}
					}
					if(skin.btnPause){
						if(skin.btnPause.visible){
							skin.btnPause.visible=false;
						}
					}
				}
				
			}
			
			if(middleBtn){
				switch(middleBtnAlign){
					case MiddleBtnAlign.BOTTOM_LEFT:
						var b:Rectangle=middleBtn.getBounds(this);
						middleBtn.x+=10-b.left;
						if(skin){
							if(skin.bottom){
								middleBtn.y+=skin.y-skin.bottom.height-10-b.bottom;
							}
						}else{
							middleBtn.y+=hei-10-b.bottom;
						}
					break;
					//case "middle":
					default:
						middleBtn.x=int(wid/2);
						middleBtn.y=int(hei/2);
					break;
				}
				if(skinMode==SkinMode.BUTTON){
					if((middleBtn.alpha+=0.1)>0.95){
						middleBtn.alpha=1;
					}
				}else{
					if(__playheadIsMovingOrIsGoingToMove){
						if((middleBtn.alpha-=0.1)<0.05){
							middleBtn.alpha=0;
						}
					}else{
						if((middleBtn.alpha+=0.1)>0.95){
							middleBtn.alpha=1;
						}
					}
				}
			}
			
			if(startImageLoader){
				if(skinMode==SkinMode.BUTTON){
					if((startImageLoader.alpha-=0.1)<0.05){
						startImageLoader.alpha=0;
					}
				}else{
					if(__isPlay||__startAniIsShowing){
						if((startImageLoader.alpha-=0.1)<0.05){
							startImageLoader.alpha=0;
						}
					}else{
						if((startImageLoader.alpha+=0.1)>0.95){
							startImageLoader.alpha=1;
						}
					}
				}
			}
			
			if(layer){
				if(skinMode==SkinMode.BUTTON){
					if((layer.alpha+=0.1)>__layerAlpha-0.05){
						layer.alpha=__layerAlpha;
					}
				}else{
					if(__playheadIsMovingOrIsGoingToMove){
						if((layer.alpha-=0.1)<0.05){
							layer.alpha=0;
						}
					}else{
						if((layer.alpha+=0.1)>__layerAlpha-0.05){
							layer.alpha=__layerAlpha;
						}
					}
				}
			}
			
			if(currPlayer){
				if(skin){
					if(skin.slider){
						skin.slider.value2=loadProgress;
						if(skin.slider.ctrling){
						}else{
							if(playheadTime>0&&totalTime>0){
								skin.slider.value=playheadTime/totalTime;
							}else{
								skin.slider.value=0;
							}
						}
					}
				}
				updateTimeStr(playheadTime);
			}
			
			if(mouseJustMove){
				mouseJustMove=false;
			}
		}
		
		private function clickMiddleBtn(...args):void{
			clearTimeout(timeoutId);
			timeoutId=setTimeout(pauseResumeDelay,200);
		}
		private function pauseResumeDelay():void{
			switch(skinMode){
				case SkinMode.AUTOHIDE:
					//
				break;
				case SkinMode.SHOW:
					//
				break;
				case SkinMode.HIDE:
					//
				break;
				case SkinMode.BUTTON:
					dispatchPlayerEvent("click");
					return;
				break;
			}
			
			if(__playheadIsMovingOrIsGoingToMove){
				pause();
			}else{
				play();
			}
		}
		private function doubleClickMiddleBtn(...args):void{
			clearTimeout(timeoutId);
			switch(skinMode){
				case SkinMode.AUTOHIDE:
					//
				break;
				case SkinMode.SHOW:
					//
				break;
				case SkinMode.HIDE:
					//
				break;
				case SkinMode.BUTTON:
					return;
				break;
			}
			switchFullScreen();
		}
		
		private function switchFullScreen():void{
			switch(stage.displayState){
				case StageDisplayState.FULL_SCREEN:
				case StageDisplayState.FULL_SCREEN_INTERACTIVE:
					stage.displayState=StageDisplayState.NORMAL;
				break;
				default:
					switch(layoutMode){
						case LayoutMode.FIXED:
							//
						break;
						case LayoutMode.EMBEDDED:
							var p:Point=this.localToGlobal(new Point(0,0));
							stage.fullScreenSourceRect=new Rectangle(p.x,p.y,Capabilities.screenResolutionX,Capabilities.screenResolutionY);
						break;
						case LayoutMode.STAND_ALONE:
							//
						break;
					}
					stage.displayState=StageDisplayState.FULL_SCREEN;
				break;
			}
			changeFullScreen();
		}
		private function changeFullScreen(...args):void{
			//trace("stage.displayState="+stage.displayState);
			switch(stage.displayState){
				case StageDisplayState.FULL_SCREEN:
				case StageDisplayState.FULL_SCREEN_INTERACTIVE:
					if(frontImageLoader){
						frontImageLoader.visible=false;
					}
					if(skin){
						if(skin.btnFullScreen){
							skin.btnFullScreen["gra"].gotoAndStop(2);
						}
					}
				break;
				default:
					if(frontImageLoader){
						frontImageLoader.visible=true;
					}
					if(skin){
						if(skin.btnFullScreen){
							skin.btnFullScreen["gra"].gotoAndStop(1);
						}
					}
				break;
			}
			switch(layoutMode){
				case LayoutMode.FIXED:
					//
				break;
				case LayoutMode.EMBEDDED:
					switch(stage.displayState){
						case StageDisplayState.FULL_SCREEN:
						case StageDisplayState.FULL_SCREEN_INTERACTIVE:
							setSize(stage.stageWidth,stage.stageHeight);
						break;
						default:
							setSize(wid0,hei0);
						break;
					}
				break;
				case LayoutMode.STAND_ALONE:
					//交给 resize()
				break;
			}
		}
		
		private function resize(...args):void{
			switch(layoutMode){
				case LayoutMode.FIXED:
					//
				break;
				case LayoutMode.EMBEDDED:
					//
				break;
				case LayoutMode.STAND_ALONE:
					setSize(stage.stageWidth,stage.stageHeight);
				break;
			}
		}
		
		public function setSize(_wid:int,_hei:int):void{
			
			if(wid==_wid&&hei==_hei){
				return;
			}
			//trace(wid,hei,"=>",_wid,_hei);
			
			if(bottom){
				bottom.width=_wid;
				bottom.height=_hei;
			}
			
			if(backImageLoader){
				backImageLoader.setSize(_wid,_hei);
			}
			if(startImageLoader){
				startImageLoader.setSize(_wid,_hei);
			}
			if(frontImageLoader){
				frontImageLoader.setSize(_wid,_hei);
			}
			
			if(grid){
				grid.setSize(_wid,_hei);
			}
			
			if(layer){
				layer.width=_wid;
				layer.height=_hei;
			}
			
			if(skin){
				if(skin.bottom){
					skin.setWid(wid0,_wid);
					skin.y+=_hei-hei;
				}
			}
			
			if(ad){
				ad.x=int(_wid/2);
				ad.y=int(_hei/2);
			}
			
			setVideoPlayerSize(_wid,_hei);
			setVideoListPlayerSize(_wid,_hei);
			
			this.scrollRect=new Rectangle(0,0,_wid,_hei);
			
			wid=_wid;
			hei=_hei;
			
			interval();
			
		}
		
		private function setVideoPlayerSize(_wid:int,_hei:int):void{
			if(videoPlayer){
				if(skin){
					switch(skinMode){
						case SkinMode.AUTOHIDE:
							videoPlayer.setSize(_wid,_hei);
						break;
						case SkinMode.SHOW:
							if(skin.bottom){
								videoPlayer.setSize(_wid,_hei-skin.bottom.height);
							}else{
								videoPlayer.setSize(_wid,_hei);
							}
						break;
						case SkinMode.HIDE:
							videoPlayer.setSize(_wid,_hei);
						break;
						case SkinMode.BUTTON:
							videoPlayer.setSize(_wid,_hei);
						break;
					}
				}else{
					videoPlayer.setSize(_wid,_hei);
				}
			}
		}
		private function setVideoListPlayerSize(_wid:int,_hei:int):void{
			if(videoListPlayer){
				if(skin){
					switch(skinMode){
						case SkinMode.AUTOHIDE:
							videoListPlayer.setSize(_wid,_hei);
						break;
						case SkinMode.SHOW:
							if(skin.bottom){
								videoListPlayer.setSize(_wid,_hei-skin.bottom.height);
							}else{
								videoListPlayer.setSize(_wid,_hei);
							}
						break;
						case SkinMode.HIDE:
							videoListPlayer.setSize(_wid,_hei);
						break;
						case SkinMode.BUTTON:
							videoListPlayer.setSize(_wid,_hei);
						break;
					}
				}else{
					videoListPlayer.setSize(_wid,_hei);
				}
			}
		}
		
		private function dispatchPlayerEvent(type:String,value:*=undefined):void{
			this.dispatchEvent(new Event(type));
			var eiM:ExternalInterfaceManager=ExternalInterfaceManager.getInstance();
			type="player"+type.charAt(0).toUpperCase()+type.substr(1);
			if(value===undefined){
				eiM.dispatchSWFEvent(type);
			}else{
				eiM.dispatchSWFEvent(type,value);
			}
		}
		private function changeState(_state:String):void{
			if(__state==_state){
				return;
			}
			__state=_state;
			//this.dispatchEvent(new PlayerEvent(__state));
			dispatchPlayerEvent(PlayerEvent.STATE_CHANGE,__state);
		}
		
		private function jsCallThis(_e:Event):void {
			var eiM:ExternalInterfaceManager=ExternalInterfaceManager.getInstance();
			switch(eiM.eventType){
				case "setValue":
					this[eiM.eventParams[0]]=eiM.eventParams[1];
				break;
				case "getValue":
					eiM.callResult=this[eiM.eventParams[0]];
				break;
				case "load":
					load(eiM.eventParams[0]);
				break;
				case "play":
					if(eiM.eventParams&&eiM.eventParams[0]>0){
						play(eiM.eventParams[0]);
					}else{
						play();
					}
				break;
				case "pause":
					pause();
				break;
				case "stop":
					stop();
				break;
				case "reset":
					stop();
				break;
			}
		}
		
		private function onlyPlayThis():void{//20131114
			if(group){
				if(lc){
				}else{
					lc=new LC(group);
					lc.onReceive=lc_receive;
				}
				lc.addThisToTail();
				
				var lastName:String=lc.getLastLCName();
				if(lastName){
					//trace(lc.name+" 停止  "+lastName);
					lc.call(lastName,null,"被停止",lc.name);
				}
				
				/*
				var msg:String="onlyPlayThis\nlc.name="+lc.name+"\nlastName="+lastName+"\nlc.getNameArr().length="+lc.getNameArr().length;
				trace(msg);
				if(ExternalInterface.available){
					ExternalInterface.call("alert",msg);
				}else{
					throw msg;
				}
				//*/
			}
			
		}
		private function lc_receive(args:Array):void{//20131114
			if(args[0]=="被停止"){
				//trace(lc.name+" 被 "+args[1]+" 停止");
				pause();
			}
		}
		
		private function playerEvent(event:PlayerEvent):void{
			if(
				currPlayer
				&&
				event.target==currPlayer
			){
			}else{
				return;
			}
			//trace("event.state="+event.state);
			switch(event.state){
				//case PlayerState.LOADING:
				//	//
				//break;
				//case PlayerState.BUFFERING:
				//	//
				//break;
				//case PlayerState.PLAYING:
				//	//
				//break;
				case PlayerState.PLAY:
					__isPlay=true;
					__playheadIsMovingOrIsGoingToMove=true;
					dispatchPlayerEvent(PlayerState.PLAY);
					changeState(PlayerState.PLAY);
				break;
				case PlayerState.PAUSED:
					__playheadIsMovingOrIsGoingToMove=false;
					dispatchPlayerEvent(PlayerState.PAUSED);
					changeState(PlayerState.PAUSED);
				break;
				case PlayerState.STOPPED:
					resetStates();
					if(ad){
						ad.startAni.stop();
						ad.visible=false;
						TweenMax.killTweensOf(ad);
						ad.alpha=1;
						if(middleBtn){
							middleBtn.visible=true;
						}
					}
					dispatchPlayerEvent(PlayerState.STOPPED);
					changeState(PlayerState.STOPPED);
				break;
				case PlayerState.LOAD_COMPLETE:
					__isLoading=false;
					__isBuffering=false;
					dispatchPlayerEvent(PlayerState.LOAD_COMPLETE);
				break;
				case PlayerState.PLAY_COMPLETE:
					dispatchPlayerEvent(PlayerState.PLAY_COMPLETE);
					changeState(PlayerState.PLAY_COMPLETE);
					_stop2();
					if(repeat){
						_play(0);
					}else if(autoRewind){
						playheadTime=0;
					}
				break;
				case PlayerState.LOAD_ERROR:
					dispatchPlayerEvent(PlayerState.LOAD_ERROR);
					changeState(PlayerState.LOAD_ERROR);
				break;
			}
		}
		
		public function load(_source:String):void{
			initPlayerBySource(_source);
			_load();
		}
		private function _load():void{
			if(currPlayer){
				if(currPlayer.source==__source){
				}else{
					currPlayer.bufferTime=bufferTime;
					currPlayer.load(__source);
					__isLoading=true;
					__isBuffering=true;
					dispatchPlayerEvent("load");
					changeState(PlayerState.LOADING);
				}
			}
		}
		
		public function play(playheadTime:Number=-1):void{
			loadAndPlay(playheadTime);
		}
		private function loadAndPlay(playheadTime:Number=-1):void{
			clearTimeout(timeoutId);
			_load();
			if(skinMode==SkinMode.BUTTON){
			}else{
				if(showLoading){
					if(ad){
						if(__startAniIsHide){
						}else{
							if(__startAniIsShowing){
							}else{
								if(configXML){
									showStartAni();
								}else{
									onLoadConfigXMLFinished=showStartAni;
								}
							}
							return;
						}
					}
				}
			}
			_play(playheadTime);
		}
		private function showStartAni():void{
			if(configXML.name().toString()=="player_config"){
				
				var swfURL:String=stage.loaderInfo.url;
				
				if(ExternalInterface.available){
					try{
						var pageURL:String=ExternalInterface.call("top.location.href.toString")
					}catch(e:Error){
						pageURL=null;
					}
					if(pageURL){
					}else{
						try{
							pageURL=ExternalInterface.call("window.location.href.toString")
						}catch(e:Error){
							pageURL=null;
						}
					}
				}
				
				if(
					pageURL
					&&
					(
						(pageURL.indexOf("/")>-1)
						||
						(pageURL.indexOf("\\")>-1)
					)
				){
					var canRunJS:Boolean=true;
				}else{
					canRunJS=false;
					pageURL=swfURL;
				}
				
				pageURL=pageURL.split("\\").join("/");
				swfURL=swfURL.split("\\").join("/");
				
				pageURL=decodeURI(pageURL);
				swfURL=decodeURI(swfURL);
				
				if(pageURL.toLowerCase().indexOf("file://")==0){
					//如果是本地打开的网页并可能引用网上的一个swf地址，那么应该使用swf地址。
					pageURL=swfURL;
				}
				
				trace("pageURL="+pageURL);
				trace("swfURL="+swfURL);
				if(configXML.ads[0]){
					loop:for each(var siteXML:XML in configXML.ads[0].site){
						//trace(siteXML.toXMLString());
						if(siteXML.content.length()){
							for each(var subReg:String in siteXML.@reg.toString().split("|")){
								if(subReg){
									if(pageURL.indexOf(subReg)>-1){
										currContentXML=siteXML.content[int(siteXML.content.length()*Math.random())];
										trace("currContentXML="+currContentXML.toXMLString());
										break loop;
									}
								}
							}
						}
						
					}
				}
				
			}
			
			__startAniIsShowing=true;
			
			ad.visible=true;
			TweenMax.killTweensOf(ad);
			ad.alpha=0;
			TweenMax.to(ad,8,{alpha:1,useFrames:true});
			if(currContentXML){
				ad.startAni.visible=false;
				ad.startAni.stop();
				ad.content.load(<img src={currContentXML.@src.toString()} align="center middle"/>);
				ad.mouseChildren=false;
				ad.mouseEnabled=true;
				ad.buttonMode=true;
				ad.addEventListener(MouseEvent.CLICK,clickAd);
			}else{
				ad.startAni.visible=true;
				ad.startAni.play();
			}
			if(middleBtn){
				middleBtn.visible=false;
			}
			checkStartAniDelayTime=60;
			this.addEventListener(Event.ENTER_FRAME,checkStartAni);
			if(playerContainer){
				playerContainer.visible=false;
			}
			if(skin){
				if(skin.slider){
					skin.slider.mouseChildren=false;
					skin.slider.alpha=0.5;
				}
			}
		}
		
		private function clickAd(...args):void{
			akdcl.net.gotoURL(currContentXML);
		}
		
		private function checkStartAni(...args):void{
			if(checkStartAniDelayTime>0){
				checkStartAniDelayTime--;
			}else{
				if(bufferProgress>-1){
					if(bufferProgress<1){
					}else{
						this.removeEventListener(Event.ENTER_FRAME,checkStartAni);
						ad.startAni.stop();
						ad.visible=false;
						TweenMax.killTweensOf(ad);
						ad.alpha=1;
						if(middleBtn){
							middleBtn.visible=true;
							middleBtn.alpha=0;
						}
						if(playerContainer){
							playerContainer.visible=true;
						}
						__startAniIsShowing=false;
						__startAniIsHide=true;
						_play();
						if(skin){
							if(skin.slider){
								skin.slider.mouseChildren=true;
								skin.slider.alpha=1;
							}
						}
					}
				}
			}
		}
		private function _play(_playheadTime:Number=-1):void{
			if(currPlayer){
				if(__playheadIsMovingOrIsGoingToMove){
				}else{
					//trace("volume="+volume);
					volume=volume;
					currPlayer.play();
					onlyPlayThis();
				}
				if(_playheadTime>-1){
					playheadTime=_playheadTime;
				}
			}
		}
		public function pause():void{
			_pause();
		}
		private function _pause():void{
			if(currPlayer){
				if(__playheadIsMovingOrIsGoingToMove){
					currPlayer.pause();
				}
			}
		}
		public function stop():void{
			_stop();
		}
		private function _stop():void{
			if(currPlayer){
				if(__isPlay){
					currPlayer.stop();
					playheadTime=0;
				}
			}
		}
		private function _stop2():void{//和_stop()的唯一区别是不跳到第一帧
			if(currPlayer){
				if(__isPlay){
					currPlayer.stop();
					//playheadTime=0;
				}
			}
		}
		
		private function update(isRelease:Boolean):void{
			clearTimeout(timeoutId);
			if(currPlayer){
				currPlayheadTime=skin.slider.value*totalTime;
				if(isRelease){
					playheadTime=currPlayheadTime;
				}
				updateTimeStr(currPlayheadTime);
			}
		}
		private function updateTimeStr(_playheadTime:Number):void{
			if(currPlayer){
				if(skin){
					if(skin.timeTxt){
						skin.timeTxt["txt"].text=getTimeStr(_playheadTime)+"/"+getTimeStr(totalTime);
					}
				}
			}
		}
		private static function getTimeStr(time:int):String{
			return (100+int(time/60)).toString().substr(1)+":"+(100+(time%60)).toString().substr(1);
		}
		
	}
}