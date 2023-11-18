function cusTumSlect(e) {
  const $selects = document.querySelectorAll('.form-area-box1 .custom-selet select');
  const $windowHeight =window.innerHeight / 1.8;
  const $wrap = document.querySelector('.wrap');
  console.log(window.innerHeight);
  console.log($wrap.clientHeight/ 1.8);
  $selects.forEach((idx, i) => {
    const $options = idx.children;
    const $ul = idx.nextElementSibling;
    const $btn = idx.previousElementSibling;
	
    const $li = $ul.children;
    let selectedIdx = idx.selectedIndex;
    /*height 위치*/
    let $thisSelectHeight = $selects[i].getBoundingClientRect().top;
    if ($thisSelectHeight < $wrap.clientHeight/ 1){
      
    } else{
      $ul.classList.add('bottom');
    }
		
   
    /*//*/
    let arr = '';
    let icons = '';
    for (let num = 0; num < $options.length; num++) {
      arr += `/${$options[num].textContent}`;
      icons += `/${$options[num].getAttribute('icon-data')}`;//아이콘 가져오기
    };
    const $optionsText = arr.substr(1).split('/'); //첫 구분자 삭제 후 구분자로 옵션의 배열 만들기. 
    const $iconsText = icons.substr(1).split('/'); //첫 구분자 삭제 후 구분자로 옵션의 배열 만들기.        
    $optionsText.forEach((optios, i) => {
      const $newLi = document.createElement('li');
      const $icons = document.createElement('i');
      $icons.classList.add($iconsText[i]);
      $newLi.textContent = optios;
      $newLi.insertBefore($icons, $newLi.childNodes[0]);//아이콘 위치 앞인지 뒤인지.
      $ul.appendChild($newLi);
      $newLi.setAttribute('onclick', `select_val(this);`);
    });

    /*//*/
    /*버튼기능 구현*/
    let ulSelect = false;// select 선택 있는지 확인
    $btn.addEventListener('click', function (e) {
      $ul.classList.toggle('select');
      $btn.closest('.form-area-box1').classList.toggle('focus');
      return ulSelect = true;
    });
   $btn.textContent = $li[0].textContent;
		//$btn.textContent = $li[selectedIdx]?.textContent;
		//$li[selectedIdx]?.classList.add('active');
    //--- 메뉴 영역외 클릭시 메뉴 닫기---//
    document.addEventListener('click', function (e) {
      if (ulSelect == true) { //select가 열려 있을때
        if (e.target != $btn) {
          let tgEl = e.target;
          $ul.classList.remove('select');
          $ul.closest('.form-area-box1').classList.remove('focus');
          return ulSelect = false;
        }
      }
    });
    //
    /*li 클릭*/

  });
}
function select_val(e) {
  const $nodes = [...e.parentElement.children];
  const $btn = e.closest('.custom-selet').querySelector('button');
  const $select = e.closest('.custom-selet').querySelector('select');
  const $index = $nodes.indexOf(e);
  // console.log($select.getAttribute('onchange'));
  // console.log($select);
  const $selectFc = document.querySelector('select');
  e.parentElement.childNodes.forEach(num =>{
    if(num.classList =='active'){
      
    }else{

    }   
  })
  let siblings = (list) => [...list.parentElement.children].filter(e => e != list);
  //let one = document.querySelector('one');
  siblings(e).forEach(i =>{
    i.classList.remove('active');
  })
  e.classList.add('active');
  $select.children[$index].selected = true;
  $btn.textContent = e.textContent; 
  $select.onchange();
  
}
function FCchage(e){
  console.log(e.value);
}
cusTumSlect();

