<template>
  <div class="archive-container">
    <split-line :icon="'post'" :desc="`${archiveTotal} posts`"></split-line>
    <div class="year-wrapper" v-for="year in archive" :key="year.year">
      <div class="year-name">{{year.year}}</div>
      <dl :key="month.month" v-for="month in year.monthList" class="month-wrapper">
        <dt class="month-name">{{month.month | monthTrans}}</dt>
        <dd class="article-item" v-for="article in month.articles" :key="article.id">
          <span class="time">{{article.created_date}}</span>
          <router-link class="title" :to="`/article/${article.id}`">{{article.title}}</router-link>
          <div class="avtar-wrapper">
            <i
              v-for="author in article.authors"
              :key="author.id"
              class="avatar"
              :style="{backgroundImage: `url(${author.avatar})`}"
            ></i>
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>


<script>
import SplitLine from "@/components/base/split-line/split-line";
import { mapState } from "vuex";
import Utils from "@/services/utils/util";
const monthMap = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};
export default {
  components: {
    SplitLine
  },

  filters: {
    monthTrans(month) {
      return monthMap[month];
    }
  },

  head() {
    return {
      title: "归档"
    };
  },

  computed: {
    ...mapState("article", ["archive"]),
    ...mapState("article", ["archiveTotal"])
  },

  async fetch({ store, params }) {
    await store.dispatch("article/getArchive");
  },

  mounted() {
    console.log(this.archive);
    console.log(this.archiveTotal);
  }
};
</script>


<style lang="scss">
@mixin margin {
  margin-top: 0.5em;
  margin-left: 2em;

  @media (max-width: 479px) {
    margin-top: 0.3em;
    margin-left: 0.7em;
  }
}

.archive-container {
  @include container;
  min-height: 480px;
}

.year-wrapper {
  @include margin;

  @media (max-width: 1023px) {
    margin-left: 5px;
  }

  .year-name {
    font-size: $title-font-size-base;
    font-weight: $font-weight-bold;
  }
}

.month-wrapper {
  @include margin;

  .month-name {
    font-size: 1.1rem;
  }
}

.article-item {
  @include margin;
  display: flex;
  align-items: center;
  min-height: 30px;
  font-size: 1rem;

  @media (max-width: 479px) {
    margin-left: 1.5em;
  }

  .time {
    position: relative;
    margin: 0 14px;
    white-space: nowrap;

    @media (max-width: 479px) {
      margin: 0 10px 0 0;
    }

    &:before {
      content: "";
      position: absolute;
      top: 9px;
      left: -18px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--font-color-primary);
    }
  }

  .title {
    display: inline-block;
    margin-bottom: 2px;
    cursor: pointer;
    font-size: 1.1rem;
    color: var(--font-color-primary);
  }

  .avtar-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: -3px 0 0 30px;

    .avatar {
      display: inline-block;
      width: 30px;
      min-width: 30px;
      height: 30px;
      margin-left: -15px;
      border-radius: 50%;
      background-color: var(--border-color);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0;
      transform: translate(0);
      transition: all 0.25s ease-in-out;

      @media (max-width: 479px) {
        margin: -3px 0 0 -15px;
      }
    }
  }

  &:hover {
    .avatar {
      opacity: 1;
      transform: translateX(10px);
    }
  }
}
</style>
