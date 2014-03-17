/*
 * page base action
 */
LP.use(['jquery', 'api', 'easing','raphael'] , function( $ , api ){
    'use strict'


    function gotoStep( step ){
        var $wrap = $('#photo-wrap');
        step = parseInt( step );
        switch( step ){
            case 1:
                $wrap.find('video,canvas,.imgwrap-opts')
                    .hide()
                    .end()
                    .find('img')
                    .show()
                    .attr('src' , '../img/test.jpg');

                    $('.block-skin-tips-imgwrap svg').hide();

                    $('.mask-bottom').height( '' );
                    $('.step1-btns').show().next().hide();
                    $('.block-skin-tips-top').html("<img src=\"./img/chun.png\"> <span>给自己的护肤小 Tips</span>"); 
                    var $oInput = $('.btn-upload input');
                    var $newInput = $oInput.clone()
                        .insertAfter('.btn-upload input')
                        .change(function(){
                            if (this.files && this.files[0] && FileReader ) {
                                //..create loading
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    // change checkpage img
                                    $('#photo-wrap').find('img')
                                        .attr('src' , fixChangeIphoneAndIpad( e.target.result ) );
                                    gotoStep( 2 );
                                };
                                reader.readAsDataURL(this.files[0]);
                            }
                        });
                    $oInput.remove();
                    break;
            case 2:
                var $optWrap = $wrap.find('video,canvas')
                    .hide()
                    .end()
                    .find('.imgwrap-opts')
                    .fadeIn();

                $('.block-skin-tips-imgwrap svg').fadeIn();
                
                // change btns
                $('.step1-btns').hide()
                    .next()
                    .show();
                // change bottom mask height
                $('.mask-bottom').height( 60 );

                $('.block-skin-tips-top').html("<span>第二步: 编辑照片 - 缩放 + 剪裁</span>");

                // hide other from step 3
                // =====================================
                $('.mouths-wrap').hide();
                $('.mouth-opts .mouth-opts-close').trigger('click');
                $('.step3-btns').hide()
                    .prev().show();
                $wrap.animate({
                    left: 0
                } , 300 , '' , function(){
                    $('.block-skin-masks').show();
                    $(this).css('overflow' , 'visible');
                    $wrap.find('.imgwrap-opts').show();
                });

				$('.block-skin-tips-bottom').fadeOut();
                
                break;
            case 3:
                // for debug
                // dragHelper.getResult();
                // move view wrap to left, and show mouth
                // hide mask
				$('.block-skin-tips-share').fadeOut();
				$('.block-skin-tips-preview').fadeOut();
				$('.block-skin-tips-opt').fadeIn();
                $('.block-skin-masks').hide();
                // hide opts
                $wrap.find('.imgwrap-opts').hide();
                // set overflow hidden

                $wrap.css('overflow' , 'hidden');
                $('.mouths-wrap').show()
                    .find('.mouths')
                    .width( $('.mouths-wrap li').length * 125 );
                    // .animate({
                    //     left: -200
                    // } , 300 , '' , function(){
                    //     // show mouth
                    //     $('.mouths').show();
                    // });

                $('.step3-btns').show()
                    .prev()
                    .hide();
                $('.block-skin-tips-top').html("<span>第二步: 换上你喜欢的嘴形</span>");
                break;
			case 4:
				$('.block-skin-tips-share').fadeOut();
				$('.block-skin-tips-preview').fadeOut();
				$('.block-skin-tips-opt').fadeIn();
                $('.mouths-wrap').hide();
                $('.mouth-opts .mouth-opts-close').trigger('click');
                $('.step3-btns').hide()
                    .prev().show();
                $wrap.animate({
                    left: 0
                } , 300 , '' , function(){
                    $('.block-skin-masks').show();
                    $(this).css('overflow' , 'visible');
                    $wrap.find('.imgwrap-opts').show();
                });
                break;
			case 5:
				$('.block-skin-tips-opt').fadeOut();
				$('.block-skin-tips-preview').delay(500).fadeIn();
				break;
			case 6:
				$('.block-skin-tips-preview').fadeOut();
				$('.block-skin-tips-share').delay(500).fadeIn();
        }

    }

    var fuckIphoneAndIpad = false;
    function fixChangeIphoneAndIpad( dataUrl ){
        fuckIphoneAndIpad = false;
        var s = dataUrl.split(',');
        var bin = atob(s[1]);
        if( bin && bin.charCodeAt( 49 ) == 6 ){
            bin = bin.replace(/(.{49})./ , '$1' + String.fromCharCode(1));

            fuckIphoneAndIpad = true;
            return s[0] + "," + btoa( bin );
        }
        return dataUrl;
    }
    // page actions here
    // =========================================================================================================
    // take photo
    // LP.action('take-photo' , function(){
    //     var $wrap = $('#photo-wrap');
    //     var forExpr = 20;
    //     // set canvas and video width and height
    //     var rate = 3 / 4;
    //     var coverWidth  = $wrap.width();
    //     var coverHeight = $wrap.height();
    //     var width   = ~~( ( coverHeight + 2 * forExpr ) / rate );
    //     var height  = coverHeight + 2 * forExpr;
    //     $wrap.find('video')
    //         .attr({
    //             width   : width,
    //             height  : height
    //         })
    //         .css({
    //             position    : 'absolute',
    //             top         : -( height - coverHeight ) / 2,
    //             left        : -( width - coverWidth ) / 2
    //         });

    //     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    //     if (navigator.getUserMedia) {
    //         navigator.getUserMedia({video: true}, function( stream ){
    //                 // hide origin imgs
    //                 $wrap.find('img')
    //                     .hide()
    //                     .end()
    //                     .find('video')
    //                     .show()
    //                     .attr('src' , window.URL.createObjectURL(stream) )
    //                     .data('__stream__' , stream);
    //             },
    //             function( e ){
    //                 if( e.name == 'PERMISSION_DENIED' ){
    //                     alert('你在当前网站上禁用了摄像头');
    //                 } else {
    //                     // 拍照失败
    //                     alert('拍照出现异常');
    //                 }
    //             });
    //     }
    // })
    // LP.action('take-photo-ok' , function(){
    //     var rate = 3 / 4; //????

    //     var $wrap = $('#photo-wrap');
    //     var wrapWidth = $wrap.width();
    //     var wrapHeight = $wrap.height();
    //     var $canvas = $wrap.find('canvas')
    //         .attr({
    //             width: wrapWidth,
    //             height: wrapHeight
    //         })
    //         .show();

    //     var $video = $wrap.find('video');
    //     var ctx = $canvas[0].getContext('2d');
    //     ctx.drawImage( $wrap.find('video')[0] , ~~(( $video.attr('width') - wrapWidth ) / 2 /rate ) , 
    //         ~~(( $video.attr('height') - wrapHeight ) / 2 ) /rate , wrapWidth/rate , wrapHeight/rate , 0 , 0 , wrapWidth , wrapHeight );

    //     var stream = $wrap.find('video')
    //         .hide()
    //         .data( '__stream__' );
    //     stream && stream.stop();
    //     $wrap.find('img')
    //         .attr('src' , $canvas[0].toDataURL());
    //     gotoStep( 2 );
    // })
    // // upload file
    // .action('upload-photo' , function(){
        
    // })
    LP.action('gostep' , function( data ){
        gotoStep( data.step );
    })
    .action('scroll-left' , function(){
        var $mouths = $('.mouths');
        
        var mleft = parseInt( $mouths.css('margin-left') );
        var width = $mouths.width();
        if( $mouths.data('scrolling') || mleft >= 0 ) return;
        $mouths.data('scrolling' , 1);
        $mouths.animate({
            marginLeft: mleft + 500 
        } , 500 , '' , function(){
            $mouths.removeData('scrolling');
        });
        return false;
    })
    .action('scroll-right' , function(){
        var $mouths = $('.mouths');
        
        var mleft = parseInt( $mouths.css('margin-left') );
        var width = $mouths.width();
        if( $mouths.data('scrolling') || mleft + width < 500 ) return;
        $mouths.data('scrolling' , 1);
        $mouths.animate({
            marginLeft: mleft - 500 
        } , 500 , '' , function(){
            $mouths.removeData('scrolling');
        });
        return false;

    })
    // rule
    .action('rule' , function(){
        $('.skin-overlay').fadeIn();
        $('#skin-pop-rule').css({top:'-50%'}).fadeIn().animate({top:'50%'}, 500, 'easeOutQuart');
    })
    //close popup
    .action('close-pop', function(){
        $('.skin-overlay').fadeOut();
        $('.skin-pop').fadeOut();
    });

    var $img = $('#photo-wrap img');
    var $wrap = $('#photo-wrap');
    var $optWrap = $('.block-skin-tips-opt');
    var dragHelper = (function(){
        var isDragging = false;
        var events = [];
        var status = {};
        var triggerEvent = null;
        var raphael = null;
        var imgRaphael = null , mouthRaphael;
        var imgWidth  , imgHeight , wrapWidth , wrapHeight;
        var wrapOff = $optWrap.offset();
        $img.load( function(){
            var img = this;
            // reset 
            transforms = [];
            dragHelper.setTransform( $('.imgwrap-opts') , "inherit" );
            
            imgWidth = img.width || $(img).width();
            imgHeight =  img.height || $(img).height();

            wrapWidth = $optWrap.width();
            wrapHeight = $optWrap.height();

            // set right image size
            var optWrapWidth = $wrap.width();
            var optWrapHeight = $wrap.height();
            if( imgWidth / imgHeight > optWrapWidth / optWrapHeight && imgWidth > optWrapWidth ){
                imgHeight = ~~(imgHeight / imgWidth * optWrapWidth);
                imgWidth = optWrapWidth;
            } else if( imgWidth / imgHeight < optWrapWidth / optWrapHeight && imgHeight > optWrapHeight ){
                imgWidth = ~~(imgWidth / imgHeight * optWrapHeight);
                imgHeight = optWrapHeight;
            }
            
            if( !raphael ){
                raphael = Raphael( img.parentNode , optWrapWidth, optWrapHeight);
                imgRaphael = raphael.image( img.src , 0 , 0 );
                mouthRaphael = raphael.image( img.src , 0 , 0 , 0, 0);
                $('svg').css({
                    left: 0,//( imgWidth - wrapWidth) / 2,
                    top: 0,//( imgHeight - wrapHeight ) / 2,
                    overflow: 'visible'
                });
            }
            //raphael.setSize( tarWidth , tarHeight );
            // console.log( imgWidth , imgHeight , wrapHeight , wrapWidth);
            // console.log( ( - imgWidth + wrapWidth) / 2 , ( - imgHeight + wrapHeight ) / 2 );
            // reset transform
            var svgWidth = $('svg').width();
            var svgHeight = $('svg').height();

            mouthRaphael.attr({
                width: 0,
                height: 0
            });

            imgRaphael
                .attr({
                    x:      ( - imgWidth + svgWidth) / 2,
                    y:      ( - imgHeight + svgHeight ) / 2,
                    src     : img.src,
                    width   : imgWidth,
                    height  : imgHeight
                })
                .transform("");
            // set the position of the imgwrap-opts
            $('.imgwrap-opts').css( {
                width: imgWidth,
                height : imgHeight,
                top: ( optWrapHeight - imgHeight ) / 2,
                left: ( optWrapWidth - imgWidth ) / 2
            } )
            .data('top' , ( optWrapHeight - imgHeight ) / 2)
            .data('left' , ( optWrapWidth - imgWidth ) / 2);
            //transformMgr.reset();
            $(img).css({
                width: imgWidth,
                height: imgHeight
            }).hide();

            if( fuckIphoneAndIpad ){
                dragHelper.rotate( 90 );
            }
        } )
        .attr( 'src' , $img.attr('src') + '?__' );
        


        $(document).bind('touchend' , function(){
            isDragging = false;
            triggerEvent = null;
            status = {};
        })
        .bind('touchstart' , function( ev ){
            // fix touch event
            if( !ev.pageX ){
                ev.pageX = ev.originalEvent.touches[0].pageX;
                ev.pageY = ev.originalEvent.touches[0].pageY;
            }

            var target = ev.target;
            $.each( events , function( i , evt){
                var contains = false;
                evt.$handler.each(function(){
                    if( this === target ){
                        contains = true;
                        return false;
                    }
                });

                if( contains ){
                    status.pageX = ev.pageX;
                    status.pageY = ev.pageY;

                    // get img status
                    var raphaelObj = $(target).data('raphaelObj') || imgRaphael;
                    var off = raphaelObj.getBBox();
                    var svgOff = $('svg').offset();
                    status.imgOff = off;
                    status.imgCenter = {x: off.x + off.width / 2 , y: off.y + off.height / 2};
                    status.center = {pageX: off.x + off.width / 2 + svgOff.left , pageY: off.y + off.height / 2 + svgOff.top};

                    status.imgWidth = imgWidth;
                    status.imgHeight = imgHeight;
                    triggerEvent = evt;
                    return false;
                }
            } );
        })
        .bind('touchmove' , function( ev ){
            if( !triggerEvent || ev.originalEvent.touches.length > 1 ) return ;

            // fix touch event
            if( !ev.pageX ){
                ev.pageX = ev.originalEvent.touches[0].pageX;
                ev.pageY = ev.originalEvent.touches[0].pageY;
            }
            
            console.log( ev );
            console.log( status );

            if( !isDragging ){
                var distance = Math.abs( ev.pageX - status.pageX  ) + Math.abs( ev.pageY - status.pageY );

                console.log( distance );
                if( distance > 15 ){
                    isDragging = true;
                }
            }
            if( isDragging  ){
                triggerEvent.fn.call( triggerEvent.$handler , ev , status );
            }
            return false;
        });


        var transforms = [];
        var trsReg = /T(-?[0-9.]+),(-?[0-9.]+)/;
        var scaReg = /S(-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)/;
        var rotReg = /R(-?[0-9.]+),(-?[0-9.]+),(-?[0-9.]+)/;
        var match = null;
        var renderOpts = function( raphaelObj , $opts , imgWidth , imgHeight ){
            // var off  = imgRaphael.getBBox( false );
            // var trs = imgRaphael.transform();
            // var s = 1;
            // var r = 0;
            // var tx = 0;
            // var ty = 0;

            // $.each( trs , function( i , ts){
            //     switch( ts[0] ){
            //         case 'R':
            //             r += ts[1];
            //             break;
            //         case 'S':
            //             s *= ts[1];
            //             break;
            //         case 'T':
            //             tx += ts[1];
            //             ty += ts[2];
            //             break;
            //     }
            // });

            // var $opts = $('.imgwrap-opts');
            // $opts.css({
            //     width: imgWidth * s,
            //     height: imgHeight * s,
            //     top: ($opts.data('top') || 0) - imgHeight * ( s - 1 ) / 2,
            //     left: ($opts.data('left') || 0) - imgWidth * ( s - 1 ) / 2
            // });
            var off  = raphaelObj.getBBox( false );
            var trs = raphaelObj.transform();
            var s = 1;
            var r = 0;
            var tx = 0;
            var ty = 0;

            $.each( trs , function( i , ts){
                switch( ts[0] ){
                    case 'R':
                        r += ts[1];
                        break;
                    case 'S':
                        s *= ts[1];
                        break;
                    case 'T':
                        tx += ts[1];
                        ty += ts[2];
                        break;
                }
            });

            //var $opts = $('.imgwrap-opts');
            $opts.css({
                width: imgWidth * s,
                height: imgHeight * s,
                top: ($opts.data('top') || 0) - imgHeight * ( s - 1 ) / 2,
                left: ($opts.data('left') || 0) - imgWidth * ( s - 1 ) / 2
            });

            dragHelper.setTransform( $opts , "translate(" + tx + "px," + ty + "px) rotate(" + r + "deg)" );

        }


        var mouthWidth , mouthHeight, mouthTransforms;
        return {
            bind: function( $dom , dragMoveFn ){
                events.push( { $handler: $dom , fn: dragMoveFn } );
                return this;
            },
            renderMouth: function( $img ){
                var imgWidth = $img.width();
                var imgHeight = $img.height();
                mouthWidth = imgWidth;
                mouthHeight = imgHeight;
                mouthRaphael.attr({
                    x:      ( - imgWidth + $('svg').width()) / 2,
                    y:      ( - imgHeight + $('svg').height() ) / 2,
                    src     : $img.attr('src'),
                    width   : imgWidth,
                    height  : imgHeight
                })
                .transform('');
                // show mouth opts
                var wWidth = $wrap.width();
                var wHeight = $wrap.height();
                var largeWidth = 50;
                var $opts = $('.mouth-opts').show()
                    .css({
                        width: imgWidth + largeWidth,
                        height: imgHeight + largeWidth,
                        top: (wHeight - imgHeight - largeWidth)/2,
                        left: (wWidth - imgWidth - largeWidth)/2
                    })
                    .data('left' , (wWidth - imgWidth - largeWidth)/2)
                    .data('top' , (wHeight - imgHeight - largeWidth)/2 );

                dragHelper.setTransform( $opts , 'inherit' );
                // set it's position and width and height
                mouthTransforms = [];
                // bind event
                if( !$opts.data('init') ){
                    $opts.data('init' , 1)
                        .find('.mouth-opts-close')
                        .click(function(){
                            $opts.hide();
                            // hide mouth
                            mouthRaphael.attr({
                                width: 0,
                                height: 0
                            });
                        });
                    // drag
                    dragHelper.bind($opts.find('.mouth-opts-drag').data('raphaelObj' , mouthRaphael) , function( ev , status ){
                        status.last_r = status.last_r || 0;
                        status.last_s = status.last_s || 1;
                        console.log( ev , status );
                        // get the center of the pic
                        var odx = status.pageX - status.center.pageX;
                        var ody = status.pageY - status.center.pageY;
                        var tdx = ev.pageX - status.center.pageX;
                        var tdy = ev.pageY - status.center.pageY;

                        var or = Math.atan( ody / odx ) * 180 / Math.PI;
                        var cr = Math.atan( tdy / tdx ) * 180 / Math.PI;
                        if( odx < 0 && ody < 0 ){
                            or = or - 180;
                        } else if( odx < 0 && ody > 0 ){
                            or = or + 180;
                        }

                        if( tdx < 0 && tdy < 0 ){
                            cr = cr - 180;
                        } else if( tdx < 0 && tdy > 0 ){
                            cr = cr + 180;
                        }

                        console.log( or , cr , odx , tdx );

                        dragHelper.rotate( cr - or - status.last_r , true );
                        status.last_r = cr - or;

                        // var s = Math.sqrt( ( tdx * tdx + tdy * tdy ) /( odx * odx + ody * ody ) );
                        // dragHelper.scale( s / status.last_s  , true);
                        // status.last_s = s;
                    })
                    .bind( $opts , function( ev , status ){
                        status.last_x = status.last_x || 0;
                        status.last_y = status.last_y || 0;
                        var mx = ev.pageX - status.pageX ;
                        var my = ev.pageY - status.pageY ;

                        dragHelper.translate( mx - status.last_x , my - status.last_y , true );

                        status.last_x = mx;
                        status.last_y = my;
                    } )
                }

            }
            ,
            getConfig: function( isMouth ){
                return !isMouth ? {
                    transforms: transforms,
                    $opts : $('.imgwrap-opts'),
                    raphaelObj : imgRaphael,
                    oWidth: imgWidth,
                    oHeight: imgHeight
                } : {
                    transforms: mouthTransforms,
                    $opts : $('.mouth-opts'),
                    raphaelObj : mouthRaphael,
                    oWidth: mouthWidth + 50,
                    oHeight: mouthHeight + 50
                }
            },
            translate: function ( x , y , isMouth ){
                var config = dragHelper.getConfig( isMouth );
                var transforms = config.transforms;

                if( transforms.length && ( match = transforms[transforms.length-1].match( trsReg ) ) ){
                    transforms[transforms.length-1] = "T" + ( x + parseFloat( match[1] ) ) + ',' + ( y + parseFloat( match[2] ) );
                } else {
                    transforms.push( "T" + x + ',' + y );
                }

                config.raphaelObj.transform( transforms.join('') );
                renderOpts( config.raphaelObj , config.$opts , config.oWidth , config.oHeight );
            }
            ,
            scale: function( s  , isMouth){
                var config = dragHelper.getConfig( isMouth );
                var transforms = config.transforms;

                if( transforms.length && ( match = transforms[transforms.length-1].match( scaReg ) ) ){
                    transforms[transforms.length-1] = "S" + ( s * parseFloat( match[1] ) ) + ','
                         + ( s * parseFloat( match[2] ) )
                         + "," + match[3]
                         + "," + match[4];
                } else {
                    var box = config.raphaelObj.getBBox();
                    transforms.push( "S" + s + ',' + s + ',' + (box.x + box.width/2) + "," + (box.y + box.height/2) );
                }
                config.raphaelObj.transform( transforms.join('') );
                renderOpts( config.raphaelObj , config.$opts , config.oWidth , config.oHeight );
            }
            ,
            rotate: function( r , isMouth ){
                var config = dragHelper.getConfig( isMouth );
                var transforms = config.transforms;

                if( transforms.length && ( match = transforms[transforms.length-1].match( rotReg ) ) ){
                    transforms[transforms.length-1] = "R" + ( r + parseFloat( match[1] ) ) 
                        + "," + match[2]
                        + "," + match[3];
                } else {
                    var box = config.raphaelObj.getBBox();
                    transforms.push( "R" + r + ',' + (box.x + box.width/2) + "," + (box.y + box.height/2) );
                }
                config.raphaelObj.transform( transforms.join('') );
                renderOpts( config.raphaelObj , config.$opts , config.oWidth , config.oHeight );
            }
			,
			getRaphaelTransform: function( raphaelObj ){
				var trs = raphaelObj.transform();
				var s = 1;
				var r = 0;
				var tx = 0;
				var ty = 0;

				$.each( trs , function( i , ts){
					switch( ts[0] ){
						case 'R':
							r += ts[1];
							break;
						case 'S':
							s *= ts[1];
							break;
						case 'T':
							tx += ts[1];
							ty += ts[2];
							break;
					}
				});
				return {
					tx: tx,
					ty: ty,
					s: s,
					r: r
				}
			}
            ,
            getResult: function(){
                
                // 'data:image/jpg;base64,' + Photo,
                // pngnum: Mouth_id,
                // pngx: Mouth_x,
                // pngy: Mouth_y,
                // pngr: Mouth_rotation
                var scale = 800 / 500;
                var $svg = $('svg');
                var svgLeft = parseInt( $svg.css('left') );
                var svgTop = parseInt( $svg.css('top') );
                var transform = dragHelper.getRaphaelTransform( imgRaphael );

                var $img = $('#photo-wrap img');
                // 后台操作：
                // 1. 使用ts缩放图片
                // 2. 旋转tr角度
                // 3. 从 -tx 和 -ty 开始裁剪，宽高为800 * 800
                var data;
                return data = {
                    photo: $img.attr('src'),
                    // 嘴巴参数
                    pngnum: $('.mouths li.selected').index() + 1,
                    pngx : (mouthRaphael.getBBox().x - Math.abs( svgLeft )) * scale,
                    pngy : (mouthRaphael.getBBox().y - Math.abs( svgTop )) * scale,
                    pngr : dragHelper.getRaphaelTransform( mouthRaphael ).r,
                    // 图片的旋转参数
                    tx   : imgRaphael.getBBox().x * scale,
                    ty   : imgRaphael.getBBox().y * scale,
                    ts   : $img[0].width / ( parseInt( $img.css('width') ) * transform.s * scale ),
                    tr   : transform.r 
                }


                
//                var $tmpCanvas = $('<canvas>').attr({
//                    width: $svg.width() * scale,
//                    height: $svg.height() * scale
//                })
//                .insertAfter('svg');
//
//                var ctx = $tmpCanvas[0].getContext('2d');
//                var imgBox = imgRaphael.getBBox();
//                // draw image
//                ctx.save();
//                ctx.translate( ( imgBox.x + imgBox.width / 2 ) * scale , ( imgBox.y + imgBox.height / 2 ) * scale );
//                ctx.scale( transform.s * scale , transform.s * scale );
//                ctx.rotate( transform.r * Math.PI / 180 );
//
//                ctx.drawImage( $('#photo-wrap img')[0] , - imgWidth / 2 , - imgHeight / 2 , imgWidth , imgHeight );
//
//                ctx.restore();
//
//                var wWidth = $wrap.width();
//                var wHeight = $wrap.height();
//                var $rCanvas = $('<canvas>')
//                    .attr({
//                        width: wWidth * scale,
//                        height: wHeight * scale
//                    })
//                    .insertAfter( $tmpCanvas );
//                var rctx = $rCanvas[0].getContext('2d');
//
//                rctx.drawImage( $tmpCanvas[0] , Math.abs( svgLeft ) * scale , Math.abs( svgTop ) * scale , wWidth * scale , wHeight * scale , 0 , 0 , wWidth * scale , wHeight * scale );
//
//
//                // clear
//                var data = {
//                    photo: $rCanvas[0].toDataURL(),
//                    pngnum: $('.mouths li.selected').index() + 1,
//                    pngx : mouthRaphael.getBBox().x - Math.abs( svgLeft ),
//                    pngy : mouthRaphael.getBBox().y - Math.abs( svgTop ),
//                    pngr : dragHelper.getRaphaelTransform( imgRaphael ).r
//                }
//
//                $tmpCanvas.remove();
                // $rCanvas.remove();
                // $('#photo-wrap img').appendTo(document.body)
                //     .show();
//                $rCanvas.show().css('background' , 'red')
//                    .appendTo(document.body);
                return data;
            }
            // getResult: function(){
            //     // 'data:image/jpg;base64,' + Photo,
            //     // pngnum: Mouth_id,
            //     // pngx: Mouth_x,
            //     // pngy: Mouth_y,
            //     // pngr: Mouth_rotation
            //     var $svg = $('svg');
            //     var $tmpCanvas = $('<canvas>').attr({
            //         width: $svg.width(),
            //         height: $svg.height()
            //     })
            //     .insertAfter('svg');

            //     var ctx = $tmpCanvas[0].getContext('2d');
            //     var transform = dragHelper.getRaphaelTransform( imgRaphael );
            //     var imgBox = imgRaphael.getBBox();
            //     // draw image
            //     ctx.save();
            //     ctx.translate( imgBox.x + imgBox.width / 2 , imgBox.y + imgBox.height / 2 );
            //     ctx.scale( transform.s , transform.s );
            //     ctx.rotate( transform.r * Math.PI / 180 );
            //     ctx.drawImage( $('#photo-wrap img')[0] , - imgWidth / 2 , - imgHeight / 2 , imgWidth , imgHeight );
            //     ctx.restore();

            //     var wWidth = $wrap.width();
            //     var wHeight = $wrap.height();
            //     var $rCanvas = $('<canvas>')
            //         .attr({
            //             width: wWidth,
            //             height: wHeight
            //         })
            //         .insertAfter( $tmpCanvas );
            //     var rctx = $rCanvas[0].getContext('2d');
            //     var svgLeft = parseInt( $svg.css('left') );
            //     var svgTop = parseInt( $svg.css('top') );
            //     rctx.drawImage( $tmpCanvas[0] , Math.abs( svgLeft ) , Math.abs( svgTop ) , wWidth , wHeight , 0 , 0 , wWidth , wHeight );


            //     // clear
            //     var data = {
            //         base64: $rCanvas[0].toDataURL(),
            //         pngnum: $('.mouths li.selected').index() + 1,
            //         pngx : mouthRaphael.getBBox().x - Math.abs( svgLeft ),
            //         pngy : mouthRaphael.getBBox().y - Math.abs( svgTop ),
            //         pngr : dragHelper.getRaphaelTransform( imgRaphael ).r
            //     }

            //     $tmpCanvas.remove();
            //     $rCanvas.remove();
            //     return data;
            // }
            ,
            setTransform: function( $dom , value ){
                $dom[0].style['-webkit-transform'] = value;
                $dom[0].style['-ms-transform'] = value;
                $dom[0].style['-o-transform'] = value;
                $dom[0].style['transform'] = value;
                $dom[0].style['-moz-transform'] = value;
            }
        }
    })();

    window.dragHelper = dragHelper;

    dragHelper
        .bind( $('.middle-center') , function( ev , status ){
            status.last_x = status.last_x || 0;
            status.last_y = status.last_y || 0;
            var mx = ev.pageX - status.pageX ;
            var my = ev.pageY - status.pageY ;

            dragHelper.translate( mx - status.last_x , my - status.last_y );

            status.last_x = mx;
            status.last_y = my;
        } )
        .bind( $('.top-left,.bottom-left,.top-right,.bottom-right') , function( ev , status ){
            status.last_r = status.last_r || 0;
            status.last_s = status.last_s || 1;
            // get the center of the pic
            var odx = status.pageX - status.center.pageX;
            var ody = status.pageY - status.center.pageY;
            var tdx = ev.pageX - status.center.pageX;
            var tdy = ev.pageY - status.center.pageY;

            var or = Math.atan( ody / odx ) * 180 / Math.PI;
            var cr = Math.atan( tdy / tdx ) * 180 / Math.PI;
            if( odx < 0 && ody < 0 ){
                or = or - 180;
            } else if( odx < 0 && ody > 0 ){
                or = or + 180;
            }

            if( tdx < 0 && tdy < 0 ){
                cr = cr - 180;
            } else if( tdx < 0 && tdy > 0 ){
                cr = cr + 180;
            }

            //console.log( or , cr , odx , tdx );

            dragHelper.rotate( cr - or - status.last_r );
            status.last_r = cr - or;

            var s = Math.sqrt( ( tdx * tdx + tdy * tdy ) /( odx * odx + ody * ody ) );
            dragHelper.scale( s / status.last_s );
            status.last_s = s;
        } )
        .bind( $('.top-center,.bottom-center,.middle-left,.middle-right') , function( ev , status ){
            status.last_s = status.last_s || 1;
            // only scale
            var odx = status.pageX - status.center.pageX;
            var ody = status.pageY - status.center.pageY;
            var tdx = ev.pageX - status.center.pageX;
            var tdy = ev.pageY - status.center.pageY;

            var s = Math.sqrt( ( tdx * tdx + tdy * tdy ) /( odx * odx + ody * ody ) );
            dragHelper.scale( s / status.last_s );
            status.last_s = s;
        } );


    // bind for file upload
    $('.btn-upload').find('input[type="file"]')
        .change(function(){
            if (this.files && this.files[0] && FileReader ) {
                //..create loading
                var reader = new FileReader();
                reader.onload = function (e) {
                    // change checkpage img
                    $('#photo-wrap').find('img')
                        .attr('src' , fixChangeIphoneAndIpad( e.target.result ) );
                    gotoStep( 2 );
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

    // mouth click event
    $('.mouths img').click(function(){
        // 1. add pic to left wrap
        dragHelper.renderMouth( $(this) );

        $(this).parent()
            .addClass('selected')
            .siblings('.selected')
            .removeClass('selected');
    });

    LP.use('hammer' , function(){
        // swipe event for slider
        $('.mouths-wrap').hammer({
                swipe_velocity: 0.3,
                prevent_event: true
            })
            .on('swipeleft' , function(){
                LP.triggerAction('scroll-right');
            })
            .on('swiperight' , function(){
                LP.triggerAction('scroll-left');
            });

        // opts transform

        var _lastRotation = 0 , _lastScale = 1 , $mouthOpt = $('.mouth-opts') , $imgOpt = $('.imgwrap-opts');
        $('#photo-wrap').hammer({
            transform_always_block: true,
            drag_block_vertical: true,
            drag_block_horizontal: true
        })
        .on("transform" , function( event ){
            var gesture = event.gesture;

            if( $imgOpt.is(':visible') || $mouthOpt.is(':visible') ){
                dragHelper.rotate( ( gesture.rotation || 0 ) - _lastRotation , $mouthOpt.is(':visible') );
            }
            _lastRotation = gesture.rotation;

            if( $imgOpt.is(':visible') ){
                dragHelper.scale( gesture.scale / _lastScale );
            }
            _lastScale = gesture.scale;
        })
        .on('transformend' , function(){
            _lastRotation = 0 ; 
            _lastScale = 1;
        });
    });
    


    LP.action('uploadImg', function(data){
        console.log(data);

        api.ajax('preview' , data , function( result ){
            console.log(result);
        });


    });


	LP.action('preview', function(){
		var data = dragHelper.getResult();
		if(!data.pngnum) return;
        data.tr = -data.tr;
		$('.loading').fadeIn();
		api.ajax('preview' , data , function( result ){
			$('.loading').fadeOut();
			if(typeof result.success.message != undefined && result.success.message == 'success') {
				result.data.thumbnail = result.data.thumbnail.replace('thumbnail', 'thumbnail_800_800');
				$('.block-skin-tips-step').data('result',result.data);
				LP.compile( 'preview-template' , result.data , function( html ){
					$('.block-skin-tips-preview').html(html);
				});
				gotoStep(5);
			}
		});
	});

	LP.action('publish', function(data){
		api.ajax('publish' , {id:data.id} , function( result ){
			var data = $('.block-skin-tips-step').data('result');
			LP.compile( 'share-template' , data , function( html ){
				$('.block-skin-tips-share').html(html);
				gotoStep(6);
				$('.tip-image').delay(500).fadeIn();
			});
		});
	});

	LP.action('restart', function(data){
		window.location.reload();
	});


	var nodeActions = {
		prependNode: function( $dom , nodes ){
			var aHtml = [];
			var lastDate = null;
			nodes = nodes || [];

			// save nodes to cache
			var cache = $dom.data('nodes') || [];
			var lastPid = cache[0].pid;
			var lastNode = getObjectIndex(nodes, 'pid', lastPid);
			var newNodes = nodes.splice(0,lastNode);
			var count = cache.length - newNodes.length;
			cache = cache.splice(0, count);
			for(var i = 0; i < newNodes.length; i++ ) {
				var $items = $dom.find('.photo_item');
				$items.eq($items.length-1).remove();
			}
			$dom.data('nodes' , newNodes.concat( cache ) );
			$.each( newNodes , function( index , node ){
				node.thumb = node.image.replace('.jpg','_thumb.jpg');
				node.sharecontent = encodeURI(node.content).replace(new RegExp('#',"gm"),'%23')
				if(node.content.length > 100) {
					node.shortcontent = node.content.substring(0,100)+'...';
				}
				LP.compile( 'node-item-template' ,
					node ,
					function( html ){
						aHtml.push( html );
						if( index == newNodes.length - 1 ){
							// render html
							$dom.prepend(aHtml.join(''));
							$dom.find('.photo_item:not(.reversal)').css({'opacity':0});
							//nodeActions.setItemWidth( $dom );
							nodeActions.setItemReversal( $dom );
						}
					});
			} );
		},

		inserNode: function( $dom , nodes ){
			var aHtml = [];
			var lastDate = null;
			nodes = nodes || [];

			// save nodes to cache
			var cache = $dom.data('nodes') || [];
			$dom.data('nodes' , cache.concat( nodes ) );

			$.each( nodes , function( index , node ){
				node.poster = node.thumbnail.replace('thumbnail', 'thumbnail');
				node.thumbnail = node.thumbnail.replace('thumbnail', 'thumbnail_250_250');
				LP.compile( 'node-item-template' ,
					node ,
					function( html ){
						aHtml.push( html );
						if( index == nodes.length - 1 ){
							// render html
							$dom.append(aHtml.join(''));
							$dom.find('.photo_item:not(.reversal)').css({'opacity':0});
							//nodeActions.setItemWidth( $dom );
							nodeActions.setItemReversal( $dom );
						}
					} );

			} );
		},
		// start pic reversal animation
		setItemReversal: function( $dom ){
			// fix all the items , set position: relative
			$dom.children()
				.css('position' , 'relative');
			// get first time item , which is not opend
			// wait for it's items prepared ( load images )
			// run the animate

			// if has time items, it means it needs to reversal from last node-item element
			// which is not be resersaled
			var $nodes = $dom.find('.photo_item:not(.reversal)');

			var startAnimate = function( $node ){
				$node.css({opacity:0}).addClass('reversal').animate({opacity:1}, 1000);
				setTimeout(function(){
					nodeActions.setItemReversal( $dom );
				} , 100);
			}
			// if esist node , which is not reversaled , do the animation
			if( $nodes.length ){
				startAnimate( $nodes.eq(0) );
			}
		}
	}

	var $loading = $('.load_more_loading');
	LP.action('load_more', function(){
		$loading.fadeIn();
		var pageParam = $('.block-skin-tips-list').data('param');
		pageParam.pages ++;
		$('.block-skin-tips-list').data('param',pageParam);
		api.ajax('list', pageParam, function( result ){
			$loading.fadeOut();
			nodeActions.inserNode( $('.block-skin-tips-list') , result.data );
		});
	});

	var init = function(){
		var pageParam = {pages:1};
		$('.block-skin-tips-list').data('param',pageParam);
		api.ajax('list' , function( result ){
			nodeActions.inserNode( $('.block-skin-tips-list') , result.data );
		});
	}

	init();


	var viewpage = function(){
		var id = getQueryString('id');
		if(!id) return;
		api.ajax('view', {id:id} , function( result ){
			result.data.timestamp = new Date().getTime();
			result.data.thumbnail = result.data.thumbnail.replace('thumbnail', 'thumbnail_800_800');
			$('#imgLoad').attr('src', './'+result.data.thumbnail);
			LP.compile( 'video-popup-template' , result.data , function( html ){
				$('.tips-view-page').append(html);
			});
		});


	}

	viewpage();


	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}



});


