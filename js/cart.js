var vm = new Vue({
    //(1)el,vm实例绑定的元素，或者可以理解为作用范围
    el : "#app",
    //（2）data，vm作用域中的变量或数据
    data : {
        productList : [],
        totalMoney : 0,
        selectAllFlag : false
    },
    //(3)filters,vue的过滤器，在这里面定义的过滤器都是局部过滤器
    filters : {
        //过滤器分为局部过滤器和全局过滤器，下面这个是局部过滤器
        moneyFormat : function (data) {
            //toFixed(n)，保留2位小数
            return "￥ " + data.toFixed(2);
        }
    },
    //(4)mounted,代替了vue1.0中的ready函数，应该注意的是，使用 mounted 并不能保证钩子函数中的 this.$el 在 document 中。
    // 为此还应该引入 Vue.nextTick/vm.$nextTick,简单讲就是，如果使用$nextTick函数，在实例范围内就可以直接将this替换成vm，
    //也就是说this == vm, 如若不然，将this替换成vm将会报错
    mounted : function() {
        this.$nextTick(function () {
            //this.cartView();
            vm.cartView();
        })
    },
    //(5)methods,vm作用范围中的函数，在html中通过v-on进行绑定，或通过@符号进行绑定
    methods : {
        //初始化
        cartView : function() {
            //(6)使用vue.resource.js中的$http函数，进行与后台的数据交换，返回的结果是json类型，但是该json类型不能直接解析，
            // 因为真正的json数据被Vue.resource.js封装在body中，因此需要通过res.body来提取真正的返回数据
            //(7)箭头函数，改变了传统函数的作用域，在本例中，通过箭头函数可以之间在函数体中使用this，此this即指vm
            vm.$http.get("data/cartData.json").then(res=>{
                this.productList = res.body.result.list;
                // this.totalMoney = res.body.result.totalMoney;
            })
        },
        //改变商品数量
        changeQuantity:function (item, num) {
            if(num < 0){
                if(item.productQuantity <= 1 ){
                    item.productQuantity = 1;
                }else{
                    item.productQuantity--;
                }
            }else{
                item.productQuantity++;
            }
            this.culTotalMoney();
        },
        //选择单个商品
        checkedProduct: function (item) {
            if(typeof item.check == "undefined"){
                //(8)使用js向实例中注册属性
                //(8.1)Vue中通过Vue.set()方法向实例中全局注册属性
                Vue.set(item, "check", true);
                //(8.2)还可以通过$set()方法向实例中局部注册属性，使用this或vm
                this.$set(item, "check", true);
                // vm.$set(item, "check", true);
            }else {
                item.check = !item.check;
            }
            this.culTotalMoney();
        },
        // 全选
        selectAll:function () {
            let _this = this;
            _this.selectAllFlag = !_this.selectAllFlag;
            //（9）遍历productList，可以使用foreach或者for…in，注意，使用for…in时，第一个变量是数组的index，而不是数组的value
            //全选
            _this.productList.forEach(function (item, index) {
                if(typeof item.check == "undefined"){
                    _this.$set(item, "check", _this.selectAllFlag);
                }else{
                    item.check = _this.selectAllFlag;
                }
            })
            // for(index in _this.productList){
            //     var item = _this.productList[index];
            //     if(typeof item.check == "undefined"){
            //         _this.$set(item, "check", _this.selectAllFlag);
            //     }else{
            //         item.check = _this.selectAllFlag;
            //     }
            // }
            this.culTotalMoney();
        },
        //  计算总金额
        culTotalMoney : function () {
            var _this = this;
            this.totalMoney = 0;
            this.productList.forEach(function (item, index) {
                if(item.check){
                    _this.totalMoney += item.productQuantity * item.productPrice;
                }
            })
        }
    }
});
//(3)vue全局过滤器
Vue.filter("transferMoney", function (data, type) {
    return "￥ " + data.toFixed(2) + type
})