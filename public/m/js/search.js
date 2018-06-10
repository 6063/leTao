var letao;
$(function () {
    letao = new Letao();
    letao.addHistory();
    letao.querryHistory();
    letao.deleteHistory();
    letao.clearHistory();
    letao.backBefore();
});

//Letao的构造函数
var Letao = function () {
	
}

Letao.prototype = {
	//添加历史记录
	addHistory:function () { 
        // 1. 获取当前搜索按钮添加点击事件
		$('.btn-search').on('click',function () {
			// 2. 获取当前文本输入的内容
            var search = $('.input-search').val();
            if(!search.trim()){
                return;
            }
            // console.log(search);            
			// 3. 获取本地存储已经存储的值
			var arr = window.localStorage.getItem('searchData');
			console.log(arr);
			// 判断当前arr是否有值
			if(arr.length && JSON.parse(arr).length){
				// 有值 就把值通过JSON.parse(arr)把JSON字符串转成数组
                arr = JSON.parse(arr);
                id = arr[arr.length-1].id+1;
			}else{
				//如果没有值就赋值为空数组
                arr = [];
                id = 0;
            }
            var flag = true;
            for(var i = 0;i<arr.length;i++){
                if(search == arr[i].search){
                    flag = false;
                }
            }
            // 4. 文本框输入框的值 添加arr数组里面
            //id为数据最后一个值得id+1，如果数组为空，id-0
            if(flag){

                arr.push({
                    'search':search,
                    'id':id                    
                })
            }

            $('.input-search').val("");

			// 5. 把arr转成JSON字符串存储到本地存储中
            window.localStorage.setItem('searchData',JSON.stringify(arr));
            letao.querryHistory();
            window.location.href = 'productList.html'

            
        })
        


    },
    querryHistory:function(){
            // 1. 获取本地存储已经存储的值,这个时候要判断有没有历史记录
			var arr = window.localStorage.getItem('searchData');
			console.log(arr);
			// 判断当前arr是否有值
			if(arr.length > 2){
				// 有值 就把值通过JSON.parse(arr)把JSON字符串转成数组
				arr = JSON.parse(arr);
			}else{
				//如果没有值就赋值为空数组
				arr = []
            }
            
            // 如果需要最后搜索的内容在最前面，那就要进行数组的翻转
            arr = arr.reverse();
        // 1.获取数据
        // var dataArr = JSON.parse(window.localStorage.getItem('searchData'));      
        // //2.渲染数据,这个时候最好是把数组变成对象
        var result = template("lists",{'rows':arr});
        // console.log(result);
        $(".content").html(result);
    },
    deleteHistory:function(){
       

        $(".content").on("click",".btn-delete",function(){
            var id = $(this).data("id");
            // 1. 获取本地存储已经存储的值,这个时候要判断有没有历史记录
			var arr = window.localStorage.getItem('searchData');
			console.log(arr);
            // 判断当前arr是否有值,这里记得要判断arr.length，因为空数组，也是为true
            // 判断长度的话，就可以保证是一定有值得
			if(arr.length && JSON.parse(arr).length){
				// 有值 就把值通过JSON.parse(arr)把JSON字符串转成数组
				arr = JSON.parse(arr);
			}else{
				//如果没有值就赋值为空数组
				arr = []
            }
            
            //3.遍历存储的数组
            for(var i = 0;i<arr.length;i++){
                // 判断当前数组中有没有id一样的
                if(arr[i].id == id){
                    // 删除数组
                    arr.splice(i,1);
                }
            }
            // 4.把删除后的新数组存储到本地中
            window.localStorage.setItem("searchData",JSON.stringify(arr));
            letao.querryHistory();
        })
    },
    clearHistory:function(){
        $(".btn-clear").on("click",function(){
            window.localStorage.setItem('searchData',"");
            letao.querryHistory();
        });
    },
    backBefore:function(){
        $(".goBefore").on("click",function(){
            window.history.go(-1);
        })
    }
}