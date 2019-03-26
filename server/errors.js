const errors = {
    no_error: 0,
    bad_request: 400,
    not_found: 404,
    internal_server_error: 500,

    uc_information_missing: 1000,
    uc_information_invalid: 1001,
    uc_username_taken: 1002,
    ul_information_missing: 1100,
    ul_wrong_password: 2101,
    ul_user_not_found: 2102,
    auth_token_missing: 2200,
    auth_token_invalid: 2201,
    fu_information_missing: 2300,
    fu_user_not_found: 2302,
    fu_no_posts_found: 2303,
    iu_upload_error: 2400,
    iu_file_handling_error: 2401,
    iu_no_image: 2402,
    iu_file_too_large: 2403,
    iu_too_many_fields: 2404,
    iu_too_many_files: 2405,
    iv_id_invalid: 2500,
    iv_post_not_found: 2501,
    pc_content_missing: 2600,
    pc_type_missing: 2601,
}

;(function addReverseKeyValue() {
    const keys = Object.keys(errors)
    let key, val
    for (let i = 0, len = keys.length; i < len; i++) {
        ;(key = keys[i]), (val = errors[key])
        errors[val] = key
    }
})()

module.exports = errors
