<template>
  <div>
    <div class="infor">
      <h4 style="text-align: center;font-weight: bold">Thông tin nhân viên</h4>
    </div>
    <div class="container">
      <div class="profile">
        <div class="row" style="text-align: center">
          <div class="col-xs-12 col-md-5">
            <img v-if="currentUser.userImage == '' || currentUser.userImage == null" class="img" src="../../../public/avatar.jpg" />
            <img
              v-else
              class="img"
              :src="
                `http://localhost:2000/api/file/avatar/` + currentUser.userImage
              "
            />
            
          </div>
          <div class="col-xs-12 col-md-7">
            <div class="detail" v-if="currentUser != null">
              <div class="item">
                <label >Họ và tên</label>
                <p style="overflow: auto">{{ currentUser.fullName }}</p>
              </div>
              <div class="item">
                <label >Mã nhân viên</label>
                <p>{{ currentUser.userCode }}</p>
              </div>
              <div class="item">
                <label >Bộ phận</label>
                <p>{{ currentUser.department.name }}</p>
              </div>
              <div class="item">
                <label >Email</label>
                <p>{{ currentUser.email }}</p>
              </div>
              <div class="item">
                <label >Ngày sinh</label>
                <p>{{ dateFormat }}</p>
              </div>
              <div class="item">
                <label >Giới tính</label>
                <p v-if="currentUser.gender == 1">Nam</p>
                <p v-else>Nữ</p>
              </div>
              <div class="item">
                <label >Địa chỉ</label>
                <p style="overflow: auto">{{ currentUser.address }}</p>
              </div>
              <div class="item">
                <label >Số điện thoại</label>
                <p>{{ currentUser.phone }}</p>
              </div>
               <div class="item">
                <label >Hợp đồng</label>
                <p><el-link :href="this.beUrl+`api/file/contract/`+contractFileEdit" type="warning"
                                         target="_blank">
                                    {{ contractNameEdit }}
                                </el-link></p>
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
import ContractService from "@/services/contract-service";
import {BE_URL} from "@/http-common";
import {FE_URL} from "@/http-common";
import moment from "moment";
export default {
  name: "user-profile",
  data() {
    return {
      beUrl: BE_URL,
      feUrl: FE_URL,
      id: "",
      dateFormat: "",
      currentUser: {},
      contractNameEdit: '',
      contractFileEdit: '',
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

        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
         this.getCurrentContractByUserId(id)
    },

      getCurrentContractByUserId(userId) {
            ContractService.getCurrentContractByUserId(userId).then(response => {
                this.contractFileEdit = response.data.fileName
                this.contractNameEdit = response.data.contractName
                console.log(response)
            }).catch((e) => {
                console.log(e);
                if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
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
  computed: {
  },
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
  width: 100%;
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
  /* margin-left: 35%; */
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

.profile .detail .item label{
  width:20%;
  text-align: left;
}

.profile .btn {
  border-radius: 5px;
  color: white;
  width: 20%;
  margin-top: 40px;
  margin-left: 31%;
  background-color: #75c4c0;
}
</style>