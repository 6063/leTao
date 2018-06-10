var letao;
$(function(){
    letao = new Letao();
    letao.initMui();
    letao.backBefore();
})
var Letao = function(){
    
}
Letao.prototype = {
    initMui:function(){
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", // 传入区域滚动父容器的选择器
                down: {                   
                    callback: function() {//下拉刷新的回调函数
                        setTimeout(function() {
                            // 延迟1.5秒结束下拉刷新
                            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                        }, 1500)
                    }
                },
                up: {
                    contentnomore:'再下实在给不了更多...',
                    callback: function() {//上拉加载的回调函数
                        setTimeout(function() {
                            // 延迟1.5秒结束上拉加载更多
                            // mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                            // 调用结束上拉加载更多并且传入了true既结束上拉加载更多并且提示没有更多数据
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        }, 1500)
                    }
                }
            }
        });
    },
    backBefore:function(){
        $(".goBefore").on("click",function(){
            window.history.go(-1);
        })
    }
}