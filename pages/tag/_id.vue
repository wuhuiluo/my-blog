<template>
  <tag-detail :id="id" :cover="cover" :name="name"></tag-detail>
</template>


<script>
import TagDetail from "@/components/layout/tag-detail/tag-detail";
export default {
  components: {
      TagDetail
  },

  async fetch({ store,params }) {
    await store.dispatch('tag/getArticles',{
      tagId: params.id,
      page: 0
    })
  },

  data() {
    return {
      id: null,
      name: "",
      cover: ""
    };
  },

  head() {
    return {
      title: this.name
    };
  },

  created() {
    //  标签
    this.name = this.$nuxt.$route.query.name;
    this.cover = "http://p1.music.126.net/IOeYfYYhuHDj7hMpWXPLKA==/109951165008181794.jpg?imageView&quality=89"
    this.id = parseInt(this.$nuxt.$route.params.id);
  },

  mounted() {
    // console.log(this.name);
    // console.log(this.cover);
    // console.log(this.id);
  }
};
</script>


<style lang="scss">
</style>
