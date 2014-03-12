<?php

class NodeController extends Controller
{
	private $allowPhotoMime = array( 					//设定允许图片类型
								"image/gif"		=>"gif", 
								"image/png"		=>"png", 
								"image/jpeg"	=>"jpg", 
								"image/jpg"		=>"jpg", 
								"image/pjpeg"	=>"jpg",
								"image/x-png"	=>"png",
								"image/bmp"		=>"bmp"
								);

	// Actions
	/**
	 * 对于前8条 item 列表调用
	 * GET /node/item
	 */
	public function actionList()
	{
	  	$items = Node::model()->recently()->findAll(); //默认获取前8条状态为1: published的内容
		if(empty($items)) 
		{
		  $this->_sendResponse(200, $this->error('end', 1001)); //内容表没有数据
		}
		else
		  {
		    $rows = array();
		    foreach($items as $ke =>$item) //ar转数组
		    {
		    	$rows[] = $item->attributes;
		    	foreach ($rows[$ke] as $key => $value) //去除不予显示的字段
		    	{
		    		if(is_null($value))
		    			unset($rows[$ke][$key]); //删除数组元素
		    	}
		  	}
		    $this->_sendResponse(200, $this->success('success',2001,$rows)); //获取列表成功
		}

	}

	/**
	 * 对于某个 item 信息调用
	 * GET /node/item/(\d+) 
	 */
	public function actionView()
	{
	  	if(!isset($_GET['id']))
		   $this->_sendResponse(200, $this->error('end', 1002) ); //未传入id参数

		$item = Node::model()->findByPk($_GET['id']);

		if(is_null($item))
		    $this->_sendResponse(200, $this->error('end', 1003)); //该id不存在

		if (Node::model()->is_published($item)) 
			$this->_sendResponse(200, $this->error('end', 1004)); //id status状态为0：unpublished，不准予显示
		else
		{
			$item=$item->attributes;  //部分数据不输出
			unset($item['createtime']);
			unset($item['status']);
			unset($item['cookieval']);
		    $this->_sendResponse(200, $this->success('success',2002,$item)); //获取该条数据成功
		}
	}

