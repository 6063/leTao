var letao;
$(function(){
    letao = new Letao();
    letao.initMui();
    letao.initSlide();
    letao.selectSize();
    var productid = getQueryString('productid');
    // letao.getProductDetail(productid);
    letao.getProductDetail(1);
    letao.addCart();
})

var Letao = function(){

};


Letao.prototype = {
    // 初始化区域滚动
    initMui:function(){
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", // 传入区域滚动父容器的选择器
                down: {    
                    contentdown: "下拉可以刷新",               
                    callback: function() {//下拉刷新的回调函数
                        setTimeout(function() {
                            // 延迟1.5秒结束下拉刷新
                            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                            // mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                        }, 1500)
                    }
                },
                up: {
                	contentnomore:'再下实在给不了更多...',
                    callback: function() {//上拉加载的回调函数
           				// 延迟1.5秒结束上拉加载更多  
           				setTimeout(function() {
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                            // 调用结束上拉加载更多并且传入了true既结束上拉加载更多并且提示没有更多数据
                            // mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        }, 1500)
                    }
                }
            }
        });
    },
    //初始化轮播图
    initSlide: function() {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    //选择尺码切换选中状态
    selectSize: function() {
        // 给所有的btn-size尺码按钮添加点击事件,这里用tap事件，不能用点击事件，因为mui禁止了click事件
        $('#product').on('tap', '.btn-size', function() {
            $(this).addClass('active').siblings().removeClass('active');
        });
    },
    //根据url参数获取商品列表的数据并渲染
    getProductDetail: function(id) {
        // 发送请求，传入id，请求相应id的商品详情API
        $.ajax({
            url: '/product/queryProductDetail',
            data: { id: id },
            success: function(data) {
                //(1) 先处理尺码,40-50,让其格式是一个数组[40,41,42,43,44,45,46,47,48,49,50]
                // console.log(data.size);
                var start = data.size.split('-')[0];
                var end = data.size.split('-')[1];
                // console.log(start+";;;"+end);
                var arr = [];
                for(var i = +start;i <= end;i++){
                    arr.push(i);
                }  
                // console.log(arr); [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
                // 把处理好的数组重新赋值给data.size
                data.size = arr;
                // 调用模板
                var html = template('productDetailTmp', data);
                $('#product').html(html);
                // 注意：这里的数字输入框如果是动态生成的是不能点击 如果要点击，需要再次初始化
                mui('.mui-numbox').numbox();

                // (2). 渲染轮播图
                var slideHtml = template('productSlideTmp', data);
                // console.log(slideHtml);
                $('.mui-slider').html(slideHtml);
                // 轮播图渲染完毕后再初始化
                // 通过letao对象的初始化轮播图
                letao.initSlide();

            }
        })
    },
    addCart: function() {
        //  给加入购物车按钮添加点击事件
        $('.btn_addCart').on('tap', function() {
            // 1. 判断当前是否选中了尺码如果没有选中尺码提示请选择尺码
            //选择有btn-size并且有active的元素
            var size = $('.btn-size.active').data('size');
            //2. 如果当前size为空 !size == true !size为true表示没有尺码
            if (!size) {
            	// 3. 提示请选择尺码 
            	// toast第一个参数就是提示的内容 第二参数是一个对象duration提示时间 type类型div 
            	 mui.toast('请选择尺码',{ duration:'short', type:'div' }); 
            	 return;
            }
            //获取数字框选中的数字 使用MUI的方法
            var num = mui('.mui-numbox').numbox().getValue();
            // 4. 判断当前是否选中数量            
            if(!num){
            	// 5.如果没有选中数量 提示请选择数量
            	 mui.toast('请选择数量',{ duration:'short', type:'div' });             
            	 return;
            }
            // mui.alert( '添加成功， 是否去购物车查看？','温馨提示', '确定',function () {
            	
            // })
          
            // 6. 如果都选择后就验证登录提示添加成功
            // confirm 第一个参数是提示内容 第二个参数是 提示标题 第三个参数是 提示的按钮的文字（是数组） 回调函数
            mui.confirm( '添加成功， 是否去购物车查看？','温馨提示', ['是','否'], function(e){
            	// 回调函数可以传递参数 e  e.index == 0 表示点击了左边的是 为1 表示点击了右边的否
            	if(e.index == 0){
            		console.log('正在进入购物车');
            	}else if(e.index == 1){
            		console.log('请继续选择尺码数量');
            	}
            });

        });
    }
}

//获取url地址栏的参数的函数 网上找的  name就是url参数名
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}