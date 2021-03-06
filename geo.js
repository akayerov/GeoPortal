//var data = require('./data_p2.json');   // приложение 2
//var fname = 'result2.txt';
var data = require('./data_p3.json');   // приложение 2
var fname = 'result3.txt';
var fs = require('fs')
var fileWr = null;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function print_out(mode, name, inaddress, address, spos)  {
  var modpos = spos.replace(/\ /gi, ";");

//  var str = name.trim() + ';' + inaddress + ';' + address + ';' + modpos +'\n';
  var str = name.trim() + ';' + inaddress + ';'  + modpos +'\n';
  fs.write(fileWr, str, null, 'utf-8', function(err, written) {
      if (!err) {
          // Всё прошло хорошо
      } else {
          // Произошла ошибка при записи
      }
  });

}

function geoCoding(name, inaddress, address, faddress) {
  console.log(faddress);
  console.log('-------------------------------------');

  // 1. Создаём новый объект XMLHttpRequest
  var xhr = new XMLHttpRequest();

// 2. Конфигурируем его: GET-запрос на URL 'phones.json'
  var encodeStr = encodeURIComponent(faddress);
  var strHttp = 'https://geocode-maps.yandex.ru/1.x/?geocode=' + encodeStr +
                '&results=1&format=json&bbox=37.93,56.43~42.36,59.22';
//  console.log(strHttp);
//  console.log('-------------------------------------');

  xhr.open('GET', strHttp, false);

 // 3. Отсылаем запрос
  xhr.send();

  // 4. Если код ответа сервера не 200, то это ошибка
  if (xhr.status != 200) {
    // обработать ошибку
     console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
  } else {
  // вывести результат
//     console.log( xhr.responseText ); // responseText -- текст ответа.
     var res = null;

     res = JSON.parse( xhr.responseText);
//     console.log(res);
//     console.log(res.response.GeoObjectCollection.featureMember);
     var ob = res.response.GeoObjectCollection.featureMember[0];
//     console.log(ob);

     if( ob !== undefined) {
       console.log(ob.GeoObject.Point.pos);
       print_out(true, name, inaddress, address,ob.GeoObject.Point.pos);
     }
     else {
       print_out(false, name, inaddress, address,'0 0');
       console.log('Не найдено');
     }
  }

}

/////////////////////////////////////////////////////////////////////////
/* Точка вхожа */
fs.open(fname, "w+", 0644, function(err, file_handle) {
    if (!err) {
      fileWr = file_handle;
      data.forEach(function(item, i, arr) {
        var reg1 = '';
        if(  item.region1 !== undefined)
           reg1 = item.region1;
       var city = '';
       if(  item.city !== undefined)
        city = item.city;

        var faddress = item.region + ' ' + reg1 + ' ' + city + ' ' + item.address;
        var outaddress =  city + ' ' + reg1 + ' ' + item.inaddress;
        var modaddress = faddress.replace(/\ /gi, "+");
        geoCoding(item.name, outaddress,faddress,modaddress);
      });

    } else {
        console.log("Произошла ошибка при открытии");
    }

   fs.close(fileWr);
//   geoCoding(faddress);

//  console.log(i, item.name,item.address);
})
