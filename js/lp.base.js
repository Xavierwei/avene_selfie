/*
 * page base action
 */
LP.use(['jquery', 'api', 'easing', 'fileupload', 'flash-detect', 'swfupload', 'swfupload-speed', 'raphael'] , function( $ , api ){
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
                .attr('src' , './img/test.jpg');
                $('.mask-bottom').height( '' );
                $('.step1-btns').show().next().hide();
                $('.block-skin-tips-top').html("<img src=\"./img/chun.png\"> <span>给自己的护肤小 Tips</span>");   
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
        var imgRaphael = null;
        var imgWidth  , imgHeight , wrapWidth , wrapHeight;
        var wrapOff = $optWrap.offset();
        $img.load( function(){
            // reset 
            transforms = [];
            dragHelper.setTransform( $('.imgwrap-opts') , "inherit" );
            console.clear();
            var img = this;

            console.log( wrapOff );
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
                $('svg').css({
                    left: ( imgWidth - wrapWidth) / 2,
                    top: ( imgHeight - wrapHeight ) / 2,
                    overflow: 'visible'
                });
            }
            //raphael.setSize( tarWidth , tarHeight );
            console.log( imgWidth , imgHeight , wrapHeight , wrapWidth);
            console.log( ( - imgWidth + wrapWidth) / 2 , ( - imgHeight + wrapHeight ) / 2 );
            // reset transform
            var svgWidth = $('svg').width();
            var svgHeight = $('svg').height();

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
                    if( this.contains( target ) || this === target ){
                        contains = true;
                        return false;
                    }
                });

                if( contains ){
                    status.pageX = ev.pageX;
                    status.pageY = ev.pageY;

                    // get img status
                    status.imgOff = imgRaphael.getBBox();
                    status.imgCenter = {x: status.imgOff.x + status.imgOff.width / 2 , y: status.imgOff.y + status.imgOff.height / 2};
                    status.center = {pageX: status.imgOff.x + status.imgOff.width / 2 + wrapOff.left , pageY: status.imgOff.y + status.imgOff.height / 2 + wrapOff.top};

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
        var renderOpts = function(){
            var off  = imgRaphael.getBBox( false );
            var trs = imgRaphael.transform();
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

            var $opts = $('.imgwrap-opts');
            $opts.css({
                width: imgWidth * s,
                height: imgHeight * s,
                top: ($opts.data('top') || 0) - imgHeight * ( s - 1 ) / 2,
                left: ($opts.data('left') || 0) - imgWidth * ( s - 1 ) / 2
            });

            dragHelper.setTransform( $opts , "translate(" + tx + "px," + ty + "px) rotate(" + r + "deg)" );

        }
        return {
            bind: function( $dom , dragMoveFn ){
                events.push( { $handler: $dom , fn: dragMoveFn } );
                return this;
            },

            translate: function ( x , y ){
                if( transforms.length && ( match = transforms[transforms.length-1].match( trsReg ) ) ){
                    transforms[transforms.length-1] = "T" + ( x + parseFloat( match[1] ) ) + ',' + ( y + parseFloat( match[2] ) );
                } else {
                    transforms.push( "T" + x + ',' + y );
                }

                imgRaphael.transform( transforms.join('') );
                renderOpts();
            }
            ,
            scale: function( s ){
                if( transforms.length && ( match = transforms[transforms.length-1].match( scaReg ) ) ){
                    transforms[transforms.length-1] = "S" + ( s * parseFloat( match[1] ) ) + ','
                         + ( s * parseFloat( match[2] ) )
                         + "," + match[3]
                         + "," + match[4];
                } else {
                    var box = imgRaphael.getBBox();
                    transforms.push( "S" + s + ',' + s + ',' + (box.x + box.width/2) + "," + (box.y + box.height/2) );
                }
                imgRaphael.transform( transforms.join('') );
                renderOpts();
            }
            ,
            rotate: function( r ){
                if( transforms.length && ( match = transforms[transforms.length-1].match( rotReg ) ) ){
                    transforms[transforms.length-1] = "R" + ( r + parseFloat( match[1] ) ) 
                        + "," + match[2]
                        + "," + match[3];
                } else {
                    var box = imgRaphael.getBBox();
                    transforms.push( "R" + r + ',' + (box.x + box.width/2) + "," + (box.y + box.height/2) );
                }
                imgRaphael.transform( transforms.join('') );
                renderOpts();
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

            console.log( or , cr , odx , tdx );

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
});


