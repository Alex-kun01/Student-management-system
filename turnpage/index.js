


!(function(){

//封装翻页对象（构造函数）
    function TurnPage(options,wrap){
        this.wrap = wrap || $('body');//将数据保存到TurnPage身上
        this.curPage = options.curPage || 1;//页数
        this.totalPage = options.totalPage || 1;//总页数
        this.changeCb = options.changeCb || function (){};
        this.init = function(){
            this.fillHtml();
            this.initStyle();
            this.bindEvent();
        }

    }
    TurnPage.prototype.fillHtml = function(){
        var oUl = $('<ul class="my-turn-page"></ul>')

        //当前页大于第一页时 出现上一页按钮
        $('<li class="prev">上一页</li>').appendTo(oUl);
        //第一页
        $('<li class="num">1</li>').appendTo(oUl)
                                   .addClass(this.curPage == 1 ? 'current' : '');
        //添加前面的省略号
        if(this.curPage - 2 > 2){
            $('<span>...</span>').appendTo(oUl);
        }
        for(var i = this.curPage - 2;i <= this.curPage + 2;i++){
            if(i > 1 && i < this.totalPage){
                $('<li class="num"></li>').text(i)
                                          .appendTo(oUl)
                                          .addClass(i == this.curPage ? 'current' : '');
            }
        }
        //添加后面的省略号
        if(this.curPage + 2 < this.totalPage - 1){
            $('<span>...</span>').appendTo(oUl);
        }
        $('<li class="num"></li>').text(this.totalPage)
                                  .appendTo(oUl)
                                  .addClass(this.curPage == this.totalPage ? 'current' : '');

        if(this.curPage < this.totalPage){
            $('<li class="next">下一页</li>').appendTo(oUl);
        }
        this.wrap.empty().append(oUl);
    }

    TurnPage.prototype.initStyle = function(){
        $('.my-turn-page',this.wrap).find('*').css({
            padding:0,
            margin:0
        }).end().find('li').css({
            listStyle:'none',
            display:'inline-block',
            padding:'2px 4px',
            backgroundColor:'#0d9196',
            color:'#e3eceb',
            borderRadius:'5px',
            cursor:'pointer',
            margin:'0 5px',
            fontSize:'14px'
        }).filter('.current').css({
            backgroundColor:'#12b0b6'
        })
    }
    TurnPage.prototype.bindEvent = function(){
        var self = this;
        $(this.wrap).on('click','.my-turn-page > li',function(){
            if($(this).hasClass('prev')){
                if(self.curPage == 1){
                    return;
                }
                self.curPage--;
                self.fillHtml();
                self.initStyle();
            }else if($(this).hasClass('next')){
                self.curPage++;
                self.fillHtml();
                self.initStyle();
            }else if($(this).hasClass('num')){
                self.curPage = parseInt($(this).text());
            }
            self.fillHtml();
            self.initStyle();
            self.changeCb(self.curPage);
        })
    }


    $.fn.extend({
        page:function(options){
            var obj = new TurnPage(options,this);
            obj.init();
            return this;
        }
    })
}())