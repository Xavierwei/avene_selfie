/***
Base3D
创建人：ZЁЯ¤　身高：168cm+；体重：57kg+；已婚（单身美女们没机会了~~）；最爱的运动：睡觉；格言：路见不平，拔腿就跑。QQ：358315553。
创建时间：2014年01月08日 15:03:38
简要说明：这家伙很懒什么都没写。
用法举例：这家伙还是很懒什么都没写。
*/

package{
	import away3d.cameras.Camera3D;
	import away3d.containers.ObjectContainer3D;
	import away3d.containers.Scene3D;
	import away3d.containers.View3D;
	import away3d.debug.AwayStats;
	import away3d.debug.Trident;
	import away3d.primitives.WireframePlane;
	
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Matrix;
	import flash.geom.Matrix3D;
	import flash.geom.Vector3D;
	
	public class Base3D extends Sprite{
		
		private var onRendering:Function;
		
		private var view:View3D;
		private var containerContainer:ObjectContainer3D;
		public var container:ObjectContainer3D;
		public var scene:Scene3D;
		private var camera:Camera3D;
		
		private var timeoutId:int;
		
		private var rotateSpeedX:Number;
		private var rotateSpeedY:Number;
		private var oldMouseX:Number;
		private var oldMouseY:Number;
		private var isDragging:Boolean;
		
		public function Base3D(){
		}
		
		public function init(_onRendering:Function):void{
			
			onRendering=_onRendering;
			
			this.addChild(view = new View3D());
			this.addChild(new AwayStats(view));
			
			scene = new Scene3D();
			scene.addChild(containerContainer = new ObjectContainer3D());
			containerContainer.addChild(container = new ObjectContainer3D());
			var plane:WireframePlane=new WireframePlane(2000,2000,10,10,0xffffff,1,WireframePlane.ORIENTATION_XZ);
			container.addChild(plane);
			plane.y=-20;
			var trident:Trident=new Trident();
			container.addChild(trident);
			
			camera = new Camera3D();
			
			view.antiAlias = 4;
			view.scene = scene;
			view.camera = camera;
			
			view.camera.lens.far=20000;
			
			camera.y=2000;
			camera.z=-2000;
			camera.lookAt(new Vector3D(0,0,0));
			
			rotateSpeedX=0;
			rotateSpeedY=1;
			
			stage.addEventListener(MouseEvent.MOUSE_DOWN,mouseDown);
			stage.addEventListener(MouseEvent.MOUSE_UP,mouseUp);
			stage.addEventListener(MouseEvent.MOUSE_WHEEL,mouseWheel);
			
			this.addEventListener(Event.ENTER_FRAME,enterFrame);
			
		}
		
		private function enterFrame(...args):void{
			
			if(isDragging){
				rotateSpeedX=(oldMouseY-this.mouseY)*1.1;
				rotateSpeedY=(oldMouseX-this.mouseX)*1.1;
				oldMouseX=this.mouseX;
				oldMouseY=this.mouseY;
			}
			
			containerContainer.rotationX+=rotateSpeedX;
			container.rotationY+=rotateSpeedY;
			
			if(onRendering==null){
			}else{
				onRendering();
			}
			
			view.render();
			
		}
		
		private function mouseDown(...args):void{
			isDragging=true;
			oldMouseX=this.mouseX;
			oldMouseY=this.mouseY;
		}
		private function mouseUp(...args):void{
			isDragging=false;
			//trace(container.transform.rawData);
			//trace(containerContainer.transform.rawData);
		}
		private function mouseWheel(event:MouseEvent):void{
			if(event.delta<0){
				containerContainer.scale(0.9);
			}else{
				containerContainer.scale(1.1);
			}
		}
		
		public function setSize(wid:int,hei:int):void{
			view.width = wid;
			view.height = hei;
		}
		
		public function setMatrixs(containerMatrix:Matrix3D,containerContainerMatrix:Matrix3D):void{
			container.transform=containerMatrix;
			containerContainer.transform=containerContainerMatrix;
		}
		public function setSpeed(_rotateSpeedX:Number,_rotateSpeedY:Number):void{
			rotateSpeedX=_rotateSpeedX;
			rotateSpeedY=_rotateSpeedY;
		}
		
	}
}
