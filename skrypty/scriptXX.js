var ust1;
var ust2;
var rozpoczeto = false;
var numerPytania;
var liczbaPowtorzen = [];
var pozostaloPytan;
var nazwa;
var pierwsza = 0;
var sprawdzono = false;
var zaznaczono = false;
var odpowiedzi = [];
var kolejnosc = [];
var ileOdpowiedzi = 0;
var zaznaczone = [];
var ileZaznaczono = 0;

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

        if (numer == 1)  //ppsy
        {
            liczbaPowtorzen.length = 157;
            reset(157);
            pozostaloPytan = 157 - pierwsza;
        }
        else if (numer == 2) //pea
        {
            liczbaPowtorzen.length = 126;
            reset(126);
            pozostaloPytan = 126 - pierwsza;
        }
        else if (numer == 3) //so
        {
            liczbaPowtorzen.length = 115;
            reset(115);
            pozostaloPytan = 115 - pierwsza;
        }
        else if(numer ==4 ) //io
        {
            liczbaPowtorzen.length = 59;
            reset(59);
            pozostaloPytan = 59 - pierwsza;
        }

        rozpoczeto = true;
        zaznaczono = false;
        sprawdzono = false;

        document.getElementById("przyciskZaladuj").style.visibility = "visible";    //widocznosc przycisku "zaladuj"
        document.getElementById("przyciskSprawdz").style.visibility = "visible";
        document.getElementById("bledy").style.visibility = "visible";
        document.getElementById("pytanie").style.visibility = "visible";
        document.getElementById("pozostalo").style.visibility = "visible";

        //reset();    //ustawienie tablicy pwtorzen
        losuj();    //losowanie pytania
        zaladuj();  //wyswietlenie pytania
    }
}

function zaladuj() {
    if (sprawdzono) return;

    zaznaczono = false;

    document.getElementById("przyciskDalej").style.visibility = "hidden";   //ukrycie przycisku "Dalej"

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

    document.getElementById("pozostalo").innerHTML = "Pozostalo pytań: " + pozostaloPytan;    //aktualizacja tekstu

    var plik = "baza/" + nazwa + ".txt";
    document.getElementById("numerPytania").innerHTML = plik;
    getData(plik);  //otwarcie pliku z wylosowanym pytaniem
}

function reset(ilePytan) {
    for (i = 0; i < ilePytan; i++)
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
    var tempOdpowiedzi = [];

    ileOdpowiedzi = 0;
    for (i = 1; i < 12; i++)
        if (lineArr[0][i] == '0' || lineArr[0][i] == '1')    //zliczamy ile jest odpowiedzi do danego pytania
            ileOdpowiedzi++;

    zaznaczone.length = ileOdpowiedzi + 1;
    kolejnosc.length = ileOdpowiedzi;
    odpowiedzi.length = ileOdpowiedzi + 1;
    tempOdpowiedzi.length = ileOdpowiedzi;

    document.getElementById("bledy").innerHTML = "Wszystkich odpowiedzi jest:" + ileOdpowiedzi;
    document.getElementById("pytanie").innerHTML = lineArr[1];

    for (i = 1; i <= ileOdpowiedzi; i++) {
        kolejnosc[i - 1] = 0;       //resetujemy kolejnosc
        odpowiedzi[i] = 0;        // i odpowiedzi
        tempOdpowiedzi[i - 1] = 0;
        if (lineArr[0][i] == 1)    //szukamy poprawnych odpowiedzi
            tempOdpowiedzi[i - 1] = 1;
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
        if (tempOdpowiedzi[i] == 1)
            for (j = 0; j < ileOdpowiedzi; j++)
                if (kolejnosc[j] == i + 1) {
                    odpowiedzi[j + 1] = 1;    //ustawiamy poprawne odpowiedzi zgodnie z kolejnością
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

    if (zaznaczone[numer] == 1)  //odznaczanie zaznaczonej
    {
        zaznaczone[numer] = 0;   //zerujemy zaznaczone pole

        var element = "odp" + numer;
        document.getElementById(element).style.color = "black";
        document.getElementById(element).style.background = "white";  //ustawiany kolor na domyslny jasniejszy niebieski

        ileZaznaczono--;
        if (ileZaznaczono == 0) zaznaczono = false;
    }
    else if (zaznaczone[numer] == 0)  //zaznaczanie odpowiedzi
    {
        zaznaczone[numer] = 1;

        var element = "odp" + numer;
        document.getElementById(element).style.color = "white";
        document.getElementById(element).style.background = "gray";  //ustawiamy kolor nowego wyboru na ciemniejszy niebieski

        ileZaznaczono++;
        zaznaczono = true;
    }

    var zaz = "";
    for (i = 1; i <= ileOdpowiedzi; i++) {
        if (zaznaczone[i] == 0)
            zaz += "0 ";
        else
            zaz += "1 ";
    }
    document.getElementById("bledy").innerHTML = "Zaznaczono: " + zaz;
}

function sprawdz() {
    if (!rozpoczeto) return;
    if (sprawdzono) return;

    var dobrze = true;
    for (i = 1; i <= ileOdpowiedzi; i++) {
        if (zaznaczone[i] == 1 && zaznaczone[i] == odpowiedzi[i])    //zaznaczono dobrzą odpowiedź
        {
            var element = "odp" + i;
            document.getElementById(element).style.background = "#07bc01";  //ustawiamy kolor wybranej odpowiedzi na zielony
            document.getElementById(element).style.color = "black";
        }
        if (zaznaczone[i] == 0 && odpowiedzi[i] == 1)    //nie zaznaczono dobrej odpowiedzi
        {
            dobrze = false;
            var element = "odp" + i;
            document.getElementById(element).style.background = "#059700";  //ustawiamy kolor wybranej odpowiedzi na zielony
            document.getElementById(element).style.color = "black";
        }
        if (zaznaczone[i] == 1 && odpowiedzi[i] == 0)    //zaznaczono złą odpowiedź
        {
            dobrze = false;
            var element = "odp" + i;
            document.getElementById(element).style.background = "#cf0000";  //ustawiamy kolor wybranej odpowiedzi na zielony
            document.getElementById(element).style.color = "black";
        }
    }
    if (dobrze) {
        //document.getElementById("bledy").innerHTML = "wszystko dobrze";
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

        dobrych++;
        document.getElementById("dobrychOdpowiedzi").innerHTML = dobrych;
    }
    else {
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
        document.getElementById("przyciskDalej").style.visibility = "hidden";   //ukrywamy przycisk "Dalej"

        losuj();
        zaladuj();
        setCiasteczka(pierwsza);
    }
}

function hoverin(ktore) {
    var element = "odp" + ktore;

    if (rozpoczeto)
        if (!sprawdzono)
            if (zaznaczone[ktore] == 0) {
                document.getElementById(element).style.background = "gray";
                document.getElementById(element).style.color = "white";
            }
}

function hoverout(ktore) {
    var element = "odp" + ktore;

    if (rozpoczeto)
        if (!sprawdzono)
            if (zaznaczone[ktore] == 0) {
                document.getElementById(element).style.background = "white";
                document.getElementById(element).style.color = "black";
            }

}