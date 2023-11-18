$(function() {
	
	
});
function createIist() {
	$(createBoxBox()).appendTo("#grid-dragbox-box");
	$('.grid-dragbox').click(function(){
		$(this).addClass('select');
		$('.grid-dragbox').not($(this)).removeClass('select');		
	});
					 
}							
function createItem() {
	$(createBox()).appendTo(".grid-dragbox");//$(createBox()).appendTo(".grid-dragbox.select");
	$('#grid-dragbox>li').click(function(){
		$(this).addClass('select');
		$('#grid-dragbox>li').not($(this)).removeClass('select');
		var this_width = $(this).find('.box').width();
		var this_height = $(this).find('.box').height();
		$('#borad-w').val(this_width);
		$('#borad-h').val(this_height);
		$(".grid-dragbox").sortable();
	$(".grid-dragbox").disableSelection();
	});
	$('#grid-dragbox>li .box').resizable();							 
}
function CloseItem() {
	$('ul.grid-dragbox>li.select').remove();							 
}
function CloseIist() {
	$('ul.grid-dragbox.select').remove();							 
}
// 아이템을 구성할 태그를 반환합니다.
// itemBox 내에 번호를 표시할 itemNum 과 입력필드가 있습니다.
function createBoxBox() {
	var contents 
	= "<ul id='grid-dragbox'class='grid-dragbox ' style='min-height:50px; min-width:50px;'>"									
	+ "</ul>";
	return contents;
}
function createBox() {
	var contents 
	= "<li class='ui-state-default' >"
		+"<div class='box' style='width:100px;height:100px;'>"
			+"<a class='close' id='submitItem' onclick='CloseItem();'><i class='icon-A-Close'></a>"
		+"</div>"									
	+ "</li>";
	return contents;
}
function borad_w(){
		width = $('#borad-w').val();
		arrow_sel_borad = $("ul.grid-dragbox>li.select .box");
		arrow_sel_borad.css('width',width);
}
function borad_h(){
		height = $('#borad-h').val();
		arrow_sel_borad = $("ul.grid-dragbox>li.select .box");
		arrow_sel_borad.css('height',height);
}
