/***
Mouth
创建人：ZЁЯ¤　身高：168cm+；体重：57kg+；已婚（单身美女们没机会了~~）；最爱的运动：睡觉；格言：路见不平，拔腿就跑。QQ：358315553。
创建时间：2014年03月07日 14:44:52
简要说明：这家伙很懒什么都没写。
用法举例：这家伙还是很懒什么都没写。
*/

package{
	import flash.display.*;
	import flash.events.*;
	import flash.geom.*;
	import flash.net.*;
	import flash.system.*;
	import flash.text.*;
	import flash.utils.*;
	
	import ui.Btn;
	
	import zero.ui.ImgLoader;
	
	public class Mouth extends Btn{
		
		public var xml:XML;
		
		public var img:ImgLoader;
		
		public var x0:int;
		public var y0:int;
		
		private var onPressThis:Function;
		
		public function Mouth(){
		}
		public function initXML(_xml:XML,_onPressThis:Function):void{
			xml=_xml;
			onPressThis=_onPressThis;
			if(xml.@href.toString()||xml.@js.toString()){
				this.href=xml;
				press=null;
			}else{
				this.href=null;
				press=pressThis;
			}
			img.load(<img src={xml.@src.toString()} align="center middle" smoothing="true"/>);
			x0=this.x;
			y0=this.y;
		}
		private function pressThis():void{
			if(onPressThis==null){
			}else{
				onPressThis(this);
			}
		}
	}
}