$(function(){
    canver_tol_box = document.getElementById("canver-tol");
    draw_map_box = document.getElementById("draw-map-box");
    canver_w_val = document.getElementById("canver-w").value;
    canver_h_val = document.getElementById("canver-h").value;
    width_value = 1155;
    height_value = 765;
   // var canvas = "<div id='canvas'class='clone-canvas'style='width:" + width_value + "px;height:" + height_value + "px;margin:auto;'></div>";
    position_tol_box = document.getElementById("position-tol");
    //$(draw_map_box).append(canvas);
    $(canver_tol_box).hide();
    $(position_tol_box).show();
     $('#canver-w').val(width_value);
	 $('#canver-h').val(height_value);
    
    //$( "#canvas" ).draggable();
     //생성후

    /*조직도 객체 복사*/
    var groud_box = $( ".clone-canvas.tol-ver>.groud-box" );
    var line_box = $( ".clone-canvas.tol-ver>.line-box" );
    var canvas_drop = $( "#canvas" );

    var counts = [0];
    var resizeOpts = {
        handles: "all" ,autoHide:true
    };
    groud_box.draggable({
        helper: "clone",
        //Create counter
        start: function() { counts[0]++; }
    });
    line_box.draggable({
        helper: "clone",
        //Create counter
        start: function() { counts[0]++; }
    });
    canvas_drop.droppable({
        drop: function(e, ui){
            if(ui.draggable.hasClass("groud-box")) {
                $(this).append($(ui.helper).clone());
                //Pointing to the groud-box class in dropHere and add new class.
                $("#canvas .groud-box").addClass("item-"+counts[0]);
                //Remove the current class (ui-draggable and groud-box)
                $("#canvas .item-"+counts[0]).removeClass("groud-box ui-draggable ui-draggable-dragging");
                $(".item-"+counts[0]).find('.close').click(function() {
									$(this).parent().remove();
                });
                make_draggable($(".item-"+counts[0]));
                $(".imgSize-"+counts[0]).resizable(resizeOpts);
                select_box()
            }
            if(ui.draggable.hasClass("line-box")) {
                $(this).append($(ui.helper).clone());
                //Pointing to the groud-box class in dropHere and add new class.
                $("#canvas .line-box").addClass("line-item-"+counts[0]);
                //Remove the current class (ui-draggable and groud-box)
                $("#canvas .line-item-"+counts[0]).removeClass("line-box ui-draggable ui-draggable-dragging");
                $(".line-item-"+counts[0]).find('.close').click(function() {
                    $(this).parent().remove();
                });
                make_draggable2($(".line-item-"+counts[0]));
                $(".imgSize-"+counts[0]).resizable(resizeOpts);
                select_box()
            }

        }
    });


    var zIndex = 0;
    function make_draggable(elements)
    {
        elements.draggable({
            containment:'parent',
            //start:function(e,ui){ ui.helper.css('z-index',++zIndex); },
            stop:function(e,ui){
            }
        });
        elements.resizable();


    }
    function make_draggable2(elements)
    {
        elements.draggable({
            containment:'parent',
            //start:function(e,ui){ ui.helper.css('z-index',++zIndex); },
            stop:function(e,ui){
            }
        });
        elements.resizable();

    }
    /*//조직도 객체 복사*/
    /*조직도 안 객체 선택*/
    function select_box(){
        var canvas_groud_box = $("#canvas>a.click-box");
        var canvas_line_box = $("#canvas>span.click-box");
        var canvas_box = $("#canvas .click-box");
				$("#multy_check").on('click', function() {
					$("#canvas .click-box").removeClass("select");
				});
        canvas_box.click(function(){

            $(this).addClass("select");
						var multy_box_check_val = $('#multy_check').is(":checked");
						if(multy_box_check_val){

						}else{
							$("#canvas .click-box").not(this).removeClass("select");
						}

            width_val =  parseInt($(this).css('width'));
            height_val = parseInt($(this).css('height'));
            position_x_val =  parseInt($(this).css('left'));
            position_y_val =  parseInt($(this).css('top'));
            text_val = $(this).find('span').text();
            text_val_h = $(this).find('span').css('line-height');
            orgCd = $(this).attr("id");
            orgNm = $(this).attr("title");
            $('input[name="orgCd"]').val(orgCd);
            $('input[name="orgNm"]').val(orgNm);

            $('#position-x').val(position_x_val);
            $('#position-y').val(position_y_val);
            if($(this).hasClass('box')){

                $('#box-tol').show();
                $('#line-tol').hide();
                $('#box-w').val(width_val);
                $('#box-h').val(height_val);
                $('#box-t').val(text_val);
                $('#text-h').val(text_val_h)
            }else if($(this).hasClass('line')){
                $('#box-tol').hide();
                $('#line-tol').show();
                $('#line-w').val(width_val);
                $('#line-h').val(height_val);

            }

        });
    }


    /*//조직도 안 객체 선택*/

});
function arrow_box(s){

        arrow_sel_box = $("#canvas>.click-box.select");
        arrow_sel_box.removeClass('link-left');
        arrow_sel_box.removeClass('link-top');
        arrow_sel_box.removeClass('link-right');
        arrow_sel_box.removeClass('link-bottom');
        arrow_sel_box.removeClass('delect-link');
        arrow_sel_box.addClass(s);
        return false

}
function colorChange(e){

    color_sel_box = $("#canvas>.click-box.select");
    val= $(e).val();
    color_sel_box.removeClass('ver1');
    color_sel_box.removeClass('ver2');
    color_sel_box.removeClass('ver3');
    color_sel_box.removeClass('ver4');
    color_sel_box.removeClass('ver5');
    color_sel_box.removeClass('ver6');
    color_sel_box.removeClass('ver7');
    color_sel_box.removeClass('ver8');
    color_sel_box.removeClass('ver1');
    color_sel_box.addClass(val);
    return false

}
function box_w(){
    width = $('#box-w').val();
    arrow_sel_box = $("#canvas .click-box.select");
    arrow_sel_box.css('width',width);
}
function box_h(){
    height = $('#box-h').val();
    arrow_sel_box = $("#canvas .click-box.select");
    arrow_sel_box.css('height',height);
}
function line_w(){
    width = $('#line-w').val();
    arrow_sel_box = $("#canvas .click-box.select");
    arrow_sel_box.css('width',width);
}
function line_h(){
    height = $('#line-h').val();
    arrow_sel_box = $("#canvas .click-box.select");
    arrow_sel_box.css('height',height);
}
function position_x(){
    val_x = $('#position-x').val();
    arrow_sel_box = $("#canvas .click-box.select");
    arrow_sel_box.css('left',val_x+'px');
}
function position_y(){
    val_y = $('#position-y').val();
    arrow_sel_box = $("#canvas .click-box.select");
    arrow_sel_box.css('top',val_y+'px');
}
function box_text(){
    text = $('#box-t').val();
    text_h = $('#text-h').val();
    arrow_sel_box = $("#canvas .click-box.select");
    arrow_sel_box.find('span').text(text);
    arrow_sel_box.find('span').css('line-height',text_h);
}
function text_position(s){
    arrow_sel_box = $("#canvas .click-box.select").find('span');
        arrow_sel_box.removeClass('text-left');
        arrow_sel_box.removeClass('text-center');
        arrow_sel_box.removeClass('text-right');
        arrow_sel_box.addClass(s);
}
function page_modify(){
    canvas  = $("#draw-map-box #canvas");
    var canverW=$('#canver-w').val();
	var canverH=$('#canver-h').val();
    canvas.css({'width':canverW,'height':canverH});
}

// 

$(document).ready(function(){
    $('#box-tol').hide();
    $('#line-tol').hide();
    //$('#position-tol').hide();

});

