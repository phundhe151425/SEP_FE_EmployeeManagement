<template>
  <div class="manage-request">
    <h3 class="text-start" style="font-weight: bold">Thống kê chấm công</h3>
    <div v-if="isAdmin || isModerator">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Toàn bộ" name="first">
          <div style="padding-bottom: 20px">
            <div className="" style="width: 100%; margin: auto">
              <el-row :gutter="20">
                <el-col :md="6" :lg="6" :xl="6" v-if="isModerator == false">
                  <div class="" style="margin-bottom: 20px">
                    <span>Phòng ban</span> &ensp;
                    <el-select
                      v-model="departmentId"
                      @change="getData"
                      placeholder="Chọn Phòng ban"
                    >
                      <el-option
                        value=""
                        label="Tất cả các phòng ban"
                      ></el-option>
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
                <el-col :md="6" :lg="6" :xl="6" v-else>
                  <div class="" style="margin-bottom: 20px">
                    <span>Phòng ban: </span> &ensp;
                    <span>{{ departmentOfModerator }}</span>
                  </div>
                </el-col>
                <el-col
                  :md="6"
                  :lg="6"
                  :xl="6"
                  class="div-buttons"
                  style="margin-bottom: 20px"
                >
                  <div class="div-buttons">
                    <el-date-picker
                      v-model="value1"
                      type="datetimerange"
                      @change="getData"
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
                    prop="department"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    label="Mã nhân viên"
                    prop="employeeCode"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    label="Nhân viên"
                    prop="employeeName"
                    align="center"
                  >
                  </el-table-column>

                  <el-table-column label="Ngày" prop="dateLog" align="center">
                  </el-table-column>
                  <el-table-column label="Checkin" prop="timeIn" align="center">
                  </el-table-column>
                  <el-table-column
                    label="Checkout"
                    prop="timeOut"
                    align="center"
                  >
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
        </el-tab-pane>
        <el-tab-pane label="Cá nhân" name="second">
          <div style="padding-bottom: 20px">
            <div className="" style="width: 100%; margin: auto">
              <el-row :gutter="20">
                <el-col
                  :md="6"
                  :lg="6"
                  :xl="6"
                  class="div-buttons"
                  style="margin-bottom: 20px"
                >
                  <div class="div-buttons">
                    <el-date-picker
                      v-model="value2"
                      type="datetimerange"
                      @change="getDataAttendanceByUser"
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
                  :data="listAttendanceByUser"
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
                    prop="department"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    label="Mã nhân viên"
                    prop="employeeCode"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    label="Nhân viên"
                    prop="employeeName"
                    align="center"
                  >
                  </el-table-column>

                  <el-table-column label="Ngày" prop="dateLog" align="center">
                  </el-table-column>
                  <el-table-column label="Checkin" prop="timeIn" align="center">
                  </el-table-column>
                  <el-table-column
                    label="Checkout"
                    prop="timeOut"
                    align="center"
                  >
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination
                class="text-end"
                background
                layout="prev, pager, next"
                :total="totalItemsPersonalUser"
                :page-size="pageSize"
                @current-change="handlePersonalUserPageChange"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else>
      <div style="padding-bottom: 20px">
        <div className="" style="width: 100%; margin: auto">
          <el-row :gutter="20">
            <el-col
              :md="6"
              :lg="6"
              :xl="6"
              class="div-buttons"
              style="margin-bottom: 20px"
            >
              <div class="div-buttons">
                <el-date-picker
                  v-model="value2"
                  type="datetimerange"
                  @change="getDataAttendanceByUser"
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
              :data="listAttendanceByUser"
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
                prop="department"
                align="center"
              ></el-table-column>
              <el-table-column
                label="Mã nhân viên"
                prop="employeeCode"
                align="center"
              ></el-table-column>
              <el-table-column
                label="Nhân viên"
                prop="employeeName"
                align="center"
              >
              </el-table-column>

              <el-table-column label="Ngày" prop="dateLog" align="center">
              </el-table-column>
              <el-table-column label="Checkin" prop="timeIn" align="center">
              </el-table-column>
              <el-table-column label="Checkout" prop="timeOut" align="center">
              </el-table-column>
            </el-table>
          </div>
             <el-pagination
                class="text-end"
                background
                layout="prev, pager, next"
                :total="totalItemsPersonalUser"
                :page-size="pageSize"
                @current-change="handlePersonalUserPageChange"
              >
              </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DepartmentService from "@/services/department-service";
