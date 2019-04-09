const errors = {
    http_bad_request: 400,
    uc_username_taken: 1000,
    uc_data_missing: 1001,
    uc_data_invalid: 1002,
    fu_id_invalid: 1010,
    fu_user_not_found: 1011,
    fu_password_doesnt_match: 1012,
    fu_token_required: 1013,
    fu_token_invalid: 1014,
    fu_data_missing: 1015,
    fp_id_invalid: 1020,
    fp_post_not_found: 1021,
    fp_invalid_comment: 1022,
    fp_comment_not_found: 1023,
    iu_file_handling_error: 1022,
    iu_too_many_files: 1023,
    iu_too_many_fields: 1024,
    iu_file_too_large: 1025,
    iu_no_image: 1026,
    iu_wrong_content_type: 1027,
    iu_maleformed_form_data: 1028,
}

function turnIntoErrorMsg(msg) {
    msg = msg.split("_")
    msg.shift()
    let str
    for (let i = 0, len = msg.length; i < len; i++) {
        str = msg[i]
        msg[i] = str.charAt(0).toUpperCase() + str.slice(1)
    }
    return msg.join(" ")
}

function setupErrorObject() {
    const keys = Object.keys(errors)
    let key = ""
    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i]
        errors[key] = {
            statusCode: errors[key],
            code: key,
            error: turnIntoErrorMsg(key),
        }
    }
}

setupErrorObject()

module.exports = errors
