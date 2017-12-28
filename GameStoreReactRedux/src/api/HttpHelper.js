class HttpHelper {
    static fetch(url, method, header, body) {
        let options = Object.assign({'method': method});
        if (header) {
            const headers = Object.assign({'Content-Type': 'application/json'});
            options = Object.assign(options, {'headers': headers});
        }
        if (body && method != 'GET') {
            options = Object.assign(options, {'body': body});
        }
        const request =  new Request(url, options);    
        //console.log(options);
        //console.log(request);
        return fetch(request).then(response => {
            //console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error(response.statusText + "(" + response.status + "), URL: " + response.url);
                //error.response = response
                //console.log(error);
                return Promise.reject(error);
            }
        }).catch(error => {
            throw(error);
        });
    }
}

export default HttpHelper;