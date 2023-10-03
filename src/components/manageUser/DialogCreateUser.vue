<template>

    <el-dialog

        :visible.sync="dialogVisible"
        width="30%"
        title="Tạo mới Nhân viên"
        center>
      <div class="row">
        <div class="col-lg-4 col-md-4">
          <span>Nhập họ tên nhân viên<span style="color: red">*</span></span><br>
          <input type="text" >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="dialogVisible  = false">Confirm</el-button>
              </span>
    </el-dialog>

</template>

<script >
export default {
  data() {
    return {
      employeeName: '',
      dialogVisible: false,// Thêm các trường thông tin khác của nhân viên
    };
  },


  methods: {
    createEmployee() {
      // Thực hiện logic để tạo mới nhân viên và đóng dialog
      // Có thể sử dụng các dịch vụ hoặc gửi yêu cầu API tại đây
      // Sau khi tạo xong, đóng dialog và cập nhật danh sách nhân viên
      this.closeDialog();
    },
    closeDialog() {
      // Đóng dialog bằng cách gửi một sự kiện tới component cha
      this.$emit('close');
    },
  },
};
</script>



<style scoped>

</style>