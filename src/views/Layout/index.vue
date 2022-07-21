<template>
  <div class="layout-container">
    <router-view></router-view>
    <van-tabbar v-model="active" class="layout-tabbar" route>
      <van-tabbar-item to="/home">
        <template #icon>
          <TouTiaoicon icon="shouye"></TouTiaoicon>
        </template>
        首页</van-tabbar-item
      >
      <van-tabbar-item to="/question">
        <template #icon> <TouTiaoicon icon="wenda"></TouTiaoicon> </template
        >问答</van-tabbar-item
      >
      <van-tabbar-item to="/video">
        <template #icon> <TouTiaoicon icon="shipin"></TouTiaoicon> </template
        >视频</van-tabbar-item
      >
      <van-tabbar-item to="/my">
        <template #icon> <TouTiaoicon icon="wode"></TouTiaoicon> </template
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
