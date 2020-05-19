<template>
  <tag-detail :id="id" type="category" :name="name" :cover="cover" :description="description"></tag-detail>
</template>


<script>
import TagDetail from "@/components/layout/tag-detail/tag-detail"
import { mapState } from "vuex";
export default {
  components: {
    TagDetail
  },
  head() {
    return {
      title: this.name
    };
  },
  data() {
    return {
      id: null,
      name: "",
      cover: "",
      description: ""
    };
  },
  async fetch({ store, params }) {
    await store.dispatch("tag/getCategory", params.id);
    await store.dispatch("tag/getArticles", {
      categoryId: params.id,
      page: 0
    });
  },
  computed: {
    ...mapState("tag", ["category"])
  },
  created() {
    const category = this.category;
    console.log(category);
    this.name = category.name;
    this.cover = category.cover;
    this.description = category.description;
    this.id = parseInt(this.$nuxt.$route.params.id);
    console.log(this.id);
  }
};
</script>


<style lang="scss" scoped>
</style>
