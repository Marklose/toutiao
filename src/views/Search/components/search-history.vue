<template>
  <div class="search-history">
    <!-- 历史记录 -->
    <van-cell-group>
      <van-cell title="搜索历史">
        <div v-if="isDeleteShow">
          <span
            @click="$emit('clear-search-history')"
            style="margin-right: 10px"
            >全部删除</span
          >
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon v-else @click="isDeleteShow = true" name="delete" />
      </van-cell>
      <van-cell
        :title="item"
        v-for="(item, index) in searchHistory"
        :key="index"
        @click="onHistoryClick(item, index)"
      >
        <van-icon v-if="isDeleteShow" name="close"></van-icon>
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onHistoryClick (item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistory.splice(index, 1)
      } else {
        // 否则执行搜索操作
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
