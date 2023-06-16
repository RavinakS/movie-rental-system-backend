exports.error_messages = {
    server_error: {status_code: 500, message: "Already exist."},
    not_exist: {status_code: 404, message: "Not found."},
    wrong_pass: {status_code: 400, message: "Incorrect Password"},
    login_page: {status_code: 404, message: "** Login/Signup page **"},
    un_authorized: {status_code: 401, message: "Only admins can see all user's data."},
    required: {status_code: 400, message: "Invalid input."},
    al_exist: {status_code: 403, message: "Already exist."},
    server_err_down_mtnce: {status_code: 503, message: "Service Unavailable."},
    time_out: {status_code: 408, message: "Request Timeout."}
}

exports.responses = {
    succeeded: {status_code: 200, message: 'Successfully Done.'}
}