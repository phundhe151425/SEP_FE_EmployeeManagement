<template>
  <div class="change-pass">
    <h3>Thay đổi mật khẩu</h3>
    <small style="color: red" v-if="message">{{ message }}</small>
    <hr style="margin-bottom: 5%" />

    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div class="input">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập mật khẩu hiện tại" prop="oldPassword">
              <el-input
                type="password"
                v-model="ruleForm.oldPassword"
                autocomplete="off"
                show-password
              ></el-input>
            </el-form-item>

            <el-form-item label="Nhập mật khẩu mới" prop="newPassword1">
              <el-input
                type="password"
                v-model="ruleForm.newPassword1"
                autocomplete="off"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="Xác nhận mật khẩu mới" prop="newPassword2">
              <el-input
                type="password"
                v-model="ruleForm.newPassword2"
                autocomplete="off"
                show-password
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-7">
            <el-form-item>
              <el-button class="btn-changepass" @click="submitForm('ruleForm')"
                >Cập nhật</el-button
              >
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import DataService from "../../services/user-service";
export default {
  name: "change-pass",
  data() {
    var validateCurrentPass = (rule, value, callback) => {
      console.log(value);
      callback();
    };

    var validateNewPass = (rule, value, callback) => {
      var re = /^[A-Za-z0-9_]+$/;
      if (re.test(value) == false) {
        callback(new Error("Vui lòng không nhập khoảng trắng và chữ có dấu!"));
      } else {
        callback();
      }
    };
    var validateNewPass2 = (rule, value, callback) => {
      var re = /^[A-Za-z0-9_]+$/;
      if (re.test(value) == false) {
        callback(new Error("Vui lòng không nhập khoảng trắng và chữ có dấu!"));
      }
      if (value !== this.ruleForm.newPassword1) {
        callback(new Error("Mật khẩu mới và mật khẩu nhập lại không giống!"));
      } else {
        callback();
      }
    };
    return {
      message: "",
      ruleForm: {
        email: "",
        oldPassword: "",
        newPassword1: "",
        newPassword2: "",
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "Vui lòng nhập mật khẩu hiện tại!",
            trigger: "blur",
          },
          { validator: validateCurrentPass, trigger: "blur" },
        ],
        newPassword1: [
          {
            required: true,
            message: "Vui lòng nhập mật khẩu mới!",
            trigger: "blur",
          },
          {
            min: 8,
            message: "Mật khẩu có ít nhất 8 kí tự!",
            trigger: "blur",
          },
          { validator: validateNewPass, trigger: "blur" },
        ],
        newPassword2: [
          {
            required: true,
            message: "Vui lòng nhập lại mật khẩu mới!",
            trigger: "blur",
          },
          {
            min: 8,
            message: "Mật khẩu có ít nhất 8 kí tự!",
            trigger: "blur",
          },
          { validator: validateNewPass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.message = "";
      this.$refs[formName].validate((valid) => {
        this.ruleForm.email = this.$store.state.auth.user.email;
        if (valid) {
          DataService.changePass(this.ruleForm)
            .then(() => {
              this.$notify.success({
                message: "Đổi mật khẩu thành công!",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
              this.$router.push("/calendar");
            })
            .catch((e) => {
              if (e.response.status == 401) {
                this.logout();
              } else {
                this.message = "Mật khẩu cũ không đúng vui lòng nhập lại!";
              }
              console.log(e);
            });
        } else {
          console.log(valid);
          console.log("error submit!!");
          return false;
        }
      });
    },
    logout() {
      this.$store.dispatch("auth/logout");
      window.location.replace("/login");
      localStorage.removeItem("user");
    },
  },
  computed: {},
};
</script>

<style>
.change-pass .el-form-item {
  display: flex;
  flex-direction: column;
}

.change-pass .input .el-form-item .el-form-item__label {
  width: 200px !important;
  text-align: left !important;
  margin-left: 20% !important;
}

/* .mt-3{
    margin-top: 10% !important;
} */

.change-pass .input .el-form-item__content {
  margin-left: 0px !important;
}

.change-pass .input .el-input {
  width: 40% !important;
  margin-left: 20%;
}

.change-pass .input .el-form-item__error {
  margin-left: 20%;
}

.change-pass .input .btn-changepass {
  border-radius: 15px;
  color: white;
  margin-top: 50px;
  margin-left: 20%;
  background-color: #75c4c0;
}
</style>