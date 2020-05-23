<template>
  <section class="container">
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item  v-for="(img,index) in imgList" :key="index">
        <img :src="img.img"/>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>
<script>
import { mapState } from "vuex";
import AppLogo from "@/components/AppLogo.vue";
const imgList = [
  {
    img:"http://p1.music.126.net/IOeYfYYhuHDj7hMpWXPLKA==/109951165008181794.jpg?imageView&quality=89"
  },
  {
    img:"http://p1.music.126.net/ALoKlu7B9fdT_DPB2LzH3g==/109951165008532251.jpg?imageView&quality=89"
  },
  {
    img:"http://p1.music.126.net/S4nsy5LxeywT3U1Rifq7Bw==/109951165008232178.jpg?imageView&quality=89"
  },
  {
    img:"http://p1.music.126.net/S92V9THxRky7eLsdPHKVug==/109951165009832806.jpg?imageView&quality=89"
  },
  {
    img:"http://p1.music.126.net/IdgNPE1Z0R6W5Cokbe6Emg==/109951165008185886.jpg?imageView&quality=89"
  }
];
export default {
  data() {
    return {
       imgList
    }
  },

  components: {
    AppLogo
  },
  async fetch({ store, params }) {
    await store.dispatch("article/getHomeArticles");
  },
  computed: {
    ...mapState("article", ["articles", "starArticles", "total"])
  },
  mounted() {
    console.log(this.articles, this.starArticles, this.total);
  }
};
</script>

<style>

</style>

