'use strict';

async function createUser(event) {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "hello user!",
                input: JSON.parse(event.body)
            })
    }
}

module.exports = {createUser};