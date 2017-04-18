/**
 * Created by NGOCHUNG on 1/12/2017.
 */
exports.res_error=function (codeerro,mes,checkerr,res) {
    res.json({
        code: codeerro,
        err:checkerr,
        message: mes
    });
}

exports.res_success=function (codeerro,mes,checkerr,result,res) {
    res.json({
        code: codeerro,
        err:checkerr,
        message: mes,
        result:result
    });
}
exports.res_succes_no_result=function (codeerro,mes,checkerr,res) {
    res.json({
        code: codeerro,
        err:checkerr,
        message: mes
    });
}