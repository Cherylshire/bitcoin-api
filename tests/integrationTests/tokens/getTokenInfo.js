'use strict';

require( 'dotenv' ).config();

const BitcoinApi = require( '../../../' );

const expect = require( 'chai' ).expect;

const fixtures = require( '../fixtures' );


describe( '.getTokenInfo', function() {

    this.timeout( 20000 );

    it( 'normal operation', async function() {

        const bitcoinApi = new BitcoinApi({

            testnetToken: fixtures.testnetToken,
        });

        const tokenInfo = await bitcoinApi.getTokenInfo();

        expect( typeof tokenInfo ).to.equal( 'object' );
        expect( typeof tokenInfo.isActivated ).to.equal( 'boolean' );
        expect( typeof tokenInfo.balanceData ).to.equal( 'object' );
        expect( typeof tokenInfo.balanceData.amount ).to.equal( 'number' );
        expect( typeof tokenInfo.balanceData.status ).to.equal( 'string' );
    });
});