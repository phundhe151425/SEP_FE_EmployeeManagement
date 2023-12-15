<template>
  <div class="manage-department">
    <h3 class="text-start" style="font-weight: bold">
      Duyêt đề xuất và chấm công
    </h3>
    <hr style="margin-bottom: 2%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto;">
        <el-row :gutter="20">
          <el-col :md="3" :lg="3" :xl="3" class="">
            <div class="">
              <el-button
                class="buttons btn-add"
                type="danger"
                style=""
                round
                @click="showProcessRequestDialog"
              >
                Duyệt đề xuất
              </el-button>
            </div>
          </el-col>

          <el-col :md="3" :lg="3" :xl="3" class="">
            <div class="">
              <el-button
                class="buttons btn-add"
                type="danger"
                style=""
                round
                @click="showProcessAttendDialog"
              >
                Duyệt chấm công
              </el-button>
            </div>
          </el-col>
        </el-row>
        <br />
      </div>
    </div>

    <el-dialog
      :visible.sync="requestProcessDialogVisible"
      width="50%"
      title="Duyệt đề xuất"
      left
    >
      <el-form
        id="formCreate"
        :model="date"
        :rules="rules"
        ref="requestProcess"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Chọn ngày" required>
              <el-form-item prop="date">
                <el-date-picker
                  type="date"
                  v-model="date.date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  name="startDate"
                  placeholder="Chọn ngày"
                  style="width: 100%"
                  :clearable="false"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #ed9696; color: white"
                  @click="cancelProcessRequest('requestProcess')"
                  >Hủy
                </el-button>
              </el-form-item>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #75c4c0; color: white"
                  @click="submitForm('requestProcess')"
                  >Lưu
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="attendProcessDialogVisible"
      width="50%"
      title="Duyệt chấm công"
      left
    >
      <el-form
        id="formCreate"
        :model="dateAttend"
        :rules="rulesAttend"
        ref="attendProcess"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Chọn ngày" required>
              <el-form-item prop="date">
                <el-date-picker
                  type="date"
                  v-model="dateAttend.date"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  name="startDate"
                  placeholder="Chọn ngày"
                  style="width: 100%"
                  :clearable="false"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #ed9696; color: white"
                  @click="cancelProcessAttendDialog('attendProcess')"
                  >Hủy
                </el-button>
              </el-form-item>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #75c4c0; color: white"
                  @click="submitAttendForm('attendProcess')"
                  >Lưu
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import RequestService from "@/services/request-service";
import AttendanceService from "@/services/attendance-service";
// import moment from "moment";

export default {
  components: {},
  name: "ManageDepartment",
  data() {
    return {
      day: "",
      month: "",
      year: "",
      date: { date: "" },
      dateAttend: { date: "" },
      rules: {
        date: [
          {
            required: true,
            message: "Vui lòng chọn ngày!",
            trigger: "change",
          },
        ],
      },
      rulesAttend: {
        date: [
          {
            required: true,
            message: "Vui lòng chọn ngày!",
            trigger: "change",
          },
        ],
      },
       requestProcessDialogVisible: false,
      attendProcessDialogVisible: false,
    };
  },

  created() {
    // this.getData();
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var subDate = this.date.date.split("-");
          this.day = Number(subDate[2]);
          this.month = Number(subDate[1]);
          this.year = Number(subDate[0]);
          console.log(this.day + "," + this.month + "," + this.year);
          RequestService.processRequest(this.day, this.month, this.year)
            .then(() => {
              this.requestProcessDialogVisible = false;
              this.$notify.success({
                message: "Tiến hành duyệt đề xuất thành công!",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
            })
            .catch((e) => {
              console.log(e);
              if (e.response.data.status == 401)
                this.$store.dispatch("auth/logout");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    submitAttendForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var subDate = this.dateAttend.date.split("-");
          this.day = Number(subDate[2]);
          this.month = Number(subDate[1]);
          this.year = Number(subDate[0]);
          console.log(this.day + "," + this.month + "," + this.year);
          AttendanceService.processAttendance(this.day, this.month, this.year)
            .then(() => {
              this.attendProcessDialogVisible = false;
              this.$notify.success({
                message: "Tiến hành duyệt chấm công thành công!",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
            })
            .catch((e) => {
              console.log(e);
              if (e.response.data.status == 401)
                this.$store.dispatch("auth/logout");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelProcessRequest(formName) {
      this.$refs[formName].resetFields();
      this.requestProcessDialogVisible = false;
    },

    showProcessRequestDialog() {
      this.requestProcessDialogVisible = true;
      this.$refs["requestProcess"].resetFields();
    },

    showProcessAttendDialog(){
        this.attendProcessDialogVisible = true;
       this.createDepartmentDialogVisible = false;
        this.$refs["attendProcess"].resetFields();
    },

    cancelProcessAttendDialog(formName) {
      this.$refs[formName].resetFields();
      this.attendProcessDialogVisible = false;
    },

    logout() {
      this.$store.dispatch("auth/logout");
      window.location.replace("/login");
      localStorage.removeItem("user");
    },

    handlePageChange(value) {
      this.page = value - 1;
      this.getData();
    },

    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex % 2 === 0) {
        return "success-row";
      }
      return "success-row";
    },
    restrictToNumbers() {
      // Xóa bất kỳ ký tự nào không phải số khỏi chuỗi
      this.numberInput = this.numberInput.replace(/[^0-9]/g, "");
    },
  },
};
</script>

<style>
* {
  font-size: 16px;
}

.manage-department .el-form-item__label {
  text-align: left;
}

.manage-department .el-form-item__content {
  margin-left: 0px !important;
}

.manage-department .el-form-item {
  display: flex;
  flex-direction: column;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-table .warning-row {
  background: #ededed;
}

.el-table .success-row {
  background: #f5f5f5;
}

.save {
  cursor: default;
  color: white;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 6px 36px;
}

.save:hover {
  cursor: pointer;
  color: white;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 6px 36px;
}

.el-table .tt1 {
  cursor: default;
  color: black;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.el-table .tt2 {
  cursor: default;
  color: black;
  background-color: #ed9696;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.el-table .btn-action {
  border: none;
  padding: 5px 5px;
  background-color: #f8cbad;
  border-radius: 5px;
}

.el-table .btn-action:hover {
  border: none;
  padding: 5px 5px;
  background-color: #f4e4d4;
  border-radius: 5px;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #c9f5eb !important;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.loading {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  /* background: rgba(0, 0, 0, 0.479); */
}

.loading img {
  width: 25rem;
}

@media only screen and (min-width: 150px) {
  .manage-department .el-col-md-6 {
    width: 108%;
  }

  .manage-department .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 992px) {
  .manage-department .el-col-md-6 {
    width: 100%;
  }

  .manage-department .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 1440px) {
  .manage-department .el-col-md-6 {
    width: 23%;
  }

  .manage-department .buttons {
    text-align: right;
  }

  .manage-department .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1689px) {
  .manage-department .el-col-md-6 {
    width: 23%;
  }

  .manage-department .buttons {
    text-align: right;
  }

  .manage-department .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1920px) {
  .manage-department .el-col-md-6 {
    width: 23%;
  }

  .manage-department .buttons {
    text-align: right;
  }

  .manage-department .div-buttons {
    float: right;
  }
}
</style>