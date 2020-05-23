<template>
  <div class="profile-container">
    <detail-header :name="author.name" :description="author.description">
      <template v-slot:header>
        <div class="avatar" :style="{backgroundImage: `url(${author.avatar})`}"></div>
      </template>
      <template v-slot:info>
        <div class="social-wrapper">
          <a @click.stop :href="`mailto:${author.email}`" class="icon icon-mail social-item"></a>
        </div>
      </template>
    </detail-header>
    <article>
      <article-list @loadMore="onLoadMore" :total="total" :articles="articles"></article-list>
    </article>
  </div>
</template>


<script>
import ArticleList from "@/components/base/article-list/article-list";
import DetailHeader from "@/components/layout/detail-header/detail-header";
import { mapState,mapActions } from "vuex";
export default {
  head() {
    return {
      title: this.author.name
    };
  },
  components: {
    DetailHeader,
    ArticleList
  },
  data() {
    return {
      id: null,
      page: 0
    };
  },
  methods:{
      ...mapActions('about',['getMoreArticles']),
      onLoadMore() {
        this.page++
        this.getMoreArticles({
          authorId: this.id,
          page: this.page
        })
      }
  },
  async fetch({ store, params }) {
    await store.dispatch("about/getAuthor", params.id);
    await store.dispatch("about/getArticles", {
      authorId: params.id,
      page: 0
    });
  },
  computed: {
    ...mapState("about", ["author"]),
    ...mapState("about", ["articles"]),
    ...mapState("about", ["total"])
  },
  created() {
    this.id = parseInt(this.$nuxt.$route.params.id);
    console.log(this.id);
  },
  mounted() {
    console.log(this.author);
    console.log(this.articles);
    console.log(this.total);
  }
};
</script>


<style lang="scss" scoped>
.avatar {
  display: flex;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  transition: all 0.6s;
  cursor: pointer;

  &:hover {
    transform: scale(1.3);
  }
}

.social-item {
  font-size: $title-font-size-base;
  margin-right: 20px;
  transition: color 0.25s ease-in-out;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    color: var(--theme-active);
  }

  @media (max-width: 479px) {
    font-size: $title-font-size-small;
  }
}
</style>
