var theThing = 1;
function doGlobalThing(){
    var local = 7;
    return (
        ()=>{ 
            console.log(local);
            return local; 
        }
    )
}
var returnFunction = doGlobalThing();
function enotherFunction(doThing) {
    var local = 455;
    doThing();
}
enotherFunction(returnFunction);