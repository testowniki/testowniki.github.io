
var ust1;
var ust2;

var rozpoczeto = false;
var sprawdzono = false;
var zaznaczono = false;

var liczbaPowtorzen = [153];
var pozostaloPytan = 153;
var pierwsza = 0;

var numerPytania;
var nazwa;
var kolejnosc;
var poprawnaKolejnosc = [3];
var dobraOdpowiedz;

var zaznaczona;

var kontynuacja = 1;

var dobrych = 0;
var zlych = 0;

function getCiasteczka() {
    let name = "pierwsza=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCiasteczka(zaczynamy) {
    napis = "pierwsza=" + zaczynamy;
    document.cookie = napis;
}

function start() {
    ust1 = document.getElementById("ustawienie1").value;    //pobieranie ilosci powtorzen pytania
    ust2 = document.getElementById("ustawienie2").value;    //pobieranie ilosci przy zlej odpowiedzi

    dobrych = 0;
    zlych = 0;
    document.getElementById("dobrychOdpowiedzi").innerHTML = dobrych;
    document.getElementById("zlychOdpowiedzi").innerHTML = zlych;

    if (ust1 > 0 && ust2 > -1) {
        if (kontynuacja == 1) {
            pierwsza = getCiasteczka();
            if (pierwsza == "")
                pierwsza = 0;
            else
                pierwsza = parseInt(getCiasteczka());

            kontynuacja = 0;
        }
        else {
            pierwsza = 0;
            setCiasteczka(pierwsza);
        }

        rozpoczeto = true;
        zaznaczono = false;
        sprawdzono = false;
        zaznaczona = 0;
        pozostaloPytan = 153 - pierwsza;

        document.getElementById("bledy").style.visibility = "visible";
        document.getElementById("bledy").innerHTML = "Nie zaznaczono odpowiedzi";
        document.getElementById("przyciskZaladuj").style.visibility = "visible";
        document.getElementById("przyciskSprawdz").style.visibility = "visible";
        document.getElementById("przyciskDalej").style.visibility = "hidden";
        document.getElementById("pozostalo").style.visibility = "visible";
        document.getElementById("pytanie").style.visibility = "visible";
        document.getElementById("odp1").style.visibility = "visible";
        document.getElementById("odp2").style.visibility = "visible";
        document.getElementById("odp3").style.visibility = "visible";

        reset();    //ustawienie tablicy pwtorzen
        losuj();    //losowanie pytania
        zaladuj();  //wyswietlenie pytania
    }
}

function zaladuj() {
    if (sprawdzono) return;

    zaznaczono = false;
    zaznaczona = 0;
    document.getElementById("bledy").innerHTML = "Nie zaznaczono odpowiedzi";
    document.getElementById("odp1").style.background = "white";   //ustawienie koloru
    document.getElementById("odp2").style.background = "white";   //dla kazdej odpowiedzi
    document.getElementById("odp3").style.background = "white";   //na niezaznaczona
    document.getElementById("odp1").style.color = "black";
    document.getElementById("odp2").style.color = "black";
    document.getElementById("odp3").style.color = "black";

    var plik = "baza/" + nazwa + ".txt";
    getData(plik);  //otwarcie pliku z wylosowanym pytaniem
}

function losuj() {
    if (!rozpoczeto) return;

    do numerPytania = Math.floor(Math.random() * 20 + 1 + pierwsza);    //losujemy od pierwszej dostepnej do max 20 dalej
    while (numerPytania > pozostaloPytan + pierwsza);

    if (liczbaPowtorzen[numerPytania - 1] == 0)  //jeżeli wylosowane pytanie juz ma się nie powtarzać losujemy jeszcze raz
        losuj();
    else if (numerPytania < 10) nazwa = "00" + numerPytania;
    else if (numerPytania < 100) nazwa = "0" + numerPytania;
    else if (numerPytania > 99) nazwa = numerPytania;

    document.getElementById("pozostalo").innerHTML = "Pozostało pytań: " + pozostaloPytan;    //aktualizacja tekstu

    zaznaczona = 0;   //wyzerowanie zaznaczonego pola

    var plik = "baza/" + nazwa + ".txt";
    document.getElementById("numerPytania").innerHTML = plik;
    getData(plik);  //otwarcie pliku z wylosowanym pytaniem

}

function reset() {
    for (i = 0; i < pozostaloPytan; i++)
        liczbaPowtorzen[i] = ust1;    //ustawiamy ilosc powtorzen każdego pytania na domyslna
}

