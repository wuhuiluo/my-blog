<template>
  <section class="container">
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="(img,index) in imgList" :key="index">
        <img :src="img.img" />
      </el-carousel-item>
    </el-carousel>
    <article-list @loadMore="onloadMore" :articles="articles" :total="total"></article-list>
  </section>
</template>
<script>
import { mapActions } from "vuex";
import { mapState } from "vuex";
import ArticleList from "@/components/base/article-list/article-list";
const imgList = [
  {
    img:
      "http://p1.music.126.net/IOeYfYYhuHDj7hMpWXPLKA==/109951165008181794.jpg?imageView&quality=89"
  },
  {
    img:
      "http://p1.music.126.net/ALoKlu7B9fdT_DPB2LzH3g==/109951165008532251.jpg?imageView&quality=89"
  },
  {
    img:
      "http://p1.music.126.net/S4nsy5LxeywT3U1Rifq7Bw==/109951165008232178.jpg?imageView&quality=89"
  },
  {
    img:
      "http://p1.music.126.net/S92V9THxRky7eLsdPHKVug==/109951165009832806.jpg?imageView&quality=89"
  },
  {
    img:
      "http://p1.music.126.net/IdgNPE1Z0R6W5Cokbe6Emg==/109951165008185886.jpg?imageView&quality=89"
  }
];
export default {
  data() {
    return {
      imgList,
      page: 0
    };
  },

  methods: {
    ...mapActions('article',['getMoreArticles']),

    onloadMore() {
       this.page++
       this.getMoreArticles({
         page: this.page
       })
    }
  },

  components: {
    ArticleList
  },
  async fetch({ store, params }) {
    await store.dispatch("article/getHomeArticles");
  },
  computed: {
    ...mapState("article", ["articles", "starArticles", "total"])
  },
  mounted() {
    console.log(this.articles,this.total);
  }
};
</script>

<style>
img {
  height: 300px;
  width: 100%;
}
</style>

