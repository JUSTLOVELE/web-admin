var code = `<div>
    <el-dialog :title="title" :visible.sync="formVisible" @closed="onDialogClosed" class="form-dialog-comp" :close-on-click-modal="false" :width="width">
       <!--头部插槽-->
       <slot name="header"></slot>
       <el-form :inline="true" status-icon ref="form" :model="formData" :rules="rules" size="mini">
         <template v-for="item in items">
            <!--分割线-->
            <template v-if="item.type === \'seperator\'">
                <el-divider content-position="left">{{item.label}}</el-divider>
            </template>
            <!--表单元素-->
            <template v-else>
                <!--动态渲染/显示-->
                <el-form-item :label="item.label" 
                              :label-width="formLabelWidth" 
                              :prop="item.field" 
                              :key="item.field">
                    <!--选择-->
                    <template v-if="item.type === \'select\'">
                        <el-select v-model="formData[item.field]" v-bind="item.props" @change="handleSelectChange(item.field, $event)">
                            <el-option v-for="option in item.options" :label="option.label" :value="option.value"></el-option>
                        </el-select>
                    </template>
                    <!--多选选择-->
                    <template v-if="item.type === \'multiSelect\'">
                        <el-select multiple v-model="formData[item.field]" v-bind="item.props" @change="handleSelectChange(item.field, $event)">
                            <el-option v-for="option in item.options" :label="option.label" :value="option.value"></el-option>
                        </el-select>
                    </template>
                    <!--输入-->
                    <template v-if="item.type === \'input\'">
                        <el-input v-model.trim="formData[item.field]" v-bind="item.props"></el-input>
                    </template>
                    <!--密码-->
                    <template v-if="item.type === \'password\'">
                        <el-input show-password v-model.trim="formData[item.field]" v-bind="item.props"></el-input>
                    </template>
                    <!--时间  year/month/date/week/datetime/datetimerange/daterange-->
                    <template v-if="item.type === \'time\'">
                           <el-date-picker align="right" 
                                           size="mini"
                                           v-model.trim="formData[item.field]" 
                                           v-bind="item.props"></el-date-picker>
                    </template>
                    <template v-if="checkTimeRange(item)">
                          <el-date-picker align="right" 
                                          size="mini"
                                          v-model.trim="formData[item.field]" 
                                          v-bind="item.props"
                                          :value-format="item.timeFormat"
                                          :type="item.timeType"
                                          :picker-options="item.pickerOptions"
                                          range-separator="至"
                                          start-placeholder="开始日期"
                                          end-placeholder="结束日期"
                                          unlink-panels clearable></el-date-picker>
                    </template>
                    <!--文本框-->
                    <template v-if="item.type === \'textarea\'">
                        <el-input type="textarea" v-model.trim="formData[item.field]" v-bind="item.props" style="width: 446px"></el-input>
                    </template>
                    <!--级联-->
                    <template v-if="item.type === \'cascader\'">
                        <el-cascader :options="item.options" :show-all-levels="false" v-model.trim="formData[item.field]" v-bind="item.props""></el-cascader>
                    </template>
                    <!--表格-->
                    <template v-if="item.type === \'table\'">
                        <el-card class="box-card">
                            <el-table :data="tableData" height="190" border ref="singleTable"  :style="tableStyle(item)">
                             <el-table-column v-for="col in item.cols" 
                                :key="col.prop" 
                                :prop="col.prop" 
                                :label="typeof col.label === \'object\' ? col.label.value : col.label" 
                                :width="col.width">
                                 </el-table-column>
                             </el-table>
                         </el-card>
                     </template>
                     <!--动态表格-->
                    <template v-if="item.type === \'dynamicTable\'">
                        <el-card class="box-card" >
                            <div slot="header" class="clearfix" style="padding-bottom:20px">
                                <el-button style="float: right; padding: 3px 0" @click.prevent="addRow(item)" type="text">新增记录</el-button>
                            </div>
                            <el-table :data="formData[item.field]" height="290" border stripe ref="dynamicTable" :style="tableStyle(item)">
                                <el-table-column v-for="col in item.cols" :key="col.prop" :prop="col.prop" align="center"
                                    :label="typeof col.label === \'object\' ? col.label.value : col.label" :width="col.width">
                                    <template slot-scope="scope">
                                        <el-form-item :prop="item.field+'.' + scope.$index + '.'+col.prop"
                                            :rules="dynamicTableRules[col.prop]">
                                        <!--输入-->
                                        <el-input v-if="col.type === \'input\'" v-model="scope.row[col.prop]" class="table_input_inner"
                                            style="margin-top: 15px;" :controls=false size="mini" v-bind="col.props">
                                        </el-input>
                                        <!--文本框-->
                                        <el-input v-if="col.type === \'textarea\'" v-model="scope.row[col.prop]"
                                            type="textarea" :rows="3"
                                            style="margin-top: 10px;" :controls=false size="mini" v-bind="col.props">
                                        </el-input>
                                        <!--下拉框-->
                                        <el-select v-if="col.type === \'select\'"  class="table_input_inner"
                                            v-model="scope.row[col.prop]"   size="mini"
                                            style="width:100%;display:block;margin-top: 15px;" v-bind="col.props">
                                            <el-option v-for="option in col.options" :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                        <!--单选-->
                                        <el-switch v-if="col.type === \'switch\'"  class="table_input_inner"
                                            style="margin-top: 15px;"
                                            v-model="scope.row[col.prop]" v-bind="col.props" size="mini"
                                        >
                                        </el-switch>
                                        <!--日期-->
                                        <el-date-picker v-if="col.type === \'date\'" align="center"  class="table_input_inner"
                                                    size="mini"
                                                    style="margin-top: 15px;"
                                                    v-model.trim="scope.row[col.prop]" 
                                                    v-bind="col.props"></el-date-picker>
                                        <!--时间-->
                                        <el-time-picker v-if="col.type === \'time\'" align="center"  class="table_input_inner"
                                                    size="mini"
                                                    style="margin-top: 15px;"
                                                    v-model.trim="scope.row[col.prop]" 
                                                    v-bind="col.props"></el-time-picker>
                                        </el-form-item>
                                        <!--文件-->
                                        <el-upload v-if="col.type === \'upload\'" class="upload-demo" 
                                                    :ref="'upload_' + scope.$index"
                                                    action=""
                                                    multiple
                                                    :limit="1"
                                                    :name = col.prop
                                                    :file-list="dynamicTableFileList[scope.$index]"
                                                    :http-request="handleTableAddUpload"
                                                    :on-change = "function(file,fileList){return handleDynamicTableChange(file,fileList,scope.$index,item.field,col.prop)}"
                                                    :on-preview="handlePictureCardPreview"
                                                    :on-remove="function(file,fileList){return handleDynamicTableRemove(file,fileList,scope.$index,col.prop)}"
                                                    v-bind="col.props">
                                                    <el-button size="small" type="primary">点击上传</el-button>
                                        </el-upload>
                                    </template>
                                </el-table-column>
                                <el-table-column  label="操作" width="80" align="center">
                                    <template slot-scope="scope">
                                     <el-button @click.native.prevent="deleteRow(scope.$index, formData[item.field],item.field)"
                                        type="text" size="small">
                                        删除
                                     </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </template>
                </el-form-item>
            </template>
         </template>
       </el-form>
       <!--中间插槽-->
       <slot name="middle"></slot>
       <template v-if="module && module.tree">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>{{module.tree.label}}</span>
                <el-button style="float: right; padding: 3px 0;" type="text" @click="checkAllNodes">&nbsp;全选</el-button>
                <el-button style="float: right; padding: 3px 0;" type="text" @click="uncheckAllNodes">清空&nbsp;</el-button>
            </div>
            <el-tree  ref="tree"
                      :data="tree"
                      node-key="id"
                      show-checkbox
                      default-expand-all
                      highlight-current
                      :props="treeProps">
            </el-tree>
         </el-card>
       </template>
       <template v-if="module && module.uploader">
         <template v-if="module.uploader.list">
            <el-upload
                       class="upload-demo"
                       action=""
                       :file-list="fileList"
                       :before-upload="beforeUpload"
                       :disabled="!!module.uploader.disabled"
                       :accept="module.uploader.accept || \'image/*\'"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove"
                       :limit="module.uploader.size || 9"
                       :multiple="module.uploader.multiple === undefined ? true : module.uploader.multiple"
                       :http-request="handleAddUpload"
                       v-bind="module.uploader.props">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">{{module.uploader.label || "　上传图片"}}</div>
            </el-upload>
         </template>
         <template v-else>
            <el-card class="box-card">
                 <div slot="header" class="clearfix">
                    <span>{{module.uploader.label || "　上传图片"}}</span>
                </div>
                <div>
                    <el-upload ref="upload"
                               action=""
                               list-type="picture-card"
                               :file-list="fileList"
                               :before-upload="beforeUpload"
                               :disabled="!!module.uploader.disabled"
                               :accept="module.uploader.accept || \'image/*\'"
                               :on-preview="handlePictureCardPreview"
                               :on-remove="handleRemove"
                               :drag="true"
                               :limit="module.uploader.size || 9"
                               :multiple="module.uploader.multiple === undefined ? true : module.uploader.multiple"
                               :http-request="handleAddUpload"
                               v-bind="module.uploader.props"
                               ><i class="el-icon-plus" style="padding-top: 50px"></i></el-upload>
                </div>
            </el-card>
         </template>
       </template>
       <!--底部插槽-->
       <slot name="footer"></slot>
       <span v-if="!noFooter" slot="footer" class="dialog-footer">
            <template v-if="buttons && buttons.length > 0">
                <el-button size="small" @click="cancel">取 消</el-button>
                 <template v-for="button in buttons">
                    <el-button size="small" @click="confirm(button.url)" :type="(button.type) ? button.type : \'primary\'">{{button.label}}</el-button>
                </template>
            </template>
            <template v-else>
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm" :loading="isLoading">确 定</el-button>
            </template>
       </span>
    </el-dialog>
    <!--图片预览-->
    <template v-if="(module && module.uploader)||isTableUpload">
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </template>
</div>
`

