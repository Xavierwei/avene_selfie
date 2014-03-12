<?php

class ManagerController extends Controller
{

	public function actionIndex()
	{
		if(Yii::app()->user->getIsGuest()) //检查是否为管理员用户
	        $this->redirect(array('login')); //未登录跳转到登录接口	
	    else
	    	$this->redirect(array('node/list'));	//已经登陆跳转到列表
  	}

  	//登陆接口
  	public function actionLogin()
	{	
		if(!Yii::app()->user->getIsGuest()) //检查是否为管理员用户
			$this->redirect(array('node/list'));	//已经登陆跳转到列表
		if(!isset($_POST['username']))
			StatusSend::_sendResponse(200, StatusSend::error('end', 3001));  //未传入用户名数据
		if(!isset($_POST['password']))
			StatusSend::_sendResponse(200, StatusSend::error('end', 3002));  //未传入密码数据

		$userIdentify = new UserIdentity($_POST['username'], $_POST['password']);

   		// 验证没有通过
	    if (!$userIdentify->authenticate())
	      StatusSend::_sendResponse(200, StatusSend::error('end', 3003) );  //用户名或密码不正确，请重新输入
	    else
	    {
	    	$duration=3600*24*5; // 5days
	      	Yii::app()->user->login($userIdentify,$duration);
	      	Manager::model()->findByPk(Yii::app()->user->getId())->save();//更新登录时间。，登陆ip	
	      	StatusSend::_sendResponse(200, StatusSend::success('success',2005,$_POST['username'])); //登陆成功
	  	}
	}

	/**
	 * 退出
	 */ 
	public function actionLogout()
	{
		Yii::app()->user->logout();
		StatusSend::_sendResponse(200, StatusSend::success('success',2006,"LogOut ok")); //注销成功
	}


}