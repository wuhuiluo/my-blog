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
  </div>
</template>


<script>
import DetailHeader from "@/components/layout/detail-header/detail-header";
import { mapState } from "vuex";
export default {
  head() {
    return {
      title: this.author.name
    };
  },
  components: {
    DetailHeader
  },
  data() {
    return {
      id: null,
      page: 0
    };
  },
  async fetch({ store, params }) {
    await store.dispatch("about/getAuthor", params.id);
  },
  computed: {
    ...mapState("about", ["author"])
  },
  created() {
    this.id = parseInt(this.$nuxt.$route.params.id);
    console.log(this.id);
  },
  mounted() {
    console.log(this.author);
  }
};
</script>


<style lang="scss">
.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
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
