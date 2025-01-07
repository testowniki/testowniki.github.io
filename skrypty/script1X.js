var ust1;
var ust2;

var liczbaPowtorzen = [];
var pozostaloPytan;

var rozpoczeto = false;
var sprawdzono = false;
var zaznaczono = false;

var pierwsza = 0;

var numerPytania;
var nazwa;
var dobraOdpowiedz;
var ileOdpowiedzi = 0;
var kolejnosc = [];

var zaznaczona;
var zaznaczone = [];

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

function start(numer) {
    ust1 = document.getElementById("ustawienie1").value;    //pobieranie ilosci powtorzen pytania
    ust2 = document.getElementById("ustawienie2").value;    //pobieranie ilosci przy zlej odpowiedzi


    dobrych = 0;
    zlych = 0;
    document.getElementById("dobrychOdpowiedzi").innerHTML = dobrych;
    document.getElementById("zlychOdpowiedzi").innerHTML = zlych;

    if (ust1 > 0 && ust2 > -1)   //kontrola błędów
    {
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
        if (numer == 1)  //ucisw
        {
            liczbaPowtorzen.length = 151;
            reset(151);    //ustawienie tablicy pwtorzen
            pozostaloPytan = 151 - pierwsza;
        }
        else if (numer == 2) //up
        {
            liczbaPowtorzen.length = 57;
            reset(57);    //ustawienie tablicy pwtorzen
            pozostaloPytan = 57 - pierwsza;
        }
        else if (numer == 3) //so2
        {
            liczbaPowtorzen.length = 463;
            reset(463);    //ustawienie tablicy pwtorzen
            pozostaloPytan = 463 - pierwsza;
        }

        zaznaczono = false;
        sprawdzono = false;
        rozpoczeto = true;
        zaznaczona = 0;

        document.getElementById("przyciskZaladuj").style.visibility = "visible";    //widocznosc przycisku "zaladuj"
        document.getElementById("przyciskSprawdz").style.visibility = "visible";
        document.getElementById("bledy").style.visibility = "visible";
        document.getElementById("pytanie").style.visibility = "visible";
        document.getElementById("pozostalo").style.visibility = "visible";

        reset(151);
        losuj();    //losowanie pytania
        zaladuj();  //wyswietlenie pytania
    }
}

function zaladuj() {
    if (sprawdzono) return;

    zaznaczono = false;
    zaznaczona = 0;
    sprawdzono = false;

    document.getElementById("przyciskDalej").style.visibility = "hidden";   //ukrycie przycisku "Dalej"

    var plik = "baza/" + nazwa + ".txt";
    getData(plik);  //otwarcie pliku z wylosowanym pytaniem
}

function losuj() {
    if (rozpoczeto) {
        do numerPytania = Math.floor(Math.random() * 20 + 1 + pierwsza);    //losujemy od pierwszej dostepnej do max 20 dalej
        while (numerPytania > pozostaloPytan + pierwsza);

        if (liczbaPowtorzen[numerPytania - 1] == 0)  //jeżeli wylosowane pytanie juz ma się nie powtarzać losujemy jeszcze raz
        {
            losuj();
        }
        else if (numerPytania < 10) nazwa = "00" + numerPytania;
        else if (numerPytania < 100) nazwa = "0" + numerPytania;
        else if (numerPytania > 99) nazwa = numerPytania;

        document.getElementById("pozostalo").innerHTML = "Pozostalo pytań: " + pozostaloPytan;    //aktualizacja tekstu

        zaznaczona = 0;

        var plik = "baza/" + nazwa + ".txt";
        getData(plik);  //otwarcie pliku z wylosowanym pytaniem
    }
}

