<template>
  <div class="login-container">
    <!-- <van-nav-bar title="登录" /> -->
    <van-nav-bar class="page-nav" title="登录">
      <van-icon slot="left" name="cross" color="#fff" @click="$router.back()" />
    </van-nav-bar>

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="form">
      <van-field
        v-model="user.mobile"
        required
        clearable
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
      >
        <template #left-icon>
          <TouTiaoicon icon="shouji"></TouTiaoicon>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        type="number"
        required
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <template #left-icon>
          <TouTiaoicon icon="yanzhengma"></TouTiaoicon>
        </template>

        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            slot="button"
            :time="1000 * 5"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            :loading="isdisabled"
            v-else
            native-type="button"
            class="send-sms-btn"
            size="mini"
            type="default"
            @click="sendSmsCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login } from '@/api/login'
import { getSmsCode } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false,
      isdisabled: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      const user = this.user
      try {
        const res = await login(user)
        console.log(res)
        Toast.success('登录成功')
        this.$store.commit('getToken', res.data.data)
      } catch (err) {
        Toast.fail(err?.response?.data?.message || '服务端错误')
      }
    },
    async sendSmsCode () {
      try {
        await this.$refs.form.validate('mobile')
      } catch (error) {
        return console.log(error)
      }
      try {
        this.isdisabled = true
        this.isCountDownShow = true
        await getSmsCode(this.user.mobile)
        this.$toast.success('发送验证码成功')
      } catch (error) {
        this.$toast.fail(error.response.data.message || '出错了')
        this.isCountDownShow = false
      } finally {
        this.isdisabled = false
      }
    }
  }
}
</script>
<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
