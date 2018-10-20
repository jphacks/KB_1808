exports.handler = async (event) => {
    // TODO implement
    if(event['name'] == undefined){
        return {
            statusCode: 400,
            body: JSON.stringify('Bad Request')
        };
    }
    // const request = JSON.parse(event);
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from ' + event['name'])
    };
    return response;
};