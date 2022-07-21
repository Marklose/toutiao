<template>
  <van-icon
    :color="value === 1 ? 'red' : ''"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    @click="onLike"
  />
</template>

<script>
import { deleteLike, addLike } from '@/api/article'
export default {
  data () {
    return {}
  },

  props: {
    value: {
      type: Number
    },
    articleId: {
      type: [Number, String]
    }
  },

  created () {},

  methods: {
    async onLike () {
      // 两个作用：1、交互提示 2、防止网络慢用户连续不断的点击按钮请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      console.log(this.value)
      try {
        // 如果已经点赞，则取消点赞
        if (this.value === 1) {
          await deleteLike(this.articleId)
          this.$emit('input', -1)
          this.$toast.success('取消点赞')
        } else {
          // 否则添加点赞
          await addLike(this.articleId)
          this.$emit('input', 1)
          this.$toast.success('点赞成功')
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
