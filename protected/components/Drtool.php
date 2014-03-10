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
        $photoType="";
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

        if(is_null(exec("which ffmpeg")))
            return "1016";              //ffmpeg不存在

		echo "ffmpeg -threads 4 -y -loop 1 -i '".$save_path.$save_name.".".$photoType . "' -i  '/Applications/MAMP/htdocs/avene_selfie/png/mouth" . $pngnum . "/" . $pngr . "/mouth" . $pngnum . "_" . $pngr . "_%4d.png'  -i  '/Applications/MAMP/htdocs/avene_selfie/wav/m" . $pngnum. ".wav' -filter_complex '[1:v]scale=" . $pngw. ":". $pngh . "[a];[0:v][a]overlay=" . $pngx .":" .$pngy ."[video]' -map '[video]' -map 2:a -r 15 -ar 22050 -shortest -vcodec h264 -movflags +faststart -s 800x800 -strict -2 -acodec aac -t ". $pngTime[$pngnum] . " '" . $save_path . $save_name .".mp4'";
exit();
            exec("ffmpeg -threads 4 -y  -loop 1 -i '".$save_path.$save_name.".".$photoType . "' -i  '/Applications/MAMP/htdocs/avene_selfie/png/mouth" . $pngnum . "/" . $pngr . "/mouth" . $pngnum . "_" . $pngr . "_%4d.png'  -i  '/Applications/MAMP/htdocs/avene_selfie/wav/m" . $pngnum. ".wav' -filter_complex '[1:v]scale=" . $pngw. ":". $pngh . "[a];[0:v][a]overlay=" . $pngx .":" .$pngy ."[video]' -map '[video]' -map 2:a -r 15 -ar 22050 -shortest -vcodec h264 -movflags +faststart -s 800x800 -strict -2 -acodec aac -t ". $pngTime[$pngnum] . " '" . $save_path . $save_name .".mp4'",$output, $status);
        


        return "converted";
    }

    /**
     * 截图
     */
    public static function screenshot($save_path,$save_name,$width=250,$height=250)
    {
        if(is_null(exec("which ffmpeg")))
            return "1016";              //ffmpeg不存在

        exec("ffmpeg -i ". $save_path.$save_name. ".mp4" . " -y -f image2 -t 0.003 -s " . $width . "x". $height . " ". $save_path.$save_name."thumbnail.jpg");

         return "screenshot";
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
}
