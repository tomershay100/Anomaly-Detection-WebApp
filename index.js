function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function syncList() {
    setTimeout(updateList, 0);
}

function updateList() {
    //while (true) {
        //sleep(1000).then(r => {
            let xhttp;
            xhttp = new XMLHttpRequest();

            xhttp.open("GET", "/api/models", true);
            xhttp.send();

            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let myObj = JSON.parse(this.responseText);
                    let list = "";
                    for (const myObjKey in myObj) {
                        list += myObj[myObjKey].id + " ";
                        addValue(myObj[myObjKey].id);
                    }
                    document.getElementById("listOfFiles").innerHTML =
                        list;
                }
            };
        //});

   // }
}


var lastAddedIndex = 0;
function addValue(value) {
    //alert("Please select any item from the ListBox");

    //var v = document.form1.txtValue.value;
    //document.getElementById("tomer").innerHTML=v;
    // get the TextBox Value and assign it into the variable
    document.form1.lstValue.options[lastAddedIndex++] = new Option(value, value);
    return true;
}
function deleteValue() {
    var s = 1;
    var Index;
    if (document.form1.lstValue.selectedIndex === -1) {
        alert("Please select any item from the ListBox");
        return true;
    }
    while (s > 0) {
        Index = document.form1.lstValue.selectedIndex;
        if (Index >= 0) {
            document.form1.lstValue.options[Index] = null;
            --lastAddedIndex;
        }
        else
            document.
                s = 0;
    }
    return true;
}