function getData(plik) {
    var xmlhttp;

    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            var lines = xmlhttp.responseText;    //*here we get all lines from text file*

            intoArray(lines);     //here we call function with parameter "lines*"                   
        }
    }

    xmlhttp.open("GET", plik, true);
    xmlhttp.send();
}

function intoArray(lines) {
    var lineArr = lines.split('\n');

    document.getElementById("pytanie").innerHTML = lineArr[1];   //wyswietlamy pytanie w odpowiednim miejscu

    if (lineArr[0][1] == "1") dobraOdpowiedz = 1;  //zapisujemy w zmiennej
    if (lineArr[0][2] == "1") dobraOdpowiedz = 2;  //która z odpowiedzi
    if (lineArr[0][3] == "1") dobraOdpowiedz = 3;  //jest poprawna

    kolejnosc = Math.floor(Math.random() * 6 + 1);  //losujemy w jakiej kolejnosci mają się wyświetlać pytania

    if (kolejnosc == 1) {
        poprawnaKolejnosc = [1, 2, 3];
        document.getElementById("odp1").innerHTML = lineArr[1 + 1];    //jedna odpowiedz zawsze się wyświetli

        if (lineArr[2 + 1] != undefined)                                   //jeżeli będzie wiecej
            document.getElementById("odp2").innerHTML = lineArr[2 + 1];    //to one też się wyswietla
        else document.getElementById("odp2").innerHTML = "brak odpowiedzi";

        if (lineArr[3 + 1] != undefined)
            document.getElementById("odp3").innerHTML = lineArr[3 + 1];
        else document.getElementById("odp3").innerHTML = "brak odpowiedzi";
    }

    else if (kolejnosc == 2) {
        poprawnaKolejnosc = [1, 3, 2];
        if (dobraOdpowiedz == 2) dobraOdpowiedz = 3;
        else if (dobraOdpowiedz == 3) dobraOdpowiedz = 2;

        document.getElementById("odp1").innerHTML = lineArr[1 + 1];    //jedna odpowiedz zawsze się wyświetli

        if (lineArr[2 + 1] != undefined)                                   //jeżeli będzie wiecej
            document.getElementById("odp2").innerHTML = lineArr[3 + 1];    //to one też się wyswietla
        else document.getElementById("odp2").innerHTML = "brak odpowiedzi";

        if (lineArr[3 + 1] != undefined)
            document.getElementById("odp3").innerHTML = lineArr[2 + 1];
        else document.getElementById("odp3").innerHTML = "brak odpowiedzi";
    }

    else if (kolejnosc == 3) {
        poprawnaKolejnosc = [2, 1, 3];
        if (dobraOdpowiedz == 2) dobraOdpowiedz = 1;
        else if (dobraOdpowiedz == 1) dobraOdpowiedz = 2;

        if (lineArr[2 + 1] != undefined)
            document.getElementById("odp1").innerHTML = lineArr[2 + 1];
        else document.getElementById("odp1").innerHTML = "brak odpowiedzi";

        document.getElementById("odp2").innerHTML = lineArr[1 + 1];

        if (lineArr[3 + 1] != undefined)
            document.getElementById("odp3").innerHTML = lineArr[3 + 1];
        else document.getElementById("odp3").innerHTML = "brak odpowiedzi";
    }

    else if (kolejnosc == 4) {
        poprawnaKolejnosc = [2, 3, 1];
        if (dobraOdpowiedz == 1) dobraOdpowiedz = 3;
        else if (dobraOdpowiedz == 2) dobraOdpowiedz = 1;
        else if (dobraOdpowiedz == 3) dobraOdpowiedz = 2;

        if (lineArr[2 + 1] != undefined)
            document.getElementById("odp1").innerHTML = lineArr[2 + 1];
        else document.getElementById("odp1").innerHTML = "brak odpowiedzi";

        if (lineArr[3 + 1] != undefined)
            document.getElementById("odp2").innerHTML = lineArr[3 + 1];
        else document.getElementById("odp2").innerHTML = "brak odpowiedzi";

        document.getElementById("odp3").innerHTML = lineArr[1 + 1];
    }


    else if (kolejnosc == 5) {
        poprawnaKolejnosc = [3, 1, 2];
        if (dobraOdpowiedz == 1) dobraOdpowiedz = 2;
        else if (dobraOdpowiedz == 2) dobraOdpowiedz = 3;
        else if (dobraOdpowiedz == 3) dobraOdpowiedz = 1;

        if (lineArr[3 + 1] != undefined)
            document.getElementById("odp1").innerHTML = lineArr[3 + 1];
        else document.getElementById("odp1").innerHTML = "brak odpowiedzi";

        document.getElementById("odp2").innerHTML = lineArr[1 + 1];

        if (lineArr[2 + 1] != undefined)
            document.getElementById("odp3").innerHTML = lineArr[2 + 1];
        else document.getElementById("odp3").innerHTML = "brak odpowiedzi";
    }

    else if (kolejnosc == 6) {
        poprawnaKolejnosc = [3, 2, 1];
        if (dobraOdpowiedz == 1) dobraOdpowiedz = 3;
        else if (dobraOdpowiedz == 3) dobraOdpowiedz = 1;

        if (lineArr[3 + 1] != undefined)
            document.getElementById("odp1").innerHTML = lineArr[3 + 1];
        else document.getElementById("odp1").innerHTML = "brak odpowiedzi";

        if (lineArr[2 + 1] != undefined)
            document.getElementById("odp2").innerHTML = lineArr[2 + 1];
        else document.getElementById("odp2").innerHTML = "brak odpowiedzi";

        document.getElementById("odp3").innerHTML = lineArr[1 + 1];
    }
}

