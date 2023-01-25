// single collections of regex used to sort the .mag file
const psoID = /Viridia|Greenill|Skyly|Bluefull|Purplenum|Pinkal|Redria|Oran|Yellowboze|Whitill/g ;
const psoClass = /HUmar|HUnewearl|HUcast|HUcaseal|RAmar|RAmarl|RAcast|RAcaseal|FOmar|FOmarl|FOnewm|FOnewearl/g ;
const psoItems = /Monomate|Dimate|Trimate|Monofluid|Difluid|Trifluid|Antidote|Antiparalysis|Sol Atomizer|Moon Atomizer|Star Atomizer/g ;
const psoLvl = /cf4\s*(.*?)\s*par/g ;

// all of the regex collections in one
// used to sort the file into an array
const psoRe = /Viridia|Greenill|Skyly|Bluefull|Purplenum|Pinkal|Redria|Oran|Yellowboze|Whitill|HUmar|HUnewearl|HUcast|HUcaseal|RAmar|RAmarl|RAcast|RAcaseal|FOmar|FOmarl|FOnewm|FOnewearl|Monomate|Dimate|Trimate|Monofluid|Difluid|Trifluid|Antidote|Antiparalysis|Sol Atomizer|Moon Atomizer|Star Atomizer|cf4\s*(.*?)\s*par/g;

// triggers upon file input
async function readText(event) {
    const file = event.target.files.item(0)
    const text = await file.text();
    const filtered = text.match(psoRe);
    
    let arrays = makeAhkArrays(filtered);
    console.log(arrays);
    //const elToDisplay = readyArrForDisplay();

    document.getElementById("output").innerText = arrays
  }

function makeAhkArrays(array){
    let lastLvl = "";
    let currId = "";
    let currClass = "";
    let itemCount = 1;
    let currItem = "";
console.log(array);
    // even index's contain class , ID and lvl info .  Odds contain the actual AHK feed array
    let ahkArrays = [];

    let currArray = [];

    // even index's contain item names, odds contain the number of the item to feed
    let itemArrayIndx = 0;

    for(i=10; i<array.length; i++){
        if ( array[i].match( psoItems ) ) {
            //console.log("its an item");
            if ( currItem === array[i] ) {
                itemCount++
            } else if ( currItem === "" ) { // if its the first item
                currItem = array[i]
            } else { // it's a new item
                currArray.push(currItem);
                currItem = array[i];
                currArray.push( itemCount );
                itemCount = 1;
            }
            if ( i === array.length-1) {
                currArray.push(currItem);
                currArray.push(itemCount);
                console.log("last line was an item",currArray);
                ahkArrays.push(currArray)
            }
        } else if ( array[i].match( psoLvl ) ) {
            //console.log("its a lvl up");
            lastLvl = array[i];
            if ( i === array.length-1 ) {
                console.log(i, "last line was a lvl up");
                currArray.push(currItem, itemCount);
                ahkArrays.push(currArray)
            }
        } else if ( array[i].match( psoClass ) ) {
            console.log("its a class");
            console.log(currArray);
            if ( currClass === "" ) { // if its the first class
                currClass = array[i]
            }
            if ( array[i + 1].match( psoID ) ) { // if the next string contains an id
                ++i;
                currId = array[i];
                if ( currArray.length > 0 ) { // if the currArray contains something push it before starting new currArray
                    ahkArrays.push( currArray );
                    currArray = []
                }
                if (lastLvl !== "") {
                    currArray.push( lastLvl );
                }
                currArray.push( currClass );
                currArray.push( currId );
                ahkArrays.push( currArray )
                currArray = []
                
            } else { // class switched
                if ( currArray.length > 0 ) { // if the currArray contains something push it before starting new currArray
                    currArray.push(currItem, itemCount);
                    ahkArrays.push( currArray );
                    itemCount = 0;
                    currItem = 0;
                    currArray = []
                }
                if (lastLvl !== "") {
                    currArray.push( lastLvl );
                }
                currClass = array[i];
                currArray.push( currClass );
                ahkArrays.push( currArray )
                currArray = []
            }
        } else if ( array[i].match( psoID ) ) {
            console.log("its an ID");
            if ( array[i + 1].match( psoClass ) ) { // if the next string contains a class
                ++i;
                currClass = array[i];
                if ( currArray.length > 0 ) { // if the currArray contains something push it before starting new currArray
                    ahkArrays.push( currArray );
                    currArray = []
                }
                if (lastLvl !== "") {
                    currArray.push( lastLvl );
                }
                currArray.push( currClass, currId );
                ahkArrays.push( currArray )
                currArray = []
                
            } else { // id switched
                if ( currArray.length > 0 ) { // if the currArray contains something push it before starting new currArray
                    currArray.push(currItem, itemCount);
                    ahkArrays.push( currArray );
                    itemCount = 0;
                    currItem = 0;
                    currArray = []
                }
                currId = array[i];
                currArray.push( currId );
                currArray.push( lastLvl );
                ahkArrays.push( currArray )
                currArray = []
            }
        } else {
            console.log(array[i]);
        }
    }
    return ahkArrays
}

function readyArrForDisplay( array ) {

}