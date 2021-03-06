'use strict';

const axios = require( 'axios' );

const {
    endpointTypes,
    urls,
    headerKeys
} = require( './constants' );

const {
    errors: {
        BitcoinApiError
    },
} = require( './utils' );

const httpMethodToAxiosMethod = Object.freeze({

    GET: 'get',
    POST: 'post',
});

const endpointTypesThatRequireToken = Object.freeze([
        
    endpointTypes.generalToken,
    endpointTypes.activatedToken
]);


module.exports = Object.freeze( async ({

    endpointType,
    token,
    livenetMode,
    resource,
    body,
    method,

}) => {
    
    const baseUrl = livenetMode ? (
        urls.bitcoinApiIo
    ) : urls.apiBitcoinIo;

    const url = `${ baseUrl }/${ resource }`;

    const axiosArgs = [ url ];

    if( !!body ) {

        axiosArgs.push( body );
    }

    const axiosOptions = {};

    if( endpointTypesThatRequireToken.includes( endpointType ) ) {

        if( !token ) {

            throw new BitcoinApiError(
                
                `request to ${ endpointType } ` +
                `${ resource } - ${ method } endpoint requires token ` +
                `(see ${ urls.github }#${ endpointType.toLowerCase() }` +
                `-endpoints) for more info`
            );
        }

        axiosOptions.headers = {

            [headerKeys.token]: token
        };
    }

    const instance = axios.create( axiosOptions );

    const axiosMethod = httpMethodToAxiosMethod[ method ];

    const response = await instance[ axiosMethod ]( ...axiosArgs );

    const requestFailed = !(

        !!response &&
        !!response.data &&
        (
            (typeof response.data.statusCode === 'number') &&
            (response.data.statusCode >= 200) &&
            (response.data.statusCode < 300)
        ) &&
        !!response.data.body &&
        (typeof response.data.body === 'object')
    );

    if( requestFailed ) {

        throw new BitcoinApiError(
        
            `${ method } request to ${ resource } failed - ` +
            `invalid API response: ${
                JSON.stringify(
                    (
                        !!response &&
                        response.data
                    ) || 'N/A'
                )
            }`
        );
    }

    const responseData = response.data; 

    return responseData;
});
