/*
Navicat MySQL Data Transfer

Source Server         : ubuntu192.168.56.2
Source Server Version : 50535
Source Host           : 192.168.56.2:3306
Source Database       : avene-yii

Target Server Type    : MYSQL
Target Server Version : 50535
File Encoding         : 65001

Date: 2014-03-12 22:46:10
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for manager
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `mid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '管理员id',
  `musername` varchar(30) NOT NULL COMMENT '管理员用户名',
  `mpassword` varchar(256) NOT NULL COMMENT '管理员密码',
  `logintime` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '最后登录时间',
  `loginip` varchar(16) NOT NULL DEFAULT '0.0.0.0' COMMENT '最后登陆ip',
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COMMENT='管理员信息表';

-- ----------------------------
-- Records of manager
-- ----------------------------
INSERT INTO `manager` VALUES ('1', 'manager', '5831100a9883b04d39bcb110f196bdbe', '1394632261', '172.16.111.87');

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
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=latin1 COMMENT='内容表';

-- ----------------------------
-- Records of node
-- ----------------------------
INSERT INTO `node` VALUES ('23', 'uploads/2014/3/9/e29c5f4058bb47751eecf9cd14803b25066d521bthumbnail.jpg', 'uploads/2014/3/9/e29c5f4058bb47751eecf9cd14803b25066d521b.mp4', '1', '1394378548', '1d64f2391674d8aaba5cc49b738d3564c6482c97');
INSERT INTO `node` VALUES ('24', 'uploads/2014/3/9/01ec11b87fb7e49c3a1459e8aef3361894779993thumbnail.jpg', 'uploads/2014/3/9/01ec11b87fb7e49c3a1459e8aef3361894779993.mp4', '1', '1394378609', '08da027fc4792850d8106773f945311ebfc7910d');
INSERT INTO `node` VALUES ('25', 'uploads/2014/3/9/6fa2484b7b1f6724b612503b989532ca2a2e82c1thumbnail.jpg', 'uploads/2014/3/9/6fa2484b7b1f6724b612503b989532ca2a2e82c1.mp4', '0', '1394378646', '3ce233162ecae320408a73e05ddfe7440eff11f1');
INSERT INTO `node` VALUES ('26', 'uploads/2014/3/9/5e2feed0a69e04e999066dccb57480a044551c30thumbnail.jpg', 'uploads/2014/3/9/5e2feed0a69e04e999066dccb57480a044551c30.mp4', '0', '1394378655', '5f55a3d48fea1018a114db7aefd057df11487db8');
INSERT INTO `node` VALUES ('27', 'uploads/2014/3/9/3d2152b15a25d414c66b8d66e9bc48ab32e36e4ethumbnail.jpg', 'uploads/2014/3/9/3d2152b15a25d414c66b8d66e9bc48ab32e36e4e.mp4', '0', '1394378664', '67e7e9e794808344d39ac3ac544aa91b73540a9c');
INSERT INTO `node` VALUES ('28', 'uploads/2014/3/9/2cfa515e66577096452455888e0d7d31be73e687thumbnail.jpg', 'uploads/2014/3/9/2cfa515e66577096452455888e0d7d31be73e687.mp4', '1', '1394378678', 'bd16c4c5c3144b761784c61554ae116c54780936');
INSERT INTO `node` VALUES ('29', 'uploads/2014/3/9/a183087576e202e9789402e13e1bef2f48c9cd5athumbnail.jpg', 'uploads/2014/3/9/a183087576e202e9789402e13e1bef2f48c9cd5a.mp4', '1', '1394378694', 'd9c8e29f077fdd1dd085b37ddb9230d2f01561d9');
INSERT INTO `node` VALUES ('30', 'uploads/2014/3/11/62d02b69851d6c86b76947e6842340a65d9b62e6thumbnail.jpg', 'uploads/2014/3/11/62d02b69851d6c86b76947e6842340a65d9b62e6.mp4', '1', '1394524742', '688759a1a43089254f2810fd3c714c662f443bb0');
INSERT INTO `node` VALUES ('31', 'uploads/2014/3/11/e05b0b86bc9c92f7249adb032823b5c23e357fa8thumbnail.jpg', 'uploads/2014/3/11/e05b0b86bc9c92f7249adb032823b5c23e357fa8.mp4', '1', '1394524767', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('32', 'uploads/2014/3/11/4cae3f4c4910f8c197d2b648565492a5920dc2b2thumbnail.jpg', 'uploads/2014/3/11/4cae3f4c4910f8c197d2b648565492a5920dc2b2.mp4', '1', '1394524952', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('33', 'uploads/2014/3/11/c7c9b2061a7ea89d92fa888a65b34b14f2407f6dthumbnail.jpg', 'uploads/2014/3/11/c7c9b2061a7ea89d92fa888a65b34b14f2407f6d.mp4', '0', '1394524958', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('34', 'uploads/2014/3/11/1cd4484c1eed12c29ec7888c9341d0b1bf7b64dbthumbnail.jpg', 'uploads/2014/3/11/1cd4484c1eed12c29ec7888c9341d0b1bf7b64db.mp4', '0', '1394525513', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('35', 'uploads/2014/3/11/f476977922cf26558ab631c59f25956b1462df98thumbnail.jpg', 'uploads/2014/3/11/f476977922cf26558ab631c59f25956b1462df98.mp4', '0', '1394525514', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('36', 'uploads/2014/3/11/50b3d607333abf6d4af48c8231bea9eb7ed46e5fthumbnail.jpg', 'uploads/2014/3/11/50b3d607333abf6d4af48c8231bea9eb7ed46e5f.mp4', '0', '1394525729', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('37', 'uploads/2014/3/11/818776a792eea888e068de388599afe0b991144fthumbnail.jpg', 'uploads/2014/3/11/818776a792eea888e068de388599afe0b991144f.mp4', '0', '1394531199', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('38', 'uploads/2014/3/11/11d53244d6d568b352ea7440c72bc8213a013a82thumbnail.jpg', 'uploads/2014/3/11/11d53244d6d568b352ea7440c72bc8213a013a82.mp4', '0', '1394553497', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('39', 'uploads/2014/3/11/20db8186025b7c71151d1ccc0faa0e2eaa9ef074thumbnail.jpg', 'uploads/2014/3/11/20db8186025b7c71151d1ccc0faa0e2eaa9ef074.mp4', '0', '1394553537', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('40', 'uploads/2014/3/11/ef12240ff509d8897f7ed968b3e5bc2fce2e595bthumbnail.jpg', 'uploads/2014/3/11/ef12240ff509d8897f7ed968b3e5bc2fce2e595b.mp4', '0', '1394553547', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('41', 'uploads/2014/3/12/0dba664b3b1da81e32c6ea18ea10a5950f7424f5thumbnail.jpg', 'uploads/2014/3/12/0dba664b3b1da81e32c6ea18ea10a5950f7424f5.mp4', '0', '1394562454', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('42', 'uploads/2014/3/12/70993d7d8ebbbc278d0dff7ad05655418a416a58thumbnail.jpg', 'uploads/2014/3/12/70993d7d8ebbbc278d0dff7ad05655418a416a58.mp4', '0', '1394562462', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('43', 'uploads/2014/3/12/297f2b57d70ad1211b5a136202cafd74ac7a4f54thumbnail.jpg', 'uploads/2014/3/12/297f2b57d70ad1211b5a136202cafd74ac7a4f54.mp4', '1', '1394562555', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('44', 'uploads/2014/3/12/3c7ce2f6d7489f1aea39015a48781322b979292dthumbnail.jpg', 'uploads/2014/3/12/3c7ce2f6d7489f1aea39015a48781322b979292d.mp4', '1', '1394562674', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('45', 'uploads/2014/3/12/1b392c81486f1751d3948f4a3ce5d680ebef34ecthumbnail.jpg', 'uploads/2014/3/12/1b392c81486f1751d3948f4a3ce5d680ebef34ec.mp4', '1', '1394562701', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('46', 'uploads/2014/3/12/1da1f47295ebc66881720c49e7fbf15c4bf906fethumbnail.jpg', 'uploads/2014/3/12/1da1f47295ebc66881720c49e7fbf15c4bf906fe.mp4', '1', '1394563402', '18b365f97738b7bb50740458a46ff9918f1d91a9');
INSERT INTO `node` VALUES ('47', 'uploads/2014/3/12/2ed23df831a4d5fcb8603183f74a506c5c7c0300thumbnail.jpg', 'uploads/2014/3/12/2ed23df831a4d5fcb8603183f74a506c5c7c0300.mp4', '0', '1394563724', 'd095a3d1b9dda277c3469fce3675cf3085d8e997');
INSERT INTO `node` VALUES ('48', 'uploads/2014/3/12/b00ecf8c976c74bc6401a4372b3c53d1bd480c60thumbnail.jpg', 'uploads/2014/3/12/b00ecf8c976c74bc6401a4372b3c53d1bd480c60.mp4', '0', '1394563803', 'd095a3d1b9dda277c3469fce3675cf3085d8e997');
INSERT INTO `node` VALUES ('49', 'uploads/2014/3/12/8c22f296ef749cac8d53d55b21cadd1e901d3379thumbnail.jpg', 'uploads/2014/3/12/8c22f296ef749cac8d53d55b21cadd1e901d3379.mp4', '0', '1394564060', 'd095a3d1b9dda277c3469fce3675cf3085d8e997');
INSERT INTO `node` VALUES ('50', 'uploads/2014/3/12/57ac09b4019639c99f4fb9c6f2cf9b4b438db6d7thumbnail.jpg', 'uploads/2014/3/12/57ac09b4019639c99f4fb9c6f2cf9b4b438db6d7.mp4', '0', '1394564075', 'd095a3d1b9dda277c3469fce3675cf3085d8e997');
INSERT INTO `node` VALUES ('51', 'uploads/2014/3/12/a67a991151ad38dd02fd9f40ccd60302f4299325thumbnail.jpg', 'uploads/2014/3/12/a67a991151ad38dd02fd9f40ccd60302f4299325.mp4', '0', '1394564126', 'd095a3d1b9dda277c3469fce3675cf3085d8e997');
INSERT INTO `node` VALUES ('52', 'uploads/2014/3/12/daad3115b591403a0839e45ad74d8e5233dfa337thumbnail.jpg', 'uploads/2014/3/12/daad3115b591403a0839e45ad74d8e5233dfa337.mp4', '0', '1394564166', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('53', 'uploads/2014/3/12/044bb5feb32ddab33bb2ea13d23a6caee68b9111thumbnail.jpg', 'uploads/2014/3/12/044bb5feb32ddab33bb2ea13d23a6caee68b9111.mp4', '0', '1394564199', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('54', 'uploads/2014/3/12/0501b2c8675956ff16991960ae7b5ec439a7ae8bthumbnail.jpg', 'uploads/2014/3/12/0501b2c8675956ff16991960ae7b5ec439a7ae8b.mp4', '0', '1394567313', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('55', 'uploads/2014/3/12/8738487db72cfe7b7b21097e82f75bcf2521a77ethumbnail.jpg', 'uploads/2014/3/12/8738487db72cfe7b7b21097e82f75bcf2521a77e.mp4', '0', '1394587868', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('56', 'uploads/2014/3/12/28a47ea6d2078261a4b18e19bc34b39893a5bfd2thumbnail.jpg', 'uploads/2014/3/12/28a47ea6d2078261a4b18e19bc34b39893a5bfd2.mp4', '0', '1394597363', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('57', 'uploads/2014/3/12/2956d4998e04849f3f9e6421a02da04c59d5ecccthumbnail.jpg', 'uploads/2014/3/12/2956d4998e04849f3f9e6421a02da04c59d5eccc.mp4', '0', '1394605786', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('58', 'uploads/2014/3/12/e00b5fda3957125168d64c15d01cfc251001eeecthumbnail.jpg', 'uploads/2014/3/12/e00b5fda3957125168d64c15d01cfc251001eeec.mp4', '0', '1394605955', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('59', 'uploads/2014/3/12/2ab3e208d02fb7de5c04ace899157876706539d2thumbnail.jpg', 'uploads/2014/3/12/2ab3e208d02fb7de5c04ace899157876706539d2.mp4', '0', '1394606041', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
INSERT INTO `node` VALUES ('60', 'uploads/2014/3/12/06f55d681b4e68b7a690da07379a0481a9561799thumbnail.jpg', 'uploads/2014/3/12/06f55d681b4e68b7a690da07379a0481a9561799.mp4', '0', '1394607024', '1b5171f336dbe98f632f9ae2d7709dae11f6819c');