	/**
	 * 创建一个  item 的方法 
	 * POST /node/item
	 */
	public function actionCreate()
	{
		Drtool::mkpath(); 										//创建日期文件夹
		$save_name=Drtool::randomNew();							//创建文件名 用于视频文件名与缩略图文件名
		$save_photopath="./uploads".'/'.date("Y/n/j") .'/';		//保存图片地址
		$save_path=dirname(Yii::app()->BasePath)."/uploads".'/'.date("Y/n/j") .'/';			//保存影片，缩略图实际地址
		$save_sql_path="uploads".'/'.date("Y/n/j") .'/';			//数据库缩略图地址

		//判断数据是否为空
		if(!isset($_POST['photo']))
			$this->_sendResponse(200, $this->error('end', 1008) ); //未传入id参数
		if(!isset($_POST['pngnum']))
			$this->_sendResponse(200, $this->error('end', 1009) ); //未传入嘴唇序列（1-9）
		if(!isset($_POST['pngx']))
			$this->_sendResponse(200, $this->error('end', 1010) ); //未传入嘴唇x坐标
		if(!isset($_POST['pngy']))
			$this->_sendResponse(200, $this->error('end', 1011) ); //未传入嘴唇y坐标
		if(!isset($_POST['pngr']))
			$this->_sendResponse(200, $this->error('end', 1012) ); //未传入旋转角度
		if(!isset($_POST['pngw']))
			$_POST['pngw']=200; 								   //未传入嘴唇png宽度,使用默认宽度200
		if(!isset($_POST['pngh']))
			$_POST['pngh']=200; 								   //未传入嘴唇png高度,使用默认高度200
		
		//intval()取整数，验证数据
		if(is_null(Drtool::photoType($this->allowPhotoMime,$_POST['photo'])))	//传入图片类型不匹配
			$this->_sendResponse(200, $this->error('end', 1013) ); 
		if(intval($_POST['pngnum'])<1 || intval($_POST['pngnum'])>9)	//传入png序列不正确1-9
			$this->_sendResponse(200, $this->error('end', 1014) ); 
		if(intval($_POST['pngx'])<0 || intval($_POST['pngx'])>800)		//传入png x坐标不正确0-800
			$this->_sendResponse(200, $this->error('end', 1015) ); 
		if(intval($_POST['pngy'])<0 || intval($_POST['pngy'])>800)		//传入png y坐标不正确0-800
			$this->_sendResponse(200, $this->error('end', 1016) ); 
		if(intval($_POST['pngr'])<0 || intval($_POST['pngr'])>359)		//传入png r度数不正确0-359
			$this->_sendResponse(200, $this->error('end', 1017) ); 
		if(intval($_POST['pngw'])<0 || intval($_POST['pngw'])>800)		//传入png w宽度不正确0-800
			$this->_sendResponse(200, $this->error('end', 1018) ); 
		if(intval($_POST['pngh'])<0 || intval($_POST['pngh'])>800) 		//传入png h高度不正确0-800
			$this->_sendResponse(200, $this->error('end', 1019) );

		//获取图片类型后缀名
		$photoType=$this->allowPhotoMime[Drtool::photoType($this->allowPhotoMime,$_POST['photo'])];

		//base64图片保存为正常图片
		if(!Drtool::upPhotoBase64($this->allowPhotoMime,$_POST['photo'],$save_photopath,$save_name))  
			$this->_sendResponse(200, $this->error('end', 1020) ); 						  		//用户照片文件保存时出错(文件类型不允许，转换为图片时出错)
		//判断图片是否为正常图片
		if(!Drtool::isValidConvert($save_path.$save_name.".".$photoType))
			$this->_sendResponse(200, $this->error('end', 1025) ); 
		//将用户上传图片转化为jpg格式。方便进行视频合成转换
		if(!Drtool::imageToJPG($save_photopath.$save_name.".".$photoType,$save_photopath.$save_name.".jpg"))
			$this->_sendResponse(200, $this->error('end', 1027) ); 

		$photoType='jpg';//上面已经将用户上传照片处理为jpg格式。这里设置为jpg格式
		//转换视频	
		$is_convert=Drtool::photoToMp4($save_path,$save_name,$photoType,$_POST['pngnum'],$_POST['pngx'],$_POST['pngy'],$_POST['pngr'],$_POST['pngw'],$_POST['pngh']);
		//var_dump(exec("ffmpeg -threads 4 -y  -loop 1 -i '/home/drogjh/桌面/selfie_mouth/2.jpg' -i  '/var/www/avene-yii/png/mouth1/0/mouth1_0_%4d.png'  -i  '/var/www/avene-yii/wav/m1.wav' -filter_complex '[1:v]scale=200:200[a];[0:v][a]overlay=240:300[video]' -map '[video]' -map 2:a -r 15 -ar 22050 -shortest -vcodec h264 -movflags +faststart -s 800x800 -strict -2 -acodec aac -t 6.20   '/home/drogjh/桌面/selfie_mouth/out1.mp4'"));
		if($is_convert!="converted")
		 	$this->_sendResponse(200, $this->error('end', $is_convert) ); //ffmpeg转换错误代码

		//截取缩略图 250*250 800*800
		$is_screenshot=Drtool::screenshot($save_path,$save_name,250,250);
		if($is_screenshot!="screenshot")
			$this->_sendResponse(200, $this->error('end', $is_screenshot) ); //ffmpeg转换错误代码
		// $is_screenshot=Drtool::screenshot($save_path,$save_name,800,800);
		// if($is_screenshot!="screenshot")
		// 	$this->_sendResponse(200, $this->error('end', $is_screenshot) ); //ffmpeg转换错误代码


	   	$item = new Node;
	   	$item->video=$save_sql_path.$save_name.".mp4";				//视频地址
	   	$item->thumbnail=$save_sql_path.$save_name."thumbnail.jpg";	//缩略图地址
	   	$item->createtime=time();									//创建时间
	   	$item->status=0;											//保存状态 0：unpublished，1：published
	   	$cookietemp=Drtool::getMyCookie('cookiecreate');			//获取本地保存的cookie

	 	if(is_null($cookietemp))												//判断本地是否存在cookie
	 	{
	 		$randtemp=Drtool::randomNew(); 					//获取一个新的cookie
	   		Drtool::setMyCookie('cookiecreate',$randtemp);	//写入客户端cookie
	   		$item->cookieval=$randtemp;						//写入数据库cookie
	 	}												
	   	else
	   	{
	   		$item->cookieval=$cookietemp;	//写入数据库cookie
	   	}

		if($item->save())
		{
			$itema=$item->attributes;  //部分数据不输出
			unset($itema['createtime']);
			unset($itema['status']);
			unset($itema['cookieval']);
		    $this->_sendResponse(200, $this->success('success',2004,array_reverse($itema))); //创建该条数据成功
		}
		else 
		    $this->_sendResponse(200, $this->error('end', 1022) );//创建该条数据失败
	}

