<template>
    <Nuxt />
</template>

<script>
if (process.client) {
    window.addEventListener("dragover", e => {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = "none"
    })
    window.addEventListener("ondrop", e => {
        e.stopPropagation()
        e.preventDefault()
    })
}

export default {}
</script>

<style lang="less">
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
</style>
