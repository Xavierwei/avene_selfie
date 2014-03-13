function upload(Photo,Mouth_id,Mouth_x,Mouth_y,Mouth_rotation){
    if(Mouth_rotation < 0)
    {
        Mouth_rotation = 360 + Mouth_rotation;
    }

    data = {
        photo: 'data:image/jpg;base64,' + Photo,
        pngnum: Mouth_id,
        pngx: Mouth_x - 100,
        pngy: Mouth_y - 100,
        pngr: Mouth_rotation
    }
    LP.triggerAction('flashPreview', data);
//    alert(
//        "Photo="+Photo.substr(0,10)+"...，Photo.length="+Photo.length+"\n"+
//            "Mouth_id="+Mouth_id+"\n"+
//            "Mouth_x="+Mouth_x+"\n"+
//            "Mouth_y="+Mouth_y+"\n"+
//            "Mouth_rotation="+Mouth_rotation
//    );
//    setTimeout("uploadComplete()",3000);
}
function uploadComplete(){
    var flash=document.getElementById("flash");
    if(flash){
        if(flash.js2flashUploadComplete){
        }else{
            flash=null;
        }
    }
    if(flash){
    }else{
        flash=document.getElementsByName("flash");
        if(flash){
            flash=flash[0];
            if(flash){
                if(flash.js2flashUploadComplete){
                }else{
                    flash=null;
                }
            }
        }
    }
    if(flash){
        flash.js2flashUploadComplete("photo_id","photourl");
    }//else{
    //	alert("找不到flash");
    //}
}
function flashReset(){
    var flash=document.getElementById("flash");
    if(flash){
        if(flash.js2reset){
        }else{
            flash=null;
        }
    }
    if(flash){
    }else{
        flash=document.getElementsByName("flash");
        if(flash){
            flash=flash[0];
            if(flash){
                if(flash.js2reset){
                }else{
                    flash=null;
                }
            }
        }
    }
    if(flash){
        flash.js2reset();
    }//else{
    //	alert("找不到flash");
    //}
}
function onStartPaizhao(){
    jQuery('.btn-rule').fadeOut();
    jQuery('.block-skin-tips').removeClass('tips-onstep1');
}
function onGetImg(){
    jQuery('.block-skin-tips-bottom').fadeOut();
    jQuery('.btn-rule').fadeOut();
    jQuery('.block-skin-tips').removeClass('tips-onstep1');
}

function onLoaded() {
    jQuery('.block-skin-tips-flash').css({opacity:0});
    setTimeout(function(){
        jQuery('.block-skin-tips-inner-wrap').removeClass('block-skin-tips-inner-loading');
        jQuery('.block-skin-tips-flash').animate({opacity:1});
    }, 1000);
}

function onReset(){
    jQuery('.btn-rule').fadeIn();
    jQuery('.block-skin-tips').fadeClass('tips-onstep1');
    jQuery('.block-skin-tips-bottom').fadeOut();
}

function onPaizhao(){
//    jQuery('.tip-image').fadeIn();
    jQuery('.block-skin-tips-bottom').fadeOut();
    jQuery('.btn-rule').fadeOut();
    jQuery('.block-skin-tips').removeClass('tips-onstep1');
}