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

        if(!(exec("which ffmpeg",$output)))
          if(!(exec("which ffmpeg 2>/dev/null 2>&1",$output)))
            return "1021";              //ffmpeg不存在
        if()
        exec($output[0]." -threads 4 -y  -loop 1 -i '".$save_path.$save_name.".".$photoType . "' -i  '".dirname(Yii::app()->BasePath)."/png/mouth" . $pngnum . "/" . $pngr . "/mouth" . $pngnum . "_" . $pngr . "_%4d.png'  -i  '". dirname(Yii::app()->BasePath) . "/wav/m" . $pngnum. ".wav' -filter_complex '[1:v]scale=" . $pngw. ":". $pngh . "[a];[0:v][a]overlay=" . $pngx .":" .$pngy ."[video]' -map '[video]' -map 2:a -r 15 -ar 22050 -shortest -vcodec h264 -movflags +faststart -s 800x800 -strict -2 -acodec aac -t ". $pngTime[$pngnum] . " '" .$save_path . $save_name .".mp4'");

        if(!self::isValidConvert($save_path . $save_name .".mp4'")) //判断视频截图是否截取成功
          return "1023";  //视频转换失效

        return "converted";
    }

    /**
     * 截取缩略图
     */
    public static function screenshot($save_path,$save_name,$width=250,$height=250)
    {
      if(!file_exists($save_path.$save_name.".mp4"))
       return '1023'; //视频文件不存在

        if(!(exec("which ffmpeg",$output)))
          if(!(exec("which ffmpeg 2>/dev/null 2>&1",$output)))
            return "1021";              //ffmpeg不存在

        exec($output[0]." -i ". $save_path.$save_name. ".mp4" . " -y -f image2 -t 0.003 -s " . $width . "x". $height . " ". $save_path.$save_name."thumbnail_".$width."_".$height.".jpg");

        if(!self::isValidConvert($save_path.$save_name."thumbnail_".$width."_".$height.".jpg")) //判断视频截图是否截取成功
          return "1024";  //截取不成功


        return "screenshot";
    }
    /**
     * 检查转换状态
     */
    public static function isValidConvert($path)
    {
      if(!(exec("which ffprobe",$output))) //$output返回数组对象，使用$output[0]获取第一个返回
          if(!(exec("which ffprobe 2>/dev/null 2>&1",$output)))
            return "1021";              //ffprobe不存在

        $cmd = $output[0]. " " . $path . "  2>/dev/null 2>&1";
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
      if(is_null($cookie[$name])) //先判断对象是否存在。
        return NULL;
      else
        return $cookie[$name]->value; //对象存在返回cookie数值
    }
    /**
     * 销毁cookie
     */
    public static function cleanMyCookie($name)
    {
      $cookie =Yii::app()->request->getCookies();
      unset($cookie[$name]);
    }

    /**
     * gif,bmp,png to jpg
     * imageToJPG('源文件名','目标文件名',目标宽,目标高);
     */
    public static function imageCreateFromBMP($filename)
    {
      if ( ! $f1 = fopen ( $filename , "rb" )) return FALSE ;

      $FILE = unpack ( "vfile_type/Vfile_size/Vreserved/Vbitmap_offset" , fread ( $f1 , 14 ));
      if ( $FILE [ 'file_type' ] != 19778 ) return FALSE ;

      $BMP = unpack ( 'Vheader_size/Vwidth/Vheight/vplanes/vbits_per_pixel' . '/Vcompression/Vsize_bitmap/Vhoriz_resolution' .
      '/Vvert_resolution/Vcolors_used/Vcolors_important' , fread ( $f1 , 40 ));
      $BMP [ 'colors' ] = pow ( 2 , $BMP [ 'bits_per_pixel' ]);
      if ( $BMP [ 'size_bitmap' ] == 0 ) $BMP [ 'size_bitmap' ] = $FILE [ 'file_size' ] - $FILE [ 'bitmap_offset' ];
      $BMP [ 'bytes_per_pixel' ] = $BMP [ 'bits_per_pixel' ] / 8 ;
      $BMP [ 'bytes_per_pixel2' ] = ceil ( $BMP [ 'bytes_per_pixel' ]);
      $BMP [ 'decal' ] = ( $BMP [ 'width' ] * $BMP [ 'bytes_per_pixel' ] / 4 );
      $BMP [ 'decal' ] -= floor ( $BMP [ 'width' ] * $BMP [ 'bytes_per_pixel' ] / 4 );
      $BMP [ 'decal' ] = 4 - ( 4 * $BMP [ 'decal' ]);
      if ( $BMP [ 'decal' ] == 4 ) $BMP [ 'decal' ] = 0 ;

      $PALETTE = array ();
      if ( $BMP [ 'colors' ] < 16777216 )
      {
      $PALETTE = unpack ( 'V' . $BMP [ 'colors' ] , fread ( $f1 , $BMP [ 'colors' ] * 4 ));
      }

      $IMG = fread ( $f1 , $BMP [ 'size_bitmap' ]);
      $VIDE = chr ( 0 );
      $res = imagecreatetruecolor( $BMP [ 'width' ] , $BMP [ 'height' ]);
      $P = 0 ;
      $Y = $BMP [ 'height' ] - 1 ;
      while ( $Y >= 0 )
      {
      $X = 0 ;
      while ( $X < $BMP [ 'width' ])
      {
      if ( $BMP [ 'bits_per_pixel' ] == 24 )
      $COLOR = unpack ( "V" , substr ( $IMG , $P , 3 ) . $VIDE );
      elseif ( $BMP [ 'bits_per_pixel' ] == 16 )
      {
      $COLOR = unpack ( "n" , substr ( $IMG , $P , 2 ));
      $COLOR [ 1 ] = $PALETTE [ $COLOR [ 1 ] + 1 ];
      }
      elseif ( $BMP [ 'bits_per_pixel' ] == 8 )
      {
      $COLOR = unpack ( "n" , $VIDE . substr ( $IMG , $P , 1 ));
      $COLOR [ 1 ] = $PALETTE [ $COLOR [ 1 ] + 1 ];
      }
      elseif ( $BMP [ 'bits_per_pixel' ] == 4 )
      {
      $COLOR = unpack ( "n" , $VIDE . substr ( $IMG , floor ( $P ) , 1 ));
      if (( $P * 2 ) % 2 == 0 ) $COLOR [ 1 ] = ( $COLOR [ 1 ] >> 4 ) ; else $COLOR [ 1 ] = ( $COLOR [ 1 ] & 0x0F );
      $COLOR [ 1 ] = $PALETTE [ $COLOR [ 1 ] + 1 ];
      }
      elseif ( $BMP [ 'bits_per_pixel' ] == 1 )
      {
      $COLOR = unpack ( "n" , $VIDE . substr ( $IMG , floor ( $P ) , 1 ));
      if (( $P * 8 ) % 8 == 0 ) $COLOR [ 1 ] = $COLOR [ 1 ] >> 7 ;
      elseif (( $P * 8 ) % 8 == 1 ) $COLOR [ 1 ] = ( $COLOR [ 1 ] & 0x40 ) >> 6 ;
      elseif (( $P * 8 ) % 8 == 2 ) $COLOR [ 1 ] = ( $COLOR [ 1 ] & 0x20 ) >> 5 ;
      elseif (( $P * 8 ) % 8 == 3 ) $COLOR [ 1 ] = ( $COLOR [ 1 ] & 0x10 ) >> 4 ;
      elseif (( $P * 8 ) % 8 == 4 ) $COLOR [ 1 ] = ( $COLOR [ 1 ] & 0x8 ) >> 3 ;
      elseif (( $P * 8 ) % 8 == 5 ) $COLOR [ 1 ] = ( $COLOR [ 1 ] & 0x4 ) >> 2 ;
      elseif (( $P * 8 ) % 8 == 6 ) $COLOR [ 1 ] = ( $COLOR [ 1 ] & 0x2 ) >> 1 ;
      elseif (( $P * 8 ) % 8 == 7 ) $COLOR [ 1 ] = ( $COLOR [ 1 ] & 0x1 );
      $COLOR [ 1 ] = $PALETTE [ $COLOR [ 1 ] + 1 ];
      }
      else
      return FALSE ;
      imagesetpixel( $res , $X , $Y , $COLOR [ 1 ]);
      $X ++ ;
      $P += $BMP [ 'bytes_per_pixel' ];
      }
      $Y -- ;
      $P += $BMP [ 'decal' ];
      }

      fclose ( $f1 );
      return $res ;
    }
    public static function imageToJPG($srcFile,$dstFile,$srcx,$srcy,$srcts,$srctr,$dstW=800,$dstH=800)
    {
      $quality=100;
      $data = @GetImageSize($srcFile); //载入原始图片
      switch ($data['2'])
      {
        case 1:
          $im = imagecreatefromgif($srcFile);
          break;
        case 2:
          $im = imagecreatefromjpeg($srcFile);
          break;
        case 3:
          $im = imagecreatefrompng($srcFile);
          break;
        case 6:
          $im = self::imageCreateFromBMP( $srcFile ); //调用上面bmp转jpg的独立方法
          break;
      }


      // $exif = @exif_read_data($srcFile); //获取exif信息
      // if (!empty($exif['Orientation']))
      // {
      //   switch ($exif['Orientation'])
      //   {
      //     case 3:
      //       $im = imagerotate($im, 180, 0);
      //       break;
      //     case 6:
      //       $im = imagerotate($im, -90, 0);
      //       break;
      //     case 8:
      //       $im = imagerotate($im, 90, 0);
      //       break;
      //   }
      // }
      // $srcx=0 ;$srcy =0 ; $srcts=1 ;

      if($srcx==0 && $srcy ==0 && $srcts==1 ) //只进行缩放。不截取区域 ，对应桌面版
      {
        //源图对象
        $src_width = @imagesx($im);
        $src_height = @imagesy($im);
        //生成等比例的缩略图
        $tmp_image_width = 0;
        $tmp_image_height = 0;
        if ($src_width / $src_height >= $dstW / $dstH)
        {
            $tmp_image_width = $dstW;
            $tmp_image_height = round($tmp_image_width * $src_height / $src_width);
        }
        else
        {
            $tmp_image_height = $dstH;
            $tmp_image_width = round($tmp_image_height * $src_width / $src_height);
        }

        //旋转图像 补白
        $white=@imagecolorallocate($im,255,255,255); //旋转图像
        $im= @imagerotate($im, -$srctr, $white); //补白

        $tmpImage = @imagecreatetruecolor($tmp_image_width, $tmp_image_height);
        @imagecopyresampled($tmpImage, $im, 0, 0, 0, 0, $tmp_image_width, $tmp_image_height, $src_width, $src_height);


        //添加白边
        $final_image = @imagecreatetruecolor($dstW, $dstH);
        $color = @imagecolorallocate($final_image, 255, 255, 255);
        @imagefill($final_image, 0, 0, $color);
        $x = round(($dstW - $tmp_image_width) / 2);
        $y = round(($dstH - $tmp_image_height) / 2);
        @imagecopy($final_image, $tmpImage, $x, $y, 0, 0, $tmp_image_width, $tmp_image_height);

      }
      else //对应手机版本
      {
        //原始图片宽高
        $srcW=@ImageSX($im); //原始宽度
        $srcH=@ImageSY($im); //原始高度

        //裁剪区域的宽高,最终保存成图片的宽和高，和源要等比例，否则会变形
        $midW=round($srcW / $srcts);  //缩小宽度
        $midH=round($srcH / $srcts);  //缩小高度

        //将裁剪区域复制到新图片上，并根据源和目标的宽高进行缩放或者拉升
        $new_image = @imagecreatetruecolor($midW, $midH);
        @imagecopyresampled($new_image, $im, 0, 0, 0, 0, $midW, $midH, $srcW, $srcH);

//        //旋转图像 补白
		  $white=@imagecolorallocate($new_image,255,255,255); //旋转图像
		  $new_image= @imagerotate($new_image, $srctr, $white); //补白


		  $srcW=@ImageSX($new_image); //原始宽度
		  $srcH=@ImageSY($new_image); //原始高度
		  $final_image = @imagecreatetruecolor(800, 800);
		  @imagecopyresampled($final_image, $new_image, $srcx, $srcy, 0, 0, $srcW, $srcH, $srcW, $srcH);

      }


      @ImageJpeg($final_image,$dstFile,$quality);
      @imagedestroy($im);
      @imagedestroy($new_image);
      @imagedestroy($final_image);


      return file_exists($dstFile);
    }


    // 检查 ffmpeg 进程个数
    public static function ffmpeg_process_count()
    {
        $command = "ps -ef | grep -v grep | grep ffmpeg | wc -l";

        $descriptorspec = array(
            0 => array("pipe", "r"),
            1 => array("pipe", "w"),
            2 => array("file", dirname(Yii::app()->BasePath)."/uploads/log.log", "w"),
        );

        $process = proc_open($command, $descriptorspec, $pipes);
        $can_be_convert = FALSE;
        if (is_resource($process)) {
            fclose($pipes[0]);

            $content = stream_get_contents($pipes[1]);
            fclose($pipes[1]);

            $ret_value = proc_close($process);

            return intval(trim($content));
        }

        else {
            // 打开进程失败
            return FALSE;
        }
    }
}

