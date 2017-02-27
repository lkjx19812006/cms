export function host(url) {
    const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    const parts = host.split('.').slice(-3)
    if (parts[0] === 'www') parts.shift()
    return parts.join('.')
}

export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute')
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour')
    } else {
        return pluralize(~~(between / 86400), ' day')
    }
}

function pluralize(time, label) {
    if (time === 1) {
        return time + label
    }
    return time + label + 's'
}

export function formatTime(time) {
  console.log(time);
    return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

export function formatClientType(type) {
    let client = '';
    switch (type) {
        case 0:
            client = 'ios';
            break;
        case 1:
            client = 'android';
            break;
        default:
            client = '未知';
            break;
    }
    return client;
}

export function formatOpenType(type) {
    let client = '';
    switch (type) {
        case 0:
            client = '未开启';
            break;
        case 1:
            client = '已开启';
            break;
        default:
            client = '未知';
            break;
    }
    return client;
}

export function formatMediaType(type) {
    let client = '';
    switch (type) {
        case 0:
            client = '无效';
            break;
        case 1:
            client = '有效';
            break;
        default:
            client = '未知';
            break;
    }
    return client;
}