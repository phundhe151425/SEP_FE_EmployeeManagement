<template>
  <html lang="en">
    <body>
      <div class="row">
        <div class="col-md-6">
          <img class="img" src="../../../public/authen.jpg" alt="" />
        </div>
        <div class="col-md-6 content">
          <div v-if="!ruleForm.continue" class="main">
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
                <el-form-item>
                  <el-button class="btn" @click="submitForm('ruleForm')"
                    >Tiếp tục</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div v-else class="main">
            <h4 style="text-align: center">QUÊN MẬT KHẨU?</h4>
            <p style="text-align: center">
              Hệ thống đã gửi mật khẩu về email của bạn
            </p>
            <p style="margin-bottom: 35%; text-align: center">
              Kiểm tra email và sử dụng mật khẩu mới để đăng nhập
            </p>

            <router-link to="/login" class="nav-link link"
              >Đi đến trang đăng nhập</router-link
            >
          </div>
        </div>
      </div>
    </body>
  </html>
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
      continue: false,
      request:{
        email:""
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
      this.$refs[formName].validate((valid) => {

        if (valid) {
          this.request.email = this.ruleForm.email;
          console.log(this.request)
          DataService.forgotPass(this.request)
            .then((response) => {
              console.log(response.data);
            })
            .catch((e) => {
              console.log(e);
            });
          this.ruleForm.continue = true;
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

<style >
.img {
  width: 50%;
  margin-top: 15%;
  margin-left: 25%;
}

.form {
  margin-left: 22%;
}
.el-form-item__label {
  text-align: left;
}
.el-form-item {
  display: flex;
  flex-direction: column;
}

/* .mt-3{
    margin-top: 10% !important;
} */

.el-form-item__content {
  margin-left: 0px !important;
}

.el-input {
  width: 70% !important;
}

.btn {
  border-radius: 15px;
  color: #75c4c0;
  width: 25%;
  margin-top: 60px;
  margin-left: 45%;
  border: #75c4c0 solid 0.5px;
}

.main {
  width: 75%;
  border-radius: 15px;
  border: #75c4c0 solid 0.5px;
  padding-bottom: 15%;
  padding-top: 15%;
  margin-top: 5%;
}

.row {
  margin-top: 5%;
}

.link {
  color: #75c4c0;
  margin-left: 55%;
  font-size: 20px;
}
</style>