<?php
class Drtool {
    /**
     * 创建文件夹
     */
    public static function mkpath()
    {
        $dir = "./uploads";
        if (!is_dir($dir)) {
          mkdir($dir, 0777, TRUE);
        }
        $dir .= '/'.date("Y/n/j");
        if (!is_dir($dir)) {
          mkdir($dir, 0777, TRUE);
        }
    }
    
    /**
     * 随机函数
     */
    public static function randomNew()
    {
        return hash("sha1",time().md5(uniqid(rand(), TRUE)));
    }

    /**
     * 获取文件类型
     */
    public static function photoType($allowmine,$imgData)
    {
        $photoType=NULL;
        foreach (array_keys($allowmine) as $key => $value) //判断文件类型
        {
            if(strpos($imgData,$value)) //是否为允许的类型
            {
                $photoType=$value;
                break;
            }
        }
        return $photoType;
    }

    /**
     * base64保存为图片
     */
    public static function upPhotoBase64($allowmine,$imgData,$save_photopath,$save_name)
    {
        $photoType=self::photoType($allowmine,$imgData);

        if(is_null($photoType)) //判断上传的是否为允许的文件类型
            return false;

        $imgTemp = base64_decode(str_replace('data:'. $photoType . ';base64,', '', $imgData)); //base64解码

        if(file_put_contents($save_photopath . $save_name. '.' . $allowmine[$photoType] , $imgTemp))
            return true;

        return false;
    }

    /**
     * 合成视频文件
     */
    public static function photoToMp4($save_path,$save_name,$photoType,$pngnum=1,$pngx=0,$pngy=0,$pngr=0,$pngw=200,$pngh=200)
    {
        $pngTime=array("0","6.20","5.48","6.13","3.80","6.21","4.51","5.24","5.56","5.40");

        if(is_null(exec("which ffmpeg",$output)))
          if(is_null(exec("which ffmpeg 2>/dev/null 2>&1",$output)))
            return "1021";              //ffmpeg不存在

        exec($output." -threads 4 -y  -loop 1 -i '".$save_path.$save_name.".".$photoType . "' -i  '".dirname(Yii::app()->BasePath)."/png/mouth" . $pngnum . "/" . $pngr . "/mouth" . $pngnum . "_" . $pngr . "_%4d.png'  -i  '". dirname(Yii::app()->BasePath) . "/wav/m" . $pngnum. ".wav' -filter_complex '[1:v]scale=" . $pngw. ":". $pngh . "[a];[0:v][a]overlay=" . $pngx .":" .$pngy ."[video]' -map '[video]' -map 2:a -r 15 -ar 22050 -shortest -vcodec h264 -movflags +faststart -s 800x800 -strict -2 -acodec aac -t ". $pngTime[$pngnum] . " '" .$save_path . $save_name .".mp4'",$output, $status);                
        
        if(!self::isValidConvert($save_path . $save_name .".mp4'")) //判断视频截图是否截取成功
          return "1023";  //视频转换失效

        return "converted";
    }

    /**
     * 截取缩略图
     */
    public static function screenshot($save_path,$save_name,$width=250,$height=250)
    {
        if(is_null(exec("which ffmpeg",$output)))
          if(is_null(exec("which ffmpeg 2>/dev/null 2>&1",$output)))
            return "1021";              //ffmpeg不存在

        exec($output." -i ". $save_path.$save_name. ".mp4" . " -y -f image2 -t 0.003 -s " . $width . "x". $height . " ". $save_path.$save_name."thumbnail.jpg");

        if(!self::isValidConvert($save_path.$save_name."thumbnail.jpg")) //判断视频截图是否截取成功
          return "1024";  //截取不成功

        return "screenshot";
    }
    /**
     * 检查转换状态
     */
    public static function isValidConvert($path) 
    {
      if(is_null(exec("which ffprobe",$output)))
          if(is_null(exec("which ffprobe 2>/dev/null 2>&1",$output)))
            return "1021";              //ffprobe不存在

        $cmd = $output. " " . $path . "  2>/dev/null 2>&1";
        $result = shell_exec($cmd);
        if (strpos($result, "Invalid") !== FALSE)
        {
            return FALSE;
        }
        return TRUE;
    }

    /**
     * 设置cookie
     */
    public static function setMyCookie($name,$val)
    {
        //新建cookie
        $cookie = new CHttpCookie($name, Drtool::randomNew());
        //定义cookie的有效期
        $cookie->expire =time()+60*60*24*5; //有限期5天
        //把cookie写入cookies使其生效
        Yii::app()->request->cookies[$name]=$cookie;
    }
    /**
     * 读取cookie
     */
    public static function getMyCookie($name)
    {
      $cookie =Yii::app()->request->getCookies();
      if(is_null($cookie[$name]->value))
        return NULL;
      else
        return $cookie[$name]->value;
    }
    /**
     * 销毁cookie 
     */
    public static function CleanMyCookie($name)
    {
      $cookie =Yii::app()->request->getCookies();
      unset($cookie[$name]);
    }
}

