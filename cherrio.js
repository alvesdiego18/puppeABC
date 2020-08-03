const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

const init = async () => {

    const htmlPage = await axios.get('https://www.superabc.com.br/carnes-e-pescados/bovinas?PS=20')
    const $ = cheerio.load(htmlPage)

    $('#preHome').remove()
    $('#popupCorona').remove()
    $('#returnToTop').remove()

    $('a.prateleira__name').each(function (i, elem) {
        console.log($(this).text())
    });
}

init()
