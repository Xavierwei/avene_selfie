<?php

/**
 * This is the model class for table "manager".
 *
 * The followings are the available columns in table 'manager':
 * @property string $mid
 * @property string $musername
 * @property string $mpassword
 * @property string $logintime
 * @property string $loginip
 */
class Manager extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'manager';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('musername, mpassword', 'required'),
			array('musername', 'length', 'max'=>30),
			array('mpassword', 'length', 'max'=>256),
			array('logintime', 'length', 'max'=>11),
			array('loginip', 'length', 'max'=>16),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('mid, musername, mpassword, logintime, loginip', 'safe', 'on'=>'search'),
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
			'mid' => '管理员id',
			'musername' => '管理员用户名',
			'mpassword' => '管理员密码',
			'logintime' => '最后登录时间',
			'loginip' => '最后登陆ip',
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

		$criteria->compare('mid',$this->mid,true);
		$criteria->compare('musername',$this->musername,true);
		$criteria->compare('mpassword',$this->mpassword,true);
		$criteria->compare('logintime',$this->logintime,true);
		$criteria->compare('loginip',$this->loginip,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Manager the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * 保存前命令
	 */
	protected function beforeSave()  
	{  
	    if(parent::beforeSave()){  
	        if($this->isNewRecord){  
	            $this->logintime = time();  
	            $this->loginip = Yii::app()->request->userHostAddress;  
	        }else{  
	            $this->logintime = time();  
	            $this->loginip = Yii::app()->request->userHostAddress;  
	        }  
	        return true;  
	    }else{  
	        return false;  
	    }  
	}  
}
