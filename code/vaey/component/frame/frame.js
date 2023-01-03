var code = `
<div>
    <el-container>
         <el-header style="text-align: right; font-size: 12px; height: 80px;">
             <div class="header__logo">
                <img v-if="!!imgUrl" :src="imgUrl" />
                <span>{{logoTxt}}</span>
             </div>
             <el-dropdown @command="handleCommand" trigger="hover" style="color: #fff; cursor: pointer; font-size: 18px;">
                <span class="el-dropdown-link">
                    <i class="el-icon-setting" style="margin-right: 5px"></i>
                    <span>{{userName}}</span>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
                </el-dropdown-menu>
             </el-dropdown>
         </el-header>
         <el-container class="page-body">
            <el-aside width="230px" style="background-color: rgb(238, 241, 246)">
                <el-menu>
                    <el-submenu v-for="(menu, menuIdx) in menus" :index="\'\'+menuIdx" :key="menuIdx">
                        <template slot="title"><i :class="menu.icon"></i>{{menu.text}}</template>
                            <el-menu-item v-for="(item, itemIdx) in menu.items"
                                            :index="menuIdx + \'-\' + itemIdx"
                                             :key="itemIdx" 
                                             @click="menuSelect(menuIdx + \'-\' + itemIdx, item.text, item.url)" 
                                             :data-url="item.url">
                             {{item.text}}
                             </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
                    <el-tab-pane class="no-icon-close" label="首页" name="default" :closable="false">
                        <div class="iframe-wrapper">
                            <iframe style="width: 100%; height: 100%; border: none;" :src="defaultSrc"></iframe>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :label="item.title" :name="item.name">
                        <div class="iframe-wrapper" v-html="item.content"></div>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
         </el-container>
    </el-container>
</div>
`

