<template>
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    v-if="!is_followed"
    size="small"
    icon="plus"
    :loading="isFollowLoading"
    @click="follow"
    >关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    round
    :loading="isFollowLoading"
    size="small"
    @click="follow"
    >已关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'follow-user',
  data () {
    return {
      isFollowLoading: false
    }
  },

  props: {
    is_followed: {
      type: Boolean
    },
    user_id: {
      type: [Number, String, Object]
    }
  },

  created () {},

  methods: {
    // 关注用户
    async follow () {
      this.isFollowLoading = true
      try {
        // 如果已关注，则取消关注
        const authorId = this.user_id
        if (this.is_followed) {
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }

        // 更新视图
        this.$emit('update-follow', !this.is_followed)
        this.$notify({
          type: 'success',
          message: this.is_followed ? '关注成功' : '取消关注'
        })
      } catch (err) {
        console.dir(err)
        if (err.response && err.response.status === 400) {
          return this.$toast.fail('不能关注自己')
        }
        this.$toast.fail('操作失败')
      }

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
