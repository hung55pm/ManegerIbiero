/**
 * Created by tungxuan on 3/29/16.
 */

exports.convertToDateString = function(date){
    return date.getHours() + ':' +date.getMinutes() + '  '+ date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

exports.convertToDateString2 = function(date){
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

exports.convertStringToDate = function(str){
    var tmp = str.split('/');
    return new Date(parseInt(tmp[2]), parseInt(tmp[1]) - 1, parseInt(tmp[0]));
}