function reset(ilePytan) {
    for (i = 0; i < ilePytan; i++) {
        liczbaPowtorzen[i] = ust1;    //ustawiamy ilosc powtorzen każdego pytania na domyslna
    }
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

    ileOdpowiedzi = 0;
    for (i = 1; i < 12; i++)
        if (lineArr[0][i] == '0' || lineArr[0][i] == '1')    //zliczamy ile jest odpowiedzi do danego pytania
            ileOdpowiedzi++;

    zaznaczone.length = ileOdpowiedzi + 1;
    kolejnosc.length = ileOdpowiedzi;

    document.getElementById("bledy").innerHTML = "Wszystkich odpowiedzi jest:" + ileOdpowiedzi;
    document.getElementById("pytanie").innerHTML = lineArr[1];

    for (i = 1; i <= ileOdpowiedzi; i++) {
        kolejnosc[i - 1] = 0;       //resetujemy kolejnosc
        if (lineArr[0][i] == 1)    //szukamy poprawnej odpowiedzi
            dobraOdpowiedz = i;
    }

    for (i = 1; i <= ileOdpowiedzi; i++) {
        var koniec = false;
        var gdzie;
        while (!koniec) {
            gdzie = Math.floor(Math.random() * ileOdpowiedzi);      //losujemy kolejnosc odpowiedzi
            if (kolejnosc[gdzie] == '0') {
                kolejnosc[gdzie] = i;
                koniec = true;
            }
        }
    }

    for (i = 0; i < ileOdpowiedzi; i++)
        if (kolejnosc[i] == dobraOdpowiedz) {
            dobraOdpowiedz = (i + 1);       //zmieniamy poprawną odpowiedz na inną, bo kolejnosc odpowiedzi się zmieniła
            break;
        }

    var divOdpowiedzi = "";
    for (i = 1; i <= ileOdpowiedzi; i++)     //tworzymy tyle divów na odpowiedzi ile jest odpowiedzi
    {
        divOdpowiedzi += '<div id="odp' + i + '" class="blok" onclick="zaznacz(' + i + ')" onmouseover="hoverin(' + i + ');" onmouseout="hoverout(' + i + ');"></div>';
        zaznaczone[i] = 0;
    }

    document.getElementById("odpowiedzi").innerHTML = divOdpowiedzi;

    for (i = 1; i <= ileOdpowiedzi; i++)     //wypełniamy divy z odpowiedziami odpowiedziami
    {
        var element = "odp" + i;
        document.getElementById(element).innerHTML = lineArr[kolejnosc[i - 1] + 1];
    }
}

function zaznacz(numer) {
    if (sprawdzono) return;

    if (zaznaczona == 0)   //gdy nie ma żadnej zaznaczonej odpowiedzi
    {
        zaznaczono = true;
        zaznaczona = numer;

        var element = "odp" + numer;
        document.getElementById(element).style.color = "white";
        document.getElementById(element).style.background = "gray";  //zmieniamy jego kolor na ciemniejszy
    }
    else if (zaznaczona == numer)  //odznaczanie zaznaczonej
    {
        zaznaczona = 0;   //zerujemy zaznaczone pole
        zaznaczono = false;

        var element = "odp" + numer;
        document.getElementById(element).style.color = "black";
        document.getElementById(element).style.background = "white";  //ustawiany kolor na domyslny jasniejszy niebieski
    }
    else if (zaznaczona != numer)  //zaznaczanie innej odpowiedzi
    {
        var element = "odp" + zaznaczona;
        document.getElementById(element).style.color = "black";
        document.getElementById(element).style.background = "white";  //ustawiamy kolor wczesniej wybranego pola na domyslny jasniejszy niebieski

        zaznaczono = true;
        zaznaczona = numer;

        element = "odp" + zaznaczona;
        document.getElementById(element).style.color = "white";
        document.getElementById(element).style.background = "gray";  //ustawiamy kolor nowego wyboru na ciemniejszy niebieski
    }

    if (zaznaczona == 0)
        document.getElementById("bledy").innerHTML = "Nie zaznaczono odpowiedzi";

    document.getElementById("bledy").innerHTML = "Zaznaczono: " + zaznaczona;
}

function sprawdz() {
    if (!rozpoczeto) return;
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
        sprawdzono = false;
        zaznaczono = false;
        zaznaczona = 0;

        document.getElementById("przyciskDalej").style.visibility = "hidden";   //ukrywamy przycisk "Dalej"
        setCiasteczka(pierwsza);
        losuj();
        zaladuj();
    }
}

function hoverin(ktore) {
    var element = "odp" + ktore;

    if (rozpoczeto)
        if (!sprawdzono)
            if (!zaznaczono) {
                document.getElementById(element).style.background = "gray";
                document.getElementById(element).style.color = "white";
            }
            else if (zaznaczona != ktore) {
                document.getElementById(element).style.background = "gray";
                document.getElementById(element).style.color = "white";
            }
}

function hoverout(ktore) {
    var element = "odp" + ktore;

    if (rozpoczeto)
        if (!sprawdzono)
            if (!zaznaczono) {
                document.getElementById(element).style.background = "white";
                document.getElementById(element).style.color = "black";
            }
            else if (zaznaczona != ktore) {
                document.getElementById(element).style.background = "white";
                document.getElementById(element).style.color = "black";
            }
}