Vue.component('form-dialog-component', {
    template: code,
    props: {
        title: {
            type: String
        },
        width: {
            type: String,
            default: '620px'
        },
        formLabelWidth: {
            type: String,
            default: '80px'
        },
        buttons: {
            type: Array,
            default: function () {
                return []
            }
        },
        items: {
            type: Array,
            default: function () {
                return []
            }
        },
        edit: {
            type: Boolean,
            default: false
        },
        currentRow: {
            type: Object,
        },
        noFooter: {
            type: Boolean,
            default: false
        },
        module: {
            type: Object,
            default: function () {
                return {}
            }
        },
        readonly: {
            type: Boolean,
            default: false
        },
        event: {
            type: Function
        }
    },
    created: function () {
        var _this = this
        var formData = {}

        _this.items.forEach(function (item) { //预设值的初始化

            if (item.type === 'cascader' || item.type === 'dynamicTable') {
                formData[item.field] = item.value ? item.value : []

            } else {
                formData[item.field] = item.value ? item.value : ''
            }

            if (item.type === 'multiSelect') {
                formData[item.field] = item.value ? item.value : []
            }

            if (_this.readonly || item.readonly) {
                item.props = Object.assign({}, item.props, { readonly: true, disabled: true })
            }
        })

        _this.formData = formData
        //处理rules和预处理数据
        var rules = {}
        _this.items.forEach(function (item) {

            if (item.rules && item.rules.length > 0) { //验证处理
                rules[item.field] = item.rules.map(function (rule) {
                    if (rule.validator) { //自定义验证 _this.formData要保持引用
                        rule.validator = rule.validator.bind(_this, _this.formData)
                    }
                    return rule
                })
            }

            if (item.type == 'dynamicTable') {
                for (var i = 0; i < item.cols.length; i++) {
                    //处理下拉框
                    if (item.cols[i].type == 'select') {
                        $.ajax({
                            method: "GET",
                            url: item.cols[i].optionsUrl,
                            async: false,
                            data: {},
                        }).done(function (resData) {
                            item.cols[i]['options'] = resData.map(function (subItem) {
                                if (!!Number(subItem.value) || Number(subItem.value) === 0) { //不是NaN值,还原成number类型
                                    subItem.value = String(subItem.value)
                                }
                                return { label: subItem.name || subItem.text, value: subItem.value }
                            })

                        }).fail(function (res) {
                            console.error('获取远程options失败')
                        })
                    }

                    if (item.cols[i].type == 'upload') {
                        _this.isTableUpload = true
                    }

                    if (typeof (item.cols[i].rules) != "undefined") {
                        //赋值
                        _this.dynamicTableRules[item.cols[i].prop] = item.cols[i].rules;
                    }
                }
            }

            // if ((item.type === 'select' || item.type === 'multiSelect') && item.options) {
            //     console.log("************");
            //     console.log(item);
            // }

            if ((item.type === 'select' || item.type === 'multiSelect') && item.optionsUrl) { //url远程获取options

                $.ajax({
                    method: "GET",
                    url: item.optionsUrl,
                    data: {},
                }).done(function (resData) {
                    // var resData = JSON.parse(res)
                    if (item.isRemoteSelected) {
                        item.value = resData.value;
                        _this.formData[item.field] = item.value
                        resData = resData.datas;
                    }

                    item.options = resData.map(function (subItem) {
                        if (!!Number(subItem.value) || Number(subItem.value) === 0) { //不是NaN值,还原成number类型
                            subItem.value = String(subItem.value)
                        }
                        return { label: subItem.name || subItem.text, value: subItem.value }
                    })

                }).fail(function (res) {
                    console.error('获取远程options失败')
                })
            }

            if (item.type === 'cascader' && item.optionsUrl) { //url远程获取options
                item.options = []
                $.ajax({
                    method: "GET",
                    url: item.optionsUrl,
                    data: {},
                }).done(function (res) {
                    var resData = JSON.parse(res)
                    _this.processCascaderData(resData[0].children, item.options, item.labelKey, item.valueKey)
                }).fail(function (res) {
                    console.error('获取远程options失败')
                })
            }
        })
        _this.rules = rules


    },
    data: function () {
        return {
            formVisible: false,
            clickRowData: this.currentRow,
            formData: {},
            rules: {},
            isLoading: false,
            tree: [],
            treeProps: {
                children: 'children',
                label: 'label'
            },
            fileUrlStr: '',
            thumbUrlStr: '',
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: [],
            fileFormData: new FormData(),
            waitUploadList: {},//待上传列表
            toRemovedUrls: [],
            tableData: [],
            dynamicTableRules: {},
            TheStyle: {
                'min-height': '60px',
                'width': '100%',
                'height': '100%',
                'overflow': 'auto'
            },
            dynamicTableFileList: [],
            toDynamicTableRemovedUrls: [],
            //动态表单中待上传的文件模型
            dynamicTableFilesModel: [],
            isTableUpload: false,
            //存放动态表格里面文件链接的路径 用于排序
            initialPictureUrls: [],
        }
    },
    computed: {
        currentRowPics: function () {
            var arr = []
            if (this.clickRowData && this.clickRowData.imageAddress) {
                this.clickRowData.imageAddress.split(',').forEach(function (url, index) {
                    if (url) {
                        arr.push({
                            name: index + '',
                            url: url
                        })
                    }
                })
            }
            return arr
        },
        tableStyle() {
            return function (item) {
                return "width:" + item.width
            }
        }
    },
    watch: {
        currentRow: {
            handler(newVal, oldValue) {
                this.clickRowData = newVal
            }
        },
        module: {
            handler(newVal, oldValue) {
                var _this = this
                if (newVal.uploader && newVal.uploader.fileUrls != null) { //可能是''空字符串，这时需要清空
                    _this.fileList = []
                    _this.fileUrlStr = _this.module.uploader.fileUrls //文件url保存下来，删除文件时进行处理
                    _this.thumbUrlStr = _this.module.uploader.thumbUrls //图片缩略图

                    _this.toRemovedUrls = []
                    var nameList = []
                    if (newVal.uploader.fileNames != null) {
                        nameList = newVal.uploader.fileNames.split(',')
                    }

                    if (_this.thumbUrlStr && _this.thumbUrlStr !== 'null') {
                        var rawList = _this.fileUrlStr.split(',')
                        _this.thumbUrlStr.split(',').forEach(function (url, index) {
                            if (url) {
                                _this.fileList.push({
                                    // name: index + '',
                                    name: _this.module.uploader.filename || nameList[index] || url.match(/.+\/(.+\..+)$/)[1],
                                    url: url,
                                    rawUrl: rawList[index]
                                })
                            }
                        })
                    } else if (_this.fileUrlStr && _this.fileUrlStr !== 'null') {
                        _this.fileUrlStr.split(',').forEach(function (url, index) {
                            if (url) {
                                _this.fileList.push({
                                    // name: index + '',
                                    name: _this.module.uploader.filename || nameList[index] || url.match(/.+\/(.+\..+)$/)[1],
                                    url: url
                                })
                            }
                        })
                    }
                }
            }
        }
    },
    methods: {
        setCurrentRow(row) {
            this.clickRowData = row
        },
        setFormDialogTableData(key) {
            this.tableData = this.clickRowData[key]
        },
        handleAddUpload: function (req) {
            this.fileFormData.append(req.filename, req.file)
            this.waitUploadList[req.file.uid] = req.file;
        },
        handleRemove: function (file, fileList) {
            // this.fileFormData.delete(file.uid);
            this.fileFormData.delete(this.module.uploader.props.name);
            delete this.waitUploadList[file.uid]

            for (var key in this.waitUploadList) {
                this.fileFormData.append(this.module.uploader.props.name, this.waitUploadList[key])
            }

            var matched = this.fileList.find(function (item) { //matched表明是后台回传显示的图片
                return item.uid === file.uid
            })

            if (matched) {
                if (matched.rawUrl) {//如有有rawUrl字段，表明这是缩略图，需要删除两个地方
                    this.thumbUrlStr = (this.thumbUrlStr.indexOf(matched.url + ',') > -1) ? this.thumbUrlStr.replace(matched.url + ',', '') : this.thumbUrlStr.replace(matched.url, '')
                    this.fileUrlStr = (this.fileUrlStr.indexOf(matched.rawUrl + ',') > -1) ? this.fileUrlStr.replace(matched.rawUrl + ',', '') : this.fileUrlStr.replace(matched.rawUrl, '')
                } else {
                    this.fileUrlStr = (this.fileUrlStr.indexOf(matched.url + ',') > -1) ? this.fileUrlStr.replace(matched.url + ',', '') : this.fileUrlStr.replace(matched.url, '')
                }
                //要删除的文件url
                this.toRemovedUrls.push(matched.url)
            }
        },
        handlePictureCardPreview: function (file) {
            var suffix = file.name.match(/.+\.(.+)$/)[1]
            if (suffix === 'pdf'
                || suffix === 'doc'
                || suffix === 'docx'
                || suffix === 'xls'
                || suffix === 'xlsx'
                || suffix === 'ppt'
                || suffix === 'pptx'
            ) {
                // this.$message.error('此文件不支持预览');
                window.open(file.url)
                return
            } else if (suffix === 'mp4'
                || suffix === 'mp3'
                || suffix === 'avi'
                || suffix === 'wmv'
                || suffix === 'mpg'
                || suffix === 'mpeg'
                || suffix === 'mov'
                || suffix === 'rm'
                || suffix === 'ram'
                || suffix === 'swf'
                || suffix === 'flv') {
                window.open(file.url)
                return
            }
            //存在原图则查看原图
            this.dialogImageUrl = file.rawUrl ? file.rawUrl : file.raw ? file.raw : file.url
            this.dialogVisible = true;

        },
        /*图片上传模块*/
        beforeUpload: function (file) {
            var isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.error('上传图片或文件大小不能超过10MB');
            }
            return isLt10M
        },
        hide: function () {
            this.formVisible = false
            this.isLoading = false
        },
        processCascaderData: function (tree, cascaderOpts, label, value) {
            /*级联菜单*/
            var _this = this
            tree.forEach(function (item) {
                var result = {}
                result.value = value ? item[value] : item.id
                result.label = label ? item[label] : item.text
                if (item.leaf === false) {
                    result.children = []
                    _this.processCascaderData(item.children, result.children, label, value)
                }
                cascaderOpts.push(result)
            })
        },
        cancel: function () {
            this.hide()
        },
        confirm: function (url) {

            var _this = this

            _this.$refs.form.validate(function (valid) {

                if (!valid) {
                    return false
                }

                let dynamicTableField = '';

                _this.isLoading = true;
                //var formData = _this.formData
                var _formData = JSON.parse(JSON.stringify(_this.formData));

                if(url && url.length > 0) {
                    _formData['submitUrl'] = url
                }

                _this.items.filter(function (item) {
                    //form表单提交时，如果需要name值就把name带上就可以了
                    if (item.type === 'select' && item.needName) {
                        var value = _formData[item.field]
                        for (let n = 0; n < item.options.length; n++) {
                            if (value == item.options[n].value) {
                                _formData[item.field + "Name"] = item.options[n].label;
                                break;
                            }
                        }
                    } else if (item.type === 'multiSelect' && item.needName) {
                        var values = _formData[item.field]
                        if (values) {
                            var array = []
                            for (var i = 0; i < values.length; i++) {
                                value = values[i];
                                for (let n = 0; n < item.options.length; n++) {
                                    if (value == item.options[n].value) {
                                        array.push(item.options[n].label)
                                        break;
                                    }
                                }
                            }
                            _formData[item.field + "Name"] = array;
                        }
                    } else if (item.type === 'dynamicTable') {
                        dynamicTableField = item.field;
                        //如果是动态表格 并且是有文件上传 就要先处理一下文件数据
                        if (_this.isTableUpload) {
                            let uploadProp = '';
                            //先清空
                            for (var i = 0; i < item.cols.length; i++) {
                                if (item.cols[i].type == 'upload') {
                                    uploadProp = item.cols[i].prop
                                    _this.fileFormData.delete(item.cols[i].prop);
                                    _this.fileFormData.delete('dynamicTableNewFileIndex');
                                }
                            }
                            //文件排序
                            //根据最终提交的formdata里面存放的表格数据 来确定文件的顺序
                            for (let l = 0; l < _formData[dynamicTableField].length; l++) {
                                let data = _formData[dynamicTableField][l];
                                //新增的存储在formdata中都有uid信息 根据uid来定位文件
                                let uid = typeof (data[uploadProp]) == "undefined" ? '' : data[uploadProp].toString();
                                if (uid.substr(0, 4) != "http" && uid != "" && typeof (uid) != "undefined") {
                                    //再添加
                                    for (let j = 0; j < _this.dynamicTableFilesModel.length; j++) {
                                        let fileModel = _this.dynamicTableFilesModel[j]
                                        if (typeof (fileModel) == "undefined") {
                                            continue;
                                        }
                                        if (fileModel.uuid == uid) {
                                            _this.fileFormData.append(fileModel.prop, fileModel.fileObject)
                                            _this.fileFormData.append('dynamicTableNewFileIndex', l)
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        //没有文件情况下 需要把数据json化提交
                        for (var f in _formData) {
                            var type = typeof _formData[f]
                            if (type == "object" && Array.isArray(_formData[f]) && _formData[f].length > 0) {
                                _formData[f] = JSON.stringify(_formData[f]);
                            }
                        }
                    }
                    return item.type === 'cascader'
                }).forEach(function (item) {
                    if (item.leafOnly) {
                        _formData[item.field] = _formData[item.field].pop()
                    }
                });
                // for(var f in _formData) {
                //     var type = typeof _formData[f]
                //     if(type == "object" && Array.isArray(_formData[f]) && _formData[f].length > 0){
                //         var string = _formData[f][0];
                //         for(var i=1; i< _formData[f].length; i++) {
                //             string += ";" + _formData[f][i]
                //         }
                //         _formData[f] = string;
                //     }
                // }
                /*菜单树数据*/
                if (_this.module && _this.module.tree) {
                    var treeData = {}
                    var map = _this.module.tree.map
                    var selectedNodes = _this.$refs.tree.getCheckedNodes(false, true) //true 只获取子节点值, false包含父节点  是否包含半选节点
                    if (selectedNodes.length === 0) {
                        _this.$message.error("请勾选菜单树");
                        _this.isLoading = false
                        return
                    }
                    selectedNodes.forEach(function (item) {
                        // if (item.leaf && !item.disabled) { //未禁用的子节点
                        if (!item.disabled) { //未禁用的节点
                            for (var key in map) {
                                if (item[key] != null) {
                                    treeData[map[key]] = (treeData[map[key]] ? treeData[map[key]] : '') + item[key] + ',' //避免首次undefined
                                }
                            }
                        }
                    })
                    Object.assign(_formData, treeData)
                }

                //上传文件，将formData中的数据放入fileFormdata中
                if ((_this.module && _this.module.uploader) || _this.isTableUpload) {
                    //遍历对象放入fileFormData中
                    for (var v in _formData) {
                        Object.keys(_formData).forEach(function (key) {
                            //如果是动态表格的数据 需要json化
                            if (key == _this.dynamicTableField) {
                                _this.fileFormData.set(key, JSON.stringify(_formData[key]))
                            } else {
                                _this.fileFormData.set(key, _formData[key])
                            }
                        })
                    }

                    if (typeof (_this.toRemovedUrls) != "undefined" && _this.toRemovedUrls.length > 0) {
                        _this.fileFormData.set("deleteFile", _this.toRemovedUrls.join(','))
                    }

                    _this.waitUploadList = {} //重置待上传列表

                    if (typeof (_this.toDynamicTableRemovedUrls) != "undefined" && _this.toDynamicTableRemovedUrls.length > 0) {
                        _this.fileFormData.set("deleteDynamicTableFile", _this.toDynamicTableRemovedUrls.join(','))
                    }

                    _this.$emit('valid', _this.fileFormData, _this.clickRowData, function () {
                        _this.isLoading = false
                    })
                } else {
                    //拷贝数据，保证组件内部数据不受外部影响
                    _this.$emit('valid', _formData, _this.clickRowData, function () {
                        _this.isLoading = false
                    })
                }
            })
        },
        onDialogClosed: function () {
            this.fileList = []
            this.nameList = []
            this.dynamicTableFileList = []
            setTimeout(function (_this) {
                _this.$emit('close')
            }, 0, this)
        },
        checkTimeRange: function (item) {

            if (item.type == 'timerange') {

                if (!item.pickerOptions) {
                    item.pickerOptions = {
                        onPick: ({ maxDate, minDate }) => {
                            if (maxDate) {
                                //console.log(maxDate)
                                this.formData[item.timeKeys[1]] = formatDate(maxDate, item.timeFormat);
                            }

                            if (minDate) {
                                //console.log(minDate)
                                this.formData[item.timeKeys[0]] = formatDate(minDate, item.timeFormat);
                            }
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        getFormData() {
            return this.formData
        },
        setComponentValue: function (param) {
            var json = param.fields
            for (var v in json) {
                this.formData[v] = json[v]
            }
        },
        handleSelectChange(field, value) {
            this.$emit('itemEvent', 'change', field, value)
        },
        show: function () {

            var _this = this

            if (_this.event) {
                _this.event.call()
            }
            if (_this.module && _this.module.uploader && _this.clickRowData) {
                //编辑的情况需要把文件设置进去
                //获取后台文件字段对应的key的值
                var split = (_this.module.uploader.props.split) ? _this.module.uploader.props.split : ",";
                var fileThumbKey = _this.module.uploader.props.name + "ThumbUrl";
                var fileUrlThumbUrl = _this.clickRowData[fileThumbKey];
                var thumbUrls = [];

                if(fileUrlThumbUrl) {
                    fileUrlThumbUrl.split(split).forEach(function (url, index) {
                        if (url) {
                            thumbUrls[index] = url;
                        }
                    })
                }

                var fileUrlStr = _this.clickRowData[_this.module.uploader.props.name];

                if(fileUrlStr) {

                    fileUrlStr.split(split).forEach(function (url, index) {
                        if (url) {
                            var array = url.split("/")
                            var filename = array[array.length-1]
                            var thumbUrl = (thumbUrls.length > 0) ? thumbUrl[index] : url

                            _this.fileList.push({
                                name: filename,
                                url: url,
                                rawUrl: thumbUrl,
                            })
                        }
                    })
                }
            }

            //重置表单
            if (_this.$refs.form) { //首次打开
                _this.$refs.form.resetFields();
            }

            _this.fileFormData = new FormData() //重置上传文件
            //如果是需要编辑的,那么就要把列中的数据带到表单当中
            if (_this.edit || _this.clickRowData !== undefined) {

                if (!_this.clickRowData) {
                    _this.$message.warning("请选择一条记录");
                    return
                }

                Object.keys(_this.formData).forEach(function (key) {

                    if (_this.clickRowData[key] != null) { //非空才赋值
                        _this.formData[key] = _this.clickRowData[key]

                    }

                    _this.items.forEach(function (item) {
                        //console.log('item' + JSON.stringify(item))
                        if (item.field === key) { //获取值的对应的表单字段类型

                            if (item.type === 'select' && item.isRemoteSelected) {
                                _this.formData[key] = item.value;
                            }

                            if (item.type === 'cascader') { //如果是级联
                                var node = _this.findLink(item.options, _this.clickRowData[key])  //通过最后一级查找整个级联链
                                if (node && (node.value != null)) {
                                    var newVal = []
                                    do {
                                        newVal.unshift(node.value)
                                    } while (node.parent && (node = node.parent))
                                    _this.formData[key] = newVal
                                }
                            }

                            if (item.type === 'dynamicTable') {
                                _this.formData[key] = _this.clickRowData[item.field];
                                for (var i = 0; i < item.cols.length; i++) {
                                    if (item.cols[i].type == 'upload') {
                                        _this.clickRowData[item.field].forEach(function (element) {
                                            _this.dynamicTableFileList.push([{
                                                name: typeof (element.fileName) == "undefined" ? element.fileUrl.match(/.+\/(.+\..+)$/)[1] :
                                                    element.fileName || url.match(/.+\/(.+\..+)$/)[1],
                                                url: element.fileUrl
                                            }])
                                            _this.initialPictureUrls.push(element.fileUrl)
                                        });
                                    }
                                }
                            }
                        }
                    })
                })
            }

            if (_this.module && _this.module.tree) {
                _this.getTreeNode()
            }

            this.formVisible = true
            setTimeout(function (_this) { //避免首次可能获取不到节点
                _this.$emit('show', _this.clickRowData)
            }, 0, this)
        },
        /*树模块*/
        checkAllNodes: function () {
            if (this.$refs.tree) {
                this.$refs.tree.setCheckedNodes(this.tree)
            }
        },
        uncheckAllNodes: function () {
            if (this.$refs.tree) {
                this.$refs.tree.setCheckedNodes([])
            }
        },
        getTreeNode: function () {
            var _this = this
            var params = {}
            var paramFields = _this.module.tree.paramFields

            if (Object.prototype.toString.call(paramFields) === "[object Array]") {
                paramFields.forEach(function (field) {
                    if (typeof field === 'string') {
                        if (_this.clickRowData[field] != null) {
                            params[field] = _this.clickRowData[field]
                        }
                    } else if (typeof field === 'object') {
                        if (_this.clickRowData[field['name']] != null) {
                            params[field['alias']] = _this.clickRowData[field['name']]
                        }
                    }
                })
            }

            setTimeout(function () {
                $.ajax({
                    method: "GET",
                    url: _this.module.tree.url,
                    data: params
                }).done(function (resData) {
                    // var resData = JSON.parse(res)
                    var checkedKeys = []
                    var tree = resData.datas[0].children
                    _this.tree = _this.processTree(tree, null, checkedKeys)
                    setTimeout(function (_this) {
                        _this.$refs.tree.setCheckedKeys(checkedKeys)
                    }, 0, _this)
                }).fail(function (res) {
                    console.error('请求出错:', res)
                })
            }, 0)
        },
        processTree: function (tree, parentIdx, checkedKeys) {
            var _this = this
            return tree.map(function (node, idx) {
                node.id = node.id || (parentIdx ? parentIdx + '_' : '') + idx
                node.label = node.text
                // if (node.checked) {
                if (node.checked && node.leaf) { //只选中子节点
                    checkedKeys.push(node.id)
                }
                if (node.leaf === false) {
                    node.children = _this.processTree(node.children, idx, checkedKeys)
                    node.disabled = node.children.length === 0
                }
                return node
            })
        },
        addRow(itemData) {
            _this = this
            //赋初值
            let initialData = {};

            this.items.forEach(function (item) {
                if (item.type == 'dynamicTable') {
                    for (var i = 0; i < item.cols.length; i++) {
                        if (item.cols[i].type == 'switch') {
                            initialData[item.cols[i].prop] = false
                        } else {
                            initialData[item.cols[i].prop] = ''
                        }
                    }
                }
            })

            this.formData[itemData.field].push(initialData)

        },
        deleteRow(index, rows, propName) {

            //判断是不是后台回传图片
            if (this.dynamicTableFileList.length > 0 && this.dynamicTableFileList[index].length > 0) {
                var matched = this.dynamicTableFileList[index].find(function (item) { //matched表明是后台回传显示的图片
                    return item.url === rows[index].fileUrl
                })

                if (matched) {
                    //要删除的文件url
                    this.toDynamicTableRemovedUrls.push(matched.url)
                }
            }

            this.dynamicTableFilesModel.splice(index, 1);
            this.dynamicTableFileList.splice(index, 1)
            rows.splice(index, 1);
        },
        handleTableAddUpload: function (req) {


        },
        handleDynamicTableRemove: function (file, fileList, index, propName) {

            let matched = this.dynamicTableFileList[index].find(function (item) { //matched表明是后台回传显示的图片
                return item.uid === file.uid
            })

            if (matched) {
                //要删除的文件url
                this.toDynamicTableRemovedUrls.push(matched.url)
            }

            this.dynamicTableFileList[index] = fileList;

            let fileModel = {
                "type": "",
                "filePath": "",
                "uuid": '',
                "index": '',
                "fileName": '',
                "prop": '',
                "fileObject": ''
            }

            this.dynamicTableFilesModel[index] = fileModel;
        },
        handleDynamicTableChange: function (file, fileList, index, field, propName) {

            this.dynamicTableFileList[index] = fileList;

            if (file.status == "ready") {

                //本地照片上传
                this.formData[field][index][propName] = file.uid

                //存入文件模型中
                let fileModel = {
                    "type": "local",
                    "filePath": "",
                    "uuid": file.uid,
                    "index": index,
                    "prop": propName,
                    "fileName": file.name,
                    "fileObject": file.raw
                }

                this.dynamicTableFilesModel[index] = fileModel;
            }
        },
    }
})