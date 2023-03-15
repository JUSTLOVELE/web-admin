var baseCode = `
<div>
<el-form label-width="100px" :inline="true" class="demo-form-inline">
    <el-row :gutter="20" justify="center" style="margin-left:5px">
        <el-form-item label="检查部位名称">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="审核医生">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="检查时间">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="报告医生">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="影像链接">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="PACS链接">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="是否急查">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="阴阳性值">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="是否危机值">
            <el-input></el-input>
        </el-form-item>
    </el-row>
    <el-row :gutter="20" justify="center">
        <el-form-item label="检查所见" >
            <el-input :rows="3" style="width:600px" type="textarea"></el-input>
        </el-form-item>
    </el-row>
    <el-row :gutter="20" justify="center">
        <el-form-item label="检查诊断">
            <el-input :rows="3" style="width:600px" type="textarea"></el-input>
        </el-form-item>
    </el-row>
    <el-row :gutter="20" justify="center">
        <el-form-item label="报告内容">
            <el-input :rows="3" style="width:600px" type="textarea"></el-input>
        </el-form-item>
    </el-row>
    </el-form>
</div>
`

Vue.component('patient-pathology-exam-component', {
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