<template>
    <div class="container-fluid" >
        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <div class="text-center" >
                    <el-progress :percentage="50"></el-progress>
                    <el-progress :percentage="100" :format="format"></el-progress>
                    <el-progress :percentage="100" status="success"></el-progress>
                    <el-progress :percentage="100" status="warning"></el-progress>
                    <el-progress :percentage="50" status="exception"></el-progress>
                </div>
            </div>
        </div>



    </div>
</template>

<script>
export default {
    name: "LoginVue",
    methods: {
        format(percentage) {
            return percentage === 100 ? 'Full' : `${percentage}%`;
        }
    }

}
</script>

<style scoped>

</style>