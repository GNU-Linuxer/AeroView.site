/*
 * This file provides array utility functions.
 */

/*
 * For a specified element, if it is in the specified array, remove it;
 * otherwise, push it back to the array's end.
 *
 * This function does not modify the array passed in; instead, it returns a new
 * array with updated members.
 *
 * Parameters:
 * - element: the element to toggle
 * - array: the array to be modified
 */
export function toggleElementInArray(element, array) {
    let newArray;
    if (array.includes(element)) {
        // The element is selected; unselect it
        newArray = array.filter(elt => elt !== element);
    } else {
        // The element is unselected; select it
        newArray = [...array, element];
    }
    return newArray;
}
