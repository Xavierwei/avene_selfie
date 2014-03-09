<?php

/**
 * This is the model class for table "node".
 *
 * The followings are the available columns in table 'node':
 * @property string $nid
 * @property string $thumbnail
 * @property string $video
 * @property integer $status
 * @property string $createtime
 */
class Node extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'node';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('status', 'numerical', 'integerOnly'=>true),
			array('thumbnail, video', 'length', 'max'=>256),
			array('createtime', 'length', 'max'=>10),
			array('cookieval', 'length', 'max'=>64),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('nid, thumbnail, video, status, createtime', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'nid' => '唯一nid',
			'thumbnail' => '缩略图地址(合成视频截取)',
			'video' => '视频地址(合成视频)',
			'status' => '完成状态(0: unpublished; 1: published;)',
			'createtime' => '发布时间',
			'cookieval' => '客户端cookieval,判断是否该用户上传',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('nid',$this->nid,true);
		$criteria->compare('thumbnail',$this->thumbnail,true);
		$criteria->compare('video',$this->video,true);
		$criteria->compare('status',$this->status);
		$criteria->compare('createtime',$this->createtime,true); 
		$criteria->compare('cookieval',$this->cookieval,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * 默认获取前8条状态为1: published的内容
	 * 自定义 recently 命名范围中指定的帖子数量
	 */
	public function recently($limit=8,$status=1)
	{
	    $this->getDbCriteria()->mergeWith(array(
	    	'select'=>'nid,thumbnail,video',
	        'order'=>'createtime DESC',
	        'limit'=>$limit,
	        'condition'=>'status=' . $status,
	    ));
	    return $this;
	}


	/**
	 * 判断状态受否为1: published
	 */
	public function is_published($item)
	{
		$temp= $item->attributes;
		if($temp['status']==0)
			return true;
		else
			return false;
	}

	/** 
	 * 创建前添加时间戳
	 **/


	/**
	 * 判断该视频是否为当前用户创建
	 */
	public function is_cookiecreate($item)
	{
		$cookie =Yii::app()->request->getCookies(); 
		$tempcookie=$cookie['cookiecreate']->value; //获取用户本地cookie进行对比判断

		$temp= $item->attributes;
		if($temp['cookieval']==$tempcookie) //与数据库中储存的进行对比
			return true;
		else
			return false;
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Node the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
