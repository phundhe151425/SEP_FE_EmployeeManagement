<template>
  <div class="row forot-pass">
    <div class="col-md-6">
      <img class="img" src="../../../public/authen.jpg" alt="" />
    </div>
    <div class="col-md-6 content">
      <div v-if="!ruleForm.continue" class="cont">
        <router-link
          style="margin-left: 10%; margin-bottom: 5%; color: #75c4c0"
          to="/login"
          class="nav-link"
          >Trang đăng nhập
        </router-link>
        <h4 style="text-align: center">QUÊN MẬT KHẨU?</h4>
        <p style="margin-bottom: 8%; text-align: center">
          Vui lòng nhập email để lấy lại mật khẩu
        </p>
        <div class="form">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="200px"
            class="demo-ruleForm"
          >
            <el-form-item label="Nhập Email" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <small style="color: red" v-if="checkExist">{{ message }}</small>
            <el-form-item>
              <el-button class="btn" @click="submitForm('ruleForm')"
                >Tiếp tục
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-else class="cont">
        <h4 style="text-align: center">QUÊN MẬT KHẨU?</h4>
        <p style="text-align: center">
          Hệ thống đã gửi mật khẩu về email của bạn
        </p>
        <p style="margin-bottom: 35%; text-align: center">
          Kiểm tra email và sử dụng mật khẩu mới để đăng nhập
        </p>

        <router-link to="/login" class="nav-link link"
          >Đi đến trang đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/user-service";

export default {
  name: "forget-pass",
  data() {
    var checkEmail = (rule, value, callback) => {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(value) == false) {
        callback(new Error("Vui lòng nhập đúng định dạng email!"));
      } else {
        callback();
      }
    };
    return {
    checkExist: false,
      message: "",
      continue: false,
      request: {
        email: "",
      },
      ruleForm: {
        continue: false,
        email: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Vui lòng nhập email!",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    submitForm(formName) {
        this.message = "";
        this.checkExist = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.request.email = this.ruleForm.email;
          console.log(this.request);
          DataService.forgotPass(this.request)
            .then((response) => {
              console.log(response.data);
              this.ruleForm.continue = true;
            })
            .catch((e) => {
              console.log(e);
              if (e.response.data == "Email không tồn tại."){
                this.message = "Email không tồn tại! Vui lòng nhập lại!";
                this.checkExist = true;
              }
              if (e.response.data.status == 401)
                this.$store.dispatch("auth/logout");
            });
        } else {
          console.log(valid);
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.forot-pass .img {
  width: 50%;
  margin-top: 15%;
  margin-left: 25%;
}

.forot-pass .form {
  margin-left: 22%;
}

.forot-pass .el-form-item__label {
  text-align: left;
}

.forot-pass .el-form-item {
  display: flex;
  flex-direction: column;
}

/* .mt-3{
    margin-top: 10% !important;
} */

.forot-pass .el-form-item__content {
  margin-left: 0px !important;
}

.forot-pass .el-input {
  width: 70% !important;
}

.forot-pass .btn {
  border-radius: 5px;
  color: #75c4c0;
  margin-top: 60px;
  margin-left: 52%;
  border: #75c4c0 solid 0.5px;
}

.forot-pass .cont {
  width: 75%;
  border-radius: 15px;
  border: #75c4c0 solid 0.5px;
  padding-bottom: 70px;
  padding-top: 60px;
  margin-top: 5%;
}

/* .row {
  margin-top: 5%;
} */

.forot-pass .link {
  color: #75c4c0;
  margin-left: 55%;
  font-size: 20px;
}
</style>