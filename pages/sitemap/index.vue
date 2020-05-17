<template>
  <div class="tag-container">
    <split-line :icon="'cloud'" :desc="'标签'"></split-line>
    <div class="tag-wrapper">
        <tag-list :tagList="tags"></tag-list>
    </div>
    <split-line :icon="'tag'" :desc="'分类'">
      <nuxt-link v-for="category in categories" :key="category.id" tag="li" class="category-item">
        <div class="category-wrapper">
          <div class="category-image" :style="{backgroundImage: `url(${category.cover})`}"></div>
          <h2 class="title" :class="{center: !category.description}">{{category.name}}</h2>
          <p v-if="category.description" class="desc">{{category.description}}</p>
        </div>
      </nuxt-link>
    </split-line>
  </div>
</template>


<script>
import TagList from "@/components/base/tag-list/tag-list"
import SplitLine from "@/components/base/split-line/split-line";
import { mapState } from "vuex";
export default {
  async fetch({ store, params }) {
    await store.dispatch("tag/getTagAndCategories");
  },
  computed: {
    ...mapState("tag", ["tags"]),
    ...mapState("tag", ["categories"])
  },
  mounted() {
    console.log(this.tags);
    console.log(this.categories);
  },
  components: {
    SplitLine,
    TagList
  }
};
</script>


<style style="scss">
</style>
