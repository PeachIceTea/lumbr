<template>
  <div class="posts-container">
    <div class="intro">
      <span>Lumbar</span>
      <br>
      <nuxt-link :to="'post/upload'">Upload a new image</nuxt-link>
    </div>
    <div class="post" v-for="post in posts" :key="post.id">
      <Thumb :post="post"/>
    </div>
    <div class="navigation">
      <nuxt-link
        :to="`/page/${+page - 1}`"
        v-if="!(page && page === 1)"
        tag="div"
        class="next nav-button"
      >Previous page</nuxt-link>
      <nuxt-link
        :to="`/page/${+page + 1}`"
        v-if="posts.length === post_per_page"
        tag="div"
        class="next nav-button"
      >Next page</nuxt-link>
    </div>
  </div>
</template>

<script>
import Thumb from "~/components/thumb"
import config from "../../config"

export default {
    data() {
        return {
            post_per_page: config.posts_per_page,
        }
    },
    computed: {
        posts() {
            return this.$store.state.posts.posts
        },
    },
    props: ["page"],
    components: { Thumb },
}
</script>

<style lang="less">
.posts-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.post {
    display: inline-block;
}

img {
    vertical-align: bottom;
}

svg {
    display: inline-flex;
    align-self: center;
    height: 0.8em;
    width: 0.8em;
    top: 0.05em;
    position: relative;
}

.navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    align-content: space-around;
}

.nav-button {
    font-size: 2em;
    text-decoration-style: none;
    color: black;
    display: flex;
    height: 45%;
    width: 95%;
    align-items: center;
    justify-content: center;
    align-content: space-around;
    border: 1px black solid;
    cursor: pointer;
}

.nav-button:nth-child(2) {
    margin-top: 2.5%;
}
</style>
