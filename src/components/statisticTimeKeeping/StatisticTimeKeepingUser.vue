<template>
  <div class="manage-request">
    <h3 class="text-start" style="font-weight: bold">Thống kê chấm công của bạn</h3>
     <hr style="margin-bottom: 2%" />
      <div style="padding-bottom: 20px">
        <div className="" style="width: 100%; margin: auto">
          <el-row :gutter="20">
               <!-- <el-col :md="6" :lg="6" :xl="6">
                  <div class="" style="margin-bottom: 20px">
                    <div><span style="font-weight:bold">Họ và tên: </span> {{ user.name }}</div> 
                    <div><span style="font-weight:bold">Mã nhân viên: </span> {{ user.code }}</div>
                    <div><span style="font-weight:bold">Phòng ban: </span>{{ user.department }}</div>
                  </div>
                </el-col> -->
            <el-col
              :md="8"
              :lg="8"
              :xl="8"
              class=""
              style="margin-bottom: 20px"
            >
              <div >
                 <span>Thời gian</span> &ensp;
                <el-date-picker
                  v-model="value2"
                  type="datetimerange"
                  @change="filterData"
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
</template>

<script>
import moment from "moment";
import TimeKeepingService from "@/services/timeKeeping-service";
export default {
  components: {},
  name: "StaticTimeKeepingUser",
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
      value2: [startDate, endDate],
      name: "",
      department: "",
      year: currentYear,
      month: currentMonth,
      currentDate: date,
      user:{
        name:"",
        code:"",
        department:""
      },
      listAttendanceByUser: [],
      status: 0,
      startDate: startDate,
      endDate: endDate,
      pagePersonalUser: 0,
      totalItemsPersonalUser: 0,
      pageSize: 30,
      search: "",
      date: "",
      fit: "fill",
    };
  },

  created() {
    this.user.name = this.$store.state.auth.user.fullName;
    this.user.code = this.$store.state.auth.user.userCode;
    this.user.department = this.$store.state.auth.user.departmentName;
    this.value1[0] = moment(String(this.value1[0])).format("yyyy-MM-DD");
    this.value1[1] = moment(String(this.value1[1])).format("yyyy-MM-DD");
    this.value2[0] = moment(String(this.value2[0])).format("yyyy-MM-DD");
    this.value2[1] = moment(String(this.value2[1])).format("yyyy-MM-DD");
    this.getDataAttendanceByUser();

  },
  methods: {
      filterData(){
        this.pagePersonalUser = 0;
        this.totalItemsPersonalUser = 0;
        this.getDataAttendanceByUser();
    },
    getDataAttendanceByUser() {
      TimeKeepingService.getListAttendanceByUser(
        this.pagePersonalUser,
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


    disableOneDayAgoDate(date) {
      if (this.isOTBefore) {
        const startWork = new Date();
        startWork.setDate(startWork.getDate() - 1);
        return date < startWork;
      }
    },


    logout() {
      this.$store.dispatch("auth/logout");
      window.location.replace("/login");
      localStorage.removeItem("user");
    },

      handlePersonalUserPageChange(value) {
      this.pagePersonalUser = value - 1;
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