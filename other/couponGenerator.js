//npx hardhat run .\other\couponGenerator.js 
const { ethers } = require("hardhat");
const fs = require("fs");

  
const {
    keccak256,
    toBuffer,
    ecsign,
    bufferToHex,
} = require("ethereumjs-utils");

let signerPvtKey1 = process.env.SigPK;

//const signerPvtKey = Buffer.from(signerPvtKey1.substring(2,66), "hex");
const signerPvtKey = Buffer.from(signerPvtKey1, "hex");


let coupons = {};

async function getClaimCodes() {
    //const [owner, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20] = await ethers.getSigners();

    let presaleAddresses = [
        { address : '0x0d02865bd52d63b549ef2e258a2ddcef715d4e81', qty : 40},
        { address : '0xbf9a9d3d1a330ae27c5d9632a17f20d129c40209', qty : 40},
        { address : '0xe67d102cad14caeec42f4cfc7c862b1b0d305943', qty : 40},
        { address : '0xfd4938b02074df1d3aa15a97ee561f40704b2195', qty : 35},
        { address : '0x8912e40d291693c7a86c418d52b46766780c6989', qty : 30},
        { address : '0x33a92eb4565d850b6e43ac0f3556bacf5aaa492e', qty : 25},
        { address : '0xf616a69aee4f0174fff7a1055aff334de481b93f', qty : 25},
        { address : '0xfbdbe219770ad5f7252000ec8fc70467a033dd09', qty : 25},
        { address : '0x203a550cab392e30b09048bbab2f7c133f553e15', qty : 20},
        { address : '0x0ff3c045432b54fc061caad4d10057da3ed08cdc', qty : 20},
        { address : '0x1be8bbac70d8574ef80e2a3471b6ed219952931b', qty : 20},
        { address : '0xc5915dd28886523dcf96bc29b5bfb1a77c4166d8', qty : 20},
        { address : '0x33895f4a011497460865d8a08608a8870a503b7f', qty : 20},
        { address : '0xb3c64a8318131802c2d77cceb9af7e5412196397', qty : 20},
        { address : '0x41fd3dc049f8c1ac6670de119698d3488017c0b6', qty : 20},
        { address : '0x4985a9b9c0cbeb430a4c7c082c5e65fb633f3603', qty : 20},
        { address : '0x4d00d10855ee5b0c76a0fa72787c2ecc0f2f7766', qty : 20},
        { address : '0x4ead6200f171ff57a6957899600f49c9afcdabc4', qty : 20},
        { address : '0x4f54cae0f923892a58721d06c2363d7a353f3a0d', qty : 20},
        { address : '0xab8ea35d2e200bf9089b7e9bee47568fdb211012', qty : 20},
        { address : '0xa7531f5a9d56089a79ebcb295baba41bed80ca22', qty : 20},
        { address : '0xa74edecc0174e43a480321c75ff06cb3842b9d7d', qty : 20},
        { address : '0x7167d2813fcf7e9fb6cf03ae1c2ce4115e8f38cb', qty : 20},
        { address : '0xd4f1ace4299fe40566adf8813a46f48bb0383e37', qty : 20},
        { address : '0xd865c9b31b5d0232ffdb8d2db8d8006feb955935', qty : 20},
        { address : '0xcd43adcb61949ab14d3f4574bfbda53d46389715', qty : 15},
        { address : '0x2a9ffcfd150ce08e0f28ca0c372fc8ede6eede3f', qty : 15},
        { address : '0xa894077e96375bdbda09d93627bbe7e4ca52fad1', qty : 15},
        { address : '0x91ce9277461bed9f163eb0b6d51c1fc9597d1ae1', qty : 10},
        { address : '0xa101064ebf57549e47e955c746744342bdf613b5', qty : 10},
        { address : '0xb1c72fee77254725d365be0f9cc1667f94ee7967', qty : 10},
        { address : '0x0c13a2b3998db54d96eb4e7f7e0b06e85bc9c271', qty : 10},
        { address : '0xb0d031f2885a40c99bd8dc16a5a516dcfe46ed25', qty : 5},
        { address : '0x9a38c29a8cdd14c315c35a3930b4a3b4a592fd9e', qty : 5},
        { address : '0x36a0c7b860a4715939ef5b2d1a47aedc6c89423a', qty : 5},
        { address : '0xb86c3faa777db50191e22fa035b67cd1cb6ceea1', qty : 5},
        { address : '0x24672e6873834038b0aefe2891f5863acffdff5e', qty : 5},
        { address : '0xc4d3511822758bede1266f2255dba32d7bcea543', qty : 5},
        { address : '0x205bbbe1b5ee65effe19c5dd59b84ad1413bbb77', qty : 5},
        { address : '0x1b8aae53607fb4c2b16d53ca60cdf8dfc17b4e1f', qty : 5},
        { address : '0xcdc991990eee077a3a2da5ffa5bba52fbf4446a3', qty : 5},
        { address : '0xa6302b85f447e50bd45cc130e77d2199e0c89280', qty : 5},
        { address : '0x04ad7ea9d13de9f571955686532446c8cb71d3fb', qty : 5},
        { address : '0xe30a3bcad12800bd9752f505bd44deb6f69bb370', qty : 5},
        { address : '0x6e98e46ded3e044fd41814bd3eb2bfca14a94846', qty : 5},
        { address : '0xf1194536bace77741a2f09f481bcb468d2ecccbe', qty : 5},
        { address : '0x5ffd8de19910efff95df729c54699aebcee8f747', qty : 5},
        { address : '0x5868c525c939837bfd8930044c9269a5c2816fd6', qty : 5},
        { address : '0x5cb17f3bc8f7434b14db3484f13e110cabc10ad5', qty : 5}
   
    ]      
    
    function createCoupon(hash, signerPvtKey) {
        return ecsign(hash, signerPvtKey);
    }
    
    function generateHashBuffer(typesArray, valueArray) {
        return keccak256(
            toBuffer(ethers.utils.defaultAbiCoder.encode(typesArray,
                valueArray))
        );
    }

    function serializeCoupon(coupon) {
        return {
            r: bufferToHex(coupon.r),
            s: bufferToHex(coupon.s),
            v: coupon.v
        };
    }

    for (let i = 0; i < presaleAddresses.length; i++) {
        const userAddress = ethers.utils.getAddress(presaleAddresses[i].address);
        const hashBuffer = generateHashBuffer(
            ["uint256", "address"],
            [presaleAddresses[i].qty, userAddress]
        );
        const coupon = createCoupon(hashBuffer, signerPvtKey);

        coupons[userAddress] = {
            q : presaleAddresses[i].qty,
            whitelistClaimPass: serializeCoupon(coupon)
        };
    }
    // HELPER FUNCTIONS
    
    // get the Console class
    const { Console } = require("console");
    // get fs module for creating write streams
    const fs = require("fs");

    // make a new logger
    const myLogger = new Console({
    stdout: fs.createWriteStream("ProjectWhitelist-signed-coupons.txt"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });

    myLogger.log(coupons);
   
}

getClaimCodes()