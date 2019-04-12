<template>
  <nuxt-link :to="`/post/${post.id}`">
    <div class="post-content">
      <div class="gradient">
        <div class="overlay">
          <span class="comment">
            {{ post.comment_count }}
            <Bubble></Bubble>
          </span>
          <span class="votes">
            {{ post.score }}
            <Heart></Heart>
          </span>
        </div>
      </div>
      <img class="thumb" v-bind:src="`${address}/uploads/thumbs/${post.filename}.jpg`">
    </div>
  </nuxt-link>
</template>

<script>
import { address } from "~/../config"
import Heart from "~/components/heart"
import Bubble from "~/components/bubble"

export default {
    components: { Heart, Bubble },
    computed: {
        address() {
            return address
        },
    },
    props: ["post"],
}
</script>


<style lang="less" scoped>
img {
    vertical-align: bottom;
}

.post {
    display: inline-block;
}

.post-content {
    position: relative;
    width: 100%;
}

.overlay {
    position: absolute;
    bottom: 0.5em;
    right: 0.5em;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.38);
    font-size: 1.25em;
}

.gradient {
    position: absolute;
    display: inline-block;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.85) 0%,
        rgba(0, 0, 0, 0) 20%
    );
    opacity: 100;
    color: white;
}

@media (hover: hover) {
    .gradient {
        opacity: 0;
        transition: ease 0.5;

        &:hover {
            opacity: 1;
        }
    }
}

.thumb {
    width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.votes {
    margin-left: 0.5em;
}
</style>