function zaznacz(numer) {
    if (sprawdzono) return;

    document.getElementById("odp1").style.background = "white";   //ustawienie koloru
    document.getElementById("odp2").style.background = "white";   //dla kazdej odpowiedzi
    document.getElementById("odp3").style.background = "white";   //na niezaznaczona
    document.getElementById("odp1").style.color = "black";
    document.getElementById("odp2").style.color = "black";
    document.getElementById("odp3").style.color = "black";

    if (zaznaczona == 0)   //gdy nie ma żadnej zaznaczonej odpowiedzi
    {
        zaznaczona = numer; //ustawiamy zaznaczone pole
        zaznaczono = true;
        var element = "odp" + numer;
        document.getElementById(element).style.color = "white";
        document.getElementById(element).style.background = "gray";  //zmieniamy jego kolor na ciemniejszy
    }
    else if (zaznaczona == numer)  //odznaczanie zaznaczonej
    {
        zaznaczona = 0;   //zerujemy zaznaczone pole
        var element = "odp" + numer;
        zaznaczono = false;
        document.getElementById(element).style.background = "white";  //ustawiany kolor na domyslny jasniejszy niebieski
    }
    else if (zaznaczona != numer)  //zaznaczanie innej odpowiedzi
    {
        var element = "odp" + zaznaczona;
        document.getElementById(element).style.background = "white";  //ustawiamy kolor wczesniej wybranego pola na domyslny jasniejszy niebieski
        zaznaczono = true;
        zaznaczona = numer;
        element = "odp" + zaznaczona;
        document.getElementById(element).style.color = "white";
        document.getElementById(element).style.background = "gray";  //ustawiamy kolor nowego wyboru na ciemniejszy niebieski
    }

    if (zaznaczona == 0) document.getElementById("bledy").innerHTML = "Nie zaznaczono odpowiedzi";

    document.getElementById("bledy").innerHTML = "Zaznaczono: " + zaznaczona;
}

