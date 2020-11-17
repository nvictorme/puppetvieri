const extractValues = async (dl) => {
    let dlValues = [];
    let divs = await dl.$$('div');
    // iterate all divs
    for (let i = 0; i < divs.length; i++) {
        let dt = await divs[i].$('dt');
        if (dt) {
            let dtSpan = await dt.$('span');
            if (dtSpan) {
                let label = await dtSpan.evaluate(el => el.innerText, dtSpan);
                let ddSpans = await divs[i].$$('dd > div > span');
                if (ddSpans.length === 2) {
                    let spanWithValue = ddSpans.pop();
                    let value = await spanWithValue.evaluate(el => el.innerText, spanWithValue);
                    dlValues.push([label, value])
                }
            }
        }
    }
    return dlValues;
}

const findListings = async (page) => {
    let prospects = await page.$$('section > ul > li');
    let listings = [];
    for (let i = 0; i < prospects.length; i++) {
        let newListing = {};
        let dl = await prospects[i].$('dl');
        // if 'dl' exists then it's a listing
        if (dl) {
            // extract revenue, profit, inventory values
            let values = await extractValues(dl);
            Object.assign(newListing, { values });

            // image **** NOT VERY FANCY - WIP **** 
            // let img = await prospects[i].$('img');
            // let imgUrl = await img?.evaluate(el => el.src, img) ?? '';
            // Object.assign(newListing, { imgUrl });
            // name
            let nameAnchor = await prospects[i].$('div > a');
            let name = await nameAnchor?.evaluate(el => el.innerText, nameAnchor) ?? '';
            Object.assign(newListing, { name });
            // description
            let descriptionParagraph = await prospects[i].$('div > p');
            let description = await descriptionParagraph?.evaluate(el => el.innerText, descriptionParagraph) ?? '';
            Object.assign(newListing, { description });
            // asking price
            let priceSpan = (await prospects[i].$$('div > div > span')).pop();
            const askingPrice = await priceSpan?.evaluate(el => el.innerText, priceSpan);
            Object.assign(newListing, { askingPrice });
            
            listings.push(newListing);
        }
    }
    return listings;
}

module.exports = { findListings };