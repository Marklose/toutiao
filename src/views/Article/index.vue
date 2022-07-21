<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.art_id" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell :border="false" center class="user-info">
          <van-image
            slot="icon"
            :src="article.aut_photo"
            class="avatar"
            fit="cover"
            round
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate }}</div>
          <FollowUser
            :is_followed="article.is_followed"
            :user_id="article.aut_id"
            @update-follow="article.is_followed = $event"
          ></FollowUser>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          ref="content"
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="isNotFound" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <!-- 评论 -->
      <article-comment
        v-if="article.art_id"
        :articleId="article.art_id"
        @onload-success="totalCount = $event"
        @reply-click="onReplyClick"
      />
    </div>
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="write-btn"
        round
        size="small"
        type="default"
        @click="isPostShow = true"
        >写评论
      </van-button>
      <van-icon :badge="article.comm_count" color="#777" name="comment-o" />
      <collect-article
        v-if="article.art_id"
        v-model="article.is_collected"
        :articleId="article.art_id"
      />
      <likeArticle
        v-if="article.art_id"
        v-model="article.attitude"
        :articleId="article.art_id"
      />
      <van-icon color="#777777" name="share"></van-icon>
    </div>
    <!-- /底部区域 -->
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post
        :list="commentList"
        :target="article.art_id"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- 发布评论 -->
    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import 'github-markdown-css'

import FollowUser from '@/views/Article/components/follow'
import CollectArticle from '@/views/Article/components/collectArticle'
import likeArticle from '@/views/Article/components/like-article'
import ArticleComment from '@/views/Article/components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    likeArticle,
    ArticleComment,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 请求回来的数据
      loading: false,
      isNotFound: false,
      isPostShow: false,
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {} // 当前点击回复的评论项
    }
  },
  // 给所有的后代组件提供数据
  // 注意：不要滥用
  provide: function () {
    return {
      articleId: this.articleId // 或者写成 this.$route.params.articleId  也可以
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getArticleById()
  },
  mounted () {},
  methods: {
    previewImg () {
      // 获取所有的img图片  push到一个数组里面
      const imgs = this.$refs.content.querySelectorAll('img')
      const images = []
      // src属性
      imgs.forEach((item, index) => {
        //  push到一个数组里面
        images.push(item.src)
        item.addEventListener('click', function () {
          ImagePreview({
            images,
            startPosition: index
          })
        })
      })
    },
    async getArticleById () {
      this.loading = true
      try {
        const res = await getArticleById(this.articleId)
        this.article = res.data.data
        // 调用获取图片src函数 $nextTick方法会在dom结构挂载结束后执行里面的代码 拿到最新的dom结构
        this.$nextTick(() => {
          this.previewImg()
        })
        this.loading = false
      } catch (error) {
        this.loading = false
        this.isNotFound = error.response.status === 404
        console.log(error)
      }
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      // todo...
      console.log(data) // comment-post.vue 传递出来的数据
    },
    onReplyClick (comment) {
      // 存储起来
      this.currentComment = comment

      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  /deep/ .van-icon-arrow-left {
    color: #fff;
  }

  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }

  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;

      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }

      .van-cell__label {
        margin-top: 0;
      }

      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }

      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }

      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;

      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }

    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }

    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;

    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }

    .van-icon {
      font-size: 40px;

      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
