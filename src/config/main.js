if (typeof $ === 'function') {
    $.toastchart = {
        helper: {},
        model: {},
        view: {},
        controller: {}
    };
} else {
    throw 'You need to include jquery!';
}
