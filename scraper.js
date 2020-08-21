/**
Name: Joshua Ng 
Date: August 20,2020
 */

const mkdirp = require('mkdirp');
const path = require('path');
const puppeteer = require('puppeteer');

const escapeXpathString = str => {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`
};

const clickByText = async (page, text) => {
    const escapedText = escapeXpathString(text);
    const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
    if (linkHandlers.length > 0) {
        await linkHandlers[0].click();
    }
    else {
        throw new Error(`Link not found: ${text}`);
    };
};

(async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 75, defaultViewport: null });
    const page = await browser.newPage();

    // Constants
    const condoUrl = 'https://app-dev.condoworks.co'
    const loginEmail = "coop.test@condoworks.co"
    const loginPass = "MyTesting711"
    const btnExpand = 'button[class="navbar-toggler"]'
    const invoiceMenu = '[id^="InvoicesMenuLink"]'
    const xPathInvoiceInput = '//*[@id="gs_invoices.InvoiceNumber"]'
    const xPathDownloadIcon = '//*[@id="thumb-InvoiceFile-init-0"]/div[2]/div[3]/div/a'

    await page.goto(condoUrl);

    await page.type('#Email', loginEmail);
    await page.type('#Password', loginPass);
    await page.click('#btnSubmit');

    await page.click(btnExpand);
    await page.click(invoiceMenu);
    await clickByText(page, 'All');
    await page.waitForNavigation();

    const objInvoice = await page.$x(xPathInvoiceInput);
    await objInvoice[0].type('123');
    page.keyboard.press('Enter');

    const tableRows = '#gridcfbf6c626a8f6de8551cf28b46ad3592 tbody tr'
    await page.waitForSelector(tableRows);
    const rowCount = await page.$$eval(tableRows, (e) => e.length);
    for (let i = 1; i < rowCount; i++) {
        const invoiceNos = await page.$eval(
            `${tableRows}:nth-child(${i + 1}) td:nth-child(8)`,
            (e) => e.innerText
        );
        if (invoiceNos == "123444") {
            await page.click(
                `${tableRows}:nth-child(${i + 1}) td:nth-child(1)`
            );
            break
        };
    };

    const myDownloadPath = path.resolve("Download/");
    mkdirp(myDownloadPath);
    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: myDownloadPath });
    const downloadObj = await page.$x(xPathDownloadIcon);
    await downloadObj[0].click();

    console.log("Downloaded File Path: " + myDownloadPath);
})();

