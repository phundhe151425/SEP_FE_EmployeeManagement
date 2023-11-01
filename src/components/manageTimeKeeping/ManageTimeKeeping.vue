<template>
  <div class="manage-request">
    <h3>Quản lý chấm công</h3>
    <hr style="margin-bottom: 5%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto">
        <el-row :gutter="20">
          <el-col :md="6" :lg="6" :xl="6" v-if="isModerator == false">
            <div class="grid-content" style="margin-bottom: 20px">
              <span>Phòng ban</span> &ensp;
              <el-select
                v-model="departmentId"
                @change="getData"
                placeholder="Chọn Phòng ban"
              >
                <el-option value="" label="Tất cả các phòng ban"></el-option>
                <el-option
                  v-for="item in departments"
                  :key="item.department"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :md="6" :lg="6" :xl="6" class="div-buttons" style="margin-bottom: 20px">
            <div class="grid-content div-buttons" >
              <el-date-picker
                v-model="value1"
                @change="hi()"
                type="datetimerange"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                :default-time="['12:00:00']"
                format="dd/MM/yyyy"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div>
          </el-col>
        </el-row>

        <br />
        <div>
          <el-table
            :data="requests"
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
              label="Phòng ban"
              prop="department.name"
              align="center"
            ></el-table-column>
            <el-table-column
              label="Mã nhân viên"
              prop="user.userCode"
              align="center"
            ></el-table-column>
            <el-table-column
              label="Nhân viên"
              prop="user.fullName"
              align="center"
            >
            </el-table-column>

            <el-table-column label="Ngày" prop="createdDate" align="center">
            </el-table-column>
            <el-table-column label="Checkin" prop="createdDate" align="center">
            </el-table-column>
            <el-table-column label="Checkout" prop="createdDate" align="center">
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
  </div>
</template>

