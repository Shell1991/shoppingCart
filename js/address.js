var vm = new Vue ({
    el:".container",
    data:{
        addressList:[],
        showLen : 3
    },
    mounted:function () {
        this.$nextTick(function () {
            this.getAddressList();
        })
    },
    computed:{
      filterAddress : function () {
          return this.addressList.slice(0, this.showLen);
      }
    },
    methods: {
        getAddressList : function () {
            this.$http.get("data/address.json").then(res=>{
                if(res.body.status == 0){
                    this.addressList = res.body.result;
                }
            })
        },
        moreAddress:function () {
            this.showLen = this.addressList.length;
        },
        lessAddress:function () {
            this.showLen = 3;
        }
    }
});