import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json"
import base58 from "bs58";

// const RPC_ENDPOINT = "https://api.devnet.solana.com";
const RPC_ENDPOINT = "https://devnet.helius-rpc.com/?api-key=c115e416-39a8-4730-a109-7b3418bd332b";

const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = await createNft(umi, {
        mint,
        name: 'PastelRug',
        symbol: 'PRUG',
        uri: 'https://arweave.net/GDZMRqjNQ7TyUZfT9m5geUHghgz8buEscJXprrvT6vKr',
        sellerFeeBasisPoints: percentAmount(2),
    });

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);

    //Succesfully Minted! Check out your TX here:
    // https://explorer.solana.com/tx/jtn7WcgaQtDXJ2Vfr21xK6jD7TgeVRGjLAfxbNr4c7UVhKmftGNngSXbfuDqxkNmDnjYNbUNbwFeRnvkdZdpfxa?cluster=devnet
    // Mint Address:  5fqXiRCNqjdKHKFJtnoR3QEGvDbXRWmfj2UBbEMqEizP
})();