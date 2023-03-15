var baseCode = `
<div>
    <el-form label-width="100px" :inline="true" class="demo-form-inline">
            <el-row :gutter="20" justify="center">
                  <el-form-item label="患者姓名">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
                  <el-form-item label="身份证">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
                  <el-form-item label="就诊卡号">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
                  <el-form-item label="出生年月">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
                  <el-form-item label="婚姻状况">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
                  <el-form-item label="家庭地址">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
                  <el-form-item label="居住地址">
                    <el-input :readonly="true"></el-input>
                  </el-form-item>
            </el-row>
     </el-form>
</div>
`


Vue.component('patient-info-component', {
    template: baseCode,
    props: {
        patientId: {
            type: String
        },
    },
    created: function() {
        console.log(this.pId)
    },
    mounted: function () {

    },
    data: function() {
        console.log(this.patientId)
        return {
            pId: this.patientId
        }
    },
    watch: {

    },
    methods: {

    }
})