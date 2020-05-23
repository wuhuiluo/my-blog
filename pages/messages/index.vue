<template>
  <div class="messages-container">
    <split-line :icon="'message'" :desc="'留言墙'"></split-line>
    <section class="editor-wrapper">
      <comment-editor @send="onSend" ref="editor" :isMessageEditor="true"></comment-editor>
    </section>
  </div>
</template>


<script>
import { mapState } from "vuex";
import markdown from "@/plugins/marked";
import CommentEditor from "@/components/base/comment-editor/comment-editor";
import SplitLine from "@/components/base/split-line/split-line";
export default {
  components: {
    SplitLine,
    CommentEditor
  },

  async fetch({ store, params }) {
    await store.dispatch('message/getMessages', {
      page: 0
    })
  },
  
  data() {
    return {
      page: 0
    };
  },

  methods: {
    async onSend({ nickname, content }) {
      try {
        const res = await this.$store.dispatch("message/createMessage", {
          nickname,
          content
        });
        if (res && res.errorCode === 0) {
          this.$refs.editor.resetField();
          this.$store.dispatch("message/getMessages", {
            page: 0
          });
        }
        // console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    //markdown解析
    marked(content) {
      return markdown(content);
    }
  },

  computed: {
    ...mapState("message", ["messages"]),
    ...mapState("message", ["total"])
  },

  mounted() {
    console.log(this.messages);
    console.log(this.total);
  }
};
</script>


<style lang="scss">
.messages-container {
  @include container;

  .editor-wrapper {
    margin: 0.5em;
  }
}
</style>
