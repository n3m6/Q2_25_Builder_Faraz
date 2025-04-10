import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    Collection,
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args, MPL_TOKEN_METADATA_PROGRAM_ID
} from "@metaplex-foundation/mpl-token-metadata";
import {createSignerFromKeypair, signerIdentity, publicKey, OptionOrNullable} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {PublicKey} from "@metaplex-foundation/umi-public-keys/src/common";
import {
    CollectionArgs,
    CollectionDetailsArgs,
    Creator,
    CreatorArgs,
    UsesArgs
} from "@metaplex-foundation/mpl-token-metadata/dist/src/generated/types";

// Define our Mint address
const mint = publicKey("FhnLH6rNA3wuMztW1fUxeWvumvkXL4fssxGkRYaftm2X")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const mint_umi = publicKey('FhnLH6rNA3wuMztW1fUxeWvumvkXL4fssxGkRYaftm2X')
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        // let accounts: CreateMetadataAccountV3InstructionAccounts = {
        //     ???
        // }
        const mint = publicKey('FhnLH6rNA3wuMztW1fUxeWvumvkXL4fssxGkRYaftm2X');

        let accounts: CreateMetadataAccountV3InstructionAccounts = {

            //Metadata key (pda of ['metadata', program id, mint id])
            //     /** Mint of token asset */
            mint: mint_umi,
            //     /** Mint authority */
            mintAuthority: signer,
            // //     /** payer */
            payer: signer,
            // //     /** update authority info */
            // updateAuthority?: PublicKey | Pda | Signer;
            // //     /** System program */
            // systemProgram?: PublicKey | Pda;
            // //     /** Rent info */
            // rent?: PublicKey | Pda;
        };

        const creator: Creator = {
            address: signer.publicKey,
            verified: true,
            share: 2,
        };

        const collection: Collection = {
            verified: true,
            key: signer.publicKey,
        };

        let data: DataV2Args = {
            name: 'Hello Kitty NFT',
            symbol: 'HKNFT',
            uri: 'https://upload.wikimedia.org/wikipedia/en/0/05/Hello_kitty_character_portrait.png',
            sellerFeeBasisPoints: 40,
            creators: null,
            collection: null,
            uses: null,
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: false,
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        // minted token -> 5DKWJZdWtucMRaqfsai7u89D7LEn1NVJGJEanGqgPzz8iTwQRgeiLuqtLp5p7tMPviaBdmzevUaHTSmiANXT4mYu


        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
