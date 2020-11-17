const interpolate = (content, arr = []) => {

    if (arr.length === 0) return [];
    if (arr.length === 1) return arr;

    const lastIndex = arr.length;

    return arr.reduce((res, item, i) => {
        return i === 0 ? [...res, item] :
            i < lastIndex ?
                [...res, content, item] :
                [...res, item];
    }, []);

}

export default interpolate;