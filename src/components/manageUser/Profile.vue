<template>
  <div>
    <div class="infor">
      <h4 style="text-align: center">Thông tin nhân viên</h4>
    </div>
    <div class="container">
      <div class="profile">
        <div class="row">
          <div class="col-xs-12 col-md-5">
            <img
              v-if="currentUser.userImage != null"
              class="img"
              :src="
                `http://localhost:2000/api/file/avatar/` + currentUser.userImage
              "
            />
            <img v-else class="img" src="..\src\assets\images\avatar.jpg" />
          </div>
          <div class="col-xs-12 col-md-7">
            <div class="detail" v-if="currentUser != null">
              <div class="item">
                <label style="width: 30%">Họ và tên</label>
                <p style="overflow: auto">{{ currentUser.fullName }}</p>
              </div>
              <div class="item">
                <label style="width: 40%">Mã nhân viên</label>
                <p>{{ currentUser.userCode }}</p>
              </div>
              <div class="item">
                <label style="width: 30%">Bộ phận</label>
                <p>{{ currentUser.department.name }}</p>
              </div>
              <div class="item">
                <label style="width: 30%">Email</label>
                <p>{{ currentUser.email }}</p>
              </div>
              <!-- <div class="item">
                <label>Loại tài khoản</label>
                <p>parttime</p>
              </div> -->
              <div class="item">
                <label style="width: 30%">Ngày sinh</label>
                <p>{{ dateFormat }}</p>
              </div>
              <div class="item">
                <label style="width: 30%">Giới tính</label>
                <p v-if="currentUser.gender == 1">Nam</p>
                <p v-else>Nữ</p>
              </div>
              <div class="item">
                <label style="width: 40%">Địa chỉ</label>
                <p style="overflow: auto">{{ currentUser.address }}</p>
              </div>
              <div class="item">
                <label style="width: 40%">Số điện thoại</label>
                <p>{{ currentUser.phone }}</p>
              </div>
            </div>
            <button type="button" class="btn" @click="edit()">Chỉnh sửa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/user-service";
import moment from "moment";
export default {
  name: "user-profile",
  data() {
    return {
      id: "",
      file: "",
      dateFormat: "",
      currentUser: {},
    };
  },
  methods: {
    getUser(id) {
      DataService.getProfile(id)
        .then((response) => {
          console.log(response.data);
          this.currentUser = response.data;
          this.dateFormat = moment(String(this.currentUser.birthDay)).format(
            "DD/MM/yyyy"
          );
          if (this.currentUser.userImage != null) {
            this.file = require("@/assets/images/" +
              this.currentUser.userImage);
          }
        })
        .catch((e) => {
          if (e.response.status == 401) {
            this.logout();
          }
          console.log(e);
        });
    },
    edit: function () {
      this.$router.push("/editProfile");
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
    setTimeout(() => {
      this.getUser(this.id);
    }, 100);
    //this.getUser(this.id)
    // this.retrieveTutorials();
    // this.message = '';
  },
};
</script>

<style>
.profile .list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.infor {
  background-color: #d9d9d9;
  border-radius: 10px 10px 0 0;
  height: 50px;
  width: 58.5%;
  margin-left: auto;
  margin-right: auto;
}
h4 {
  padding-top: 10px;
}
.profile .box {
  text-align: center;
}
.profile .img {
  margin-left: 35%;
  margin-top: 9.5%;
  height: 75%;
  width: 60%;
}
.profile .detail {
  margin-top: 5%;
}
.profile .detail .item {
  display: flex;
  justify-content: space-between;
  width: 75%;
  border-bottom: black solid;

  margin-bottom: 3%;
}

.profile .btn {
  border-radius: 15px;
  color: white;
  width: 20%;
  margin-top: 40px;
  margin-left: 55%;
  background-color: #75c4c0;
}
</style>