	/**
	 * 更新一个 item 的方法 
	 * POST /node/item/(\d+)
	 */
	public function actionUpdate()
	{
		if(!isset($_POST['id']))
		   $this->_sendResponse(200, $this->error('end', 1002) ); //未传入id参数

		$item = Node::model()->findByPk($_POST['id']); //获取该条数据
		  
		if(is_null($item))
		  $this->_sendResponse(200,$this->error('end', 1003)); //该id不存在

		if (!Node::model()->is_published($item)) 
			$this->_sendResponse(200, $this->error('end', 1005)); //该id status状态为1：published，已经完成。

		if (!Node::model()->is_cookiecreate($item))
			$this->_sendResponse(200, $this->error('end', 1006)); //越权操作。cookie值不匹配

		$item->status=1; //改变状态为已完成

		if($item->save())
		  $this->_sendResponse(200, $this->success('success',2003,$item->nid)); //修改数据库成功
		else
		  $this->_sendResponse(200, $this->error('end', 1007)); //修改数据库错误，
	}

	/**
	 * 删除某一item的方法，不开放
	 * DELETE /node/item/(\d+)
	 */
	/*
	public function actionDelete()
	{
	  	$item = Node::model()->findByPk($_GET['id']);
		if(is_null)
		    $this->_sendResponse(200, 'No Item found');
		if($item->delete())
		    $this->_sendResponse(200, 'Delete Success');
		else
		    $this->_sendResponse(500, 'Could not Delete Item');
	}
	*/

	// Assistant Functions

	//返回响应的方法
	private function _sendResponse($status = 200, $body = '', $content_type = 'text/html')
	{
	  $status_header = 'HTTP/1.1 ' . $status . ' ' . $this->_getStatusCodeMessage($status);
	  header($status_header);
	  header('Content-type: ' . $content_type);
	  echo CJSON::encode($body);
	  Yii::app()->end();
	}

	//返回错误的方法
	private function error($msg, $code)
	{
      return array(
          "data" => NULL,
          "error" => array(
              "code" => $code,
              "message" => $msg,
          ),
      );
  	}

  	//返回正确的方法
  	private function success($msg, $code,$arr=NULL)
	{
      return array(
          "data" => $arr,
          "success" => array(
              "code" => $code,
              "message" => $msg,
          ),
      );
  	}

	//获取 http 状态码的方法
	private function _getStatusCodeMessage($status)
	{
	  $codes = Array(
	    200 => 'OK',
	    400 => 'Bad Request',
	    401 => 'Unauthorized',
	    402 => 'Payment Required',
	    403 => 'Forbidden',
	    404 => 'Not Found',
	    500 => 'Internal Server Error',
	    501 => 'Not Implemented',
	  );
	  return (isset($codes[$status])) ? $codes[$status] : '';
	}



	public function actionTest()
	{
		//echo dirname(Yii::app()->BasePath);
		//print_r(exec("/usr/bin/ffprobe"));
		
		//Yii::app()->easyImage->thumbOf('./uploads/2014/3/12/2ed23df831a4d5fcb8603183f74a506c5c7c0300.jpg', array('type' => 'png'));
		/*$image = new EasyImage('./uploads/2014/3/12/1.png');
		//$data = $image->render('png');
		$image->save('./uploads/2014/3/12/2.jpg');
		*/

	}
}
