var code = `
<div>
    <el-table :style="TheStyle"
              ref="globalSingleTable"
              v-bind="props" 
              :data="rows" 
              :row-class-name="rowClassName" 
              stripe border highlight-current-row 
              @current-change="handleCurrentRowChange" 
              @selection-change="handleSelectionChange"
              @row-click="onRowClick">
              <el-table-column type="selection" width="55">
                <slot name="tableColumn"></slot>
              </el-table-column>
              <el-table-column v-for="col in cols" 
                                :key="col.prop" 
                                :prop="col.prop" 
                                :label="typeof col.label === \'object\' ? col.label.value : col.label" 
                                :width="col.width">
								<el-table-column v-if="col.children||col.children.length>0" v-for="item1 in col.children" 
												:label="item1.label" :prop="item1.prop" :width="item1.width" > 
													<el-table-column v-if="item1.children||item1.children.length>0" v-for="item2 in item1.children" \n' +
													:label="item2.label" :prop="item2.prop" :width="item2.width" > 
													<el-table-column v-if="item2.children||item2.children.length>0" v-for="item3 in item2.children" \n' +
													:label="item3.label" :prop="item3.prop" :width="item3.width" > 
													</el-table-column>
													</el-table-column>
												</el-table-column>
								
              </el-table-column>
    </el-table>
    <el-pagination :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="pageSize"
                :page-sizes="pageSizes || [10, 25, 50, 100]"
                :current-page="currentPage"
                :manual="manual"
                :handler="handler"
                @current-change="handleCurrentPageChange"
                @size-change="handleSizeChange">
    </el-pagination>
</div>
`

Vue.component('table-component', {
	template: code,
	props: ['cols', 'url', 'sort', 'queryObj', 'enumMap', 'rowClassName', 'props', 'rowClick', 'pageSizes',
		'params', 'dataProcess', 'firstSelected', "manual", "handler"
	],
	created: function() {
		this.getData(this.currentPage, this.pageSize)
	},
	watch: {
		pageSize: function(newValue, oldValue) {
			this.getData()
		},
		currentPage: function(newValue, oldValue) {
			this.getData()
		},
	},
	data: function() {

		return {
			currentRow: null,
			pageSize: this.pageSizes ? this.pageSizes[0] : 10,
			currentPage: 1,
			total: 0,
			rows: [],
			lastQueryObj: null,
			TheStyle: {
				'min-height': '60px',
				'width': '100%',
				'height': '100%',
				'overflow': 'auto'
			}
		}
	},
	mounted: function() {
		this.$emit('get-form-header-height')
		var vm = this
		$(window).resize(function() {
			vm.$emit('get-form-header-height')
		});
	},
	methods: {
		refresh: function() {
			this.getData()
		},
		getData: function() {
			//获取table的数据
			let _this = this

			if (_this.manual) {
				_this.handler();
				return;
			}

			if (_this.queryObj !== _this.lastQueryObj &&
				(JSON.stringify(_this.queryObj) !== JSON.stringify(_this.lastQueryObj))) { //查询条件变化
				_this.currentPage = 1
			}

			_this.lastQueryObj = Object.assign({}, _this.queryObj);
			$.ajax({
				method: "GET",
				url: _this.url,
				data: Object.assign({
					page: _this.currentPage,
					start: (_this.currentPage - 1) * _this.pageSize,
					limit: _this.pageSize,
					sort: _this.sort,
				}, _this.params, _this.queryObj),
			}).done(function(resData) {

				if (resData.code && resData.code === 101) {
					_this.$message.error(resData.desc || '请求失败');
					return
				}

				if (typeof _this.dataProcess === 'function') {
					resData.datas = _this.dataProcess(resData.datas)
				}

				if (_this.enumMap !== undefined) {
					Object.keys(_this.enumMap).forEach(function(key) {
						resData.datas.forEach(function(row) {
							//_this.enumMap[key]就是sex对象
							let textKey = _this.enumMap[key]['CONVERT_TEXT']
							var val = row[key]

							if (val != null) { //避免null转undefined
								row[textKey] = _this.enumMap[key]['CONVERT'][val]
							} else if (_this.enumMap[key]._default !=
								null) { //_default 数据null或undefined时的默认值
								row[textKey] = _this.enumMap[key]._default
							}
						})
					})
				}

				_this.rows = resData.datas
				_this.total = resData.total
				_this.$emit('update', {
					rows: resData.datas,
					total: resData.total
				})
				if (_this.firstSelected && resData.datas[0] != null) {
					_this.setCurrent(resData.datas[0]) //默认选中第一行
				}

			}).fail(function(jqXHR, textStatus) {
				console.log(jqXHR, textStatus);
			})
		},
		setCurrent: function(row) {
			this.$refs['globalSingleTable'].setCurrentRow(row);
		},
		handleSelectionChange: function(array) {
			//每次这个被调用都会根据实际情况增减数组
			this.$emit("multi-row-change", array)
		},
		handleCurrentRowChange: function(val) {
			var _this = this
			if (val == null) {
				this.$emit("current-row-change", null)
				return
			}
			//多选的checkbox选中当前
			this.$refs['globalSingleTable'].clearSelection();
			this.$refs['globalSingleTable'].toggleRowSelection(val, true)
			this.currentRow = val;
			this.$emit("current-row-change", val) //传递一个副本
		},
		handleCurrentPageChange: function(val) {
			
			this.currentPage = val
			this.$refs['globalSingleTable'].toggleRowSelection(val, true)
			this.$emit('current-change', val)
			// var _this = this
			// if(val == null) {
			//     this.$emit("current-row-change", null)
			//     return
			// }
			// //多选的checkbox选中当前
			// this.$refs['globalSingleTable'].clearSelection();
			// this.$refs['globalSingleTable'].toggleRowSelection(val, true)
			// this.currentRow = val;
			// this.$emit("current-row-change", val) //传递一个副本
		},
		handleSizeChange: function(val) {
			this.pageSize = val;
		},
		onRowClick: function(row, column, event) {
			this.$emit("row-click", row)
		},
	}
})
