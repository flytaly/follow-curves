export function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}

/**
 * @template T
 * @arg {T[]} arr
 * @returns {T} elem
 * */
export function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function map(value, in_min, in_max, out_min, out_max) {
    return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
