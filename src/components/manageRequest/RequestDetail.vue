<template>
  <div class="request-detail">
    <router-link
      v-if="type === 'manage'"
      style="text-decoration: none; font-size: 18px; margin-left: 2%"
      :to="'/manageRequest'"
    >
      <i class="el-icon-back"></i> Quản lý đề xuất
    </router-link>
    <router-link
      v-else
      style="text-decoration: none; font-size: 18px; margin-left: 2%"
      :to="'/myRequest'"
    >
     <i class="el-icon-back"></i> Danh sách đề xuất
    </router-link>
 
    <div style="display: flex">
      <div style="display: flex; width: 24%; margin-left: 3%; margin-top: 2%;">
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
          <button v-else-if="request.status == 3" class="tt2">
            {{ status }}
          </button>
          <button v-else class="tt4">
            {{ status }}
          </button></span
        >
      </div>
      <div
        v-if="type === 'manage' && request.status == 1"
        style="margin-left: 5%; margin-top: 2%;"
      >
        <el-row>
          <span>Thao tác: </span>
          <el-button
            type="success"
            @click="acceptRequest(request.id)"
            style="padding: 6px"
            >Chấp thuận
          </el-button>
          <el-button
            type="danger"
            @click="showDeclineRequestDialog(request.id)"
            style="padding: 6px"
            >Từ chối
          </el-button>
        </el-row>
      </div>
      <div
        v-else-if="type === 'list' && request.status == 1"
        style="margin-left: 5%; margin-top: 2%;"
      >
        <el-row>
          <span>Thao tác: </span>
          <el-button
            type="danger"
            @click="showCancelRequestDialog(request.id)"
            style="padding: 6px"
            >Hủy đề xuất
          </el-button>
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
              >{{ request.endDate }} - {{ request.endTime }}</span
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
              >{{ request.endDate }} - {{ request.endTime }}</span
            >
          </div>
        </div>

        <div class="infor1">
          <label class="label" for="">Nội dung đề xuất: </label>
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
      :visible.sync="cancelRequestDialogVisible"
      width="40%"
      title="Hủy đề xuất"
      left
    >
      <el-form
        id="formDelete"
        label-width="200px"
        class="demo-ruleForm"
      >
        <p style="text-align: center">Xác nhận hủy đơn đề xuất này!</p>

        <div class="row" style="margin-top: 20px">
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3"></div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <el-form-item>
              <el-button
                class="btn"
                style="width: 100%; background-color: #ed9696; color: white"
                @click="cancelRequestDialogVisible = false"
                >Huỷ
              </el-button>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <el-form-item>
              <el-button
                class="btn"
                style="width: 100%; background-color: #75c4c0; color: white"
                @click="acceptCancel()"
                >Xác nhận
              </el-button>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3"></div>
        </div>
      </el-form>
    </el-dialog>
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
           <h4 style="text-align:center; font-weight: bold">Từ chối đề xuất</h4>
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
                  class="btn"
                  type="primary"
                 style="width: 90%; background-color: #ed9696; color: white"
                  @click="cancelDeclineRequestForm('requestStatus')"
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
                  @click="declineRequest('requestStatus')"
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
// import DataService from "../services/DataService";
// import DataService from "../../services/user-service";
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
      requestCancel: {
        status: ""
      },
      accept: false,
      status: "",
      request: {
      },
      dateFormat: "",
      currentUser: null,
      noteRules: {
        note: [
          {
            required: true,
            message: "Vui lòng nhập nọi dung ghi chú!",
            trigger: "blur",
          },
          {
            min: 1,
            max: 255,
            message: "Nội dung ghi chú từ 1 đến 255 kí tự",
            trigger: "blur",
          },
        ],
      },
      imageUrl: "",
      cancelRequestDialogVisible: false,
      declineRequestDialogVisible: false,
      requestId: "",
    };
  },
  methods: {
    getRequest(id) {
      RequestService.getRequest(id)
        .then((response) => {
          this.request = response.data;
          if (this.request.status === 1) {
            this.status = "Chờ phê duyệt";
          } else if (this.request.status === 2) {
            this.status = "Đã chấp thuận";
            this.accept = true;
          } else if (this.request.status === 3) {
            this.status = "Đã từ chối";
            this.accept = true;
          } else {
            this.status = "Đã hủy";
          }
          this.request.createdDate = moment(
            String(this.request.createdDate)
          ).format("DD/MM/yyyy");
          this.request.startDate = moment(
            String(this.request.startDate)
          ).format("DD/MM/yyyy");
          this.request.endDate = moment(String(this.request.endDate)).format(
            "DD/MM/yyyy"
          );
          if (
            this.request.requestTypeId == 4 ||
            this.request.requestTypeId == 5
          ) {
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
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    acceptRequest(id) {
      this.requestStatus.status = 2;
      RequestService.changeStatus(id, this.requestStatus)
        .then(() => {
          this.$notify.success({
            message: "Yêu cầu đã được chấp nhận",
            title: "Success",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getRequest(id);
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    declineRequest(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.declineRequestDialogVisible = false;
          this.requestStatus.status = 3;
          RequestService.changeStatus(this.requestId, this.requestStatus)
            .then(() => {
              this.$notify.success({
                message: "Yêu cầu đã bị từ chối",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
              this.getRequest(this.requestId);
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

    showCancelRequestDialog(id) {
      this.requestId = id;
      this.cancelRequestDialogVisible = true;
      this.declineRequestDialogVisible = false;
    },

    acceptCancel() {
      this.cancelRequestDialogVisible = false;
      this.requestCancel.status = 4;
      RequestService.updateRequest(this.requestId, this.requestCancel)
        .then(() => {
          this.$notify.success({
            message: "Yêu cầu đã được hủy",
            title: "Success",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getRequest(this.requestId);
        })
        .catch((e) => {
           console.log(e.response);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    showDeclineRequestDialog(id) {
      this.requestId = id;
      this.requestStatus.note = "Đề xuất của bạn bị từ chối!";
      this.declineRequestDialogVisible = true;
      this.cancelRequestDialogVisible = false;
    },

    cancelDeclineRequestForm(formName) {
      this.$refs[formName].resetFields();
      this.declineRequestDialogVisible = false;
    },

    logout() {
      this.$store.dispatch("auth/logout");
      window.location.replace("/login");
      localStorage.removeItem("user");
    },
  },
  computed: {},
  beforeMount() {
    this.id = this.$store.state.auth.user.id;
  },
  mounted() {
    this.getRequest(this.$route.params.id);
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
  background-color: #f46c6c;
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

.request-detail .tt4 {
  cursor: default;
  color: white;
  background-color: #ed9696;
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

.request-detail .infor1 .label {
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