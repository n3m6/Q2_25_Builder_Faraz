import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://devnet.helius-rpc.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = 'https://arweave.net/G3B6w4Re58h1HygnjcReXtducnWCqiPmeeq7ZsR3KRqQ';
        const metadata = {
            name: "PastelRug",
            symbol: "PRUG",
            description: "Pastel Rug",
            image: image,
            attributes: [
                {trait_type: 'style', value: 'pastel'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://arweave.net/G3B6w4Re58h1HygnjcReXtducnWCqiPmeeq7ZsR3KRqQ"
                    },
                ]
            },
            creators: []
        };

        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
        //Your metadata URI:  https://arweave.net/GDZMRqjNQ7TyUZfT9m5geUHghgz8buEscJXprrvT6vKr
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
