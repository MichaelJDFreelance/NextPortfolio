const quotes = [
    {
        id:"117",
        text:"It is easy to sit up and take notice, what's difficult is getting up and taking action."
    },
    {
        id:"120",
        text:"Many a mickle makes a muckle"
    }
]

const getQuoteAtRandom = () => quotes[Math.floor(Math.random() * quotes.length)]

export const getQuote = async () => {
    return getQuoteAtRandom()
}