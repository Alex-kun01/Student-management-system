
//锚点


function init (){
    binEvent();
    location.hash = '#student-list'
}

init();

function binEvent(){
     //下拉菜单
    
     const list = $('.header .drop-list');
     $('.header .btn').on('click',function(){
         list.slideToggle();
         console.log(1)
     })

     $(window).resize(function(){
         //视口宽度超过786的时候就将drop-list收起来
         if( $(window).innerWidth() >= 768 ){
             list.css('display','none');
         }
     })
     //监控url中的哈希值的变化
     $(window).on('hashchange',function(){
        const hash = location.hash;//获取哈希值
        console.log(hash);
        $('.content-active').removeClass('content-active');
        $(hash).addClass('content-active');

        $('.list-item.active').removeClass('active');
        console.log('.' + hash.slice(1))
        $('.' + hash.slice(1) + '2').addClass('active');
     })

     //左边点击
     $('.list-item').on('click',function(){
         $('.drop-list').slideUp();
         const id = $(this).attr('data-id');
         location.hash = '#' + id;
     })
}