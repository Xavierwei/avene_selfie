/*
 * page base action
 */
LP.use(['jquery', 'api', 'easing', 'fileupload', 'flash-detect', 'swfupload', 'swfupload-speed', 'raphael'] , function( $ , api ){
    'use strict'

    var isFlash = !$('html').hasClass('video') || navigator.userAgent.toLowerCase().indexOf('firefox') > 0;

    $('body').delegate('video','click',function(){
        $(this)[0].pause();
    });

    function gotoStep( step ){
        var $wrap = $('#photo-wrap');
        step = parseInt( step );
        switch( step ){
            case 1:
                $wrap.find('video,canvas,.imgwrap-opts')
                    .hide()
                    .end()
                    .find('img')
                    .attr('src' , './img/test.jpg');
                    $('.mask-bottom').height( '' );
                    $('.step1-btns').show().next().hide();
                    $('.block-skin-tips-top').html("<img src=\"./img/chun.png\"> <img src=\"./img/title_tip.png\">");
                    break;
            case 2:
                var $optWrap = $wrap.find('video,canvas')
                    .hide()
                    .end()
                    .find('.imgwrap-opts')
                    .fadeIn();
                
                // change btns
                $('.step1-btns').hide()
                    .next()
                    .show();
                // change bottom mask height
                $('.mask-bottom').height( 60 );

                $('.block-skin-tips-top').html("<span>缩 放 + 裁 剪</span>");

                // hide other from step 3
                // =====================================
                $('.mouths').hide();
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
            case 3:
                // move view wrap to left, and show mouth
                // hide mask
                $('.block-skin-masks').hide();
                // hide opts
                $wrap.find('.imgwrap-opts').hide();
                // set overflow hidden
                $wrap.css('overflow' , 'hidden')
                    .animate({
                        left: -200
                    } , 300 , '' , function(){
                        // show mouth
                        $('.mouths').show();
                    });

                $('.step3-btns').show()
                    .prev()
                    .hide();
                $('.block-skin-tips-top').html("<span>选 择 你 的 嘴 形</span>");
                break;
            case 4:
                $('.block-skin-tips-preview').fadeOut(500, function(){
                    $(this).html('');
                });
                $('.block-skin-tips-share').fadeOut(500);
                $('.block-skin-tips-opt').delay(500).animate({opacity:1},500);
                $('.mouths').hide();
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
                $('.tip-image').fadeOut();
                break;
            case 5:
                $('.block-skin-tips-opt').animate({opacity:0},500);
                $('.block-skin-tips-preview').delay(800).fadeIn(500);
                break;
            case 6:
                $('.block-skin-tips-preview').fadeOut(500);
                $('.block-skin-tips-share').delay(800).fadeIn(800);
                break;
        }

    }
    // page actions here
    // =========================================================================================================
    // take photo
    LP.action('take-photo' , function(){
        var $wrap = $('#photo-wrap');
        var forExpr = 20;
        // set canvas and video width and height
        var rate = 3 / 4;
        var coverWidth  = $wrap.width();
        var coverHeight = $wrap.height();
        var width   = ~~( ( coverHeight + 2 * forExpr ) / rate );
        var height  = coverHeight + 2 * forExpr;
        $wrap.find('video')
            .attr({
                width   : width,
                height  : height
            })
            .css({
                position    : 'absolute',
                top         : -( height - coverHeight ) / 2,
                left        : -( width - coverWidth ) / 2
            });

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, function( stream ){
                    // hide origin imgs
                    $wrap.find('img')
                        .hide()
                        .end()
                        .find('video')
                        .show()
                        .attr('src' , window.URL.createObjectURL(stream) )
                        .data('__stream__' , stream);
                },
                function( e ){
                    if( e.name == 'PERMISSION_DENIED' ){
                        alert('你在当前网站上禁用了摄像头');
                    } else {
                        // 拍照失败
                        alert('拍照出现异常');
                    }
                });
        }
    })
    .action('take-photo-ok' , function(){
        var rate = 3 / 4; //????

        var $wrap = $('#photo-wrap');
        var wrapWidth = $wrap.width();
        var wrapHeight = $wrap.height();
        var $canvas = $wrap.find('canvas')
            .attr({
                width: wrapWidth,
                height: wrapHeight
            })
            .show();

        var $video = $wrap.find('video');
        var ctx = $canvas[0].getContext('2d');
        ctx.drawImage( $wrap.find('video')[0] , ~~(( $video.attr('width') - wrapWidth ) / 2 /rate ) , 
            ~~(( $video.attr('height') - wrapHeight ) / 2 ) /rate , wrapWidth/rate , wrapHeight/rate , 0 , 0 , wrapWidth , wrapHeight );

        var stream = $wrap.find('video')
            .hide()
            .data( '__stream__' );
        stream && stream.stop();
        $wrap.find('img')
            .attr('src' , $canvas[0].toDataURL());
        gotoStep( 2 );
    })
    // upload file
    .action('upload-photo' , function(){
        
    })
    .action('gostep' , function( data ){
        gotoStep( data.step );
    })
    // rule
    .action('rule' , function(){
        $('.skin-overlay').fadeIn();
        $('#skin-pop-rule').css({top:'-50%'}).fadeIn().animate({top:'50%'}, 500, 'easeOutQuart');
    })
    //close popup
    .action('close-pop', function(){
        $('.skin-overlay').fadeOut(function(){
            $('#skin-pop-video').remove();
        });
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
                imgHeight = imgHeight / imgWidth * optWrapWidth;
                imgWidth = optWrapWidth;
            } else if( imgWidth / imgHeight < optWrapWidth / optWrapHeight && imgHeight > optWrapHeight ){
                imgWidth = imgWidth / imgHeight * optWrapHeight;
                imgHeight = optWrapHeight;
            }

            if( !raphael ){
                raphael = Raphael( img.parentNode , wrapWidth, wrapHeight);
                imgRaphael = raphael.image( img.src , 0 , 0 , imgWidth, imgHeight);
                mouthRaphael = raphael.image( img.src , 0 , 0 , 0, 0);
                $('svg').css({
                    left: ( imgWidth - wrapWidth) / 2,
                    top: ( imgHeight - wrapHeight ) / 2,
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
            imgRaphael.attr({
                x:      ( - imgWidth + svgWidth) / 2,
                y:      ( - imgHeight + svgHeight ) / 2,
                src     : img.src,
                width   : imgWidth,
                height  : imgHeight
            })
            .transform('');


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
            $(img).hide();

        } )
        .attr( 'src' , $img.attr('src') + '?__' );
        

        $(document).bind('mouseup' , function(){
            isDragging = false;
            triggerEvent = null;
            status = {};
        })
        .bind('mousedown' , function( ev ){
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
                    // fuck ff
                    var svgOff =  $optWrap.offset(); //$('svg').offset();
                    svgOff.left += parseInt( $('#photo-wrap').css('left') );
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
        .bind('mousemove' , function( ev ){
            if( !triggerEvent ) return;

            if( !isDragging ){
                var distance = Math.abs( ev.pageX - status.pageX  ) + Math.abs( ev.pageY - status.pageY );
                if( distance > 15 ){
                    isDragging = true;
                }
            }
            if( isDragging  ){
                triggerEvent.fn.call( triggerEvent.$handler , ev , status );
            }
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
                var $svg = $('svg');
                var scale = 800 / 324;
                var $tmpCanvas = $('<canvas>').attr({
                    width: $svg.width() * scale,
                    height: $svg.height() * scale
                })
                .insertAfter('svg');

                var ctx = $tmpCanvas[0].getContext('2d');
                var transform = dragHelper.getRaphaelTransform( imgRaphael );
                var imgBox = imgRaphael.getBBox();
                // draw image
                ctx.save();
                ctx.translate( ( imgBox.x + imgBox.width / 2 ) * scale , ( imgBox.y + imgBox.height / 2 ) * scale );
                ctx.scale( transform.s * scale , transform.s * scale );
                ctx.rotate( transform.r * Math.PI / 180 );

                ctx.drawImage( $('#photo-wrap img')[0] , - imgWidth / 2 , - imgHeight / 2 , imgWidth , imgHeight );

                ctx.restore();

                var wWidth = $wrap.width();
                var wHeight = $wrap.height();
                var $rCanvas = $('<canvas>')
                    .attr({
                        width: wWidth * scale,
                        height: wHeight * scale
                    })
                    .insertAfter( $tmpCanvas );
                var rctx = $rCanvas[0].getContext('2d');
                var svgLeft = parseInt( $svg.css('left') );
                var svgTop = parseInt( $svg.css('top') );
                rctx.drawImage( $tmpCanvas[0] , Math.abs( svgLeft ) * scale , Math.abs( svgTop ) * scale , wWidth * scale , wHeight * scale , 0 , 0 , wWidth * scale , wHeight * scale );


                // clear
                var data = {
					photo: $rCanvas[0].toDataURL(),
                    pngnum: $('.mouths li.selected').index() + 1,
                    pngx : mouthRaphael.getBBox().x - Math.abs( svgLeft ),
                    pngy : mouthRaphael.getBBox().y - Math.abs( svgTop ),
                    pngr : dragHelper.getRaphaelTransform( imgRaphael ).r
                }

                $tmpCanvas.remove();
                $rCanvas.remove();
                return data;
            }
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

    //window.dragHelper = dragHelper;
    
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
                        .attr('src' , e.target.result );
                    gotoStep( 2 );
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

    // mouth click event
    $('.mouths img').click(function(){
        // 1. add pic to left wrap
        $(this).parent().addClass('selected')
            .siblings('.selected')
            .removeClass('selected');

        dragHelper.renderMouth( $(this) );
    });


    LP.action('flashPreview', function(data){
        $('.block-skin-tips-step').data('pngnum',data.pngnum);
        api.ajax('preview' , data , function( result ){
            if(result.success && result.success.message == 'success') {
                gotoStep(5);
                uploadComplete();
                result.data.flash = isFlash;
                result.data.timestamp = new Date().getTime();
                result.data.thumbnail = result.data.thumbnail.replace('thumbnail', 'thumbnail_800_800');
                $('.block-skin-tips-step').data('result',result.data);
                LP.compile( 'preview-template' , result.data , function( html ){
                    $('.block-skin-tips-preview').html(html);
                    LP.use('video-js' , function(){
                        videojs( "inner-video-" + result.data.timestamp , {}, function(){
                        });
                    });

                    $('#imgLoad').attr('src', result.data.thumbnail);
                    $('.preview-player').css({opacity:0});
                    $('#imgLoad').ensureLoad(function(){
                        $('.preview-player').animate({opacity:1});
                    });

                    LP.use('video-js' , function(){
                        if($("inner-pop-video-" + result.data.timestamp).length) {
                            videojs( "inner-pop-video-" + result.data.timestamp , {}, function(){
                                $('.vjs-big-play-button').show();
                            });
                        }

                    });
                });
            }
            else if(result.error && result.error.code == 1032) {
                setTimeout(function(){
                    LP.triggerAction('flashPreview', data);
                }, 5000);
            }
            else {

                uploadComplete();
            }

        });
    });


    LP.action('preview', function(){
		var data = dragHelper.getResult();
        api.ajax('preview' , data , function( result ){
            if(result.success && result.success.message == 'success') {
                gotoStep(5);
            }
            else {
                uploadComplete();
            }

            //uploadComplete();
        });
    });

    LP.action('publish', function(data){
        api.ajax('publish' , {id:data.id} , function( result ){
            var data = $('.block-skin-tips-step').data('result');
//            LP.compile( 'share-template' , data , function( html ){
//                $('.block-skin-tips-share').html(html);
//
//                $('.tip-image').fadeIn();
//            });

            var pngnum = $('.block-skin-tips-step').data('pngnum');
            LP.compile( 'tips-template' , {pngnum:pngnum, copy: tipsCopy[pngnum]} , function( html ){
                $('.tip-wrap').html(html).fadeIn();
            });

            $('.block-skin-tips-step').data('result',result.data);
            LP.compile( 'share-template' , data , function( html ){
                gotoStep(6);
                $('.block-skin-tips-share').html(html);

                $('.block-skin-tips-preview').html(html);
                LP.use('video-js' , function(){
                    videojs( "inner-video-" + data.timestamp , {}, function(){
                    });
                });

                $('#imgLoad').attr('src', data.thumbnail);
                $('.preview-player').css({opacity:0});
                $('#imgLoad').ensureLoad(function(){
                    $('.preview-player').animate({opacity:1});
                });

                LP.use('video-js' , function(){
                    if($("inner-pop-video-" + data.timestamp).length) {
                        videojs( "inner-pop-video-" + data.timestamp , {}, function(){
                            $('.vjs-big-play-button').show();
                        });
                    }

                });
            });
        });
    });

    LP.action('showPopVideo', function(data){
        data.timestamp = new Date().getTime();
        data.flash = isFlash;
        LP.compile( 'video-popup-template' , data , function( html ){
            $('body').append(html);
            $('.skin-overlay').fadeIn();
            $('#skin-pop-video').css({top:'-50%'}).fadeIn().animate({top:'50%'}, 500, 'easeOutQuart');
            LP.use('video-js' , function(){
                if($("inner-pop-video-" + data.timestamp).length) {
                    videojs( "inner-pop-video-" + data.timestamp , {}, function(){
                        $('.vjs-big-play-button').show();
                    });
                }

                setTimeout(function(){
                    $('.vjs-big-play-button').show();
                },2000);
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
        $('.block-skin-tips-flash .btn-rule').fadeIn(500);
        var pageParam = {pages:1};
        $('.block-skin-tips-list').data('param',pageParam);
        api.ajax('list' , function( result ){
            nodeActions.inserNode( $('.block-skin-tips-list') , result.data );
        });

        setTimeout(function(){
           if($('.block-skin-tips-flash').css('opacity') == 0 && !$('.block-skin-tips-preview').is(':visible')){
               $('.block-skin-tips-flash').animate({opacity:1});
           }

        }, 10000);


    }

    var tipsCopy = {
        '1': {
            'tit': '黯黄暗沉坏气色，统统走开！',
            'text1': '以前的护肤观念不正确，不注意保养，化妆、熬夜、吃喝不忌口，现在才发现自己的皮肤黯黄了许多！肤色不均、毫无光泽，还有讨厌的色斑和痘印！天啊，气色差到总被人问是不是生病，好尴尬！',
            'text2': '选用雅漾清透美白系列，轻松重焕清透亮白！首先用润肤水温和调理肌肤，注入保湿与天然美白精粹；再用精华乳密集美白，淡化暗沉、提亮肤色、改善肤质；日常必备美白乳，每天使用，持久润泽净白。'
        },
        '2': {
            'tit': '救命，前方黑色素预警！',
            'text1': '变白很难，变黑却总是这么容易！每到夏天黑一圈已经成了例行规律，晒后的干纹和色斑更让人烦恼。即使每次出门都全副武装，也仍旧无法阻挡无孔不入的阳光。防晒霜粘腻难受，效果却总是一般。结束暴晒再照镜子……你是？',
            'text2': '雅漾防晒系列，针对敏感肌肤，天然矿物成分，能全面抵抗UVB、UVA。舒缓自然防晒霜为纯物理防晒，即涂即有效。清爽倍护便捷防晒乳，质地轻薄舒适，让肌肤再无粘腻负担！防晒效果显著，再也不怕太阳啦！'
        },
        '3': {
            'tit': '赶不走的“青春”。',
            'text1': '青春早就跑远，可“青春的证据”却一留多年，怎么赶都赶不走。杜绝一切辛辣食物，煎炸食品更不敢奢望，每一天都过得小心翼翼，可痘痘、痘印依旧赖着不动，反倒失去了自信……',
            'text2': '每日睡前洗净脸部，使用雅漾祛脂系列，能够舒缓痘痘造成的红肿不适，调节角质层，控油、并收敛毛孔，还能有效预防痤疮形成。全方位呵护，彻底告别痘痘，让肌肤重现光洁无瑕！'
        },
        '4': {
            'tit': '不想再敏感！',
            'text1': '和许多人一样，我的皮肤也有一些敏感。一旦疏于保养，就会出现许多肌肤问题，比如干燥紧绷、刺痛发痒，甚至长出难看的小红斑！要如何选择合适的皮肤护理产品，是一个大难题。',
            'text2': '敏感肌肤清洁必须选用温和的护理产品，避免伤害皮肤。雅漾修护系列成分经过严格挑选；不含香料和对羟基苯甲酸酯；富含雅漾舒护活泉水，能修护皮脂膜，给皮肤持久保护。'
        },
        '5': {
            'tit': '我的脸真得洗干净了吗？',
            'text1': '空气污染越来越严重，雾霾那几天，就算带着口罩也会感觉有许多灰尘偷偷钻进了每一个毛孔，每次回到家都好像戴着一个尘螨面具……不得不认真洗脸，清洁肌肤，却总觉得洗不干净。',
            'text2': '日常洁肤，需要针对自己的肤质选择护肤品：如干性肌肤要少用刺激性大的产品，优先选用温和无皂基的护肤品；混合性及油性肌肤要确保不会阻塞毛孔，适当控油。高度敏感肌肤，可选用雅漾舒缓特护系列产品，有效清洁并持久保湿。'
        },
        '6': {
            'tit': '再也不想当番茄！',
            'text1': '我从小皮肤就很敏感，一到换季的时候就会出现一大片红斑；温差变化一大，就会敏感泛红；甚至只要一紧张，脸就瞬间通红，特别尴尬，还被同学起过“番茄”的绰号。那么多年了，却还是没有好转。',
            'text2': '敏感肌肤泛红诱因有许多，包括日晒、温度刺激等。雅漾修红舒润面膜能即刻凉爽肌肤，瞬间解除灼热泛红尴尬。配合使用修红保湿系列其他产品，能缓解敏感泛红现象，让肌肤更健康！'
        },
        '7': {
            'tit': '我的脸快要枯萎了！',
            'text1': '连续加班半个月了。整天呆在空调房面对电脑屏幕，一天工作下来，脸部肌肤干燥粗糙，毫无光泽，没有活力……甚至细纹都明显加深。整个人看起来特别疲惫，心情也变得很差。',
            'text2': '加班前先清洁面部，选用拥有强悍保湿力量的活泉恒润保湿系列，舒缓肌肤同时，让水分均匀分布在肌肤表面，长久锁水滋润，缓解肌肤干渴状态。加班中也要记得随时补水喔，避免干燥突袭！'
        },
        '8': {
            'tit': '肌肤遭遇红灯，束手无策！',
            'text1': '有时候，肌肤会突然出现问题，比如过敏、生理期猛发痘等。为了减少刺激、不让肌肤问题恶化，必须素颜出门。平时还好，一旦到了重要时刻，不化妆真是出不了门！简直手足无措，怎么办？',
            'text2': '害怕彩妆用品恶化肌肤问题？你需要雅漾焕彩遮瑕系列！它能改善肌肤瑕疵，营造自然通透的完美妆容；防紫外线，保护肌肤免受阳光侵害；不含香料，不诱发粉刺，耐受性良好；遮盖功能卓越，轻盈自然，肌肤无负担！'
        },
        '9': {
            'tit': '我的脸有颗玻璃心！',
            'text1': '作为超级敏感肌的主人，护肤过程相当痛苦。因为皮肤非常脆弱，状况总是不稳定，从来不敢乱用护肤品，稍有不慎就会过敏，非常难受。真不知道怎么办才好！ ',
            'text2': '高度敏感肌的皮肤屏障严重受损，细微的刺激都会引起皮肤的不适，因此必须使用能保证百分百安全的护肤品。雅漾舒缓特护系列，提出革命性的“无菌护肤”理念，能温柔呵护敏感肌肤，让皮肤在被滋润的过程中，不受刺激损伤。'
        }

    };
    init();


	var viewpage = function(){
		var id = getQueryString('id');
		if(!id) return;
		api.ajax('view', {id:id} , function( result ){
			result.data.timestamp = new Date().getTime();
			result.data.flash = isFlash;
            result.data.thumbnail = result.data.thumbnail.replace('thumbnail', 'thumbnail_250_250');
            $('#imgLoad').attr('src', './'+result.data.thumbnail);
			LP.compile( 'video-popup-template' , result.data , function( html ){
				$('.tips-view-page').append(html);
                $('.tips-view-page').css({opacity:0});
                $('#imgLoad').ensureLoad(function(){
                    $('.tips-view-page').animate({opacity:1});
                    $('.vjs-big-play-button').show();
                });
				LP.use('video-js' , function(){
					if($("inner-pop-video-" + result.data.timestamp).length) {
						videojs( "inner-pop-video-" + result.data.timestamp , {}, function(){
                            $('.vjs-big-play-button').show();
						});
					}
				});
			});
		});


	}

	viewpage();




	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}


    jQuery.fn.extend({
        ensureLoad: function(handler) {
            return this.each(function() {
                if(this.complete) {
                    handler.call(this);
                } else {
                    $(this).load(handler);
                }
            });
        }
    });






});


