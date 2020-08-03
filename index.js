const puppeteer = require('puppeteer')
const fs = require('fs')

const init = async () => {

    const siteURL = 'https://www.superabc.com.br'

    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(siteURL);

    console.log('Inicio')

    await page.waitForSelector('#preHome')
    await page.evaluate((sel) => {
        document.querySelector(sel).remove()
    }, '#preHome')

    await page.evaluate((sel) => {
        document.querySelector(sel).remove()
    }, '#popupCorona')

    let links = await page.evaluate(() => {
        let as = [...document.querySelectorAll('a.dpt-menu__link')];
        return as.map((a) => {

            return {
                nome: a.textContent,
                link: a.getAttribute('href')
            }
        });
    });

    let titles
    let countItens = 0
    for (const url of links) {

        await page.goto(`${siteURL}${url.link}`)
        await page.waitFor(5000)

        await page.evaluate((sel) => {
            document.querySelector(sel).remove()
        }, '#preHome')

        for (let i = 1; i < 100; i++) {

            try {

                await page.click('#carregar-mais')
                await page.waitFor(5000)

            } catch (error) {
                break
            }
        }

        titles = await page.evaluate(() => {

            let _titles = [...document.querySelectorAll('.prateleira__item')]
            return _titles.map((t) => {

                const price = t.querySelector('.prateleira__best-price')

                return {
                    title: t.getAttribute('title'),
                    price: price?.textContent ? price.textContent : 'Produto Esgotado'
                }
            })
        })

        console.log(url.nome, `total => ${titles.filter(item => item.price !== 'Produto Esgotado').length}`)

        const data = JSON.stringify(titles.filter(item => item.price !== 'Produto Esgotado'))
        fs.writeFileSync(`dados/${url.nome}.json`, data)
    }

    console.log('Fim!')    
    await browser.close();
}

init()