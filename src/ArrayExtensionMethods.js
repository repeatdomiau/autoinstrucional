// eslint-disable-next-line
Array.prototype.any = function (func) {
    return this.reduce((res, test) => res === true ? true : func(test), false);
}