Vue.component('frame-component',{
    template: code,
    props: ['userName', 'logoTxt', 'menuUrl', 'imgUrl', 'defaultSrc'],
    data: function() {
        return {
            menus: [],
            editableTabsValue: 'default',
            editableTabs: [],
            tabIndex: 0,
        }
    },
    mounted: function (){
        this.createMenu();
    },
    methods: {
        menuSelect: function (id, text, url) {
            //菜单选中事件
            this.openTab(id, text, url)
        },
        removeTab: function (targetName) {

            var _this = this
            var tabs = _this.editableTabs;

            if (_this.editableTabsValue === targetName) {
                tabs.forEach(function (tab, index) {
                    if (tab.name === targetName) {
                        //假如说关闭的是当前页面,要重新激活一个页面,当然如果没东西就激活首页
                        var nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            _this.editableTabsValue = nextTab.name;
                        } else {
                            _this.editableTabsValue = 'default'
                        }
                    }
                });
            }

            this.editableTabs = tabs.filter(function (tab) {
                return tab.name !== targetName
            });
        },
        openTab: function (name, text, url) {
            //开启一个新的tab页,name和text可以传同一个值
            var isExisted = this.editableTabs.find(function (tab) {
                return tab.name === name
            })

            if (isExisted) {
                this.editableTabsValue = name;
                return
            }

            this.editableTabs.push({
                title: text,
                name: name,
                content: '<iframe style="width: 100%; height: 100%; border: none;" src="' + url + '"></iframe>'
            });

            this.editableTabsValue = name;
        },
        createMenu: function() {
            //创建菜单
            var _this = this
            //以下是和服务器交互的代码

            // $.get(_this.menuUrl, function (resData) {
            //     // var resData = JSON.parse(data)
            //    if(resData.code == 100) {
            //         //成功
            //         var d = resData.datas;
            //         $.each(d, function (index, value) {
            //             var menu = new Object();
            //             menu.icon = 'el-icon-menu';
            //             menu.text = value.text;
            //             if (value.children.length > 0) {
            //                 menu.items = getMenu(value.children);
            //             }
            //             _this.menus.push(menu);
            //         })
            //     }else{
            //         _this.$confirm('登录已过期,请重新登录!', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             type: 'warning'
            //           }).then(res => {
            //             window.location.href = resData;
            //           })
            //           .catch(() => {
            //             window.location.href = resData;
            //             // _this.$message({
            //             //   type: 'info',
            //             //   message: '已取消操作'
            //             // });
            //           })
            //           ;
            //     }
            // });


            var d = [{
                "text": "演示模块",
                "url": null,
                "opId": "101",
                "parentId": "21",
                "leaf": false,
                "type": 1,
                "keyCode": null,
                "icon": null,
                "children": [{
                    "text": "表格页面",
                    "url": "demo/demo1.html",
                    "opId": "1001",
                    "parentId": "101",
                    "leaf": true,
                    "type": 2,
                    "keyCode": null,
                    "icon": null,
                    "children": []
                },{
                    "text": "表格页面2",
                    "url": "demo/demo2.html",
                    "opId": "1004",
                    "parentId": "101",
                    "leaf": true,
                    "type": 2,
                    "keyCode": null,
                    "icon": null,
                    "children": []
                },{
                    "text": "点击弹窗",
                    "url": "demo/demo3.html",
                    "opId": "1004",
                    "parentId": "101",
                    "leaf": true,
                    "type": 2,
                    "keyCode": null,
                    "icon": null,
                    "children": []
                },{
                    "text": "报表演示",
                    "url": "demo/report01.html",
                    "opId": "1002",
                    "parentId": "101",
                    "leaf": true,
                    "type": 2,
                    "keyCode": null,
                    "icon": null,
                    "children": []
                },{
                    "text": "404页面",
                    "url": "404.html",
                    "opId": "1003",
                    "parentId": "101",
                    "leaf": true,
                    "type": 2,
                    "keyCode": null,
                    "icon": null,
                    "children": []
                },{
                    "text": "测试页面",
                    "url": "demo/demo03.html",
                    "opId": "1005",
                    "parentId": "105",
                    "leaf": true,
                    "type": 2,
                    "keyCode": null,
                    "icon": null,
                    "children": []
                }]
            }];
            $.each(d, function (index, value) {
                var menu = new Object();
                menu.icon = 'el-icon-menu';
                menu.text = value.text;
                if (value.children.length > 0) {
                    menu.items = getMenu(value.children);
                }
                _this.menus.push(menu);
            })

            function getMenu(d) {
                var menus = [];
                $.each(d, function (index, value) {
                    var menu = new Object();
                    menu.text = value.text;
                    menu.url = value.url;
                    menus.push(menu);
                })
                return menus;
            }
        },
        handleCommand: function (command) {
            //处理右上方个人设置
            if(command == "logout") {

                // $.get('/iom/loginAction/logout', function (resData) {
                //     /*关闭当前页*/
                //     var userAgent = navigator.userAgent;
                //     if (userAgent.indexOf("Firefox") !== -1 || userAgent.indexOf("Chrome") !== -1) {
                //         // window.location.href = "about:blank";
                //         window.location.href = "/iom/reLogin";
                //         window.close();
                //     } else {
                //         window.open("", "_self");
                //         window.close();
                //     }
                // })

                this.$message({
                    message: '如果要修改请在frame.js找到handleCommand和相关代码',
                    type: 'error'
                });

            }else if(command == "editPwd") {
                this.openTab("修改密码", "修改密码", "../../");
            }else{
                this.$message({
                    message: '未知错误,请联系管理员',
                    type: 'error'
                });
            }
        },
        openTaskWindow: function(param) {

            let _this = this;

            if(param.callUrl) {
                $.ajax({
                    type: "post",
                    url: param.callUrl,
                    data: param,
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        if(data.code = 100) {
                            let title = data.datas[0].title;
                            let url = data.datas[0].url;
                            _this.openTab(title, title, url);
                        }else{
                            console.log(data);
                        }
                    }
                });
            }else if(param.url){
                _this.openTab(param.title, param.title, param.url);
            }
        }
    }
})