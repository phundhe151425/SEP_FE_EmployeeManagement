<template>
  <div class="manage-holiday">
    <h3 class="text-start" style="font-weight: bold">
      Quản lý thời gian làm việc
    </h3>
    <hr style="margin-bottom: 2%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto">
        <div>
          <el-table
            :data="workingTimes"
            height="700px"
            :header-cell-style="{
              background: '#D9D9D9',
              color: 'black',
              align: 'center',
            }"
            style="
              width: 100%;
              display: inline-block;
              font-size: 16px;
              border-radius: 10px;
              box-shadow: rgb(149 157 165 / 20%) 0px 8px 24px;
            "
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              label="STT"
              type="index"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              label="Giờ bắt đầu"
              prop="startTime"
              align="center"
            >
            </el-table-column>
            <el-table-column label="Giờ kết thúc" prop="endTime" align="center">
            </el-table-column>
            <el-table-column
              label="Tên"
              prop="workingTimeName"
              align="center"
            ></el-table-column>
            <el-table-column
              v-slot:="data"
              label="Thao tác"
              width="150px"
              align="center"
            >
              <button
                style="margin-right: 10px"
                class="btn-action"
                @click="showEditHolidayDialog(data.row.id)"
              >
                <i class="el-icon-edit-outline" style="width: 30px"></i>
              </button>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          class="text-end"
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :visible.sync="editWorkingTimeDialogVisible"
      width="50%"
      title="Sửa thời gian làm việc"
      left
    >
      <el-form
        id="formEdit"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Tên" prop="workingTimeName">
              <el-input
                v-model="ruleForm.workingTimeName"
                name="workingTimeName"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="row" style="margin-top: 20px">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Thời gian bắt đầu" required>
              <el-form-item prop="startTime">
                <el-time-picker
                  v-model="ruleForm.startTime"
                  placeholder="Chọn thời gian"
                  :clearable="false"
                >
                </el-time-picker>
              </el-form-item>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Thời gian kết thúc" required>
              <el-form-item prop="endTime">
                <el-time-picker
                  v-model="ruleForm.endTime"
                  placeholder="Chọn thời gian"
                  :picker-options="pickerOptionTime"
                  :clearable="false"
                >
                </el-time-picker>
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
                  @click="cancelEditForm('ruleForm')"
                  >Hủy</el-button
                >
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
                  @click="submitEditForm('ruleForm')"
                  >Lưu</el-button
                >
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import WorkingTimeService from "@/services/workingtime-service";
import moment from "moment";
export default {
  components: {},
  name: "ManageWorkingTime",
  data() {
    var validateEndDate = (rule, value, callback) => {
      if (this.ruleForm.startDate == "" && this.ruleForm.endDate != "") {
        this.ruleForm.endDate = "";
        callback(new Error("Vui lòng nhập ngày bắt đầu trước!"));
      } else {
        callback();
      }
    };

    return {
      workingTimeId: "",
      ruleForm: {
        endTime: "",
        workingTimeName: "",
        startTime: "",
      },
      rules: {
        startTime: [
          {
            required: true,
            message: "Vui lòng nhập thời gian bắt đầu!",
            trigger: "change",
          },
        ],
        endTime: [
          {
            required: true,
            message: "Vui lòng nhập thời gian kết thúc!",
            trigger: "change",
          },
          { validator: validateEndDate, trigger: "blur" },
        ],
      },
      workingTimes: [],
      page: 0,
      pageSize: 5,
      search: "",
      date: "",
      totalItems: 0,
      fit: "fill",
      editWorkingTimeDialogVisible: false,
    };
  },

  created() {
    this.getData();
  },
  computed: {
    pickerOptionTime() {
      return {
        selectableRange: this.rangeEndTime(),
      };
    },
  },
  methods: {
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.startTime = moment(
            String(this.ruleForm.startTime)
          ).format("HH:mm:ss");
          this.ruleForm.endTime = moment(String(this.ruleForm.endTime)).format(
            "HH:mm:ss"
          );
          WorkingTimeService.updateWorkingTime(
            this.workingTimeId,
            this.ruleForm
          )
            .then(() => {
              this.editWorkingTimeDialogVisible = false;
              this.$notify.success({
                message: "Sửa thời gian thành công!",
                title: "Thành công",
                timer: 2000,
                timerProgressBar: true,
              });
              this.getData();
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

    cancelEditForm(formName) {
      this.$refs[formName].resetFields();
      this.editWorkingTimeDialogVisible = false;
    },

    showEditHolidayDialog(id) {
      WorkingTimeService.getWorkingTimeById(id)
        .then((response) => {
          this.ruleForm = response.data;
          if (this.ruleForm.workingTimeName == "FULLTIME") {
            this.ruleForm.workingTimeName = "Hành chính";
          }
          if (this.ruleForm.workingTimeName == "MORNING_SHIFT") {
            this.ruleForm.workingTimeName = "Ca sáng";
          }
          if (this.ruleForm.workingTimeName == "AFTERNOON_SHIFT") {
            this.ruleForm.workingTimeName = "Ca chiều";
          }
          var date = new Date();
          var date1 = new Date();
          var startTime = response.data.startTime;
          var subStartTime = startTime.split(":");
          date.setHours(
            Number(subStartTime[0]),
            Number(subStartTime[1]),
            Number(subStartTime[2])
          );
          this.ruleForm.startTime = date;
          var endTime = response.data.endTime;
          var subEndTime = endTime.split(":");
          date1.setHours(
            Number(subEndTime[0]),
            Number(subEndTime[1]),
            Number(subEndTime[2])
          );
          this.ruleForm.endTime = date1;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });

      this.editWorkingTimeDialogVisible = true;
      this.workingTimeId = id;
    },

    getData() {
      WorkingTimeService.getData(this.page, this.pageSize, this.search)
        .then((response) => {
          this.workingTimes = response.data;
          console.log(this.workingTimes);
          for (const key in this.workingTimes) {
            if (Object.hasOwnProperty.call(this.workingTimes, key)) {
              if (this.workingTimes[key].workingTimeName == "FULLTIME") {
                this.workingTimes[key].workingTimeName = "Hành chính";
              }
              if (this.workingTimes[key].workingTimeName == "MORNING_SHIFT") {
                this.workingTimes[key].workingTimeName = "Ca sáng";
              }
              if (this.workingTimes[key].workingTimeName == "AFTERNOON_SHIFT") {
                this.workingTimes[key].workingTimeName = "Ca chiều";
              }
            }
          }
          //   this.page = response.data.pageable.pageNumber;
          //   this.totalItems = response.data.totalElements;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    rangeEndTime() {
      var startTime = new Date(this.ruleForm.startTime);
      var min = startTime.getMinutes();
      startTime.setMinutes(min + 1);
      var timeString = moment(String(startTime)).format("HH:mm:ss");
      return timeString + " - 23:59:59";
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
.manage-holiday .el-form-item__label {
  text-align: left;
}
.manage-holiday .el-form-item__content {
  margin-left: 0px !important;
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
  .manage-holiday .el-col-md-6 {
    width: 108%;
  }

  .manage-holiday .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 992px) {
  .manage-holiday .el-col-md-6 {
    width: 100%;
  }

  .manage-holiday .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 1440px) {
  .manage-holiday .el-col-md-6 {
    width: 23%;
  }

  .manage-holiday .buttons {
    text-align: right;
  }

  .manage-holiday .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1689px) {
  .manage-holiday .el-col-md-6 {
    width: 23%;
  }

  .manage-holiday .buttons {
    text-align: right;
  }

  .manage-holiday .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1920px) {
  .manage-holiday .el-col-md-6 {
    width: 23%;
  }

  .manage-holiday .buttons {
    text-align: right;
  }

  .manage-holiday .div-buttons {
    float: right;
  }
}
</style>

