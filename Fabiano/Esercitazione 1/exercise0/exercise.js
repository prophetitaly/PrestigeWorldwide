let array = [ 'Hello', 'a', ' poi', 'ab'];

console.log(array);

array = array.map( x => {
    if(x.length<2) return '';
    return x.slice(0,2) + x.slice(x.length-2, x.length);
});
console.log(array);

debugger;

