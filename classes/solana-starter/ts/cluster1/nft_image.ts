import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        //2. Convert image to generic file.
        //3. Upload image

        const image = await readFile('./images/generug.png');
        const genericImage = createGenericFile(image, 'generug.png', {
            contentType: 'image/png'
        });
        const [myUri] = await umi.uploader.upload([genericImage])
        console.log("Your image URI: ", myUri);
        //Your image URI:  https://arweave.net/G3B6w4Re58h1HygnjcReXtducnWCqiPmeeq7ZsR3KRqQ
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
