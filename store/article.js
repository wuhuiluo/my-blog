import article from '../models/article'

export const state = () => ({
  // 文章列表
  articles: [],
  total: 0,
  starArticles: []
})
export const mutations = {
  setHomeArticles(state,{articles,starArticles,total}) {
      state.articles = articles
      state.starArticles = starArticles
      state.total = total
  }
}
export const actions = {
  // 获取首页文章列表
  async getHomeArticles({commit},params) {
    try {
      const { articles,total } = await article.getArticles(params)
      const starArticles = await article.getStarArticles()
      //调用mutations中的方法
      commit('setHomeArticles',{articles,starArticles,total})
    } catch(e) {
      console.log(e)
    }
  }
}
