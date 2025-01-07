var minuty = 0;
var sekundy = 0;
var godziny = 0;
var minutyDoWyswietlenia;
var sekundyDoWyswietlenia;
var godzinyDoWyswietlenia
var czas;
var klik=0;
let int = null;

function odNowa()
{
    minuty = 0;
    sekundy = 0;
    godziny = 0;
    czas = godziny + ":" + minuty + ":" + sekundy;
    document.getElementById("timer").innerHTML = czas;
    if(int!==null){
        clearInterval(int);
        
    }
    int = setInterval("timer()",1000);
}

function timer()
{
    sekundy++;
    if(sekundy ==60)
    {
        sekundy=0;
        minuty++;
    }
    if(minuty==60)
    {
        minuty=0;
        godziny++;
    }

    if(sekundy<10)
        sekundyDoWyswietlenia="0"+sekundy;
    else
    sekundyDoWyswietlenia=sekundy;

    if(minuty<10)
        minutyDoWyswietlenia="0"+minuty;
    else
    minutyDoWyswietlenia=minuty;

    if(godziny<10)
    godzinyDoWyswietlenia="0"+godziny;
    else
    godzinyDoWyswietlenia=godziny;

    czas = godzinyDoWyswietlenia + ":" + minutyDoWyswietlenia + ":" + sekundyDoWyswietlenia;
    document.getElementById("timer").innerHTML = czas;

}

function stop()
{
    clearInterval(int);
    czas = godzinyDoWyswietlenia + ":" + minutyDoWyswietlenia + ":" + sekundyDoWyswietlenia;
    document.getElementById("timer").innerHTML = czas;
}
    