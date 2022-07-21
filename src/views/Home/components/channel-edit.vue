<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button
        size="mini"
        round
        type="danger"
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(channelItem, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channelItem, index)"
      >
        <span class="text" :class="{ active: active === index }" slot="text">{{
          channelItem.name
        }}</span>
        <!-- 通过插槽自定义图标 -->
        <van-icon v-show="isEdit && index !== 0" slot="icon" name="close" />
      </van-grid-item>
    </van-grid>

    <van-cell title="频道推荐" :border="false"></van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="channel in recommendChannels"
        :key="channel.id"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import differenceBy from 'lodash/differenceBy'
import { mapState } from 'vuex'
import { setLocal } from '@/utils/storage'
import { TOUTIAO_CHANNELS } from '@/constState'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    recommendChannels () {
      return differenceBy(this.allChannels, this.myChannels, 'id')
    },
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    // 加载所有频道
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      if (this.user) {
        try {
          // 已登录，数据存储到线上
          await addUserChannel({
            id: channel.id, // 频道 id
            seq: this.myChannels.length // 频道的 序号
          })
          this.$toast('添加成功')
        } catch (err) {
          this.$toast('保存失败')
        }
      } else {
        // 未登陆
        setLocal(TOUTIAO_CHANNELS, this.myChannels)
      }
    },
    // 点击我的频道
    onMyChannelClick (channelItem, index) {
      if (this.isEdit) {
        // 如果删除的是推荐频道，则终止代码执行/给出提示
        if (index === 0) return this.$toast('推荐频道不允许删除')
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.myChannels.splice(index, 1)
        // 删除数据持久化
        this.deleteChannel(channelItem)
      } else {
        // 执行跳转操作
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setLocal('channles', this.userChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  .channel-item {
    height: 86px;
    width: 81px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 20px;
        white-space: nowrap;
      }

      .active {
        color: red;
      }
    }
  }
  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      color: #222;
      .van-icon {
        font-size: 24px;
      }

      .van-grid-item__text {
        font-size: 20px;
        margin-top: 0;
      }
    }
  }
  /deep/ .van-icon-close {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 36px;
    color: #ccc;
  }
  /deep/ .van-grid-item__icon-wrapper {
    position: unset;
    font-size: 17px;
  }
}
</style>
