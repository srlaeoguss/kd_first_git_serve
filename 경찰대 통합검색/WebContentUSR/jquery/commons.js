$(document).ready(function(){
	var lev1 =$(".lev-menu-box .lev1>li>a");
	var lev2 =$(".lev-menu-box .lev2>li>a");
	var lev3 =$(".lev-menu-box .lev2>li>a");
	lev1.click(function(){
		
		$(this).parent().addClass("active").siblings().removeClass("active");
      lev1.find("[class^='icon-']").removeClass('F');
      $(this).find("[class^='icon-']").addClass('F');
	});
	lev2.click(function(){
		$(this).parent().addClass("active").siblings().removeClass("active");
	});
	lev3.click(function(){
		$(this).parent().addClass("active").siblings().removeClass("active");
	});
	$('.datepicker-input').datepicker({
         format: 'yyyy/mm/dd', //데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
         //startDate: '-10d', //달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
        // endDate: '+10d', //달력에서 선택 할 수 있는 가장 느린 날짜. 이후로 선택 불가 ( d : 일 m : 달 y : 년 w : 주)
         autoclose: true, //사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
         calendarWeeks: false, //캘린더 옆에 몇 주차인지 보여주는 옵션 기본값 false 보여주려면 true
         //clearBtn: false, //날짜 선택한 값 초기화 해주는 버튼 보여주는 옵션 기본값 false 보여주려면 true
         //datesDisabled: ['2019-06-24', '2019-06-26'], //선택 불가능한 일 설정 하는 배열 위에 있는 format 과 형식이 같아야함.
         //daysOfWeekDisabled: [0, 6], //선택 불가능한 요일 설정 0 : 일요일 ~ 6 : 토요일
         //daysOfWeekHighlighted: [3], //강조 되어야 하는 요일 설정
        // disableTouchKeyboard: false, //모바일에서 플러그인 작동 여부 기본값 false 가 작동 true가 작동 안함.
        // immediateUpdates: false, //사용자가 보는 화면으로 바로바로 날짜를 변경할지 여부 기본값 :false
        // multidate: false, //여러 날짜 선택할 수 있게 하는 옵션 기본값 :false
        // multidateSeparator: ',', //여러 날짜를 선택했을 때 사이에 나타나는 글짜 2019-05-01,2019-06-01
         templates: {
            leftArrow: '<i class="icon-angle-left"></i>',
            rightArrow:'<i class="icon-angle-right"></i>',
         }, //다음달 이전달로 넘어가는 화살표 모양 커스텀 마이징
         showWeekDays: true, // 위에 요일 보여주는 옵션 기본값 : true
         //title: '테스트', //캘린더 상단에 보여주는 타이틀
        // todayHighlight: true, //오늘 날짜에 하이라이팅 기능 기본값 :false
        // toggleActive: true, //이미 선택된 날짜 선택하면 기본값 : false인경우 그대로 유지 true인 경우 날짜 삭제
        // weekStart: 0, //달력 시작 요일 선택하는 것 기본값은 0인 일요일
         language: 'ko', //달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
      }).on('changeDate', function (e) {
         /* 이벤트의 종류 */
         //show : datePicker가 보이는 순간 호출
         //hide : datePicker가 숨겨지는 순간 호출
         //clearDate: clear 버튼 누르면 호출
         //changeDate : 사용자가 클릭해서 날짜가 변경되면 호출 (개인적으로 가장 많이 사용함)
         //changeMonth : 월이 변경되면 호출
         //changeYear : 년이 변경되는 호출
         //changeCentury : 한 세기가 변경되면 호출 ex) 20세기에서 21세기가 되는 순간
 
         console.log(e);
         // e.date를 찍어보면 Thu Jun 27 2019 00:00:00 GMT+0900 (한국 표준시) 위와 같은 형태로 보인다.
      });
});
function menu_collapse(){
 var	left_area = $('.wrap>.row>div.left');
 	left_area.toggleClass('trans');
 	
 	$('.trans .lev-menu-box .lev1>li').mouseover(function(){
		console.log('aa');

		$(this).addClass('hover').siblings().removeClass('hover');
	});
	$('.trans .lev-menu-box .lev2').mouseout(function(){
		console.log('b');
		$('.trans .lev-menu-box .lev1>li').removeClass('hover');
	});
 	
}
function close_btn(e){
	 var	left_search_area = $('.content-wrap>div.left-search');
	 left_search_area.toggleClass('trans');
    
    $('.btnFc-1').toggleClass('active');
    if($('.btnFc-1').hasClass('active')){
      $('.btnFc-1').html('<i class="icon-search mr-3px"></i>검색조건 열기');
    }else{
      $('.btnFc-1').html('<i class="icon-search-minus mr-3px"></i>검색조건 닫기');
    }
    tablecheck();
   }

