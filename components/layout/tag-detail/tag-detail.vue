<template>
  <div class="tags-detail-container">
    <detail-header :cover="cover" :name="name" :description="description">
       <template v-slot:info>
          <div class="posts-number">
             <i class="icon icon-post"></i>
             <span>{{total || 0}}&nbsp;posts</span>
          </div>
       </template>
    </detail-header>
    <article class="article-list">
      <article-list :articles="articles" :total="total" @loadMore="onLoadMore"></article-list>
    </article>
  </div>
</template>


<script>
import { mapState,mapActions } from "vuex"
import ArticleList from "@/components/base/article-list/article-list"
import DetailHeader from "@/components/layout/detail-header/detail-header"
export default {
  props: {
    id: Number,

    name: {
      type: String,
      default: ""
    },
    
    description: {
        type: String,
        default: ""
    },

    cover: {
      type: String,
      default: ''
    }
  },

  components: {
     DetailHeader,
     ArticleList
  },
  
  methods: {
    onLoadMore() {
      this.page++
      const params = {
        page: this.page,
        [this.type === 'tag' ? 'tagId' : 'categoryid'] : this.id
      }
      this.getMoreArticles(params)
    },
    
    ...mapActions('tag',['getMoreArticles'])
  },
  
  data() {
    return {
      page: 0
    }
  },

  computed: {
    ...mapState('tag',['total']),
    ...mapState('tag',['articles'])
  },

  mounted() {
    //  console.log(this.total)
    //  console.log(this.id)
    //  console.log(this.articles)
  }
};
</script>


<style lang="scss" scoped>
.posts-number {
  display: flex;
  align-items: center;
  margin: 0 auto;

  .icon-post {
    font-size: $title-font-size-base;
  }

  span {
    font-size: $font-size-small;
    font-weight: $font-weight-bold;
    padding-left: 5px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
}

.article-list {
  position: relative;
  margin-top: -10vh;
}
</style>
