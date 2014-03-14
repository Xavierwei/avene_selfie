/***
Main
创建人：ZЁЯ¤　身高：168cm+；体重：57kg+；已婚（单身美女们没机会了~~）；最爱的运动：睡觉；格言：路见不平，拔腿就跑。QQ：358315553。
创建时间：2014年03月06日 15:18:54
简要说明：这家伙很懒什么都没写。
用法举例：这家伙还是很懒什么都没写。
*/

package{
	import com.greensock.TweenMax;
	import com.hurlant.util.Base64;
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.display.PixelSnapping;
	import flash.display.Sprite;
	import flash.events.ActivityEvent;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.StatusEvent;
	import flash.external.ExternalInterface;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.media.Camera;
	import flash.media.Video;
	import flash.net.FileFilter;
	import flash.net.FileReference;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.system.Security;
	import flash.system.SecurityPanel;
	import flash.utils.ByteArray;
	
	import nt.imagine.exif.ExifExtractor;
	import nt.imagine.exif.prototype.IFDEntry;
	
	import zero.FileTypes;
	import zero.codec.BMPEncoder;
	import zero.codec.JPEGEncoder;
	import zero.ui.FreeTran;
	import zero.utils.playAll;
	import zero.utils.stopAll;
	
	public class Main extends Sprite{
		
		private static const bmdPX:int=800;
		
		private var xmlLoader:URLLoader;
		private var xml:XML;
		
		private var fengmianLoader:Loader;
		
		public var page1:Page1;
		public var page2:Page2;
		public var page3:Page3;
		public var page4:Page4;
		public var loading:Sprite;
		//public var page5:Page5;
		
		private var btnMoveX0:Number;
		private var btnMoveY0:Number;
		
		private var fr:FileReference;
		private var imgLoader:Loader;
		
		private var camera:Camera;
		private var video:Video;
		private var cameraOK:Boolean;
		
		private var bmd:BitmapData;
		private var bmp:Bitmap;
		
		private var targetBmd:BitmapData;
		
		private var currDraggingMouth:Mouth;
		private var currMouth:Mouth;
		
		private var oldScale:Number;
		
		private var Orientation:int;
		
		public function Main(){
			
			this.visible=false;
			
			this.tabEnabled=this.tabChildren=false;
			this.mouseEnabled=false;
			
			xmlLoader=new URLLoader();
			xmlLoader.addEventListener(Event.COMPLETE,loadXMLComplete);
			xmlLoader.load(new URLRequest(
				this.loaderInfo.parameters.xml
				||
				"xml/config.xml"
			));
			
			page2._3210.stop();
			stopAll(loading);
			
		}
		
		private function loadXMLComplete(...args):void{
			
			xmlLoader.removeEventListener(Event.COMPLETE,loadXMLComplete);
			xml=new XML(xmlLoader.data);
			xmlLoader=null;
			
			init();
			
		}
		
		private function init():void{
			fengmianLoader=new Loader();
			fengmianLoader.contentLoaderInfo.addEventListener(Event.COMPLETE,loadBottomComplete);
			fengmianLoader.load(new URLRequest(xml.fengmian[0].@src.toString()));
		}
		private function loadBottomComplete(...args):void{
			
			fengmianLoader.contentLoaderInfo.removeEventListener(Event.COMPLETE,loadBottomComplete);
			page1.fengmian.addChild(fengmianLoader);
			fengmianLoader=null;
			
			targetBmd=new BitmapData(bmdPX,bmdPX,true,0x00000000);
			
			page1.container.addChild(new Bitmap(targetBmd,PixelSnapping.AUTO,true));
			page3.container.addChild(bmp=new Bitmap());
			page4.container.addChild(new Bitmap(targetBmd,PixelSnapping.AUTO,true));
			
			fr=new FileReference();
			fr.addEventListener(Event.SELECT,select);
			fr.addEventListener(Event.COMPLETE,loadComplete);
			imgLoader=new Loader();
			imgLoader.contentLoaderInfo.addEventListener(Event.COMPLETE,loadImgComplete);
			
			page3.bottom.addEventListener(MouseEvent.MOUSE_DOWN,startDragFreeTran);
			
			page4.mouthArea.mouseEnabled=false;
			var x:int=0;
			var y:int=0;
			for each(var mouthXML:XML in xml.mouths[0].mouth){
				var mouth:Mouth=new Mouth();
				page4.mouthArea.addChild(mouth);
				mouth.x=x;
				mouth.y=y;
				mouth.initXML(mouthXML,pressMouth);
				if((x+=120)>=360){
					x=0;
					y+=120;
				}
			}
			
			page4.tran.visible=false;
			page4.btnPreview.mouseEnabled=false;
			page4.btnPreview.alpha=0.5;
			page4.tran.dragBtn.press=startMoveMouth;
			page4.tran.btnX.press=currMouthBack;
			page4.tran.btnRotate.press=startRotateMouth;
			
			loading.visible=false;
			
			if(ExternalInterface.available){
				ExternalInterface.addCallback(xml.js2flash[0].@callback.toString(),js2flashUploadComplete);
				ExternalInterface.addCallback(xml.js2flash[1].@callback.toString(),reset);
			}
			
			this.visible=true;
			
			showPage1();
			
			if(ExternalInterface.available){
				ExternalInterface.call("eval",xml.onLoaded[0].@action.toString());
			}
			
		}
		
		private function showPage1():void{
			
			clearCamera();
			
			page1.btnStart.release=start;
			page1.btnUpload.release=browse;
			
			_showPage(page1);
			
			if(ExternalInterface.available){
				ExternalInterface.call("eval",xml.onReset[0].@action.toString());
			}
			
		}
		private function showPage2():void{
			
			_showPage(page2);
			
			page2.btnPaizhao.release=paizhao;
			page2.btnBack.release=showPage1;
			
			if(ExternalInterface.available){
				ExternalInterface.call("eval",xml.onStartPaizhao[0].@action.toString());
			}
			
		}
		private function showPage3():void{
			
			_showPage(page3);
			
			page3.btnBack.release=showPage1;
			page3.btnNext.release=showPage4;
			
			page3.freeTran.skewEnabled=false;
			//page3.freeTran.scaleArea.getChildAt(0).visible=false;
			//page3.freeTran.scaleArea.getChildAt(1).visible=false;
			//page3.freeTran.scaleArea.getChildAt(2).visible=false;
			//page3.freeTran.scaleArea.getChildAt(3).visible=false;
			page3.freeTran.addChildAt(page3.freeTran.dragArea,0);
			page3.freeTran.useUserMouse=false;
			page3.freeTran.minWid=100;
			page3.freeTran.minHei=100;
			page3.freeTran.lockScale=true;
			page3.moveMc.mouseEnabled=page3.moveMc.mouseChildren=false;
			page3.moveMc.x=page3.freeTran.x;
			page3.moveMc.y=page3.freeTran.y;
			page3.freeTran.onStartTran=startTran;
			page3.freeTran.onTran=tran;
			page3.freeTran.onStopTran=stopTran;
			page3.moveMc2.visible=false;
			
			oldScale=bmp.scaleX;
			//trace("oldScale="+oldScale);
			
			page3.freeTran.setPic(bmp);
			
			page3.container.cacheAsBitmap=true;
			page3.containerMask.cacheAsBitmap=true;
			page3.container.mask=page3.containerMask;
			
			updateTargetBmd();
			
		}
		private function startDragFreeTran(...args):void{
			page3.freeTran.setPic(bmp,true);
		}
		
		private function startTran(pic:DisplayObject,matrix:Matrix,type:String):void{
			if(type==FreeTran.TYPE_DRAG){
				trace("drag");
				TweenMax.killTweensOf(page3.moveMc);
				var dis:int=30;
				page3.moveMc.startDrag(false,new Rectangle(page3.moveMc2.x-dis,page3.moveMc2.y-dis,dis*2,dis*2));
			}
		}
		private function tran(pic:DisplayObject,matrix:Matrix,type:String):void{
			if(type==FreeTran.TYPE_SCALE){
				var b1:Rectangle=bmp.getBounds(bmp.parent);
				if((bmp.scaleX-oldScale)*(bmp.scaleX-oldScale)>(bmp.scaleY-oldScale)*(bmp.scaleY-oldScale)){
					oldScale=bmp.scaleY=bmp.scaleX;
				}else{
					oldScale=bmp.scaleX=bmp.scaleY;
				}
				var b2:Rectangle=bmp.getBounds(bmp.parent);
				bmp.x+=(b1.x+b1.width/2)-(b2.x+b2.width/2);
				bmp.y+=(b1.y+b1.height/2)-(b2.y+b2.height/2);
				page3.freeTran.setPic(bmp);
			}
		}
		private function stopTran(...args):void{
			//trace(args);
			stopDrag();
			TweenMax.to(page3.moveMc,12,{x:page3.moveMc2.x,y:page3.moveMc2.y,useFrames:true});
			updateTargetBmd();
		}
		
		private function showPage4():void{
			
			_showPage(page4);
			
			page4.btnBack.release=showPage3;
			page4.btnPreview.release=ok;
			
		}
		
		private function updateTargetBmd():void{
			targetBmd.fillRect(targetBmd.rect,0xffffffff);
			page3.container.mask=null;
			targetBmd.draw(page3.container);
			page3.container.mask=page3.containerMask;
			page1.fengmian.visible=false;
		}
		
		private function _showPage(page:Sprite):void{
			
			var i:int=this.numChildren;
			while(i--){
				var _page:Sprite=this.getChildAt(i) as Sprite;
				if(_page&&/^page\d+$/.test(_page.name)){
				}else{
					continue;
				}
				_page.alpha=0;
				_page.mouseEnabled=_page.mouseChildren=false;
			}
			
			page.mouseChildren=true;
			TweenMax.to(page,8,{alpha:1,useFrames:true});
			
		}
		
		private function start():void{
			if(cameraOK){
				showPage2();
			}else{
				if(Camera.isSupported){
					camera = Camera.getCamera();
					trace("申请摄像头");
					if (camera) {
						if(camera.muted){
							Security.showSettings(SecurityPanel.PRIVACY);
							camera.addEventListener(StatusEvent.STATUS,camera_status);
						}else{
							//trace(bmdPX*(320/240));
							camera.setMode(320*2,240*2,camera.fps);
							//camera.setMode(320*3,240*3,camera.fps);//2倍以上会变形
							//camera.setMode(320*3.4,240*3.4,camera.fps);//3倍以上会变形
							//camera.setMode(Math.round(bmdPX*(320/240)),bmdPX,camera.fps);
							camera.addEventListener(ActivityEvent.ACTIVITY, activityHandler);
							video = new Video(Math.round(bmdPX*(320/240)),bmdPX);
							video.attachCamera(camera);
							video.smoothing=true;
							page2.cameraArea.addChild(video);
							video.alpha=0;
							TweenMax.to(video,8,{alpha:1,useFrames:true,delay:8});
						}
						return;
					}
				}
				if(ExternalInterface.available){
					ExternalInterface.call("alert","找不到摄像头");
				}
			}
		}
		private function camera_status(event:StatusEvent):void{
			switch(event.code){
				case "Camera.Muted":
					trace("您成功拒绝使用摄像头");
				break;
				default:
					trace("camera_status "+event);
					camera.removeEventListener(StatusEvent.STATUS,camera_status);
					start();
				break;
			}
		}
		private function activityHandler(event:ActivityEvent):void {
			trace("activityHandler: " + event);
			if(event.activating){
				camera.removeEventListener(ActivityEvent.ACTIVITY, activityHandler);
				cameraOK=true;
				showPage2();
			}
		}
		private function paizhao():void{
			this.mouseChildren=false;
			page2._3210.gotoAndPlay(2);
			page2._3210.addFrameScript(0,_3210Complete);
			
			if(ExternalInterface.available){
				ExternalInterface.call("eval",xml.onPaizhao[0].@action.toString());
			}
			
		}
		private function _3210Complete():void{
			this.mouseChildren=true;
			
			page2._3210.addFrameScript(0,null);
			page2._3210.stop();
			
			var bmd:BitmapData=new BitmapData(bmdPX,bmdPX,false,0xffffff);
			var b:Rectangle=page2.bottom.getBounds(page2.cameraArea);
			bmd.draw(page2.cameraArea,new Matrix(1,0,0,1,-b.x,-b.y));
			
			clearCamera();
			
			doo(bmd);
		}
		
		private function clearCamera():void{
			if(video){
				
				camera.removeEventListener(ActivityEvent.ACTIVITY, activityHandler);
				video.attachCamera(null);
				page2.cameraArea.removeChild(video);
				video=null;
				
				cameraOK=false;
				
				trace("clearCamera");
				
			}
		}
		
		private function browse():void{
			try{
				fr.browse([new FileFilter("图片（*.jpg;*.png;*.gif;*.bmp）","*.jpg;*.png;*.gif;*.bmp")]);
			}catch(e:Error){
				if(ExternalInterface.available){
					ExternalInterface.call("alert","e="+e);
				}
			}
		}
		private function select(...args):void{
			fr.load();
		}
		private function loadComplete(...args):void{
			
			Orientation=1;
			
			switch(FileTypes.getType(fr.data,fr.name)){
				case FileTypes.JPG:
					
					var exifMgr:ExifExtractor=new ExifExtractor(fr.data);
					
					for each(var tag:IFDEntry in exifMgr.getAllTag()){
						if(tag.EN=="Orientation"){
							Orientation=int(tag.values);
							break;
						}
					}
					
					imgLoader.loadBytes(fr.data);
					
				break;
				case FileTypes.PNG:
				case FileTypes.GIF:
					imgLoader.loadBytes(fr.data);
				break;
				case FileTypes.BMP:
					doo(BMPEncoder.decode(fr.data));
				break;
			}
		}
		private function loadImgComplete(...args):void{
			var bmd0:BitmapData=(imgLoader.content as Bitmap).bitmapData;
			//http://www.media.mit.edu/pia/Research/deepview/exif.html
			//0x0112 Orientation  unsigned short 1  The orientation of the camera relative to the scene, when the image was captured. The start point of stored data is, '1' means upper left, '3' lower right, '6' upper right, '8' lower left, '9' undefined. 
			trace("Orientation="+Orientation);
			switch(Orientation){
				case 3:
					bmd=new BitmapData(bmd0.width,bmd0.height,bmd0.transparent,0x00000000);
					bmd.draw(bmd0,new Matrix(-1,0,0,-1,bmd.width,bmd.height));
				break;
				case 6:
					bmd=new BitmapData(bmd0.height,bmd0.width,bmd0.transparent,0x00000000);
					bmd.draw(bmd0,new Matrix(0,1,-1,0,bmd.width,0));
				break;
				case 8:
					bmd=new BitmapData(bmd0.height,bmd0.width,bmd0.transparent,0x00000000);
					bmd.draw(bmd0,new Matrix(0,-1,1,0,0,bmd.height));
				break;
				default:
					var bmd:BitmapData=bmd0;
				break;
			}
			doo(bmd);
		}
		
		private function doo(_bmd:BitmapData):void{
			if(bmd){
				bmd.dispose();
			}
			bmd=_bmd;
			bmp.bitmapData=bmd;
			bmp.smoothing=true;
			bmp.transform.matrix=new Matrix();
			//if(bmp.width>bmdPX||bmp.height>bmdPX){
				if(bmp.width/bmp.height<bmdPX/bmdPX){
					bmp.scaleX=bmp.scaleY=bmdPX/bmp.width;
				}else{
					bmp.scaleX=bmp.scaleY=bmdPX/bmp.height;
				}
			//}
			bmp.x=-(bmp.width-bmdPX)/2;
			bmp.y=-(bmp.height-bmdPX)/2;
			showPage3();
			
			if(ExternalInterface.available){
				ExternalInterface.call("eval",xml.onGetImg[0].@action.toString());
			}
		}
		
		private function pressMouth(mouth:Mouth):void{
			currDraggingMouth=mouth;
			currDraggingMouth.parent.addChild(currDraggingMouth);
			currDraggingMouth.startDrag(false);
			stage.addEventListener(MouseEvent.MOUSE_UP,stopDragMouth);
		}
		private function stopDragMouth(...args):void{
			stage.removeEventListener(MouseEvent.MOUSE_UP,stopDragMouth);
			stopDrag();
			
			if(page4.bottom.hitTestPoint(stage.mouseX,stage.mouseY)){
			}else{
				//TweenMax.to(currDraggingMouth,8,{x:currDraggingMouth.x0,y:currDraggingMouth.y0,useFrames:true});
				//return;
				var b:Rectangle=page4.bottom.getBounds(page4);
				currDraggingMouth.x=int(b.x+b.width/2)-page4.mouthArea.x;
				currDraggingMouth.y=int(b.y+b.height/2)-page4.mouthArea.y;
			}
			
			currMouthBack();
			currMouth=currDraggingMouth;
			currMouth.mouseEnabled=false;
			page4.tran.transform.matrix=currMouth.transform.matrix;
			page4.tran.x+=page4.mouthArea.x;
			page4.tran.y+=page4.mouthArea.y;
			page4.tran.visible=true;
			page4.btnPreview.mouseEnabled=true;
			page4.btnPreview.alpha=1;
		}
		
		private function startMoveMouth():void{
			page4.tran.startDrag();
			stage.addEventListener(MouseEvent.MOUSE_UP,stopMoveMouth);
			stage.addEventListener(MouseEvent.MOUSE_MOVE,updateCurrMouth);
		}
		private function updateCurrMouth(...args):void{
			currMouth.transform.matrix=page4.tran.transform.matrix;
			currMouth.x-=page4.mouthArea.x;
			currMouth.y-=page4.mouthArea.y;
		}
		private function stopMoveMouth(...args):void{
			stage.removeEventListener(MouseEvent.MOUSE_UP,stopMoveMouth);
			stage.removeEventListener(MouseEvent.MOUSE_MOVE,updateCurrMouth);
			stopDrag();
		}
		private function currMouthBack():void{
			if(currMouth){
				currMouth.mouseEnabled=true;
				TweenMax.to(currMouth,8,{x:currMouth.x0,y:currMouth.y0,rotation:0,scaleX:1,scaleY:1,useFrames:true});
				currMouth=null;
			}
			page4.tran.visible=false;
			page4.btnPreview.mouseEnabled=false;
			page4.btnPreview.alpha=0.5;
		}
		private function startRotateMouth():void{
			stage.addEventListener(MouseEvent.MOUSE_UP,stopRotateMouth);
			stage.addEventListener(MouseEvent.MOUSE_MOVE,rotateMouth);
		}
		private function rotateMouth(...args):void{
			page4.tran.rotation=Math.atan2(this.mouseY-page4.tran.y,this.mouseX-page4.tran.x)*180/Math.PI-45;
			updateCurrMouth();
		}
		private function stopRotateMouth(...args):void{
			stage.removeEventListener(MouseEvent.MOUSE_UP,stopRotateMouth);
			stage.removeEventListener(MouseEvent.MOUSE_MOVE,rotateMouth);
		}
		
		private function ok():void{
			loading.visible=true;
			playAll(loading);
			
			var jpgData:ByteArray=JPEGEncoder.encode(targetBmd);
			if(ExternalInterface.available){
				var p:Point=page4.container.globalToLocal(currMouth.localToGlobal(new Point()));
				var action:String=xml.flash2js[0].@action.toString()
					.replace(/\$\{Photo\}/g,Base64.encodeByteArray(jpgData))
					.replace(/\$\{Mouth_id\}/g,currMouth.xml.@id.toString())
					.replace(/\$\{Mouth_x\}/g,Math.round(p.x))
					.replace(/\$\{Mouth_y\}/g,Math.round(p.y))
					.replace(/\$\{Mouth_rotation\}/g,Math.round(currMouth.rotation));
				ExternalInterface.call("eval",action);
			}else{
				new FileReference().save(jpgData,"img.jpg");
			}
		}
		private function js2flashUploadComplete(photo_id:String,photourl:String):void{
			
			//if(ExternalInterface.available){
			//	ExternalInterface.call("alert","photo_id="+photo_id+"，photourl="+photourl);
			//}
			
			//if(ExternalInterface.available){
			//	ExternalInterface.call("eval",xml.onReset[0].@action.toString());
			//}
			
			loading.visible=false;
			stopAll(loading);
			
		}
		
		private function reset():void{
			loading.visible=false;
			stopAll(loading);
			currMouthBack();
			showPage1();
		}
		
	}
}