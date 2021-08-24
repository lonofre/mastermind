/**
 * Return the code message in json
 * that can be used to send to the server
 * @param {string} code 
 * @returns {string} the code in json
 */
export function codeMessage(code){
    const message = {
        action: 'registerCode',
        data: {
            code: code
        }
    };
    const json = JSON.stringify(message);
    return json;
}