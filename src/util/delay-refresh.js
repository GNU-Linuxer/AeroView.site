
// The helper function that limits number of window resizing event frequency
// Code is adapted from https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
export function debounce(fn, ms) {
    let timer
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
        }, ms)
    };
}