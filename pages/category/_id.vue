<template></template>


<script>
export default {
  
  created() {
    this.id = parseInt(this.$nuxt.$route.params.id);
    console.log(this.id)
  }
};
</script>


<style lang="scss" scoped>
</style>