function remove_table_top(e){
	 var	ele_table_t = $('.eletabletop1'); 
	 ele_table_t.toggleClass('trans');
	 $(e).parent().toggleClass("trans");
	 $(e).find('i').switchClass("icon-angle-left",'icon-A-Right')
}
function detail_pop(){
	$('.detail-pop').toggleClass('trans');
   $('.content-wrap>div.content').toggleClass('detail-show');

   tablecheck();
}

// new SimpleBar($('.detail-pop .border-areabox-box,.content')[0]);

/*hover icon*/
$(document).ready(function(){
   $('i.HoverIcon').hover(function(){
      $(this).addClass('F');
   },function(){
      $(this).removeClass('F');
   });
   $('.HoverIcon').hover(function(){
      $(this).find("[class^='icon-']").addClass('F');
   },
   function(){
      $(this).find("[class^='icon-']").removeClass('F');
   });
});
function tablecheck(){
   var table_w = $('[class*="table-box-"].overtable').width();
   console.log(table_w);
   if(table_w > 1280){
      console.log('크다');
      $('.tbox-prent').removeClass('smalling');
   }else{
      $('.tbox-prent').addClass('smalling');
      console.log('작다');
   }
}

$(document).ready(function(){
   let modal_btn = $("[custum-modal-target]")
   modal_btn.click(function(){
        let modal_btn_target = $(this).attr('custum-modal-target');
        $(modal_btn_target).addClass('show');
        $('body').addClass('overflow-hidden');
        let  target_h = $(modal_btn_target).find('.cutum-modal-dialog').css('height');
        if(target_h = 900){
           $(modal_btn_target).find('.cutum-modal-dialog').css('height');
        }
        console.log(modal_btn_target);
     });
  $("[custum-modal-dismiss='modal']").click(function(){
     $(this).parents('.custum-modal.show').removeClass('show');
     
     $('body').removeClass('overflow-hidden');
  });
  

});
/*//*/

const $input = document.querySelectorAll("[class*='form-area-box1'] [class*='ele-icon-box']>input");
let focusSelect = false;// focus 선택 있는지 확인
$input.forEach((e) => {
   //console.log(e);
   e.addEventListener('focus', function () {
      this.closest('.form-area-box1').classList.add('focus');
      return focusSelect = true;
   });
   e.addEventListener('focusout', function () {
      this.closest('.form-area-box1').classList.remove('focus');
      
   });
});

function close_btn(e){
   if(e.closest('.left-menu')){
      console.log('left 메뉴');
      if(e.classList.contains('trans')){
         e.innerHTML = "검색조건 닫기 <i class='icon-times'></i>";
         e.classList.remove('trans');
         document.querySelector('.left-search').classList.remove('trans');
      }else{
         e.innerHTML = "검색조건 열기 <i class='icon-search'></i>";
         e.classList.add('trans');
         document.querySelector('.left-search').classList.add('trans');
      }

   }else if(e.closest('.left-search')){
      const $menuCollapse= document.querySelector('.left-menu .top').querySelector('.menu-collapse')
      $menuCollapse.classList.add('trans');
      $menuCollapse.innerHTML = "검색조건 열기 <i class='icon-search'></i>";
      document.querySelector('.left-search').classList.add('trans');
   }
}
function datilbox(e){
   e.closest("[class*='show-in-right']").classList.add('trans');
   //console.log(e);
   document.querySelector('.right-box').classList.add('trans');
}
function datilbox_close(){
   
   document.querySelector("[class*='show-in-right']").classList.remove('trans');
   document.querySelector('.right-box').classList.remove('trans');
}
function tab(e){
   //console.log(`tab-${e}`);
   $("[class*='tab-tit-']").removeClass('active');
   $(`.tab-tit-${e}`).addClass('active');
   $('.tab-box>div').removeClass('on');
   $(`#tab-${e}`).addClass('on');
}