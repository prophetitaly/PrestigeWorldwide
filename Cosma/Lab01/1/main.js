"use strict";

function a(strings) {
    return strings.map((string) => {
        if (string.length < 2) {
            return "";
        } else {
            return string.slice(0, 2) + string.slice(string.length-2, string.length);
        }
    });
}

console.log(a(["Ciaone", "Ciao", "Ci", "c"]));