<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <ArticleCommentItem
        v-for="item in list"
        :comment="item"
        :key="item.art_id"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
    <!-- 评论列表 -->
  </div>
</template>

<script>
import ArticleCommentItem from '@/views/Article/components/article-comment-item'
import { getComments } from '@/api/comment'
export default {
  name: 'ArticleComment',
  components: { ArticleCommentItem },
  props: {
    articleId: {
      type: [Number, String]
    },
    // 定义自定义属性list，去接收外面的commentList 变量
    list: {
      type: Array,
      default: () => []
    },
    // 【新增这个type】判断是文章还是评论
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 请求下一页数据的页码
      totalCount: 0 // 总数据条数
    }
  },
  created () {
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      console.log(this.articleId)
      // 1. 请求获取数据
      const { data } = await getComments({
        type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.articleId, // 源id，文章id或评论id  【文章id或者评论id都有可能存在大数字】
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: 10 // 每页大小
      })

      console.log(data)

      // 2. 将数据添加到列表中
      const { results } = data.data
      this.list.push(...results)

      // 更新总数据条数
      this.totalCount = data.data.total_count

      // 3. 将加载更多的 loading 设置为 false
      this.loading = false

      // 4. 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id // 更新获取下一页数据的页码
      } else {
        this.finished = true // 没有数据了，关闭加载更多
      }
    }
  }
}
</script>

<style scoped lang="less">
.van-list {
  margin-bottom: 45px;
}
</style>
