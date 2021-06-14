function addGetParams(url, params) {
    let tmp = [];
    for (var param in params) {
        tmp.push(param + '=' + params[param]);
    }
    for (let i = 0; i < tmp.length; i++) {
        if (i) url += '&';
        url += tmp[i];
    }
    return url;
}
