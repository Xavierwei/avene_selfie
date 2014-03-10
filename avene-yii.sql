/*
Navicat MySQL Data Transfer

Source Server         : ubuntu192.168.56.2
Source Server Version : 50535
Source Host           : 192.168.56.2:3306
Source Database       : avene-yii

Target Server Type    : MYSQL
Target Server Version : 50535
File Encoding         : 65001

Date: 2014-03-09 23:32:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for node
-- ----------------------------
DROP TABLE IF EXISTS `node`;
CREATE TABLE `node` (
  `nid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '唯一nid',
  `thumbnail` varchar(256) CHARACTER SET utf8 DEFAULT '' COMMENT '缩略图地址(合成视频截取)',
  `video` varchar(256) CHARACTER SET utf8 DEFAULT '' COMMENT '视频地址(合成视频)',
  `status` tinyint(1) unsigned DEFAULT '0' COMMENT '完成状态(0: unpublished; 1: published;)',
  `createtime` int(10) unsigned DEFAULT '0' COMMENT '发布时间',
  `cookieval` varchar(64) CHARACTER SET utf8 DEFAULT '' COMMENT '客户端cookieval,判断是否该用户上传',
  PRIMARY KEY (`nid`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1 COMMENT='内容表';

-- ----------------------------
-- Records of node
-- ----------------------------
INSERT INTO `node` VALUES ('23', 'uploads/2014/3/9/e29c5f4058bb47751eecf9cd14803b25066d521bthumbnail.jpg', 'uploads/2014/3/9/e29c5f4058bb47751eecf9cd14803b25066d521b.mp4', '0', '1394378548', '1d64f2391674d8aaba5cc49b738d3564c6482c97');
INSERT INTO `node` VALUES ('24', 'uploads/2014/3/9/01ec11b87fb7e49c3a1459e8aef3361894779993thumbnail.jpg', 'uploads/2014/3/9/01ec11b87fb7e49c3a1459e8aef3361894779993.mp4', '0', '1394378609', '08da027fc4792850d8106773f945311ebfc7910d');
INSERT INTO `node` VALUES ('25', 'uploads/2014/3/9/6fa2484b7b1f6724b612503b989532ca2a2e82c1thumbnail.jpg', 'uploads/2014/3/9/6fa2484b7b1f6724b612503b989532ca2a2e82c1.mp4', '0', '1394378646', '3ce233162ecae320408a73e05ddfe7440eff11f1');
INSERT INTO `node` VALUES ('26', 'uploads/2014/3/9/5e2feed0a69e04e999066dccb57480a044551c30thumbnail.jpg', 'uploads/2014/3/9/5e2feed0a69e04e999066dccb57480a044551c30.mp4', '0', '1394378655', '5f55a3d48fea1018a114db7aefd057df11487db8');
INSERT INTO `node` VALUES ('27', 'uploads/2014/3/9/3d2152b15a25d414c66b8d66e9bc48ab32e36e4ethumbnail.jpg', 'uploads/2014/3/9/3d2152b15a25d414c66b8d66e9bc48ab32e36e4e.mp4', '0', '1394378664', '67e7e9e794808344d39ac3ac544aa91b73540a9c');
INSERT INTO `node` VALUES ('28', 'uploads/2014/3/9/2cfa515e66577096452455888e0d7d31be73e687thumbnail.jpg', 'uploads/2014/3/9/2cfa515e66577096452455888e0d7d31be73e687.mp4', '0', '1394378678', 'bd16c4c5c3144b761784c61554ae116c54780936');
INSERT INTO `node` VALUES ('29', 'uploads/2014/3/9/a183087576e202e9789402e13e1bef2f48c9cd5athumbnail.jpg', 'uploads/2014/3/9/a183087576e202e9789402e13e1bef2f48c9cd5a.mp4', '0', '1394378694', 'd9c8e29f077fdd1dd085b37ddb9230d2f01561d9');