<script>
import RequestService from "@/services/request-service";
import DepartmentService from "@/services/department-service";
import moment from "moment";
export default {
  components: {},
  name: "ManageHoliday",
  data() {
    var date = new Date();
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth() + 1;
    var startDate = new Date(currentYear, date.getMonth(), 1);

    const get_day_of_month = (year, month) => {
      return new Date(year, month, 0).getDate();
    };
    var lastDateOfMonth = get_day_of_month(currentYear, currentMonth);

    var endDate = new Date(currentYear, date.getMonth(), lastDateOfMonth);

    return {
      value1: [startDate, endDate],
      requestCategoryId: "",
      type: "manage",
      departmentOfModerator: "",
      isModerator: false,
      name: "",
      department: "",
      year: currentYear,
      month: currentMonth,
      currentDate: date,
      requests: [],
      requestTypes: [],
      requestCategories: [],
      requestId: "",
      requestTypeId: "",
      status: 0,
      departments: [],
      departmentId: "",
      startDate: startDate,
      endDate: endDate,
      page: 0,
      pageSize: 5,
      search: "",
      date: "",
      totalItems: 0,
      fit: "fill",
      createRequestDialogVisible: false,
      createOTRequestDialogVisible: false,
      createTimeKeepingRequestDialogVisible: false,
      declineRequestDialogVisible: false,
    };
  },

  created() {
    this.startDate = moment(String(this.startDate)).format("yyyy-MM-DD");
    this.endDate = moment(String(this.endDate)).format("yyyy-MM-DD");
    this.getData();
    this.getAllDepartment();
    this.getAllRequestCategory();
    this.name = this.$store.state.auth.user.fullName;
    this.department = this.$store.state.auth.user.departmentName;
  },
  methods: {
    hi() {
      console.log(this.value1[0]);
    },
    getData() {
      console.log(this.startDate);
      console.log(this.endDate);
      if (this.$store.state.auth.user.roles[0] === "ROLE_MODERATOR") {
        this.isModerator = true;
        this.departmentOfModerator = this.$store.state.auth.user.departmentName;
        this.departmentId = this.$store.state.auth.user.departmentId;
      }
      RequestService.getData(
        this.page,
        this.pageSize,
        this.search,
        this.status,
        this.departmentId,
        this.startDate,
        this.endDate
      )
        .then((response) => {
          this.requests = response.data.content;
          console.log(this.requests);
          for (const key in this.requests) {
            if (Object.hasOwnProperty.call(this.requests, key)) {
              this.requests[key].createdDate = moment(
                String(this.requests[key].createdDate)
              ).format("DD/MM/yyyy");
            }
          }
          this.page = response.data.pageable.pageNumber;
          this.totalItems = response.data.totalElements;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
    },

    getAllDepartment() {
      DepartmentService.getAllDepartment()
        .then((response) => {
          this.departments = response.data;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
    },

    getAllRequestCategory() {
      RequestService.getRequestCategories()
        .then((response) => {
          this.requestCategories = response.data.content;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
    },

    acceptRequest(id) {
      this.requestStatus.status = 2;
      RequestService.changeStatus(id, this.requestStatus).then(() => {
        this.$notify.success({
          message: "Yêu cầu đã được chấp nhận",
          title: "Success",
          timer: 2000,
          timerProgressBar: true,
        });
        this.getData();
      });
    },

    declineRequest(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.declineRequestDialogVisible = false;
          this.requestStatus.status = 3;
          RequestService.changeStatus(this.requestId, this.requestStatus).then(
            () => {
              this.$notify.success({
                message: "Yêu cầu đã bị từ chối",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
              this.getData();
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.startTime = moment(
            String(this.ruleForm.startTime)
          ).format("HH:mm:ss");
          this.ruleForm.endTime = moment(String(this.ruleForm.endTime)).format(
            "HH:mm:ss"
          );
          var request = {
            endDate: this.ruleForm.endDate,
            requestTitle: null,
            requestContent: this.ruleForm.requestContent,
            startDate: this.ruleForm.startDate,
            requestTypeId: this.ruleForm.requestTypeId,
            startTime: this.ruleForm.startTime,
            endTime: this.ruleForm.endTime,
          };
          RequestService.save(request).then(() => {
            this.createRequestDialogVisible = false;
            this.createOTRequestDialogVisible = false;
            this.createTimeKeepingRequestDialogVisible = false;
            this.$notify.success({
              message: "Tạo đề xuất thành công",
              title: "Success",
              timer: 2000,
              timerProgressBar: true,
            });
            this.getData();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelCreateForm() {
      this.clearField();
      this.ruleForm.requestTypeId = "";
      this.createRequestDialogVisible = false;
      this.createOTRequestDialogVisible = false;
      this.createTimeKeepingRequestDialogVisible = false;
    },

    cancelDeclineRequestForm(formName) {
      this.$refs[formName].resetFields();
      this.declineRequestDialogVisible = false;
    },

    chooseCategory(categotyId) {
      RequestService.getRequestTypes(categotyId)
        .then((response) => {
          this.requestTypes = response.data.content;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
      this.isOT = false;
      this.isRest = false;
      this.isPersonalWork = false;
      this.isForgetTimeKeeping = false;
      this.ruleForm.numberRestDay = 0;
      this.isRestBySlot = false;
      this.isRestByDay = false;
      this.isWorkFromHome = false;
      this.isBusinessTravel = false;
      this.ruleForm.slotId = "";
      this.ruleForm.requestTypeId = "";
      this.clearField();
      if (categotyId == 1) {
        this.createRequestDialogVisible = true;
        this.createOTRequestDialogVisible = false;
        this.createTimeKeepingRequestDialogVisible = false;
      } else if (categotyId == 2) {
        this.createOTRequestDialogVisible = true;
        this.createRequestDialogVisible = false;
        this.isOT = true;
        this.createTimeKeepingRequestDialogVisible = false;
      } else if (categotyId == 3) {
        this.createTimeKeepingRequestDialogVisible = true;
        this.createRequestDialogVisible = false;
        this.createOTRequestDialogVisible = false;
      }
    },

    showDeclineRequestDialog(id) {
      this.requestId = id;
      this.requestStatus.note = "Đề xuất của bạn bị từ chối!";
      this.declineRequestDialogVisible = true;
      this.createRequestDialogVisible = false;
      this.createOTRequestDialogVisible = false;
      this.createTimeKeepingRequestDialogVisible = false;
    },

    handleChange() {
      this.clearField();
      this.ruleForm.slotId = "";
      if (this.ruleForm.numberRestDay >= 1) {
        this.ruleForm.slotId = 1;
        this.isRestBySlot = false;
        this.isRestByDay = true;
        this.resetField();
      } else if (
        this.ruleForm.numberRestDay < 1 &&
        this.ruleForm.numberRestDay > 0
      ) {
        this.isRestBySlot = true;
        this.isRestByDay = false;
        this.resetField();
      } else {
        this.isRestBySlot = false;
        this.isRestByDay = false;
      }
    },

    selectType(typeId) {
      this.clearField();
      this.isOTBefore = false;
      if (typeId == 5) {
        this.isPersonalWork = true;
        this.isRest = false;
        this.isRestBySlot = false;
        this.isRestByDay = false;
      } else if (typeId == 1 || typeId == 2) {
        this.isRest = true;
        this.isPersonalWork = false;
        this.ruleForm.numberRestDay = 0;
        this.isRestBySlot = false;
        this.isRestByDay = false;
        this.ruleForm.slotId = "";
      } else if (typeId == 3) {
        this.isOTBefore = true;
      } else if (typeId == 4) {
        this.isForgetTimeKeeping = true;
        this.isWorkFromHome = false;
        this.isBusinessTravel = false;
        this.ruleForm.slotId = "";
        this.resetField();
      } else if (typeId == 8) {
        this.isForgetTimeKeeping = false;
        this.isBusinessTravel = false;
        this.isWorkFromHome = true;
        this.ruleForm.slotId = 1;
        this.resetField();
      } else if (typeId == 10) {
        this.isForgetTimeKeeping = false;
        this.isWorkFromHome = false;
        this.isBusinessTravel = true;
        this.ruleForm.slotId = 1;
        this.resetField();
      }
    },

    resetField() {
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "startDate")
        .resetField();
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "endDate")
        .resetField();
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "startTime")
        .resetField();
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "endTime")
        .resetField();
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "requestContent")
        .resetField();
    },

    clearField() {
      this.ruleForm.startDate = "";
      this.ruleForm.endDate = "";
      this.ruleForm.startTime = "";
      this.ruleForm.endTime = "";
      this.ruleForm.requestContent = "";
    },

    disableOneDayAgoStartDate(date) {
      const startWork = new Date();
      startWork.setDate(startWork.getDate() - 1);
      return date < startWork;
    },

    disableOneDayAgoEndDate(date) {
      const startWork = new Date(this.ruleForm.startDate);
      startWork.setDate(startWork.getDate() - 1);
      return date < startWork;
    },

    disableOneDayAgoDate(date) {
      if (this.isOTBefore) {
        const startWork = new Date();
        startWork.setDate(startWork.getDate() - 1);
        return date < startWork;
      }
    },

    logout() {
      this.$store.dispatch("auth/logout");
      window.location.replace("http://localhost:2001/login");
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
.manage-request .el-date-editor.el-input {
  width: 60% !important;
}

.manage-request .el-form-item__label {
  text-align: left;
}
.manage-request .el-form-item__content {
  margin-left: 0px !important;
}

.manage-request .el-form-item {
  display: flex;
  flex-direction: column;
}

.manage-request .avatar {
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

.manage-request .el-table .tt1 {
  cursor: default;
  color: white;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.manage-request .el-table .tt2 {
  cursor: default;
  color: white;
  background-color: #ed9696;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.manage-request .el-table .tt3 {
  cursor: default;
  color: white;
  background-color: #f8cbad;
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
  .el-col-md-6 {
    width: 108%;
  }

  .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 992px) {
  .el-col-md-6 {
    width: 100%;
  }

  .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 1440px) {
  .el-col-md-6 {
    width: 23%;
  }

  .buttons {
    text-align: right;
  }

  .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1689px) {
  .el-col-md-6 {
    width: 23%;
  }

  .buttons {
    text-align: right;
  }

  .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1920px) {
  .el-col-md-6 {
    width: 23%;
  }

  .buttons {
    text-align: right;
  }

  .div-buttons {
    float: right;
  }
}
</style>