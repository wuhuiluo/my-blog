<template>
  <div class="about-container">
    <split-line :icon="'about'" :desc="'我们'"></split-line>
    <ul class="author-list">
      <li 
      @click="showProfile(author.id)"
      class="author-item" 
      v-for="author in authors"
      :key="author.id">
        <div class="author-avatar" :style="{backgroundImage : `url(${author.avatar})`}"></div>
        <div class="author-info-wrapper">
          <h2 class="author-name">{{author.name}}</h2>
          <div class="social-wrapper">
            <a class="social-item icon icon-mail" @click.stop :href="`mailto:${author.email}`"></a>
          </div>
          <div class="author-social"></div>
          <p class="author-desc">{{author.description}}</p>
        </div>
      </li>
    </ul>
    <div>
      <split-line :desc="'友链 (在留言板申请“昵称”+“链接”)'" :icon="'star-fill'"></split-line>
      <ul class="friend-wrapper" v-if="friends.length">
        <template v-for="friend in friends">
          <a class="friend-item" :key="friend.id" :href="friend.link">{{friend.name}}</a>
        </template>
      </ul>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";
import SplitLine from "@/components/base/split-line/split-line";
export default {
  head() {
    return {
      title: "关于"
    };
  },
  components: {
    SplitLine
  },
  async fetch({ store, params }) {
    await store.dispatch("about/getAuthors");
    await store.dispatch("blog/getFriends");
  },
  computed: {
    ...mapState("about", ["authors"]),
    ...mapState("blog", ["friends"])
  },
  methods: {
    showProfile(id) {
      this.$router.push({path: `/about/${id}`})
    }
  },
  mounted() {
    console.log(this.authors);
    console.log(this.friends);
  }
};
</script>


<style lang="scss">
.about-container {
  @include container;
  min-height: 450px;
  .author-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
    .author-item {
      @include noCover;
      box-sizing: border-box;
      flex: 1 0 25%;
      max-width: 420px;
      min-width: 290px;
      margin: 15px;
      padding-bottom: 25px;
      border-radius: 20px;
      // border-bottom-left-radius: 20px;
      // border-bottom-right-radius: 20px;
      overflow: hidden;
      transition: all 0.25s ease-in-out;
      // cursor: pointer;
      &:hover {
        transform: translateY(-4px);
      }

      .author-avatar {
        width: 100%;
        height: 250px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 50%;
      }

      .author-info-wrapper {
        box-sizing: border-box;
        padding: 0 30px;
        display: flex;
        align-items: center;
        flex-direction: column;
        flex-wrap: wrap;
        .social-item {
          font-size: $title-font-size-base;
          transition: color 0.25s ease-in-out;
          cursor: pointer;
          &:hover {
            color: var(--theme-active);
          }
          @media (max-width: 479px) {
            font-size: $title-font-size-small;
          }
        }
      }
      .author-name {
        font-size: $title-font-size-medium;
        font-weight: $font-weight-bold;
        margin: 5px 0;

        @media (max-width: 479px) {
          font-size: $title-font-size-base;
        }
      }

      .author-desc {
        padding: 5px 0;

        @media (max-width: 479px) {
          font-size: $font-size-base;
        }
      }
    }
  }
.friend-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 -5px;
  .friend-item {
    display: inline-block;
    margin: 5px;
    padding: 5px 12px;
    color: var(--font-color-primary);
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    letter-spacing: 1.5px;
    border-radius: 20px;
    background: var(--tag-color);
    cursor: pointer;
    &:nth-last-child() {
      margin-right: 0;
    }
    &:hover {
      color: #fff;
      background: var(--theme-active);
      transition: all .25s ease-in-out;
    }
  }
}

}
</style>
