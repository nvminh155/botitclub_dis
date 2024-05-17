
const format = {
    bold: "**",
    italic: "*",
    underline: "__",
    strikethrough: "~~",
    code: "```",
}
module.exports = (needs, text) => {
    needs.reverse().forEach(need => {
        const arr = need.split('_');

        if(arr.length === 1 && arr[0].startsWith("code")) {
            text = `${format.code}${arr[0].replace('code', '')}\n${text}\n${format.code}`
        } else {
            const multiFormat = []
            arr.forEach(f => {
                multiFormat.push(format[f])
            })
            text = `${multiFormat.join('')}${text}${multiFormat.reverse().join('')}`
        }
    })

    return text;
}