function sprawdz() {
    if (sprawdzono) return;

    if (zaznaczona == dobraOdpowiedz) {
        liczbaPowtorzen[numerPytania - 1]--;  //zmniejszamy liczbe powtorzen danego pytania o 1
        if (liczbaPowtorzen[numerPytania - 1] == 0)     //jezeli dane pytanie ma juz sie nie pojawiać
        {
            if (numerPytania - 1 == pierwsza)    //to sprawdzamy czy bylo pierwszy z losowanych
            {
                var koniec = false; //warunek zakonczenia szukania
                while (!koniec) {
                    pierwsza++;     //zwiekszamy numer pierwszego z losowanych pytan o 1
                    if (liczbaPowtorzen[pierwsza] != 0)    //sprawdzamy czy mozna je losowac
                        koniec = true;    //konczymy
                }
            }
            pozostaloPytan--;   //wyzerowaliśmy liczbe powtorzeń danego pytania więc liczbe pozostałych pytań zmniejszamy o 1
            document.getElementById("pozostalo").innerHTML = "Pozostalo pytań: " + pozostaloPytan;    //aktualizacja tekstu
        }

        var element = "odp" + zaznaczona;
        document.getElementById(element).style.background = "#07bc01";  //ustawiamy kolor wybranej odpowiedzi na zielony
        document.getElementById(element).style.color = "black";

        dobrych++;
        document.getElementById("dobrychOdpowiedzi").innerHTML = dobrych;

    }
    else if (zaznaczona != dobraOdpowiedz || zaznaczona == 0)    //jeżeli zaznaczono złą odpowiedź
    {
        if (ust2 != 0) {
            for (i = 0; i < ust2; i++)
                liczbaPowtorzen[numerPytania - 1]++;    //zwiększamy ilość jego wystąpień
        }
        else {
            liczbaPowtorzen[numerPytania - 1]--;  //zmniejszamy liczbe powtorzen danego pytania o 1
            if (liczbaPowtorzen[numerPytania - 1] == 0)     //jezeli dane pytanie ma juz sie nie pojawiać
            {
                if (numerPytania - 1 == pierwsza)    //to sprawdzamy czy bylo pierwszy z losowanych
                {
                    var koniec = false; //warunek zakonczenia szukania
                    while (!koniec) {
                        pierwsza++;     //zwiekszamy numer pierwszego z losowanych pytan o 1
                        if (liczbaPowtorzen[pierwsza] != 0)    //sprawdzamy czy mozna je losowac
                            koniec = true;    //konczymy
                    }
                }
                pozostaloPytan--;   //wyzerowaliśmy liczbe powtorzeń danego pytania więc liczbe pozostałych pytań zmniejszamy o 1
                document.getElementById("pozostalo").innerHTML = "Pozostalo pytań: " + pozostaloPytan;    //aktualizacja tekstu
            }
        }

        if (zaznaczona != 0) {
            var element = "odp" + zaznaczona;
            document.getElementById(element).style.background = "#cf0000";  //zmieniamy kolor wybranej odpowiedzi na czerwony
        }

        var element2 = "odp" + dobraOdpowiedz;
        document.getElementById(element2).style.background = "#07bc01"; //poprawną odpowiedź podświetlamy na zielono
        document.getElementById(element2).style.color = "black";

        zlych++;
        document.getElementById("zlychOdpowiedzi").innerHTML = zlych;
    }

    document.getElementById("bledy").innerHTML = "Pytanie pojawi się jeszcze " + liczbaPowtorzen[numerPytania - 1] + " razy";
    document.getElementById("przyciskDalej").style.visibility = "visible";
    sprawdzono = true;
}

function dalej() {
    if (pozostaloPytan == 0) {

        document.getElementById("menu").innerHTML = "Odpowiedziano na wszystkie pytania!<br><br>Aby zacząć od nowa odśwież stronę<br><br>Strona główna: <a href=" + '"../index.html" class="link"><h4>Testownik online</h4></a><br>Dobrych odpowiedzi: <span id="dobrychOdpowiedzi">0</span><br>Złych odpowiedzi: <span id="zlychOdpowiedzi">0</span><br><span id="timer">00:00:00</span><br>';
        document.getElementById("dobrychOdpowiedzi").innerHTML = dobrych;
        document.getElementById("zlychOdpowiedzi").innerHTML = zlych;
        document.getElementById("koniec").innerHTML = "";
        stop();
        setCiasteczka(0);
    }
    else {
        document.getElementById("bledy").innerHTML = "Nie zaznaczono odpowiedzi";

        sprawdzono = false;
        zaznaczono = false;

        document.getElementById("przyciskDalej").style.visibility = "hidden";   //ukrywamy przycisk "Dalej"

        setCiasteczka(pierwsza);

        losuj();
        zaladuj();
    }

}

function hoverin(ktore) {
    var element = "odp" + ktore;

    if (!sprawdzono)
        if (!zaznaczono) {
            document.getElementById(element).style.background = "gray";
            document.getElementById(element).style.color = "white";
        }
        else {
            if (zaznaczona != ktore) {
                document.getElementById(element).style.background = "gray";
                document.getElementById(element).style.color = "white";
            }
        }
}

function hoverout(ktore) {
    var element = "odp" + ktore;

    if (!sprawdzono)
        if (!zaznaczono) {
            document.getElementById(element).style.background = "white";
            document.getElementById(element).style.color = "black";
        }
        else {
            if (zaznaczona != ktore) {
                document.getElementById(element).style.background = "white";
                document.getElementById(element).style.color = "black";
            }
        }
}