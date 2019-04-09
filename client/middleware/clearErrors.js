export default function({ store }) {
    if (store.state.auth.error) store.commit("auth/clearError")
}
