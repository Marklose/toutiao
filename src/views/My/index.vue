<template>
  <div class="my-container">
    <!-- 未登录头部 -->
    <div class="header not-login" v-if="!user">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->
    <!-- 已登录头部 -->
    <!-- 已登录 -->
    <div class="header user-info" v-else>
      <!-- 基本信息 -->
      <div class="base-info">
        <div class="left">
          <van-image fit="cover" :src="userInfo.photo" class="avatar" round />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button to="/user/profile" type="default" size="mini" round
            >编辑资料</van-button
          >
        </div>
      </div>
      <!-- 粉丝、关注 -->
      <div class="data">
        <div class="data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>头条</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.like_count }}</span>
          <span>获赞</span>
        </div>
      </div>
    </div>

    <!-- /已登录头部 -->
    <!-- 宫格 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item text="收藏">
        <template #icon>
          <TouTiaoicon icon="shoucang"></TouTiaoicon>
        </template>
        <template #text> <span class="text">历史</span> </template>
        <!-- <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span class="text" slot="text">收藏</span> -->
      </van-grid-item>
      <van-grid-item text="文字">
        <template #icon>
          <TouTiaoicon icon="lishi"></TouTiaoicon>
        </template>
        <template #text> <span class="text">历史</span> </template>
        <!-- <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span class="text" slot="text">历史</span> -->
      </van-grid-item>
    </van-grid>
    <van-cell title="消息通知" is-link url="" />
    <van-cell title="实名认证" is-link url="" />
    <van-cell title="用户反馈" is-link url="" />
    <van-cell title="小智同学" is-link url="" />
    <van-cell title="系统设置" is-link url="" />
    <van-cell class="logout-cell" title="退出登录" center @click="onLogout" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    if (this.$store.state?.user?.token) {
      this.loadUser()
    }
  },
  mounted () {},
  methods: {
    async onLogout () {
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹框组件
      await this.$dialog.confirm({
        title: '确认退出吗？'
      })
      // 确认退出：清除登录状态（容器中的 user + 本地存储中的 user）
      this.$store.commit('getToken', null)
    },
    async loadUser () {
      const res = await fetchUserInfo()
      console.log(res)
      this.userInfo = res.data.data
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  padding-bottom: 100px;
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    //background: red;
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 2px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
          margin-left: 30px;
        }
      }
    }
  }
  .data {
    display: flex;
    justify-content: space-around;
    .data-item {
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;
      span:nth-child(1) {
        font-size: 36px;
        margin-bottom: 15px;
      }
      span:nth-child(2) {
        font-size: 23px;
      }
    }
  }
  .grid-nav {
    background: #fff;
    /deep/.toutiao {
      font-size: 45px;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
    /deep/.text {
      color: #000;
      margin-top: 8px;
      font-size: 28px;
    }
  }
  .logout-cell {
    height: 100px;
    text-align: center;
    color: #eb5253;
    margin: 10px 0;
    font-size: 30px;
  }
}
</style>
