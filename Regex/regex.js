const regex = {
    onlyString:/^[a-zA-z\s]+$/,
    onlyNumber:/^(0|[1-9]\d*)$/,
    periodYear:/^(?:[0-9]|[1-4][0-9]|50)$/,
    percentage:/^(100(\.0+)?|[1-9]?\d(\.\d+)?|0(\.0+)?){1}$/,
    arrayNumber:/\[\s*(-?\d+(\.\d+)?(\s*,\s*-?\d+(\.\d+)?)*)?\s*\]/,
    email:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    month:/^(?:0|[1-9]|1[0-2])$/,
    panCard : /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    aadharCard : /^[0-9]{12}$/
}
module.exports = regex