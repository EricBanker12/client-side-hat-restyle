module.exports = function clientSideHatRestyle(dispatch) {
    // variables
    let gameId = 0,
        hatId = 0,
        contractId = false

    // get character id
    dispatch.hook('S_LOGIN', 10, event => {
        gameId = event.gameId
    })

    dispatch.hook('S_USER_EXTERNAL_CHANGE', 6, event => {
        // if character is your character
        if (gameId.equals(event.gameId)) {
            hatId = event.styleHead
        }
    })

    dispatch.hook('S_REQUEST_CONTRACT', 1, event => {
        // if character is your character
        if (gameId.equals(event.senderId)) {
            // if in hat restyle
            if (event.type == 90) {
                // get contract
                contractId = event.id
            }
        }
    })

    dispatch.hook('S_CANCEL_CONTRACT', 1, event => {
        // if character is your character
        if (gameId.equals(event.senderId)) {
            // if in hat restyle
            if (event.type == 90) {
                // end contract
                contractId = false
            }
        }
    })

    dispatch.hook('C_REQUEST_ACCESSORY_COST_INFO', 1, event => {
        if (contractId) {
            // make cost free
            dispatch.toClient('S_RESPONSE_ACCESSORY_COST_INFO', 1, {
                response: 1,
                item: 0,
                unk: 0,
                amount: 0
            })
            // do not send to server
            return false
        }
    })

    dispatch.hook('C_COMMIT_ACCESSORY_TRANSFORM', 1, event => {
        if (contractId) {
            // apply changes client side
            dispatch.toClient('S_COMMIT_ACCESSORY_TRANSFORM_RESULT', 1, {
                success: true
            })
            dispatch.toClient('S_ITEM_TRANSFORM_DATA', 1, {
                gameId: gameId,
                item: hatId,
                scale: event.scale,
                rotation: event.rotation,
                translation: event.translation,
                translationDebug: event.translationDebug,
                unk: true
            })
            // do not send to server
            return false
        }
    })
}
