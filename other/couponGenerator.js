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
        { address : '0xFd4938b02074DF1d3Aa15a97Ee561f40704b2195', qty : 4},
        { address : '0x4D00D10855EE5B0c76A0Fa72787C2ECC0F2F7766', qty : 4},
        { address : '0x4f54cAE0F923892a58721D06C2363d7A353F3A0d', qty : 4},
        { address : '0x41FD3dC049F8c1aC6670dE119698D3488017c0b6', qty : 4},
        { address : '0xe67d102CAd14CAeEC42F4cFC7C862B1b0d305943', qty : 8},
        { address : '0x5aa8C06f9DFc455Cf4005e4D923b5034EF97cdf7', qty : 4},
        { address : '0x5F50aaFe3920c227099919F6B5Ce482E023b98fc', qty : 4},
        { address : '0xB3c64a8318131802c2D77cCEb9AF7e5412196397', qty : 4},
        { address : '0x1Be8bBac70d8574eF80e2a3471B6Ed219952931b', qty : 4},
        { address : '0x203A550caB392e30B09048bBAb2F7C133f553e15', qty : 4},
        { address : '0xf616a69aeE4f0174FFf7A1055afF334de481B93F', qty : 4},
        { address : '0x67515BCb2e93AF3E6D632FD12d0fc884a1f24d0D', qty : 4},
        { address : '0xA10DEE78Cf06D8d83738B3dc9bAeaD402805Dd22', qty : 4},
        { address : '0x0d02865BD52d63b549eF2e258a2dDCEf715d4E81', qty : 5},
        { address : '0x1D1F2356d94325FafBe1C022F728bf07B415A5F1', qty : 4},
        { address : '0x33895f4A011497460865d8A08608a8870A503b7F', qty : 4},
        { address : '0x92a293f563872671750060Ab5935e1117c3f7294', qty : 4},
        { address : '0xd865C9b31B5d0232fFdB8D2Db8D8006FEB955935', qty : 4},
        { address : '0x62b615759E6Ba4754d33d69F799AAf386a6EF279', qty : 4},
        { address : '0xCd43AdcB61949ab14D3f4574BFbDA53d46389715', qty : 6},
        { address : '0xd4F1AcE4299fE40566aDF8813a46f48bB0383e37', qty : 5},
        { address : '0xbF9A9d3D1A330AE27c5d9632A17F20D129c40209', qty : 4},
        { address : '0x23AEb45378AD26437cE1c3dD0ac4A015E9865596', qty : 4},
        { address : '0xc5915dd28886523DCf96Bc29B5bFb1a77c4166D8', qty : 4},
        { address : '0xa7531F5A9D56089A79EBCb295bAba41bED80ca22', qty : 5},
        { address : '0xAB8EA35D2e200bF9089b7E9Bee47568Fdb211012', qty : 4},
        { address : '0xa894077e96375BdBdA09d93627bbe7E4Ca52fAd1', qty : 4},
        { address : '0x2a9FFCFd150ce08E0f28Ca0c372fc8edE6eeDe3F', qty : 2},
        { address : '0x0Ff3c045432b54fC061CaAD4d10057Da3ed08cdC', qty : 4},
        { address : '0x4985a9B9c0CbeB430a4C7C082C5E65FB633f3603', qty : 4},
        { address : '0x8912e40d291693C7A86C418D52b46766780C6989', qty : 6},
        { address : '0x4EAD6200f171FF57a6957899600f49c9aFCDABC4', qty : 4},
        { address : '0xeb2246f29fd9f32E67Cb85Fb0bb4b855f07E94bC', qty : 4},
        { address : '0x24672e6873834038B0AeFe2891f5863ACFfdFF5e', qty : 1},
        { address : '0x2901D242D1F83F6Ae08099D66a75EE5AAA2b9962', qty : 1},
        { address : '0x4d8Be5F2a5e8bfe8470f6Ff41Ae71A05f5dc6495', qty : 1},
        { address : '0x61800F3230A6954888032a5f0bC37a7611a719Ae', qty : 1},
        { address : '0xD61a225Dcf838bf73880Bf3E0a1Ba10630c31cb4', qty : 1},
        { address : '0x33a92eB4565D850B6E43AC0f3556bacF5Aaa492e', qty : 1},
        { address : '0xFf5b711fdB4D2045B9a5017f7b95EE426C3aCB5a', qty : 1},
        { address : '0x47112537b522d37745faE721C13e702d96365012', qty : 1},
        { address : '0x0C13a2b3998DB54d96Eb4E7f7E0b06E85bc9c271', qty : 1},
        { address : '0xc4B8A7856732520843D078De91cEa8b8639F4dc0', qty : 1},
        { address : '0xc039Ca22de42Ea6efD6E4d315D34A7D589B17E89', qty : 1},
        { address : '0xc5135C7AA51ce725f526446f035e4c671baeFa44', qty : 1},
        { address : '0x36a0C7B860A4715939EF5B2D1A47aEdc6c89423A', qty : 1},
        { address : '0xA32aC6F43458c40369385E60f704912B33312919', qty : 1},
        { address : '0xC4825b74C238910727400Ab2980dEcedAf1A0Cb7', qty : 1},
        { address : '0xE4cD887b35C7a7941EEbE8336c6Bfc5d1E9f7bfA', qty : 1},
        { address : '0xE080C0376e056F79Ef9E6097edCF487C0D10f13c', qty : 1},
        { address : '0xf0becf82a1826a1B2f0c47E5317866894f3aa0af', qty : 1},
        { address : '0x33a92eB4565D850B6E43AC0f3556bacF5Aaa492e', qty : 1},
        { address : '0xd4F1AcE4299fE40566aDF8813a46f48bB0383e37', qty : 1},
        { address : '0xCbb47AE9C8865791702D44bd3Aca14751e77C95f', qty : 1},
        { address : '0xC4D3511822758BEde1266f2255dba32d7BcEA543', qty : 1},
        { address : '0xDf2cDcfD31F2F69fd9393D0630694f39F8506DF1', qty : 1},
        { address : '0x72A04e56Fe243731473148cc972c39eC353cC734', qty : 1},
        { address : '0x3f75Ab85b1d19a3eBC74E9Ef7B010348D7007500', qty : 1},
        { address : '0xD440591b88C0d915567063A03745809bC2bE3885', qty : 1},
        { address : '0xE83a465d835E56C4E445d4f83F8cE382cE58Feae', qty : 1},
        { address : '0xa74EDecc0174e43a480321c75fF06cb3842B9d7D', qty : 1},
        { address : '0xf3C11bA805765Bd0aFce51f605FfDe875e04ef17', qty : 4}
   
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