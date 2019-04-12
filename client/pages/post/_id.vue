<template>
  <div class="post">
    <div class="image-container">
      <img :src="address + '/uploads/resized/' + post.filename + '.jpg'">
    </div>
    <div class="info">
      <div>
        Uploaded by
        <nuxt-link class="user" :to="'/user/' + post.user_id">{{ post.username }}</nuxt-link>
      </div>
      <div>Score: {{ post.score }}</div>
      <div class="comments">
        <div class="comment" v-for="comment in post.comments" :key="comment.id">
          <nuxt-link class="user" :to="'/user/' + comment.user_id">{{ comment.username }}</nuxt-link>
          <div class="content">{{ comment.content }}</div>
        </div>
        <div class="new-comment" v-if="authenticated">
          <br>
          <div>Write a new comment</div>
          <textarea class="new-comment-text" v-model="newComment"></textarea>
          <input type="submit" @click="submitComment">
        </div>
      </div>
      <nuxt-link :to="'/post'">Back to posts</nuxt-link>
    </div>
  </div>
</template>

<script>
import { address } from "~/../config"

export default {
    validate({ params }) {
        return !isNaN(+params.id)
    },
    async fetch({ store, params }) {
        await store.dispatch("posts/getPost", params.id)
    },
    data() {
        return {
            newComment: "",
        }
    },
    methods: {
        async submitComment() {
            await this.$store.dispatch("posts/submitComment", this.newComment)
            this.newComment = ""
        },
    },
    computed: {
        post() {
            return this.$store.state.posts.post
        },
        address() {
            return address
        },
        authenticated() {
            return !!this.$store.state.auth.jwt
        },
    },
}
</script>

<style lang="less" scoped>
.post {
    display: grid;
    grid-template-columns: 1fr;
}
.image-container {
    display: inline-block;
    object-fit: cover;
    width: 100%;
}

.info {
    display: inline-block;
}

img {
    max-height: 100vh;
    max-width: 75vw;
    height: auto;
    width: auto;
}

.comments {
    border: 1px black solid;
    padding: 1px;
}

.comment {
    border: 1px black solid;
}

.content {
    margin-left: 1em;
}

@media only screen and (min-device-width: 768px) {
    .post {
        grid-template-columns: 0.75fr 0.25fr;
    }
}

.new-comment-text {
    width: 100%;
    font-size: 13pt;
}
</style>
