<template>
  <div class="comment-container">
    <comment-editor ref="editor" @send="onSend" :isShowReplyContent="isShowReplyContent"></comment-editor>
    <div class="comment-list-wrapper">
       <comment-list :comments="comments"></comment-list>
    </div> 
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import CommentList from "./comment-list";
import CommentEditor from "@/components/base/comment-editor/comment-editor";
export default {
  components: {
    CommentEditor,
    CommentList
  },

  methods: {
    ...mapActions('article',['createComment']),

    async onSend(data) {
      if(!this.articleId) {
        return 
      }
      try {
         //创建评论
        data.articleId = this.articleId
        const res = await this.createComment(data)
        console.log(res)
        if(res.errorCode === 0) {
            this.$refs.editor.resetField()
            this.$emit('createCommentSuccess')
        }
      } catch(e) {
        console.log(e)
      }
    }
  },

  props: {
    comments: {
      type: Array,
      defualt: () => []
    },

    articleId: {
      type: Number
    }
  },

  data() {
    return {
      isShowReplyContent: false
    };
  },
};
</script>


<style lang="scss">
.comment-list-wrapper {
  margin-top: 25px;
}
</style>
