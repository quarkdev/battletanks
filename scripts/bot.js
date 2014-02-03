// worker test: http://blogs.msdn.com/b/davrous/archive/2011/07/15/introduction-to-the-html5-web-workers-the-javascript-multithreading-approach.aspx

function messageHandler(event) {
    var messageSent = event.data,
        messageReturned = "Hello " + messageSent + " from a separate thread!";
        
    this.postMessage(messageReturned);
}

this.addEventListener('message', messageHandler, false);