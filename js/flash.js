function upload(Photo,Mouth_id,Mouth_x,Mouth_y,Mouth_rotation){

    data = {
        photo: 'data:image/jpg;base64,' + Photo,
        pngnum: Mouth_id,
        pngx: Mouth_x,
        pngy: Mouth_y,
        pngr: Mouth_rotation
    }
    LP.triggerAction('uploadImg', data);
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
function onGetImg(){
    alert("onGetImg");
}
function onReset(){
    alert("onReset");
}

function onPaizhao(){
    $('.btn-rule').fadeOut();
}