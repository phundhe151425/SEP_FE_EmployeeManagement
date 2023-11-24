<template>
  <div class="request-detail">
    <router-link
      v-if="type === 'manage'"
      style="text-decoration: none; font-size: 18px; margin-left: 5%"
      :to="'/manageRequest'"
    >
      Quản lý đề xuất</router-link
    >
    <router-link
      v-else
      style="text-decoration: none; font-size: 18px; margin-left: 5%"
      :to="'/myRequest'"
    >
      Danh sách đề xuất</router-link
    >
    <h1 style="margin-top: 2%; margin-left: 5%; margin-bottom: 2%;">
      {{ request.requestTitle }}
    </h1>
    <div style="display: flex">
      <div style="display: flex; width:24%; margin-left: 3%;">
        <label
          style="
            margin-bottom: 2%;
            margin-left: 5%;
            font-size: 20px;
            margin-right: 1.5%;
          "
        >
          Trạng thái:
        </label>

        <span
          ><button v-if="request.status == 1" class="tt3">
            {{ status }}
          </button>
          <button v-else-if="request.status == 2" class="tt1">
            {{ status }}
          </button>
          <button v-else class="tt2">
            {{ status }}
          </button></span
        >
      </div>
      <div v-if="type==='manage'&&request.status == 1" style="margin-left:5%">
        <el-row >
          <span>Thao tác: </span>
          <el-button type="success" @click="acceptRequest(request.id)" style="padding: 6px;"
            >Chấp thuận</el-button
          >
          <el-button type="danger" @click="showDeclineRequestDialog(request.id)" style="padding: 6px;"
            >Từ chối</el-button
          >
        </el-row>
      </div>
    </div>
    <h4 style="margin-left: 5%; margin-top: 2%">THÔNG TIN ĐỀ XUẤT</h4>
    <hr style="margin-bottom: 2%; margin-left: 5%; width: 80%" />
    <div class="row" style="display: flex">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 request1">
        <div class="infor">
          <label class="label" for="Nhân viên">Nhân viên: </label>
          <span class="detail">{{ request.user.fullName }}</span>
        </div>
        <div class="infor">
          <label class="label" for="Mã Nhân viên">Mã Nhân viên: </label
          ><span class="detail">{{ request.user.userCode }}</span>
        </div>
        <div class="infor">
          <label class="label" for="">Phòng ban: </label
          ><span class="detail">{{ request.department.name }}</span>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 request">
        <div class="infor">
          <label class="label" for="">Loại đề xuất: </label
          ><span class="detail">{{ request.requestType.requestTypeName }}</span>
        </div>
        <div class="infor">
          <label class="label" for="Mã Nhân viên">Thời gian tạo: </label
          ><span class="detail">{{ request.createdDate }}</span>
        </div>

        <div v-if="isOT">
          <div class="infor">
            <label class="label" for="">Ngày thực hiện: </label
            ><span class="detail">{{ request.startDate }}</span>
          </div>
          <div class="infor">
            <label class="label" for="">Thời gian thực hiện: </label
            ><span class="detail"
              >{{ request.startTime }} - {{ request.endTime }}</span
            >
          </div>
        </div>
        <div v-else-if="isForgetTimeKeeping">
          <div class="infor">
            <label class="label" for="">Ngày quên: </label
            ><span class="detail">{{ request.startDate }}</span>
          </div>
          <div class="infor">
            <label class="label" for="">Thời gian: </label
            ><span class="detail"
              >{{ request.startTime }} - {{ request.endTime }}</span
            >
          </div>
        </div>
        <div v-else-if="isBusinessTravel || isWorkFromHome">
          <div class="infor">
            <label class="label" for="">Thời gian thực hiện: </label
            ><span class="detail"
              >{{ request.startDate }} - {{ request.startTime }}</span
            >
          </div>
          <div class="infor">
            <label class="label" for="">Thời gian kết thúc: </label
            ><span class="detail"
              >{{ request.startDate }} - {{ request.endTime }}</span
            >
          </div>
        </div>
        <div v-else>
          <div class="infor">
            <label class="label" for="">Thời gian thực hiện: </label
            ><span class="detail"
              >{{ request.startDate }} - {{ request.startTime }}</span
            >
          </div>
          <div class="infor">
            <label class="label" for="">Thời gian kết thúc: </label
            ><span class="detail"
              >{{ request.startDate }} - {{ request.endTime }}</span
            >
          </div>
        </div>

        <div class="infor1">
          <label class="label"  for=""
            >Nội dung đề xuất:
          </label>
          <p class="detail">{{ request.requestContent }}</p>
        </div>
      </div>
    </div>

    <h4 style="margin-left: 5%">Người xử lý đơn</h4>
    <hr style="margin-bottom: 2%; width: 40%; margin-left: 5%" />
    <div v-if="accept">
      <div class="row" style="display: flex">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 request">
          <div style="display: flex">
            <i
              class="el-icon-time"
              style="margin-right: 4%; font-size: 20px"
            ></i>
            <h5>Đê xuất đã xử lý vào lúc: {{ handleTime }}</h5>
          </div>
        </div>
      </div>
      <div class="row" style="display: flex">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 request">
          <div style="display: flex">
            <i
              class="el-icon-user"
              style="margin-right: 4%; font-size: 20px"
            ></i>
            <h5>Họ và tên người xử lý: {{ request.handlerName }}</h5>
          </div>
        </div>
      </div>
      <div class="row" style="display: flex">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 request">
          <div style="display: flex">
            <i
              class="el-icon-s-cooperation"
              style="margin-right: 4%; font-size: 20px"
            ></i>
            <h5>Chức vụ người xử lý: {{ request.handlerPosition }}</h5>
          </div>
        </div>
      </div>
      <div class="row" style="display: flex">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 request">
          <div style="display: flex">
            <i
              class="el-icon-tickets"
              style="margin-right: 4%; font-size: 20px"
            ></i>
            <h5 style="margin-bottom: 20%">Ghi chú: {{ request.note }}</h5>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="row" style="display: flex">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 request">
          <div style="display: flex">
            <h5 style="margin-bottom: 20%">Hiện tại đơn chưa được xử lý</h5>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="declineRequestDialogVisible"
      width="50%"
      title="Ghi chú"
      left
    >
      <el-form
        id="formCreate"
        :model="requestStatus"
        :rules="noteRules"
        ref="requestStatus"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập ghi chú" prop="note">
              <el-input
                type="textarea"
                v-model="requestStatus.note"
                name="requestContent"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn btn-outline-danger"
                  type="primary"
                  style="width: 90%"
                  @click="cancelDeclineRequestForm('requestStatus')"
                  >Hủy</el-button
                >
              </el-form-item>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn btn-success"
                  type="primary"
                  style="width: 90%"
                  @click="declineRequest('requestStatus')"
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
// import DataService from "../services/DataService";
import DataService from "../../services/user-service";
import RequestService from "@/services/request-service";
import moment from "moment";
export default {
  name: "edit-profile",
  data() {
    return {
      isOT: false,
      isForgetTimeKeeping: false,
      isWorkFromHome: false,
      isBusinessTravel: false,
      handleTime: "",
      type: "",
      id: "",
      requestStatus: {
        status: "",
        note: "",
      },
      accept: false,
      status: "",
      request: {},
      dateFormat: "",
      currentUser: null,
      ruleForm: {
        fullName: "",
        phone: "",
        address: "",
        birthDay: "",
        gender: 0,
      },
      imageUrl: "",
      declineRequestDialogVisible: false,
      requestId: "",
    };
  },
  methods: {
    getUser(id) {
      RequestService.getRequest(id)
        .then((response) => {
          this.request = response.data;

          if (this.request.status === 1) {
            this.status = "Chờ phê duyệt";
          } else if (this.request.status === 2) {
            this.status = "Đã chấp thuận";
            this.accept = true;
          } else {
            this.status = "Đã từ chối";
            this.accept = true;
          }
          this.request.createdDate = moment(
            String(this.request.createdDate)
          ).format("DD/MM/yyyy");
          this.request.startDate = moment(
            String(this.request.startDate)
          ).format("DD/MM/yyyy");
          if (this.request.requestTypeId == 4 || this.request.requestTypeId == 5) {
            this.isOT = true;
            this.isForgetTimeKeeping = false;
            this.isWorkFromHome = false;
            this.isBusinessTravel = false;
          } else if (this.request.requestTypeId == 6) {
            this.isOT = false;
            this.isForgetTimeKeeping = true;
            this.isWorkFromHome = false;
            this.isBusinessTravel = false;
          } else if (
            this.request.requestTypeId == 7 ||
            this.request.requestTypeId == 8
          ) {
            this.isWorkFromHome = true;
            this.isBusinessTravel = true;
            this.isOT = false;
            this.isForgetTimeKeeping = false;
          }
          if (this.request.updatedDate != null) {
            this.handleTime = moment(String(this.request.updatedDate)).format(
              "DD/MM/yyyy HH:mm:ss"
            );
          }
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
        this.getUser(id);
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
              this.getUser(this.requestId);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    showDeclineRequestDialog(id) {
      this.requestId = id;
      this.requestStatus.note = "Đề xuất của bạn bị từ chối!";
      this.declineRequestDialogVisible = true;
    },

    cancelDeclineRequestForm(formName) {
      this.$refs[formName].resetFields();
      this.declineRequestDialogVisible = false;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.dateFormat = this.ruleForm.birthDay.toLocaleDateString();
        this.ruleForm.birthDay = moment(String(this.dateFormat)).format(
          "yyyy-MM-DD"
        );
        if (valid) {
          DataService.updateProfile(this.currentUser.id, this.ruleForm)
            .then((response) => {
              console.log(response.data);
            })
            .catch((e) => {
              console.log(e);
            });

          this.$router.push("/profile");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    logout() {
      this.$store.dispatch("auth/logout");
      window.location.replace("http://localhost:2001/login");
      localStorage.removeItem("user");
    },
  },
  computed: {},
  beforeMount() {
    this.id = this.$store.state.auth.user.id;
  },
  mounted() {
    this.getUser(this.$route.params.id);
    this.type = this.$route.params.type;
    // this.retrieveTutorials();
    // this.message = '';
  },
};
</script>

<style>
.request-detail .tt1 {
  cursor: default;
  color: white;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.request-detail .tt2 {
  cursor: default;
  color: white;
  background-color: #ed9696;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}
.request-detail .tt3 {
  cursor: default;
  color: white;
  background-color: #f8cbad;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}
.request-detail .row {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.request-detail .infor {

  margin-bottom: 5%;
}

.request-detail .infor1 {
  display: flex;
  margin-bottom: 5%;
}

.request-detail .request1 .label {
  width: 25%;
  /* border: solid 1px black; */
  font-weight: bold;
  font-size: 18px;
}
.request-detail .infor1 .label{
   width: 38%;
}

.request-detail .label {
  width: 32%;
  /* border: solid 1px black; */
  font-weight: bold;
  font-size: 18px;
}

.request-detail .detail {
  width: 80%;
  /* font-weight: 10; */
  font-size: 18px;
}
.request-detail .el-form-item__label {
  text-align: left;
}

.request-detail .left .el-form-item__label {
  margin-left: 22%;
}
.request-detail .el-form-item {
  display: flex;
  flex-direction: column;
}

/* .mt-3{
    margin-top: 10% !important;
} */

.request-detail .el-form-item__content {
  margin-left: 0px !important;
}

.request-detail .el-input {
  width: 70% !important;
}

.request-detail .left .el-input {
  margin-left: 22%;
}
.request-detail .el-radio-group {
  margin-left: 22%;
}
.request-detail .left .el-form-item__error {
  margin-left: 22%;
}
.request-detail .img {
  margin-left: 22%;
}

/* .request-detail .btn {
  border-radius: 15px;
  color: white;
  width: 20%;
  margin-top: 100px;
  margin-left: 49%;
  background-color: #75c4c0;
} */
</style>