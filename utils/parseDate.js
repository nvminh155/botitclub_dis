
module.exports = (dateTimeString) => {
    var parts = dateTimeString.split(" ");
    var dateParts = parts[0].split("/");
    console.log("🚀 ~ dateParts:", dateParts)
    var timeParts = parts[1].split(":");
    
    // Note: months are 0-based in JavaScript, so we subtract 1 from the month
    var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]);
    console.log("🚀 ~ date:", date)
    
    // Get the timestamp in milliseconds and convert it to seconds
    var timestampSeconds = Math.floor(date.getTime());
    
    return date.getTime();
}