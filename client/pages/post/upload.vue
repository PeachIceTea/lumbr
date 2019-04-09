<template>
    <div class="upload">
        <div class="error" v-if="error">{{ error }}</div>
        <div
            class="drag"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
        >
            <div class="msg">
                <span v-if="!hoverFile">Drag your image here</span>
                <span v-if="hoverFile && !drop">Let your image go</span>
                <span class="uploading" v-if="fileDroped"
                    >Uploading <span>.</span><span>.</span><span>.</span></span
                >
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios"

// TODO: Have the messages become increasingly fustrated as the file is hovered over the zone
export default {
    data() {
        return {
            hoverFile: false,
            fileDroped: false,
            error: null,
        }
    },
    methods: {
        //TODO: Disable drag while uploading
        dragover(e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = "copy"
            e.target.classList.add("hover")
            this.hoverFile = true
        },
        dragleave(e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = "none"
            e.target.classList.remove("hover")
            this.hoverFile = false
        },
        async drop(e) {
            e.stopPropagation()
            e.preventDefault()
            if (!this.fileDroped) {
                this.fileDroped = true

                const files = e.dataTransfer.files
                console.log(files)
                if (files.length === 1) {
                    await this.$store.dispatch("posts/new", files[0])
                    this.$router.push(
                        `/post/${this.$store.state.posts.post.id}`
                    )
                } else {
                    this.error = "Only one image can be uploaded at a time" //TODO: Implement pools and multi-image uploads
                    this.hoverFile = false
                    this.fileDroped = false
                }
            }
        },
    },
}
</script>


<style lang="less" scoped>
.drag {
    display: flex;
    width: 20em;
    height: 15em;
    border: 1px dashed black;
    justify-content: center;
    align-items: center;
}

.uploading span {
    animation: loading 1s infinite both;
}

.upload span:nth-child(2) {
    animation-delay: 0.3s;
}

.upload span:nth-child(3) {
    animation-delay: 0.6s;
}

@keyframes loading {
    0% {
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
