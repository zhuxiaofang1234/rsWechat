Component({
  options: {
    multipleSlots: true //在组件定义时的选项中启用多slot支持
  },
  /*组件属性列表 */
  properties:{
    title:{
      type:String,
      value:'标题' //默认值
    },
    //弹窗内容
    content:{
      type:String,
      value:'弹窗内容'
    },
    //弹窗确认按钮文字
    confirmText:{
      type:String,
      value:'确定'
    }  
  },

  /**组件内私有数据 */
  data:{
    //弹窗显示控制
    isShow:false
  },
  /**组件公有方法列表 */
  methods:{
    //隐藏弹框
    hideDialog(){
      this.setData({
        isShow:!this.data.isShow
      })
    },
    //展示弹框
    showDialog(){
      this.setData({
        isShow:!this.data.isShow
      })
    },
    /** tiggerEvent组件之间通信*/
    confirmEvent(){
      this.triggerEvent("myconfirmEvent");
    },

    bindopensetting(event) { //打开授权页面后的回调
      var authSettingList = event.detail.authSetting;
      this.triggerEvent("bindopensetting", authSettingList);
    }
  }
});