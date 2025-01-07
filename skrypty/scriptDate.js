var dzisiaj;
var dzien;


var poprawaG = new Date('02/07/2023');

var poprawaPEA = new Date('02/09/2023');

var poprawaSO = 0;

var poprawaUC = new Date('02/06/2023');

var poprawaUP = new Date('01/31/2023');

var poprawaIO = new Date('02/10/2023');

function wpiszDaty() {
    var now = new Date().getTime();

    //grafika


    if (poprawaG != 0)
        document.getElementById("poprawa grafika").innerHTML = "Poprawa: " + poprawaG.toLocaleDateString();
    else
        document.getElementById("poprawa grafika").innerHTML = "Poprawa: brak daty";

    //Projektowanie Efektywnych algorytmów
    if (poprawaPEA != 0)
        document.getElementById("poprawa PEA").innerHTML = "Poprawa: " + poprawaPEA.toLocaleDateString();
    else
        document.getElementById("poprawa PEA").innerHTML = "Poprawa: brak daty";

    //Systemy Operacyjne
    if (poprawaSO != 0)
        document.getElementById("poprawa SO").innerHTML = "Poprawa: " + poprawaSO.toLocaleDateString();
    else
        document.getElementById("poprawa SO").innerHTML = "Poprawa: brak daty";

    //Układy Cyfrowe i Systemy Wbudowane
    if (poprawaUC != 0)
        document.getElementById("poprawa UCISW").innerHTML = "Poprawa: " + poprawaUC.toLocaleDateString();
    else
        document.getElementById("poprawa UCISW").innerHTML = "Poprawa: brak daty";

    //Urządzenia Peryferyjne
    if (poprawaUP != 0)
        document.getElementById("poprawa UP").innerHTML = "Poprawa: " + poprawaUP.toLocaleDateString();
    else
        document.getElementById("poprawa UP").innerHTML = "Poprawa: brak daty";

    //Inżynieria Oprogramowania
    if(poprawaIO != 0)
        document.getElementById("poprawa IO").innerHTML = "Poprawa: " + poprawaIO.toLocaleDateString();

    else
        document.getElementById("poprawa IO").innerHTML = "Poprawa: brak daty";
}
