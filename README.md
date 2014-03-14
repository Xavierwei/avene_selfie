视频地址为真实地址
数据库图片地址uploads/2014/3/9/5e2feed0a69e04e999066dccb57480a044551c30thumbnail.jpg
实际地址为:默认为800*800分辨率原始图片，添加_250_250后缀为250*250分辨率截取图片 添加_800_800后缀为800*800分辨率截取图片
uploads/2014/3/9/5e2feed0a69e04e999066dccb57480a044551c30thumbnail_800_800.jpg
uploads/2014/3/9/5e2feed0a69e04e999066dccb57480a044551c30thumbnail_250_250.jpg
uploads/2014/3/9/5e2feed0a69e04e999066dccb57480a044551c30thumbnail.jpg

调用方式：
对于所有 item 列表调用： GET /node/list
	默认 显示前八条
对于某个 item 信息调用： GET /node/view/123
	id：id 数值
创建一个 item： POST /node/create
	 photo:base64(图片)；tx:(x坐标) ；ty:(y坐标) ；tw:(缩放比率) ；tr:(照片旋转角度) ；pngnum:（png序列1-9） ；pngx:(png坐标x)；pngy:(png坐标y)；pngr(png旋转角度)；pngw(png宽)；pngh(png高)；
更新一个 item： POST /node/update/123
	id：id 数值

admin（管理员）:
登陆接口 POST /manager/login
注销接口      /manager/logout
更新一个 item： POST /node/update/123  //管理员默认不用认证cookie
对于所有 item 列表调用： GET /node/list //管理员可以传入 
		pages:（第几页），pageSize:(每页显示条数)，status(0,1)：（显示状态。可传入0和1）
	
字典：
data：内容 或者 null

end:1001 内容表没有数据
end:1002 未传入id参数
end:1003 该id不存在
end:1004 id status状态为0：unpublished，不准予显示
end:1005 id status状态为1：published，已经完成。
end:1006 越权操作。cookie值不匹配
end:1007 修改数据库错误，


end:1008 未传入图片base64参数
end:1009 未传入嘴唇序列（1-9）
end:1010 未传入嘴唇x坐标
end:1011 未传入嘴唇y坐标
end:1012 未传入旋转角度
end:1013 传入图片类型不匹配
end:1014 传入png序列不正确
end:1015 传入png x坐标不正确0-800
end:1016 传入png y坐标不正确0-800
end:1017 传入png r度数不正确0-359
end:1018 传入png w宽度不正确0-800
end:1019 传入png h高度不正确0-800
end:1020 base64保存图片失败
end:1021 ffmpeg不存在
end:1022 创建该条数据失败
end:1023 视频生成错误，请重新提交
end:1024 缩略图截取不成功，请重新提交
end:1025 base64上传图片数据出错。请重新上传
end:1026 ffprobe不存在
end:1027 用户上传照片转换为jpg格式不成功
end:1028 未传入用户照片x坐标
end:1029 未传入用户照片y坐标
end:1030 未传入用户照片缩放信息
end:1031 未传入用户照片旋转角度

end:3001 未传入用户名数据
end:3002 未传入密码数据
end:3003 用户名或密码不正确，请重新输入

success:2001 获取列表成功
success:2002 获取该条数据成功
success:2003 修改数据成功
success:2004 创建视频成功

success:2005 登陆成功
success:2006 注销成功