import moment from "moment";
import TimeKeepingService from "@/services/timeKeeping-service";
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
      activeName: "first",
      value1: [startDate, endDate],
      value2: [startDate, endDate],
      requestCategoryId: "",
      type: "manage",
      departmentOfModerator: "",
      isModerator: false,
      isAdmin: false,
      name: "",
      department: "",
      year: currentYear,
      month: currentMonth,
      currentDate: date,
      requests: [],
      listAttendanceByUser: [],
      status: 0,
      departments: [],
      departmentId: "",
      startDate: startDate,
      endDate: endDate,
      pagePersonalUser: 0,
      totalItemsPersonalUser: 0,
      page: 0,
      pageSize: 30,
      search: "",
      date: "",
      totalItems: 0,
      fit: "fill",
    };
  },

  created() {
    this.value1[0] = moment(String(this.value1[0])).format("yyyy-MM-DD");
    this.value1[1] = moment(String(this.value1[1])).format("yyyy-MM-DD");
    this.value2[0] = moment(String(this.value2[0])).format("yyyy-MM-DD");
    this.value2[1] = moment(String(this.value2[1])).format("yyyy-MM-DD");
    if (this.$store.state.auth.user.roles[0] === "ROLE_ADMIN") {
      this.getData();
      this.getAllDepartment();
      this.isAdmin = true;
    } else if (this.$store.state.auth.user.roles[0] === "ROLE_MODERATOR") {
      this.isModerator = true;
       this.departmentOfModerator = this.$store.state.auth.user.departmentName;
        this.departmentId = this.$store.state.auth.user.departmentId;
      this.getData();
    }
    this.getDataAttendanceByUser();

    this.name = this.$store.state.auth.user.fullName;
    this.department = this.$store.state.auth.user.departmentName;
  },
  methods: {
    getData() {
      TimeKeepingService.getData(
        this.page,
        this.pageSize,
        this.departmentId,
        this.value1[0],
        this.value1[1]
      )
        .then((response) => {
          this.requests = response.data.content;
          console.log(response.data);
          for (const key in this.requests) {
            if (Object.hasOwnProperty.call(this.requests, key)) {
              this.requests[key].dateLog = moment(
                String(this.requests[key].dateLog)
              ).format("DD/MM/yyyy");
            }
          }
          this.page = response.data.pageable.pageNumber;
          this.totalItems = response.data.totalElements;
        })
        .catch((e) => {
          if (e.response.status == 401) {
            this.logout();
          }
          console.log(e);
        });
    },

    getDataAttendanceByUser() {
      TimeKeepingService.getListAttendanceByUser(
        this.page,
        this.pageSize,
        this.value2[0],
        this.value2[1]
      )
        .then((response) => {
          this.listAttendanceByUser = response.data.content;
          console.log(response.data.content);
          for (const key in this.listAttendanceByUser) {
            if (Object.hasOwnProperty.call(this.listAttendanceByUser, key)) {
              this.listAttendanceByUser[key].dateLog = moment(
                String(this.listAttendanceByUser[key].dateLog)
              ).format("DD/MM/yyyy");
            }
          }
          this.pagePersonalUser = response.data.pageable.pageNumber;
          this.totalItemsPersonalUser =  response.data.totalElements;
        })
        .catch((e) => {
          if (e.response.status == 401) {
            this.logout();
          }
          console.log(e);
        });
    },

    getAllDepartment() {
      DepartmentService.getAllDepartment()
        .then((response) => {
          this.departments = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    disableOneDayAgoDate(date) {
      if (this.isOTBefore) {
        const startWork = new Date();
        startWork.setDate(startWork.getDate() - 1);
        return date < startWork;
      }
    },

    handleClick(tab) {
      if (tab.name == "first") {
        this.page = 0;
        this.getData();
        this.getAllDepartment();
      } else {
        this.page = 0;
        this.getDataAttendanceByUser();
      }
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

      handlePersonalUserPageChange(value) {
      this.page = value - 1;
      this.getDataAttendanceByUser();
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
  .manage-request .el-col-md-6 {
    width: 108%;
  }

  .manage-request .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 992px) {
  .manage-request .el-col-md-6 {
    width: 100%;
  }

  .manage-request .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 1440px) {
  .manage-request .el-col-md-6 {
    width: 23%;
  }

  .manage-request .buttons {
    text-align: right;
  }

  .manage-request .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1689px) {
  .manage-request .el-col-md-6 {
    width: 23%;
  }

  .manage-request .buttons {
    text-align: right;
  }

  .manage-request .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1920px) {
  .manage-request .el-col-md-6 {
    width: 23%;
  }

  .manage-request .buttons {
    text-align: right;
  }

  .manage-request .div-buttons {
    float: right;
  }
}
</style>