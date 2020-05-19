<template>
  <div>
    <header class="article-header">
      <div class="header-wrapper">
        <div class="content">
          <tag-list :tagList="article.tags"></tag-list>
          <h1 class="title">{{article.title}}</h1>
          <div class="author-wrapper" v-show="article.created_date">
            by&nbsp;
            <router-link
              tag="span"
              v-for="author in article.authors"
              :key="author.id"
              class="author-name"
              :to="`/about/${author.id}`"
            >{{author.name}}</router-link>&nbsp;
            <time
              :datetime="article.created_date | filterTime"
            >&nbsp;{{article.created_date | filterTime}}</time>
          </div>
        </div>
      </div>
    </header>

    <!-- 文章区域 -->
    <div class="article-container">
      <div class="content">
        <!-- 文章内容 -->
        <div class="article-wrapper">
          <article ref="markedContent" class="markdown" v-html="markedContent"></article>
        </div>
        <!-- 文章信息 -->
        <div class="article-info-wrapper">
          <div class="tags-wrapper">
            <i class="icon icon-tags-fill"></i>
            <ul class="tags">
              <li class="tag-item" v-for="tag in article.tags" :key="tag.id">{{tag.name}}</li>
            </ul>
          </div>
          <div class="like-btn">
            <i class="icon icon-heart-fill"></i>
          </div>
        </div>
        <!-- 相关推荐 -->
        <split-line
          v-if="haveCategoryArtilces"
          class="split-line"
          :icon="'recommend'"
          :desc="'相关推荐'"
        ></split-line>
        <div v-if="haveCategoryArtilces" class="recommend-wrapper">
          <recommend
            :articles="article.categoryArticles"
            @showRecommendDetail="onShowRecommendDetail"
          ></recommend>
        </div>
      </div>
    </div>
    <!-- 相关推荐 -->
  </div>
</template>


<script>
import markdown from "@/plugins/marked";
import { mapState } from "vuex";
import Recommend from "@/components/layout/recommend/recommend";
import TagList from "@/components/base/tag-list/tag-list";
import SplitLine from "@/components/base/split-line/split-line";
export default {
  components: {
    TagList,
    SplitLine,
    Recommend
  },

  async fetch({ store, params }) {
    await store.dispatch("article/getArticleDetail", {
      id: params.id
    });
    await store.dispatch("article/getComments", {
      articleId: params.id
    });
  },

  data() {
    return {
      id: 0
    };
  },

  methods: {
    onShowRecommendDetail(id) {
      const ids = id;
      this.$router.push(`/article/${ids}`);
    },

    // markdown解析
    marked(content) {
      return markdown(content);
    }
  },

  computed: {
    ...mapState("article", ["article"]),
    ...mapState("article", ["comments"]),

    haveCategoryArtilces() {
      return (
        this.article.categoryArticles && this.article.categoryArticles.length
      );
    },

    markedContent() {
      if (this.article.content) {
        return markdown(this.article.content);
      } else {
        return "";
      }
    }
  },

  created() {
    this.id = this.$nuxt.$route.params.id;
    // console.log(this.id);
    // console.log(this.article);
  },

  mounted() {
    console.log(this.article);
    console.log(this.comments)
  }
};
</script>


<style lang="scss">
.article-header {
  @include cover;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: calc(100% - 85px - 85px);
  height: calc(100vh - 245px);
  margin: 0 auto;
  color: #fff;
  border-radius: 5px;
  background: no-repeat center center;
  background-size: cover;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 1399px) {
    width: 100%;
    border-radius: 0;
  }

  @media (max-width: 1023px) {
    height: calc(100vh - 160px);
  }

  @media (max-width: 479px) {
    height: auto;
    padding: 15vh 0 15vh;
  }

  .header-wrapper {
    @include container;
    position: relative;
    margin: 0 auto;
  }

  .content {
    @include headerPadding;
    margin-top: -10vh;

    @media (max-width: 479px) {
      margin-top: 0;
    }
  }

  .title {
    margin: 0.7em 0;
    line-height: 1;
    color: #fff;
    font-size: $title-font-size-extra-large;
    font-weight: $font-weight-bold;

    @media (max-width: 479px) {
      font-size: $title-font-size-base;
    }
  }

  .author-wrapper {
    font-size: $font-size-small;

    @media (max-width: 479px) {
      font-size: $font-size-minimum;
    }

    .author-name {
      font-size: $font-size-large;
      font-weight: $font-weight-bold;
      cursor: pointer;

      @media (max-width: 479px) {
        font-size: $font-size-small;
      }

      &:not(:first-child)::before {
        content: "、";
      }
    }
  }
}
</style>
