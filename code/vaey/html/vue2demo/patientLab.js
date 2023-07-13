var baseCode = `
<div>
<!--    <el-form label-width="100px" :inline="true" class="demo-form-inline">-->
<!--            <el-row :gutter="20" justify="center">-->
<!--                  <el-form-item label="患者姓名">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="身份证">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="就诊卡号">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="联系方式">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="出生年月">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="性别">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="婚姻状况">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="家庭地址">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="居住地址">-->
<!--                    <el-input :readonly="true"></el-input>-->
<!--                  </el-form-item>-->
<!--            </el-row>-->
<!--     </el-form>-->
<el-form label-width="100px" :inline="true" class="demo-form-inline">
<el-row v-if="patient.INP">
    <el-collapse accordion>
        <el-collapse-item title="住院">
            <el-row v-if="patient.INP.labReports">
                <el-row>
                    <!--labReports 检验报告-->
                    <el-collapse accordion>
                        <el-collapse-item v-for="(labReport,index) in patient.INP.labReports">
                            <template slot="title">
                                检验报告 &nbsp;&nbsp;&nbsp;<i class="header-icon el-icon-success"></i>
                            </template>
                            <el-row :gutter="20" justify="center" style="margin-left:5px">
                                <el-form-item label="检验类别名称">
                                    <el-input  :value="labReport.LAB_TYPE_NAME"></el-input>
                                </el-form-item>
                                <el-form-item label="标本名称">
                                    <el-input  :value="labReport.SPECIMEN_NAME"></el-input>
                                </el-form-item>
                                <el-form-item label="申请诊断名称">
                                    <el-input  :value="labReport.LAB_DIAGNOSIS_NAME"></el-input>
                                </el-form-item>
                                <el-form-item label="采样部位名称">
                                    <el-input  :value="labReport.SAMPLING_POSITION_NAME"></el-input>
                                </el-form-item>
                                <el-form-item label="样本类型名称">
                                    <el-input  :value="labReport.SPECIMAN_TYPE_NAME"></el-input>
                                </el-form-item>
                                <el-form-item label="采样量">
                                    <el-input  :value="labReport.SAMPLE_VOLUME"></el-input>
                                </el-form-item>
                                <el-form-item label="检验方法名称">
                                    <el-input  :value="labReport.LAB_PERFORMED_TIME"></el-input>
                                </el-form-item>
                                <el-form-item label="诊断类别名称">
                                    <el-input  :value="labReport.REPORT_CONFIRMER_NAME"></el-input>
                                </el-form-item>
                                <el-form-item label="PDF链接">
                                    <el-input  :value="labReport.REPORT_URL"></el-input>
                                </el-form-item>
                                <el-form-item label="检验目的">
                                    <el-input  :value="labReport.EXAM_AIM"></el-input>
                                </el-form-item>
                            </el-row>
                            <el-row v-if="labReport.detail">
                                <el-collapse accordion>
                                    <el-collapse-item v-for="(report,index) in labReport.detail">
                                        <template slot="title">
                                            检验明细 &nbsp;&nbsp;&nbsp;<i class="header-icon el-icon-success"></i>
                                        </template>
                                        <el-row :gutter="20" justify="center" style="margin-left:5px">
                                            <el-form-item label="检验细项名称">
                                                <el-input  :value="report.LAB_SUB_ITEM_NAME"></el-input>
                                            </el-form-item>
                                            <el-form-item label="检验定量结果">
                                                <el-input  :value="getNull(report.LAB_RESULT_VALUE) + getNull(report.LAB_RESULT_UNIT)"></el-input>
                                            </el-form-item>
                                            <el-form-item label="微生物项目名">
                                                <el-input  :value="report.MICRO_ITEM_NAME"></el-input>
                                            </el-form-item>
                                            <el-form-item label="检验定性结果">
                                                <el-input  :value="report.LAB_QUAL_RESULT"></el-input>
                                            </el-form-item>
                                            <el-form-item label="检验结果状态">
                                                <el-input  :value="report.RESULT_STATUS_NAME"></el-input>
                                            </el-form-item>
                                            <el-form-item label="正常值上限值">
                                                <el-input  :value="getNull(report.MAX_RESULT_VALUE) + getNull(report.MAX_RESULT_UNIT)"></el-input>
                                            </el-form-item>
                                            <el-form-item label="正常值下限值">
                                                <el-input  :value="getNull(report.MIN_RESULT_VALUE) + getNull(report.MIN_RESULT_UNIT)"></el-input>
                                            </el-form-item>
                                            <el-form-item label="参考范围">
                                                <el-input  :value="report.RANGE"></el-input>
                                            </el-form-item>
                                            <el-form-item label="报告时间">
                                                <el-input  :value="report.REPORT_TIME"></el-input>
                                            </el-form-item>
                                            <el-form-item label="临床意义">
                                                <el-input  :value="report.CLINICAL_MEANING"></el-input>
                                            </el-form-item>
                                            <el-form-item label="培养+药敏">
                                                <el-input  :value="report.LAB_YM_RESULT"></el-input>
                                            </el-form-item>
                                            <el-form-item label="细菌和药物名">
                                                <el-input  :value="report.LAB_YM_NAME"></el-input>
                                            </el-form-item>
                                        </el-row>
                                    </el-collapse-item>
                                </el-collapse>
                            </el-row>
                        </el-collapse-item>
                    </el-collapse>
                </el-row>
            </el-row>
        </el-collapse-item>
    </el-collapse>
    </el-row>
</el-form>
</div>
`


Vue.component('patient-lab-component', {
    template: baseCode,
    props: {
        patient: {
            type: Object
        }
    },
    created: function() {
        console.log("***************")
        console.log(this.patient)
    },
    mounted: function () {

    },
    data: function() {

        return {
            p: this.patient
        }
    },
    watch: {

    },
    methods: {
        getNull(name) {

            if(name){
                return name;
            }else {
                return "";
            }
        }
    }
})