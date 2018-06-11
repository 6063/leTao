var letao;
$(function() {
    letao = new Letao();
    letao.initPullRefresh();
    letao.searchProductList();
    // 商品的排序
    letao.productSort();
    search = getQueryString('search');
    //进入商品列表页面马上执行搜索
    letao.getProdcutList({
        proName: search
    }, function(data) {
        // 4. 把数据调用模板引擎生成html
        var html = template('productListTmp', data);
        // 5. 把生成的模板绑定到商品列表的内容
        $('.content .mui-row').html(html);
    });
});

//Letao的构造函数
var Letao = function() {

}
var search;
var page = 1;
Letao.prototype = {
    //初始化下拉刷新和上拉加载
    initPullRefresh: function() {
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", // 传入区域滚动父容器的选择器
                down: {
                    callback: function() {
                        setTimeout(function() {
                            //在下拉刷新里面根据当前搜索的内容再次刷新一下
                            // 再次根据搜索内容重新请求数据渲染一遍
                            letao.getProdcutList({
                                proName:search
                            },function (data) {//我把这个渲染完毕后要执行的代码通过回调函数传递
                                console.log('下拉刷新完毕');
                                 // 4. 把数据调用模板引擎生成html
                                var html = template('productListTmp',data);
                                // 5. 把生成的模板绑定到商品列表的内容
                                $('.content .mui-row').html(html); 
                                  // 当前数据请求渲染完毕后结束下拉刷新
                                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                                //每次下拉刷新的时候要重置上拉加载更多
                                mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                                // page当前页码也要重置为1
                                page = 1;
                            });                          
                        }, 1500)
                    }
                    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
                up: {
                	contentnomore:'再下实在给不了更多...',
                    callback: function() {
                    		 setTimeout(function() {
                            // 在上拉加载更多的时候调用获取商品列表的方法
                             letao.getProdcutList({
                                proName:search,
                                page:++page//page是我当前上拉要请求的页码数 每次++注意先++
                            },function (data) {//我把这个渲染完毕后要执行的代码通过回调函数传递
                                console.log('上拉加载完毕');
                                // 4. 把数据调用模板引擎生成html
                                var html = template('productListTmp',data);
                                // 5. 把生成的模板绑定到商品列表的内容
                                $('.content .mui-row').append(html); 
                                if(data.data.length > 0){                                    
                                  // 当前数据请求渲染完毕后结束下拉刷新
                                mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                                }else{
                                    //length小于等于表示数据已经加载完毕
                                    //结束上拉加载并且提示没有更多数据了
                                     mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                                }
                            });       
                            // 延迟1.5秒结束上拉加载更多
                            // mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                            // 调用结束上拉加载更多并且传入了true既结束上拉加载更多并且提示没有更多数据
                            // mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        }, 1500)
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        });
    },
    // 搜索商品列表
    searchProductList:function () {
        // 1. 给搜索按钮添加点击事件  tap是移动端的点击事件 
        // 使用touchstart事件模拟的 解决click延迟问题 移动端推荐使用tap事件
        // 在PC端有一些版本浏览器tap在模拟器会触发2次 真机不会
        //mui在下拉刷新和上拉加载里面阻止了click事件 推荐使用tap
        $('.btn-search').on('tap',function () {
            // 2. 获取当前输入的搜索的内容
            search = $('.input-search').val()
            console.log(search);
            // 3. 调用获取商品列表的API搜索商品
            letao.getProdcutList({
                proName:search
            },function (data) {
                   // 4. 把数据调用模板引擎生成html
                var html = template('productListTmp',data);
                // 5. 把生成的模板绑定到商品列表的内容
                $('.content .mui-row').html(html); 
            });
        })
    },
    getProdcutList:function (obj,callback) {
         $.ajax({
            url:'/product/queryProduct',
            //使用当前对象上的参数属性 例如obj.page是当前要请求的页码数
            // obj.pageSize当前请求每页数据量大小
            // obj.proName 当前搜索的商品的关键字
            data:{
                page:obj.page || 1,
                pageSize:obj.pageSize || 2,
                proName:obj.proName,
                price: obj.price,
                num: obj.num
            },
            success:function (data) {
                console.log(data);
                // 判断回调函数传递了就调用
                if(callback){            
                    //  数据确定渲染完毕后我就可以结束下拉刷新    
                    callback(data);
                }
            }
        });
    },
     //商品列表的排序
    productSort: function() {
        // 1. 给所有排序按钮添加点击事件 tap
        $('.productlist .title').on('tap', 'a', function() {
            // 2. 跟当前点击的a获取当前a链接的排序方式
            var sortType = $(this).data('sort-type');
            // console.log(sortType);  这里价格和销量是可排序的，其余2个不可排
            // 3. 获取当前a上data-sort排序顺序  1代表升序 2代表降序
            var sort = $(this).data('sort');
            // console.log(sort);
            // 4. 判断当前sort 是1 还是2  
            if (sort == 1) {
                //如果是1 就表示当前是升序 点击了之后变成降序 sort = 2
                sort = 2;
            } else {
                //如果是1 就表示当前是降序 点击了之后变成升序 sort = 1
                sort = 1;
            }
            // 5. 改变完sort后赋值给当前的data-sort自定义属性的值
            $(this).attr('data-sort', sort);
            // 6. 判断当前sortType是哪个排序方式 如果是price就执行价格排序 如果是num就执行num排序
            if (sortType == 'price') {
                // 7. 当前是排序类型是price 就调用获取数据函数传入price的排序方式
                letao.getProdcutList({
                    proName: search,
                    price: sort
                }, function(data) {
                    // 4. 把数据调用模板引擎生成html
                    var html = template('productListTmp', data);
                    // 5. 把生成的模板绑定到商品列表的内容
                    $('.content .mui-row').html(html);
                });
            } else if (sortType == 'num') {
                // 8. 当前是排序类型是num 就调用获取数据函数传入num的排序方式
                letao.getProdcutList({
                    proName: search,
                    num: sort
                }, function(data) {
                    // 4. 把数据调用模板引擎生成html
                    var html = template('productListTmp', data);
                    // 5. 把生成的模板绑定到商品列表的内容
                    $('.content .mui-row').html(html);
                });
            }
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


// 商品列表页面做了商品的搜索功能和商品按价格和销量排序的功能
//首先这个接口地址：/product/queryProduct，它是get的请求方式
// 有以下这些参数：proName、brandId、price、num、page、pageSize
// 其中page pageSize是必选参数，分别代表第几页和每页的条数
// price 传入1代表商品排序按价格升序排序，2代表降序排序
// num 传入1代表商品排序按库存升序排序，2代表降序排序
// brandId 是品牌的id
// proName 是产品的名称

// 在这里用了getProdcutList这个函数来获取数据
// 因为参数是可选的，所以这里传入的data最好是传入一个对象，然后取对应的值
// 因为page和pageSize是必选参数，所以一定要给一个默认值
// $.ajax({
//     url:'/product/queryProduct',
//     //使用当前对象上的参数属性 例如obj.page是当前要请求的页码数
//     // obj.pageSize当前请求每页数据量大小
//     // obj.proName 当前搜索的商品的关键字
//     data:{
//         page:obj.page || 1,
//         pageSize:obj.pageSize || 2,
//         proName:obj.proName,
//         price: obj.price,
//         num: obj.num
//     },
//     success:function (data) {
//         console.log(data);
//         // 判断回调函数传递了就调用
//         if(callback){            
//             //  数据确定渲染完毕后我就可以结束下拉刷新    
//             callback(data);
//         }
//     }
// });

